import Link from "next/link";
import { FileCheck, Package, HelpCircle, Quote } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Panel admin — AgroConecta" };

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [pendingDocs, activeProducts, faqs, testimonials] = await Promise.all([
    supabase
      .from("verification_docs")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase.from("faqs").select("id", { count: "exact", head: true }),
    supabase.from("testimonials").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    {
      label: "Verificaciones pendientes",
      count: pendingDocs.count ?? 0,
      icon: FileCheck,
      href: "/admin/verificaciones",
      highlight: (pendingDocs.count ?? 0) > 0,
    },
    {
      label: "Productos activos",
      count: activeProducts.count ?? 0,
      icon: Package,
      href: "/admin/publicaciones",
    },
    {
      label: "FAQs publicadas",
      count: faqs.count ?? 0,
      icon: HelpCircle,
      href: "/admin/faqs",
    },
    {
      label: "Testimonios publicados",
      count: testimonials.count ?? 0,
      icon: Quote,
      href: "/admin/testimonials",
    },
  ];

  return (
    <>
      <h1 className="text-2xl font-extrabold text-agro-800">Resumen</h1>
      <p className="mt-1 text-sm text-stone-500">
        Vista rápida del estado del sitio.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {stats.map(({ label, count, icon: Icon, href, highlight }) => (
          <Link
            key={label}
            href={href}
            className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
              highlight ? "border-sun-400" : "border-cream-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  highlight ? "bg-sun-400 text-stone-900" : "bg-agro-50 text-agro-700"
                }`}
              >
                <Icon size={18} />
              </span>
              <div>
                <p className="text-xs font-bold uppercase text-stone-500">{label}</p>
                <p className="text-2xl font-extrabold text-agro-800">{count}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}