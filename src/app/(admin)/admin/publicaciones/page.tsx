import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductsAdminList } from "./ProductsAdminList";

export const metadata = { title: "Publicaciones — Admin" };

export default async function PublicacionesAdminPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, farmer:profiles!farmer_id(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm font-semibold text-agro-700 hover:underline"
      >
        <ArrowLeft size={14} /> Volver al panel
      </Link>
      <h1 className="mt-2 flex items-center gap-2 text-2xl font-extrabold text-agro-800">
        <Package className="text-agro-600" /> Todas las publicaciones
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Pausa o elimina cualquier producto del catálogo.
      </p>

      {!products || products.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center text-sm text-stone-500">
          No hay publicaciones todavía.
        </div>
      ) : (
        <ProductsAdminList products={products} />
      )}
    </>
  );
}