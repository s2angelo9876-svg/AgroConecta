"use server";

import { z } from "zod";
import { safeAction } from "@/lib/safe-action";
import { createClient as createServerClient } from "@/lib/supabase/server";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = ["application/pdf", "image/jpeg", "image/png"];

const uploadSchema = z.object({
  fileName: z.string().min(1).max(200),
  fileSize: z.number().int().positive().max(MAX_SIZE_BYTES),
  mimeType: z.enum(ALLOWED_MIME as [string, ...string[]]),
  docType: z.enum(["ppa", "recibo_agua"]),
});

/**
 * Sube un documento de verificación al bucket privado.
 * Valida tamaño (≤5MB) y MIME (pdf/jpg/png) en el servidor.
 */
export const uploadVerificationDocAction = safeAction(
  uploadSchema,
  async ({ fileName, fileSize, mimeType, docType }) => {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    // Genera una ruta única dentro del bucket privado (carpeta por usuario)
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${user.id}/${Date.now()}-${safeName}`;

    // Genera una URL firmada de subida (PUT) con expiración corta
    const { data, error } = await supabase.storage
      .from("verification-docs")
      .createSignedUploadUrl(filePath);

    if (error || !data) throw error ?? new Error("No se pudo generar URL de subida");

    // Registra el documento en la tabla (estado: pending)
    const { error: dbError } = await supabase.from("verification_docs").insert({
      user_id: user.id,
      doc_type: docType,
      file_path: filePath,
      file_size_bytes: fileSize,
      mime_type: mimeType,
    });
    if (dbError) throw dbError;

    return {
      uploadUrl: data.signedUrl,
      token: data.token,
      filePath,
    };
  }
);