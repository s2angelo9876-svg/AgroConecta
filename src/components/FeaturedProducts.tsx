"use client";

import { useProducts } from "./ProductsProvider";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  const { products } = useProducts();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {products.slice(0, 4).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}