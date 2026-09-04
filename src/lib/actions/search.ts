"use server";

import { createClient } from "@/lib/supabase/server";
import type { SearchResultItem } from "@/lib/search-data";

interface GroupedResults {
  pages: SearchResultItem[];
  products: SearchResultItem[];
  faqs: SearchResultItem[];
  farmers: SearchResultItem[];
}

const PAGES: SearchResultItem[] = [
  { type: "page", title: "Inicio", href: "/" },
  { type: "page", title: "Buscar productos", href: "/buscar" },
  { type: "page", title: "Publicar cosecha", href: "/publicar" },
  { type: "page", title: "Mapa de productores", href: "/mapa" },
  { type: "page", title: "Mis publicaciones", href: "/mis-publicaciones" },
  { type: "page", title: "Mis favoritos", href: "/favoritos" },
  { type: "page", title: "Mensajes", href: "/mensajes" },
  { type: "page", title: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
  { type: "page", title: "Equipo", href: "/equipo" },
  { type: "page", title: "Política de privacidad", href: "/privacidad" },
  { type: "page", title: "Términos y condiciones", href: "/terminos" },
];

/** Devuelve todos los datos remotos necesarios para el Cmd+K. */
export async function fetchSearchIndexAction(): Promise<GroupedResults> {
  const supabase = await createClient();
  const [
    { data: products },
    { data: faqs },
    { data: farmers },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, location, price, farmer:profiles!farmer_id(full_name)")
      .eq("status", "active")
      .limit(50),
    supabase
      .from("faqs")
      .select("id, question, answer")
      .eq("published", true)
      .limit(50),
    supabase
      .from("profiles")
      .select("id, full_name, farmer_profile:farmer_profiles!user_id(location, verified)")
      .eq("role", "agricultor")
      .limit(50),
  ]);

  return {
    pages: PAGES,
    products: (products ?? []).map((p: any) => ({
      type: "product" as const,
      title: p.name,
      subtitle: `${p.location} · S/ ${Number(p.price).toFixed(2)} · ${
        p.farmer?.full_name ?? "Agricultor"
      }`,
      href: `/producto/${p.id}`,
    })),
    faqs: (faqs ?? []).map((f: any) => ({
      type: "faq" as const,
      title: f.question,
      subtitle: f.answer.slice(0, 80) + (f.answer.length > 80 ? "…" : ""),
      href: `/preguntas-frecuentes#${f.id}`,
    })),
    farmers: (farmers ?? []).map((f: any) => ({
      type: "farmer" as const,
      title: f.full_name,
      subtitle:
        f.farmer_profile?.verified
          ? `🌱 ${f.farmer_profile?.location ?? "Ica"} · Verificado`
          : (f.farmer_profile?.location ?? "Ica"),
      href: `/agricultor/${f.id}`,
    })),
  };
}