import Link from "next/link";
import { Home, Search, MessageCircle } from "lucide-react";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <div className="text-7xl font-extrabold text-agro-700">404</div>
      <h1 className="mt-2 text-2xl font-extrabold text-stone-800">
        Página no encontrada
      </h1>
      <p className="mt-2 text-stone-500">
        Es posible que la cosecha que buscabas ya no esté disponible o la
        dirección cambió.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-2">
        <Link
          href="/"
          className="flex flex-col items-center gap-1 rounded-xl bg-agro-700 px-4 py-3 text-xs font-bold text-white transition hover:bg-agro-600"
        >
          <Home size={18} /> Inicio
        </Link>
        <Link
          href="/buscar"
          className="flex flex-col items-center gap-1 rounded-xl border-2 border-agro-700 px-4 py-3 text-xs font-bold text-agro-700 transition hover:bg-agro-50"
        >
          <Search size={18} /> Buscar
        </Link>
        <Link
          href="/mensajes"
          className="flex flex-col items-center gap-1 rounded-xl border-2 border-stone-200 px-4 py-3 text-xs font-bold text-stone-700 transition hover:bg-cream-50"
        >
          <MessageCircle size={18} /> Mensajes
        </Link>
      </div>
    </section>
  );
}