"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient as createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import {
  verificationApprovedEmail,
  verificationRejectedEmail,
} from "@/lib/email-templates";

/**
 * Garantiza que el usuario actual sea admin. Lanza Error si no lo es.
 * Los admin actions deben usar SIEMPRE el admin client para bypassear RLS.
 */
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
    throw new Error("No tienes permisos de administrador.");
  }
  return user;
}

const reviewSchema = z
  .object({
    docId: z.string().uuid(),
    decision: z.enum(["verified", "rejected"]),
    notes: z.string().max(500).optional(),
  })
  .strict();

/**
 * Aprueba o rechaza una solicitud de verificación KYC.
 * Solo admin. Cambia verification_docs y farmer_profiles,
 * envía email al agricultor.
 */
export async function reviewVerificationAction(input: unknown) {
  const user = await requireAdmin();
  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Datos inválidos." };
  const { docId, decision, notes } = parsed.data;

  const admin = createAdminClient();

  // Traer doc para saber qué agricultor
  const { data: doc } = await admin
    .from("verification_docs")
    .select("user_id")
    .eq("id", docId)
    .single();
  if (!doc) return { ok: false as const, error: "Documento no encontrado." };

  // Actualizar verification_docs
  const { error: docErr } = await admin
    .from("verification_docs")
    .update({
      status: decision,
      reviewer_id: user.id,
      reviewed_at: new Date().toISOString(),
      notes: notes ?? null,
    })
    .eq("id", docId);
  if (docErr) return { ok: false as const, error: docErr.message };

  // Actualizar farmer_profiles
  const { error: fpErr } = await admin
    .from("farmer_profiles")
    .update({
      verification_status: decision,
      verified: decision === "verified",
    })
    .eq("user_id", doc.user_id);
  if (fpErr) return { ok: false as const, error: fpErr.message };

  // Email al agricultor
  const { data: profile } = await admin
    .from("profiles")
    .select("full_name, email")
    .eq("id", doc.user_id)
    .single();
  if (profile?.email) {
    const template =
      decision === "verified"
        ? verificationApprovedEmail(profile.full_name)
        : verificationRejectedEmail(profile.full_name, notes ?? "No se especificó un motivo.");
    await sendEmail({
      to: profile.email,
      subject: template.subject,
      html: template.html,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/verificaciones");
  revalidatePath("/perfil");

  return { ok: true as const };
}

const setProductStatusSchema = z
  .object({
    productId: z.string().uuid(),
    status: z.enum(["active", "paused", "deleted"]),
  })
  .strict();

/** Admin puede pausar/reactivar/eliminar cualquier producto. */
export async function setProductStatusAction(input: unknown) {
  await requireAdmin();
  const parsed = setProductStatusSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Datos inválidos." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("products")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.productId);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/publicaciones");
  revalidatePath("/buscar");
  return { ok: true as const };
}