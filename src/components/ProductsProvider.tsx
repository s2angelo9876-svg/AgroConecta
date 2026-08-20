"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { PRODUCTS, type Product } from "@/data/mock";

const STORAGE_KEY = "agroconecta:products";

interface ProductsContextValue {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
}

const ProductsContext = createContext<ProductsContextValue>({
  products: PRODUCTS,
  addProduct: () => {},
  removeProduct: () => {},
});

/**
 * Fuente de datos del demo: productos mock + los publicados por el usuario
 * (persistidos en localStorage). Cuando se conecte el backend, basta con
 * reemplazar este provider por llamadas a la API.
 */
export function ProductsProvider({ children }: { children: ReactNode }) {
  const [localProducts, setLocalProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLocalProducts(JSON.parse(raw) as Product[]);
    } catch {
      // almacenamiento no disponible: el demo sigue funcionando con los mock
    }
  }, []);

  const addProduct = (product: Product) => {
    setLocalProducts((prev) => {
      const next = [product, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // sin persistencia, solo estado en memoria
      }
      return next;
    });
  };

  const removeProduct = (id: string) => {
    setLocalProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // sin persistencia
      }
      return next;
    });
  };

  return (
    <ProductsContext.Provider
      value={{
        products: [...localProducts, ...PRODUCTS],
        addProduct,
        removeProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
