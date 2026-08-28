"use client";

import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Sticky CTA móvil: aparece después de cierto scroll y se puede cerrar.
 */
export default function MobileStickyCta() {
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (closed || !visible) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-30 mx-auto max-w-md px-3 md:hidden">
      <div className="flex items-center gap-2 rounded-2xl border border-sun-400 bg-sun-300/90 p-2 shadow-lg backdrop-blur">
        <Link
          href="/publicar"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-agro-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-agro-600"
        >
          <ShoppingBag size={14} /> Publica tu cosecha gratis
        </Link>
        <button
          onClick={() => setClosed(true)}
          aria-label="Cerrar"
          className="rounded-full p-1.5 text-stone-700 hover:bg-yellow-200"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}