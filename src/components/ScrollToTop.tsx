"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Cada vez que cambia la ruta, hace scroll al top con animación suave.
 * Next.js App Router NO hace scroll al top automáticamente al cambiar de ruta.
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}