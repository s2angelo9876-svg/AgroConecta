"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "agroconecta:favorites";

interface FavoritesContextValue {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue>({
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  // Cargar favoritos: si hay sesión los carga desde DB, si no desde localStorage
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (cancelled) return;
      if (data.user) {
        setUserId(data.user.id);
        const { data: rows } = await supabase
          .from("favorites")
          .select("product_id")
          .eq("user_id", data.user.id);
        if (rows) setFavorites(rows.map((r: { product_id: string }) => r.product_id));
      } else {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) setFavorites(JSON.parse(raw) as string[]);
        } catch {}
      }
    };
    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        load();
      } else {
        setUserId(null);
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          setFavorites(raw ? (JSON.parse(raw) as string[]) : []);
        } catch {
          setFavorites([]);
        }
      }
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleFavorite = async (productId: string) => {
    const isFav = favorites.includes(productId);

    // Actualización optimista
    setFavorites((prev) =>
      isFav ? prev.filter((id) => id !== productId) : [...prev, productId]
    );

    if (userId) {
      // Persistir en DB
      if (isFav) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("product_id", productId);
      } else {
        await supabase
          .from("favorites")
          .insert({ user_id: userId, product_id: productId });
      }
    } else {
      try {
        const next = isFav
          ? favorites.filter((id) => id !== productId)
          : [...favorites, productId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
    }
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}