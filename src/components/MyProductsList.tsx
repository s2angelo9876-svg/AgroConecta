"use client";

import { useProducts } from "./ProductsProvider";
import { findFarmer, FARMERS, PRODUCTS } from "@/data/mock";
import ProductCard from "./ProductCard";

export default function MyProductsList({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
  const { products, removeProduct } = useProducts();

  const mine = products.filter(
    (p) =>
      p.farmerId === userId ||
      // Demo: si ingresó como Juan Pérez, también mostramos los productos mock f1
      (userName === "Juan Pérez" && p.farmerId === "f1")
  );

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar esta publicación? (solo se eliminará del demo)")) {
      removeProduct(id);
    }
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
          <ProductCard
            product={product}
            farmer={findFarmer(product.farmerId)}
          />
          {!PRODUCTS.some((p) => p.id === product.id) && (
            <button
              onClick={() => handleDelete(product.id)}
              className="absolute -top-2 -right-2 rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm transition hover:bg-red-600"
            >
              Eliminar
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
