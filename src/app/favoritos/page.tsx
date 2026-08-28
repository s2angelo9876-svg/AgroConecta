"use client";

import { Heart } from "lucide-react";
import { useProducts } from "@/components/ProductsProvider";
import { useFavorites } from "@/components/FavoritesProvider";
import ProductCard from "@/components/ProductCard";

export default function FavoritosPage() {
  const { products } = useProducts();
  const { favorites } = useFavorites();

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="flex items-center gap-2 text-2xl font-extrabold text-agro-800">
        <Heart className="text-red-500" fill="currentColor" /> Mis favoritos
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Productos que has guardado para contactar después.
      </p>
      {favoriteProducts.length > 0 ? (
        <div className="mt-6 space-y-4">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center text-sm text-stone-500">
          Aún no has guardado productos.
        </div>
      )}
    </section>
  );
}