"use client";

import { useProducts } from "./ProductsProvider";
import { findFarmer } from "@/data/mock";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  const { products } = useProducts();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {products.slice(0, 4).map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          farmer={findFarmer(product.farmerId)}
        />
      ))}
    </div>
  );
}
