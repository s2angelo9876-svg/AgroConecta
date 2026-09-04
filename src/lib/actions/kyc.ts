"use server";

import { z } from "zod";
import { lookupDni } from "@/lib/decolecta";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import { welcomeEmail, verificationSubmittedEmail } from "@/lib/email-templates";
import { safeAction } from "@/lib/safe-action";

const dniLookupSchema = z
  .object({
    dni: z.string().regex(/^\d{8}$/),
  })
  .strict();

/**
 * Server Action: consulta RENIEC por DNI a través de Decolecta.
 * Solo para agricultores que aún no están verificados.
 */
export const lookupDniAction = safeAction(
  dniLookupSchema,
  async ({ dni }) => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    // Verifica que el rol sea agricultor
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "agricultor") {
      throw new Error("Solo los agricultores pueden usar esta función.");
    }

    return await lookupDni(dni);
  }
);

const submitVerificationSchema = z
  .object({
    dni: z.string().regex(/^\d{8}$/),
    dniConfirmedName: z.string().min(1).max(200), // El usuario confirma que el nombre coincide
    docType: z.enum(["ppa", "recibo_agua"]),
    fileName: z.string().min(1).max(200),
    fileSize: z.number().int().positive().max(5 * 1024 * 1024),
    mimeType: z.enum(["application/pdf", "image/jpeg", "image/png"]),
  })
  .strict();

/**
 * Sube el documento de verificación al bucket privado (Fase 3) y
 * genera una URL firmada para que el cliente suba el archivo directo.
 */
export const submitVerificationAction = safeAction(
  submitVerificationSchema,
  async ({ dni, dniConfirmedName, docType, fileName, fileSize, mimeType }) => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    // Validar rol + ya verifico contra el DNI real para anti-spoofing
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "agricultor") {
      throw new Error("Solo los agricultores pueden verificar identidad.");
    }

    // Validación de DNI contra RENIEC
    if (process.env.DECOLECTA_API_KEY) {
      try {
        const decolectaData = await lookupDni(dni);
        const normalizedReal = decolectaData.full_name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/\s+/g, " ")
          .trim();
        const normalizedGiven = dniConfirmedName
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/\s+/g, " ")
          .trim();

        if (!normalizedReal.includes(normalizedGiven) && !normalizedGiven.includes(normalizedReal)) {
          const words = normalizedGiven.split(" ").filter((w) => w.length > 2);
          const hasMatch = words.some((w) => normalizedReal.includes(w));
          if (!hasMatch) {
            throw new Error(
              "El nombre que ingresaste no coincide con el DNI en RENIEC. Verifica el orden de tus nombres."
            );
          }
        }
      } catch (err: any) {
        if (err.message.includes("no coincide con el DNI")) throw err;
        console.warn("[kyc] Advertencia RENIEC:", err.message);
      }
    }

    // Ruta del archivo
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${user.id}/${Date.now()}-${safeName}`;

    // URL firmada para upload directo del cliente
    const { data: signed, error: urlError } = await supabase.storage
      .from("verification-docs")
      .createSignedUploadUrl(filePath);
    if (urlError || !signed) throw urlError ?? new Error("No se pudo generar la URL");

    // Inserta el registro en verification_docs (estado: pending)
    const { error: dbError } = await supabase.from("verification_docs").insert({
      user_id: user.id,
      doc_type: docType,
      file_path: filePath,
      file_size_bytes: fileSize,
      mime_type: mimeType,
      status: "pending",
    });
    if (dbError) throw dbError;

    // Crea fila en farmer_profiles si no existe
    await supabase
      .from("farmer_profiles")
      .upsert(
        { user_id: user.id },
        { onConflict: "user_id", ignoreDuplicates: true }
      );

    // Email de confirmación
    await sendEmail({
      to: user.email!,
      ...verificationSubmittedEmail(profile.full_name || "Agricultor"),
    });

    return {
      uploadUrl: signed.signedUrl,
      token: signed.token,
      filePath,
    };
  }
);