import { z } from "zod";

export const QualitySchema = z.enum(["Premium", "Primera", "Segunda"]);

/**
 * Esquema para crear una publicación. `strict()` rechaza cualquier campo
 * adicional (incluyendo `role`, `farmer_id`, `verification_status`, etc.).
 */
export const productInputSchema = z
  .object({
    name: z.string().min(1).max(100),
    quantity: z.coerce.number().positive().max(1_000_000),
    unit: z.string().min(1).max(20).default("kg"),
    price: z.coerce.number().min(0).max(1_000_000),
    harvest_date: z.string().min(1), // YYYY-MM-DD
    location: z.string().min(1).max(100),
    quality: QualitySchema,
    description: z.string().max(2000).optional(),
    image_url: z.string().url().optional().nullable(),
  })
  .strict();

export type ProductInput = z.infer<typeof productInputSchema>;

/** Producto unificado para la UI (camelCase). */
export interface UiProduct {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  location: string;
  harvestDate: string;
  quality: "Premium" | "Primera" | "Segunda";
  image: string;
  description: string;
  farmerId: string;
  farmerName?: string;
}