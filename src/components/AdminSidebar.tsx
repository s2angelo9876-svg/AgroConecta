"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  FileCheck,
  Package,
  HelpCircle,
  Quote,
} from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Resumen", icon: ShieldCheck },
  { href: "/admin/verificaciones", label: "Verificaciones", icon: FileCheck },
  { href: "/admin/publicaciones", label: "Publicaciones", icon: Package },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/testimonials", label: "Testimonios", icon: Quote },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const active = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside className="hidden w-56 shrink-0 border-r border-cream-200 bg-white p-4 md:block">
      <Link
        href="/admin"
        className="mb-4 flex items-center gap-2 border-b border-cream-200 pb-4"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-agro-800 text-white">
          <ShieldCheck size={18} />
        </span>
        <span>
          <p className="text-sm font-extrabold">AgroConecta</p>
          <p className="text-xs text-stone-500">Panel admin</p>
        </span>
      </Link>

      <nav className="space-y-1">
        {LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              active(href)
                ? "bg-agro-50 text-agro-700"
                : "text-stone-600 hover:bg-cream-100"
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-6 rounded-lg bg-cream-50 p-3 text-xs text-stone-500">
        <Link href="/" className="font-bold text-agro-700 hover:underline">
          ← Volver al sitio
        </Link>
      </div>
    </aside>
  );
}