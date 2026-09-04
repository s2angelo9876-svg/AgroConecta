"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { captureException } from "@/lib/sentry";
import { safeAction } from "@/lib/safe-action";

const updateSchema = z
  .object({ password: z.string().min(6).max(200) })
  .strict();

/**
 * Solicita el enlace de recuperación de contraseña.
 *
 * Por ahora, esta acción solo valida el email y muestra un mensaje genérico
 * de éxito. NO envía email real (eso se implementará en producción).
 * Para el demo / presentaciones, esto es suficiente.
 */
export async function requestPasswordResetAction(input: unknown) {
  const recoverSchema = z.object({ email: z.string().email() }).strict();
  const parsed = recoverSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Correo inválido." };
  }

  const hdrs = await headers();
  const ip = getClientIp(hdrs);
  const rl = rateLimit(`recover:${ip}`, 3, 10 * 60 * 1000);
  if (!rl.ok) {
    return {
      ok: false as const,
      error: `Demasiados intentos. Vuelve a probar en ${Math.ceil(
        rl.retryAfterMs / 60000
      )} minutos.`,
    };
  }

  // Anti-enumeración: siempre devolvemos ok, no exponemos si el email existe.
  return { ok: true as const };
}

/**
 * Cambia la contraseña del usuario autenticado.
 */
export const updatePasswordAction = safeAction(
  updateSchema,
  async ({ password }): Promise<{ ok: boolean; error?: string }> => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        ok: false,
        error: "Sesión expirada. Vuelve a iniciar sesión.",
      };
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      captureException(error, { area: "update-password" });
      return { ok: false, error: "No se pudo cambiar la contraseña." };
    }

    await supabase.auth.signOut();
    return { ok: true };
  }
);