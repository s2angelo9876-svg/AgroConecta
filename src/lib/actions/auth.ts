"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { captureException } from "@/lib/sentry";
import { sendEmail } from "@/lib/email";
import { welcomeEmail } from "@/lib/email-templates";

const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1),
  })
  .strict();

const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(200),
    name: z.string().min(1).max(200),
    role: z.enum(["agricultor", "comprador"]),
    turnstileToken: z.string().optional(),
  })
  .strict();

/**
 * Verifica un token de Cloudflare Turnstile (si está configurado).
 */
async function verifyTurnstile(token?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // No-op si no está configurado
  if (!token) return false;

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
      }
    );
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    captureException(err, { area: "turnstile-verify" });
    return false;
  }
}

/**
 * Server Action de login. Aplica rate limit (5 intentos / 5min por IP).
 */
export async function loginAction(input: unknown) {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Datos inválidos." };
  }

  const hdrs = await headers();
  const ip = getClientIp(hdrs);
  const rl = rateLimit(`login:${ip}`, 15, 5 * 60 * 1000);
  if (!rl.ok) {
    return {
      ok: false as const,
      error: `Demasiados intentos. Intenta en ${Math.ceil(rl.retryAfterMs / 60000)} minutos.`,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) {
    captureException(error, { area: "login", email: parsed.data.email });
    return { ok: false as const, error: "Credenciales inválidas." };
  }
  return { ok: true as const };
}

/**
 * Server Action de registro. Aplica rate limit (3 registros / 10min por IP)
 * y verifica Turnstile si está configurado.
 */
export async function registerAction(input: unknown) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Datos inválidos." };
  }

  const hdrs = await headers();
  const ip = getClientIp(hdrs);
  const rl = rateLimit(`register:${ip}`, 15, 10 * 60 * 1000);
  if (!rl.ok) {
    return {
      ok: false as const,
      error: `Demasiados registros desde tu IP. Intenta en ${Math.ceil(rl.retryAfterMs / 60000)} minutos.`,
    };
  }

  const turnstileOk = await verifyTurnstile(parsed.data.turnstileToken);
  if (!turnstileOk) {
    return { ok: false as const, error: "Verificación anti-bot falló." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.name,
        role: parsed.data.role,
      },
    },
  });
  if (error) {
    captureException(error, { area: "register", email: parsed.data.email });
    return {
      ok: false as const,
      error: error.message.includes("already registered")
        ? "Este correo ya está registrado."
        : "No se pudo crear la cuenta.",
    };
  }

  // Si Supabase requiere confirmación de email, NO hay sesión todavía.
  // Devolvemos requiresEmailConfirmation para que el cliente muestre un
  // mensaje claro en vez de redirigir a una página "sin sesión".
  if (!data.session) {
    // Email de bienvenida (no bloquea el flujo)
    await sendEmail({
      to: parsed.data.email,
      ...welcomeEmail(parsed.data.name),
    });
    return {
      ok: true as const,
      role: parsed.data.role,
      requiresEmailConfirmation: true as const,
    };
  }

  // Email de bienvenida (no bloquea el flujo)
  await sendEmail({
    to: parsed.data.email,
    ...welcomeEmail(parsed.data.name),
  });

  return { ok: true as const, role: parsed.data.role };
}