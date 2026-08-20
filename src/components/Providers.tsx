"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { ReactNode } from "react";
import { ProductsProvider } from "./ProductsProvider";
import { FavoritesProvider } from "./FavoritesProvider";

export default function Providers({
  session,
  children,
}: {
  session: Session | null;
  children: ReactNode;
}) {
  return (
    <SessionProvider session={session}>
      <ProductsProvider>
        <FavoritesProvider>{children}</FavoritesProvider>
      </ProductsProvider>
    </SessionProvider>
  );
}
