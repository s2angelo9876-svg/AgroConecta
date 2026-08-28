import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Package, ShoppingBag, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = { title: "¡Listo! — AgroConecta" };

interface SearchParams {
  action?: "publicacion" | "compra";
  id?: string;
  qty?: string;
  total?: string;
}

export default async function GraciasPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const isPublication = params.action === "publicacion";

  let productName = "tu cosecha";
  if (params.id) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("name")
      .eq("id", params.id)
      .maybeSingle();
    if (data?.name) productName = data.name;
  }

  const title = isPublication
    ? `¡${productName} publicado!`
    : "¡Pago realizado con éxito!";
  const subtitle = isPublication
    ? `Tu cosecha ya está visible en el catálogo. Los compradores interesados pueden contactarte directamente.`
    : `Orden #${Date.now().toString().slice(-6)} · ${params.qty ?? "?"} kg de ${productName} · S/ ${params.total ?? "?"}`;

  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-16">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Listo" }]} />

      <div className="mt-4 flex h-20 w-20 items-center justify-center rounded-full bg-agro-100">
        <CheckCircle2 size={48} className="text-agro-600" />
      </div>
      <h1 className="mt-6 text-3xl font-extrabold text-agro-800">{title}</h1>
      <p className="mx-auto mt-2 max-w-md text-center text-sm text-stone-500">
        {subtitle}
      </p>

      <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {isPublication ? (
          params.id && (
            <Link
              href={`/producto/${params.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-agro-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-agro-600"
            >
              <Package size={16} /> Ver publicación
            </Link>
          )
        ) : (
          <Link
            href="/buscar"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-agro-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-agro-600"
          >
            <ShoppingBag size={16} /> Seguir comprando
          </Link>
        )}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-agro-700 px-4 py-3 text-sm font-bold text-agro-700 transition hover:bg-agro-50"
        >
          Volver al inicio <ArrowRight size={16} />
        </Link>
      </div>

      <div className="mt-10 grid w-full grid-cols-3 gap-2 text-center">
        <Stat
          icon={<Package size={18} className="mx-auto text-agro-600" />}
          label="Tu cosecha está activa"
        />
        <Stat
          icon={<CheckCircle2 size={18} className="mx-auto text-agro-600" />}
          label="Sin intermediarios"
        />
        <Stat
          icon={<ShoppingBag size={18} className="mx-auto text-agro-600" />}
          label="Listo para vender"
        />
      </div>

      <p className="mt-8 rounded-lg bg-cream-50 p-3 text-center text-xs text-stone-500">
        💡 Tip: responde rápido a los mensajes para cerrar más tratos. Tu
        perfil ya tiene el sello de <strong>confianza</strong>.
      </p>
    </section>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border border-cream-200 bg-white p-3">
      {icon}
      <p className="mt-1 text-xs font-semibold text-stone-700">{label}</p>
    </div>
  );
}