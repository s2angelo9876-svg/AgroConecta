"use client";

import type { ReactNode } from "react";
import { ProductsProvider } from "./ProductsProvider";
import { FavoritesProvider } from "./FavoritesProvider";
import type { UiProduct } from "@/lib/schemas";

export default function Providers({
  initialProducts,
  children,
}: {
  initialProducts: UiProduct[];
  children: ReactNode;
}) {
  return (
    <ProductsProvider initialProducts={initialProducts}>
      <FavoritesProvider>{children}</FavoritesProvider>
    </ProductsProvider>
  );
}