"use client";

import { ProductCardSkeleton, FaqsSkeleton } from "./Skeletons";

/**
 * Loading state por defecto: spinner centrado.
 * Para loadings más avanzados, importar el skeleton específico desde
 * `@/components/Skeletons` (ProductCardSkeleton, etc).
 */
export default function LoadingState({
  label = "Cargando...",
}: {
  label?: string;
}) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-cream-200 border-t-agro-600" />
      <p className="mt-3 text-sm text-stone-500">{label}</p>
    </div>
  );
}

export { ProductCardSkeleton, FaqsSkeleton };