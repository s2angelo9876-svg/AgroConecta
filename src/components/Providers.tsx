"use client";

import type { ReactNode } from "react";
import { ProductsProvider } from "./ProductsProvider";
import { FavoritesProvider } from "./FavoritesProvider";
import ToastProvider from "./ToastProvider";

export default function Providers({
  initialProducts,
  children,
}: {
  initialProducts: any[];
  children: ReactNode;
}) {
  return (
    <ProductsProvider initialProducts={initialProducts}>
      <FavoritesProvider>
        {children}
        <ToastProvider />
      </FavoritesProvider>
    </ProductsProvider>
  );
}