"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { captureException } from "@/lib/sentry";

const recoverSchema = z
  .object({ email: z.string().email() })
  .strict();

const updateSchema = z
  .object({ password: z.string().min(6).max(200) })
  .strict();

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Solicita el correo de recuperación.
 * Rate limit: 3 cada 10 minutos por IP.
 */
export async function requestPasswordResetAction(input: unknown) {
  const parsed = recoverSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Correo inválido." };

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

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${APP_URL}/reset-password`,
  });
  if (error) {
    captureException(error, { area: "recover-password", email: parsed.data.email });
    // No revelamos si el correo existe o no (anti-enumeración).
    // Devolvemos ok igual para no filtrar información.
  }
  return { ok: true as const };
}

/**
 * Cambia la contraseña del usuario actual (autenticado por el link de recovery).
 * Requiere que la sesión esté activa (creada por Supabase al hacer click en el link).
 */
export async function updatePasswordAction(input: unknown) {
  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Contraseña inválida." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      ok: false as const,
      error: "Sesión expirada. Vuelve a solicitar el correo de recuperación.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) {
    captureException(error, { area: "update-password" });
    return { ok: false as const, error: "No se pudo cambiar la contraseña." };
  }

  // Cerramos la sesión de recuperación para que el usuario haga login normal
  await supabase.auth.signOut();
  return { ok: true as const };
}