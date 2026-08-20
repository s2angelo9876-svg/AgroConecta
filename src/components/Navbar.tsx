"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import {
  Sprout,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Tractor,
  ShoppingCart,
  User,
} from "lucide-react";
import NotificationsDropdown from "./NotificationsDropdown";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/buscar", label: "Buscar productos" },
  { href: "/publicar", label: "Publicar cosecha" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  // Referencia para cerrar el menú desplegable si se hace clic fuera de él
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-cream-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-agro-600 text-white">
            <Sprout size={20} />
          </span>
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-agro-700">Agro</span>
            <span className="text-sun-500">Conecta</span>
          </span>
        </Link>

        {/* Navegación Desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive(link.href)
                  ? "bg-agro-50 text-agro-700"
                  : "text-stone-600 hover:bg-cream-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Usuario / Auth Status */}
        <div className="hidden items-center gap-2 md:flex">
          <NotificationsDropdown />
          
          {status === "loading" ? (
            <div className="h-9 w-28 animate-pulse rounded-full bg-cream-100" />
          ) : session?.user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserOpen((v) => !v)}
                aria-expanded={userOpen}
                aria-label="Menú de usuario"
                className="flex items-center gap-2 rounded-full border border-cream-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition hover:bg-cream-50"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? "Avatar de usuario"}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-agro-600 text-sm font-bold text-white">
                    {session.user.name?.[0]?.toUpperCase() ?? "U"}
                  </span>
                )}
                <span className="max-w-[8rem] truncate text-sm font-semibold text-stone-800">
                  {session.user.name}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-stone-400 transition-transform ${
                    userOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {userOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-cream-200 bg-white shadow-lg">
                  <div className="border-b border-cream-200 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-stone-800">
                      {session.user.name}
                    </p>
                    <span
                      className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        session.user.role === "agricultor"
                          ? "bg-agro-100 text-agro-800"
                          : "bg-sun-300/40 text-yellow-800"
                      }`}
                    >
                      {session.user.role === "agricultor" ? (
                        <Tractor size={12} />
                      ) : (
                        <ShoppingCart size={12} />
                      )}
                      {session.user.role === "agricultor"
                        ? "Agricultor"
                        : "Comprador"}
                    </span>
                  </div>
                  <Link
                    href="/perfil"
                    onClick={() => setUserOpen(false)}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-stone-700 transition hover:bg-cream-50"
                  >
                    <User size={16} /> Mi perfil
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={16} /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-sun-400 px-5 py-2.5 text-sm font-bold text-stone-900 shadow-sm transition hover:bg-sun-300"
            >
              Ingresar
            </Link>
          )}
        </div>

        {/* Notificaciones y menú móvil */}
        <div className="flex items-center gap-1 md:hidden">
          <NotificationsDropdown />
          <button
            type="button"
            className="text-stone-700"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú Móvil */}
      {mobileOpen && (
        <div className="border-t border-cream-200 bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                  isActive(link.href)
                    ? "bg-agro-50 text-agro-700"
                    : "text-stone-600 hover:bg-cream-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {session?.user ? (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} /> Cerrar sesión ({session.user.name})
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-1 rounded-lg bg-sun-400 px-3 py-2 text-center text-sm font-bold text-stone-900"
              >
                Ingresar
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}