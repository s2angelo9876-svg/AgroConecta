"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@/lib/supabase/admin";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { captureException } from "@/lib/sentry";
import { sendEmail } from "@/lib/email";
import { passwordResetEmail } from "@/lib/email-templates";
import { safeAction } from "@/lib/safe-action";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const IS_DEV = process.env.NODE_ENV !== "production";

const updateSchema = z
  .object({ password: z.string().min(6).max(200) })
  .strict();

/**
 * Solicita el enlace de recuperación de contraseña.
 *
 * En lugar de `supabase.auth.resetPasswordForEmail()` (que depende del
 * SMTP de Supabase, rate-limited en el tier gratuito), usamos
 * `admin.generateLink({ type: "recovery" })` que devuelve el enlace
 * directamente y lo enviamos nosotros mismos con Resend.
 *
 * Bonus: en modo desarrollo, si Resend falla (p.ej. dominio no
 * verificado), devolvemos el link para mostrarlo en pantalla.
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

  const supabaseAdmin = createAdminClient();

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "recovery",
    email: parsed.data.email,
    options: { redirectTo: `${APP_URL}/reset-password` },
  });

  if (error || !data?.properties?.action_link) {
    captureException(error, { area: "recover-generateLink" });
    return { ok: true as const }; // anti-enumeración
  }

  const actionLink = data.properties.action_link;

  // Log siempre (útil como respaldo si el email falla)
  console.log(
    `[recover-password] Link de reseteo para ${parsed.data.email}:\n${actionLink}`
  );

  const emailResult = await sendEmail({
    to: parsed.data.email,
    ...passwordResetEmail(actionLink),
  });

  if (!emailResult.ok) {
    console.warn(
      `[recover-password] Email no enviado (${emailResult.error}). Link disponible arriba en consola.`
    );
    captureException(emailResult.error, { area: "recover-email-send" });
  }

  return {
    ok: true as const,
    ...(IS_DEV && emailResult.id === "mock" ? { devLink: actionLink } : {}),
  };
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
        error: "Sesión expirada. Vuelve a solicitar el correo de recuperación.",
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