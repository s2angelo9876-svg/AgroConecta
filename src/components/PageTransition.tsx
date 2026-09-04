"use client";

import { usePathname } from "next/navigation";

/**
 * Wrapper client que aplica una animación de entrada cada vez que cambia
 * la ruta. Usado dentro de <main> en el layout.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-pageEnter">
      {children}
    </div>
  );
}