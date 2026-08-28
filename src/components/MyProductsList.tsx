"use client";

import { useProducts } from "./ProductsProvider";
import ProductCard from "./ProductCard";

export default function MyProductsList({ userId }: { userId: string }) {
  const { products, removeProduct, loading } = useProducts();

  const mine = products.filter((p) => p.farmerId === userId);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta publicación?")) return;
    await removeProduct(id);
  };

  if (mine.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center text-sm text-stone-500">
        Aún no tienes publicaciones.
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {mine.map((product) => (
        <div key={product.id} className="relative">
          <ProductCard product={product} />
          <button
            disabled={loading}
            onClick={() => handleDelete(product.id)}
            className="absolute -top-2 -right-2 rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm transition hover:bg-red-600 disabled:opacity-50"
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}