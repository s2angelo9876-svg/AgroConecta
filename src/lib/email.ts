import { Resend } from "resend";

/**
 * Cliente de Resend para emails transaccionales.
 * Solo se usa desde el servidor (Server Actions).
 *
 * Si RESEND_API_KEY no está configurada, los emails se loguean en
 * consola en lugar de enviarse (modo desarrollo).
 */

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

const FROM =
  process.env.RESEND_FROM_EMAIL || "AgroConecta <noreply@agroconecta.pe>";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailParams): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!resend) {
    console.warn(
      "[email] RESEND_API_KEY no configurada — email NO enviado. Destinatario:",
      to,
      "Asunto:",
      subject
    );
    console.log("[email HTML preview]", html.slice(0, 200), "...");
    return { ok: true, id: "mock" };
  }

  try {
    const result = await resend.emails.send({
      from: FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    });
    if ("error" in result && result.error) {
      console.error("[email] Resend error:", result.error);
      return { ok: false, error: result.error.message };
    }
    return { ok: true, id: "data" in result ? result.data?.id : undefined };
  } catch (err) {
    console.error("[email] Excepción:", err);
    return { ok: false, error: "No se pudo enviar el email." };
  }
}