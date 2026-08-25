"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  createProductAction,
  deleteProductAction,
} from "@/lib/actions/products";
import type { ProductInput, UiProduct } from "@/lib/schemas";

interface ProductsContextValue {
  products: UiProduct[];
  addProduct: (
    input: ProductInput
  ) => Promise<{ ok: boolean; error?: string; product?: UiProduct }>;
  removeProduct: (id: string) => Promise<{ ok: boolean; error?: string }>;
  loading: boolean;
}

const ProductsContext = createContext<ProductsContextValue>({
  products: [],
  addProduct: async () => ({ ok: false }),
  removeProduct: async () => ({ ok: false }),
  loading: false,
});

export function ProductsProvider({
  initialProducts,
  children,
}: {
  initialProducts: UiProduct[];
  children: ReactNode;
}) {
  const [products, setProducts] = useState<UiProduct[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  const addProduct = useCallback(
    async (input: ProductInput) => {
      setLoading(true);
      const result = await createProductAction(input);
      setLoading(false);
      if (result.ok) {
        setProducts((prev) => [result.data, ...prev]);
        return { ok: true, product: result.data };
      }
      return { ok: false as const, error: result.error };
    },
    []
  );

  const removeProduct = useCallback(async (id: string) => {
    setLoading(true);
    const result = await deleteProductAction({ id });
    setLoading(false);
    if (result.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return { ok: true };
    }
    return { ok: false, error: result.error };
  }, []);

  return (
    <ProductsContext.Provider
      value={{ products, addProduct, removeProduct, loading }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}