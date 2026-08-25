"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { safeAction } from "@/lib/safe-action";
import {
  productInputSchema,
  type ProductInput,
  type UiProduct,
} from "@/lib/schemas";
import { createClient as createServerClient } from "@/lib/supabase/server";

/**
 * Convierte una fila de Supabase (snake_case) al shape que usa la UI (camelCase).
 */
function toUiProduct(row: any): UiProduct {
  return {
    id: row.id,
    name: row.name,
    quantity: Number(row.quantity),
    unit: row.unit,
    price: Number(row.price),
    location: row.location,
    harvestDate: row.harvest_date,
    quality: row.quality,
    image: row.image_url || "/placeholder.png",
    description: row.description || "",
    farmerId: row.farmer_id,
    farmerName: row.farmer?.full_name,
  };
}

export async function fetchProductsAction(): Promise<UiProduct[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, farmer:profiles!farmer_id(full_name)")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) {
    console.error("[fetchProducts]", error);
    return [];
  }
  return (data ?? []).map(toUiProduct);
}

export const createProductAction = safeAction(
  productInputSchema,
  async (input: ProductInput): Promise<UiProduct> => {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const { data, error } = await supabase
      .from("products")
      .insert({
        farmer_id: user.id,
        name: input.name,
        quantity: input.quantity,
        unit: input.unit,
        price: input.price,
        harvest_date: input.harvest_date,
        location: input.location,
        quality: input.quality,
        description: input.description ?? null,
        image_url: input.image_url ?? null,
        status: "active",
      })
      .select("*, farmer:profiles!farmer_id(full_name)")
      .single();

    if (error || !data) throw error ?? new Error("Error al crear producto");

    revalidatePath("/");
    revalidatePath("/buscar");
    revalidatePath("/mis-publicaciones");

    return toUiProduct(data);
  }
);

const deleteProductSchema = z
  .object({ id: z.string().uuid() })
  .strict();

export const deleteProductAction = safeAction(
  deleteProductSchema,
  async ({ id }): Promise<{ id: string }> => {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    // Soft delete: cambiar status
    const { error } = await supabase
      .from("products")
      .update({ status: "deleted" })
      .eq("id", id);
    if (error) throw error;

    revalidatePath("/buscar");
    revalidatePath("/mis-publicaciones");
    return { id };
  }
);