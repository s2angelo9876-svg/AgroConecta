"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient as createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

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
  if (profile?.role !== "admin") throw new Error("Solo administradores.");
  return user;
}

// ===== FAQs =====

const faqSchema = z
  .object({
    id: z.string().uuid().optional(),
    question: z.string().min(1).max(300),
    answer: z.string().min(1).max(2000),
    order_index: z.number().int().min(0).max(1000),
    published: z.boolean(),
  })
  .strict();

export async function upsertFaqAction(input: unknown) {
  await requireAdmin();
  const parsed = faqSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Datos inválidos." };

  const admin = createAdminClient();
  const { id, ...data } = parsed.data;
  const { error } = id
    ? await admin.from("faqs").update(data).eq("id", id)
    : await admin.from("faqs").insert(data);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/faqs");
  return { ok: true as const };
}

const deleteFaqSchema = z.object({ id: z.string().uuid() }).strict();
export async function deleteFaqAction(input: unknown) {
  await requireAdmin();
  const parsed = deleteFaqSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Datos inválidos." };

  const admin = createAdminClient();
  const { error } = await admin.from("faqs").delete().eq("id", parsed.data.id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/faqs");
  return { ok: true as const };
}

// ===== Testimonials =====

const testimonialSchema = z
  .object({
    id: z.string().uuid().optional(),
    author_name: z.string().min(1).max(200),
    author_role: z.string().max(200).optional(),
    content: z.string().min(1).max(1000),
    avatar_url: z.string().url().optional().nullable(),
    rating: z.number().int().min(1).max(5),
    published: z.boolean(),
  })
  .strict();

export async function upsertTestimonialAction(input: unknown) {
  await requireAdmin();
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Datos inválidos." };

  const admin = createAdminClient();
  const { id, ...data } = parsed.data;
  const { error } = id
    ? await admin.from("testimonials").update(data).eq("id", id)
    : await admin.from("testimonials").insert(data);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/testimonials");
  return { ok: true as const };
}

const deleteTestimonialSchema = z.object({ id: z.string().uuid() }).strict();
export async function deleteTestimonialAction(input: unknown) {
  await requireAdmin();
  const parsed = deleteTestimonialSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Datos inválidos." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("testimonials")
    .delete()
    .eq("id", parsed.data.id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/testimonials");
  return { ok: true as const };
}