"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[error]", error);
  }, [error]);

  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <div className="text-6xl">😔</div>
      <h1 className="mt-2 text-2xl font-extrabold text-agro-800">
        Algo salió mal
      </h1>
      <p className="mt-2 text-stone-500">
        Encontramos un error inesperado. Ya lo registramos para revisarlo.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-xl bg-agro-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-agro-600"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-xl border-2 border-stone-200 px-5 py-2.5 text-sm font-bold text-stone-700 hover:bg-cream-100"
        >
          <Home size={16} /> Inicio
        </Link>
      </div>
    </section>
  );
}