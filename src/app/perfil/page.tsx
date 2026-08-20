import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Tractor, ShoppingCart, Package, Heart, Map, MessageCircle, Settings } from "lucide-react";
import SignOutButton from "@/components/SignOutButton";

export const metadata = { title: "Mi perfil — AgroConecta" };

export default async function PerfilPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/perfil");

  const isAgricultor = session.user.role === "agricultor";

  const links = [
    ...(isAgricultor
      ? [
          { href: "/mis-publicaciones", label: "Mis publicaciones", icon: Package },
          { href: "/mapa", label: "Mapa de productores", icon: Map },
        ]
      : []),
    { href: "/favoritos", label: "Mis favoritos", icon: Heart },
    { href: "/mensajes", label: "Mensajes", icon: MessageCircle },
  ];

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="rounded-3xl border border-cream-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt=""
              width={80}
              height={80}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-agro-600 text-2xl font-bold text-white">
              {session.user.name?.[0] ?? "U"}
            </span>
          )}
          <div>
            <h1 className="text-2xl font-extrabold text-agro-800">
              {session.user.name}
            </h1>
            <span
              className={`mt-1 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                isAgricultor
                  ? "bg-agro-100 text-agro-800"
                  : "bg-sun-300/40 text-yellow-800"
              }`}
            >
              {isAgricultor ? <Tractor size={12} /> : <ShoppingCart size={12} />}
              {isAgricultor ? "Agricultor" : "Comprador"}
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
      </div>
    </section>
  );
}
