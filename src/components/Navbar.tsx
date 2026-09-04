"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, type MouseEvent } from "react";
import {
  Menu,
  X,
  LogOut,
  ChevronDown,
  Tractor,
  ShoppingCart,
  User,
  ShieldCheck,
  Settings as SettingsIcon,
} from "lucide-react";
import { toast } from "sonner";
import NotificationsDropdown from "./NotificationsDropdown";
import GlobalSearch from "./GlobalSearch";
import SettingsModal from "./SettingsModal";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { createClient } from "@/lib/supabase/client";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/buscar", label: "Buscar productos" },
  { href: "/publicar", label: "Publicar cosecha" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, profile, loading } = useCurrentUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const supabase = createClient();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleSignOut = async (e: MouseEvent) => {
    e.preventDefault();
    setUserOpen(false);
    setMobileOpen(false);
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-cream-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-mark.png"
            alt=""
            width={344}
            height={250}
            className="h-9 w-auto"
            priority
          />
          <Image
            src="/logo-wordmark.png"
            alt="AgroConecta"
            width={799}
            height={120}
            className="h-5 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <GlobalSearch />
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

        {/* Right area (desktop) */}
        <div className="hidden items-center gap-2 md:flex">
          <NotificationsDropdown />
          {loading ? (
            <div className="h-9 w-28 animate-pulse rounded-full bg-cream-100" />
          ) : user && profile ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-cream-200 bg-white py-1.5 pl-1.5 pr-3 transition hover:bg-cream-50"
              >
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-agro-600 text-sm font-bold text-white">
                    {profile.full_name?.[0]?.toUpperCase() ?? "U"}
                  </span>
                )}
                <span className="max-w-[8rem] truncate text-sm font-semibold text-stone-800">
                  {profile.full_name}
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
                      {profile.full_name}
                    </p>
                    <span
                      className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        profile.role === "agricultor"
                          ? "bg-agro-100 text-agro-800"
                          : profile.role === "admin"
                          ? "bg-soil-500/20 text-soil-800"
                          : "bg-sun-300/40 text-yellow-800"
                      }`}
                    >
                      {profile.role === "agricultor" ? (
                        <Tractor size={12} />
                      ) : profile.role === "comprador" ? (
                        <ShoppingCart size={12} />
                      ) : (
                        <User size={12} />
                      )}
                      {profile.role === "agricultor"
                        ? "Agricultor"
                        : profile.role === "admin"
                        ? "Administrador"
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
                    onClick={() => {
                      setUserOpen(false);
                      setSettingsOpen(true);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-stone-700 transition hover:bg-cream-50"
                  >
                    <SettingsIcon size={16} /> Configuración
                  </button>
                  {profile.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setUserOpen(false)}
                      className="flex w-full items-center gap-2 bg-agro-50 px-4 py-2.5 text-left text-sm font-bold text-agro-800 transition hover:bg-agro-100"
                    >
                      <ShieldCheck size={16} /> Panel de administración
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleSignOut}
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

        {/* Mobile right */}
        <div className="flex items-center gap-2 md:hidden">
          <GlobalSearch />
          <NotificationsDropdown />
          <button
            type="button"
            className="text-stone-700"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
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
                    : "text-stone-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && profile ? (
              <>
                <Link
                  href="/perfil"
                  onClick={() => setMobileOpen(false)}
                  className="mt-1 flex items-center gap-2 rounded-lg bg-cream-50 px-3 py-2 text-sm font-semibold text-stone-700"
                >
                  <User size={16} /> {profile.full_name}
                </Link>
                {profile.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-lg bg-agro-50 px-3 py-2 text-sm font-bold text-agro-800"
                  >
                    <ShieldCheck size={16} /> Panel de administración
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} /> Cerrar sesión
                </button>
              </>
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

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentName={profile?.full_name ?? ""}
        currentPhone={profile?.phone ?? ""}
      />
    </header>
  );
}