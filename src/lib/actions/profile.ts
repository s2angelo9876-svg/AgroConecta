"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { safeAction } from "@/lib/safe-action";

const updateProfileSchema = z
  .object({
    full_name: z.string().min(1).max(200),
    phone: z
      .string()
      .max(20)
      .optional()
      .nullable()
      .transform((v) => (v && v.trim() !== "" ? v.trim() : null)),
  })
  .strict();

/**
 * Actualiza el perfil del usuario autenticado.
 * El role NO puede cambiar (lo protege la RLS con check constraint).
 */
export const updateProfileAction = safeAction(
  updateProfileSchema,
  async (input) => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: input.full_name,
        phone: input.phone,
      })
      .eq("id", user.id);

    if (error) throw error;

    revalidatePath("/perfil");
    revalidatePath("/");
    return { full_name: input.full_name };
  }
);