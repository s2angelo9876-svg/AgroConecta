"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, MessageCircle, User } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const TAB =
  "flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-bold transition";

export default function MobileNav() {
  const pathname = usePathname();
  const { user } = useCurrentUser();

  const active = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-cream-200 bg-white md:hidden">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around">
        <Link
          href="/"
          className={`${TAB} ${active("/") ? "text-agro-700" : "text-stone-400"}`}
        >
          <Home size={22} />
          Inicio
        </Link>
        <Link
          href="/buscar"
          className={`${TAB} ${active("/buscar") ? "text-agro-700" : "text-stone-400"}`}
        >
          <Search size={22} />
          Buscar
        </Link>
        <Link
          href="/publicar"
          className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-sun-400 shadow-lg transition hover:bg-sun-300"
        >
          <PlusCircle size={28} className="text-stone-900" />
        </Link>
        <Link
          href="/mensajes"
          className={`${TAB} ${active("/mensajes") ? "text-agro-700" : "text-stone-400"}`}
        >
          <MessageCircle size={22} />
          Mensajes
        </Link>
        <Link
          href={user ? "/perfil" : "/login"}
          className={`${TAB} ${active("/perfil") || active("/login") ? "text-agro-700" : "text-stone-400"}`}
        >
          <User size={22} />
          {user ? "Perfil" : "Ingresar"}
        </Link>
      </div>
    </nav>
  );
}