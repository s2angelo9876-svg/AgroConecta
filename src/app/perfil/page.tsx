import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Tractor,
  ShoppingCart,
  Package,
  Heart,
  Map,
  MessageCircle,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { getUser, getProfile } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";

export const metadata = { title: "Mi perfil — AgroConecta" };

export default async function PerfilPage() {
  const user = await getUser();
  if (!user) redirect("/login?callbackUrl=/perfil");

  const profile = await getProfile();
  const role = profile?.role ?? "comprador";
  const fullName = profile?.full_name ?? user.email ?? "Usuario";
  const avatarUrl = profile?.avatar_url ?? null;
  const isAgricultor = role === "agricultor";

  const links = [
    ...(isAgricultor
      ? [
          { href: "/mis-publicaciones", label: "Mis publicaciones", icon: Package },
          { href: "/verificar", label: "Verificar mi cuenta", icon: ShieldCheck },
          { href: "/mapa", label: "Mapa de productores", icon: Map },
        ]
      : []),
    ...(role === "admin"
      ? [{ href: "/admin", label: "Panel de administración", icon: ShieldCheck }]
      : []),
    { href: "/favoritos", label: "Mis favoritos", icon: Heart },
    {
      href: "/mensajes",
      label: "Mensajes (próximamente)",
      icon: MessageCircle,
    },
  ];

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="rounded-3xl border border-cream-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt=""
              width={80}
              height={80}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-agro-600 text-2xl font-bold text-white">
              {fullName[0]?.toUpperCase() ?? "U"}
            </span>
          )}
          <div>
            <h1 className="text-2xl font-extrabold text-agro-800">{fullName}</h1>
            <span
              className={`mt-1 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                isAgricultor
                  ? "bg-agro-100 text-agro-800"
                  : role === "admin"
                  ? "bg-soil-500/20 text-soil-800"
                  : "bg-sun-300/40 text-yellow-800"
              }`}
            >
              {isAgricultor ? (
                <Tractor size={12} />
              ) : role === "admin" ? (
                <ShieldCheck size={12} />
              ) : (
                <ShoppingCart size={12} />
              )}
              {isAgricultor
                ? "Agricultor"
                : role === "admin"
                ? "Administrador"
                : "Comprador"}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between rounded-xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm font-bold text-stone-700 transition hover:border-agro-300"
            >
              <span className="flex items-center gap-2">
                <Icon size={18} className="text-agro-600" /> {label}
              </span>
              <span>→</span>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <SignOutButton />
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-stone-200 px-4 py-3 text-sm font-bold text-stone-600 transition hover:bg-cream-50">
            <Settings size={16} /> Configuración
          </button>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-stone-400">
          <ShieldCheck size={14} /> Sesión segura vía Supabase (cookies
          HttpOnly).
        </p>
      </div>
    </section>
  );
}