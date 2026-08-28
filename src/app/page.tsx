import Image from "next/image";
import Link from "next/link";
import {
  Sprout,
  Handshake,
  Truck,
  ShoppingBasket,
  Store,
  MessagesSquare,
  CheckCircle2,
  Search,
  Sun,
  Leaf,
  ArrowRight,
  Star,
  Clock,
  ShieldCheck,
  Quote,
} from "lucide-react";
import FeaturedProducts from "@/components/FeaturedProducts";
import { LocalBusinessJsonLd } from "@/components/JsonLd";
import { createClient } from "@/lib/supabase/server";
import { HERO_IMAGE } from "@/lib/catalog";

const STEPS = [
  {
    Icon: Sprout,
    title: "1. Publica tu cosecha",
    text: "Registra tus productos de forma fácil.",
  },
  {
    Icon: Handshake,
    title: "2. Encuentra compradores",
    text: "Conéctate con restaurantes, hoteles, supermercados y más.",
  },
  {
    Icon: Truck,
    title: "3. Negocia directamente",
    text: "Sin intermediarios, mejor precio para ti.",
  },
];

const FEATURES = [
  {
    Icon: ShoppingBasket,
    iconClasses: "bg-agro-600",
    title: "Publica tu cosecha",
    items: [
      "Registra tus productos",
      "Sube fotografías",
      "Indica precio y cantidad",
      "Llega a más compradores",
    ],
  },
  {
    Icon: Store,
    iconClasses: "bg-sun-400",
    title: "Encuentra compradores",
    items: [
      "Restaurantes",
      "Hoteles",
      "Supermercados",
      "Empresas exportadoras",
      "y más",
    ],
  },
  {
    Icon: MessagesSquare,
    iconClasses: "bg-soil-500",
    title: "Negociación directa",
    items: [
      "Sin intermediarios",
      "Mejor precio",
      "Contacto directo por chat",
      "Acuerdos más rápidos",
    ],
  },
];

const FARMER_BENEFITS = [
  "Más compradores",
  "Mejores precios",
  "Menos dependencia de intermediarios",
  "Mayor ganancia",
  "Publicación gratuita de productos",
  "Acceso a compradores de otras regiones",
];

const BUYER_BENEFITS = [
  "Productos frescos",
  "Compra directa del productor",
  "Precios más competitivos",
  "Contacto con agricultores confiables",
  "Mayor variedad de productos",
];

export default async function Home() {
  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(3);
  return (
    <>
      <LocalBusinessJsonLd />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-agro-50 px-4 py-1.5 text-sm font-semibold text-agro-700">
              <Sprout size={16} /> Conectando agricultores con compradores
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-agro-800 sm:text-5xl">
              Del campo al comprador,{" "}
              <span className="text-soil-700">sin intermediarios.</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-stone-600">
              Publica tu cosecha y encuentra compradores de manera rápida,
              segura y directa.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/publicar"
                className="inline-flex items-center gap-2 rounded-xl bg-sun-400 px-6 py-3.5 font-bold text-stone-900 shadow-md transition hover:bg-sun-300"
              >
                <ShoppingBasket size={20} /> Publicar mi cosecha
              </Link>
              <Link
                href="/buscar"
                className="inline-flex items-center gap-2 rounded-xl bg-agro-700 px-6 py-3.5 font-bold text-white shadow-md transition hover:bg-agro-600"
              >
                <Search size={20} /> Buscar productos
              </Link>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-stone-700">
              <Clock size={14} className="text-agro-600" /> Respondemos en menos de 24 horas
            </div>
          </div>
          <div className="relative">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-agro-200/60 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-sun-300/50 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] rounded-tr-[6rem] shadow-xl">
              <Image
                src={HERO_IMAGE}
                alt="Agricultor con su cosecha"
                width={1200}
                height={800}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
            <Sun
              className="absolute -top-4 left-10 text-sun-400"
              size={44}
              aria-hidden
            />
            <Leaf
              className="absolute -left-4 bottom-6 text-agro-400"
              size={36}
              aria-hidden
            />
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-extrabold text-agro-800">
            ¿Cómo funciona?
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map(({ Icon, title, text }, i) => (
              <div
                key={title}
                className="relative rounded-2xl border border-cream-200 bg-cream-50 p-6 text-center"
              >
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-agro-600 text-white">
                  <Icon size={28} />
                </span>
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-1 text-sm text-stone-500">{text}</p>
                {i < STEPS.length - 1 && (
                  <ArrowRight
                    className="absolute -right-5 top-1/2 hidden -translate-y-1/2 text-agro-400 md:block"
                    size={24}
                    aria-hidden
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUÉ OFRECE */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-extrabold text-agro-800">
            ¿Qué ofrece AgroConecta?
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {FEATURES.map(({ Icon, iconClasses, title, items }) => (
              <div
                key={title}
                className="rounded-2xl border border-cream-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full text-white ${iconClasses}`}
                >
                  <Icon size={26} />
                </span>
                <h3 className="mt-4 text-lg font-bold text-agro-800">
                  {title}
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-stone-600">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-agro-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-cream-200">
            <h3 className="bg-agro-800 px-6 py-4 text-center text-lg font-extrabold uppercase tracking-wide text-white">
              Beneficios para el agricultor
            </h3>
            <ul className="space-y-3 bg-cream-50 p-6">
              {FARMER_BENEFITS.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-3 font-medium text-stone-700"
                >
                  <CheckCircle2 size={20} className="shrink-0 text-agro-600" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-3xl border border-cream-200">
            <h3 className="bg-agro-600 px-6 py-4 text-center text-lg font-extrabold uppercase tracking-wide text-white">
              Beneficios para el comprador
            </h3>
            <ul className="space-y-3 bg-cream-50 p-6">
              {BUYER_BENEFITS.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-3 font-medium text-stone-700"
                >
                  <CheckCircle2 size={20} className="shrink-0 text-agro-600" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <h2 className="flex items-center gap-2 text-2xl font-extrabold text-agro-800 sm:text-3xl">
              Productos disponibles <Leaf className="text-agro-400" size={24} />
            </h2>
            <Link
              href="/buscar"
              className="shrink-0 text-sm font-bold text-agro-700 hover:underline"
            >
              Ver todos →
            </Link>
          </div>
          <div className="mt-6">
            <FeaturedProducts />
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/buscar"
              className="inline-block rounded-xl border-2 border-agro-700 px-8 py-3 font-bold text-agro-700 transition hover:bg-agro-50"
            >
              Ver más productos
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      {testimonials && testimonials.length > 0 && (
        <section className="bg-white py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-center text-3xl font-extrabold text-agro-800">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-stone-500">
              Restaurantes, hoteles y compradores que encontraron su próxima
              cosecha en AgroConecta.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="relative rounded-2xl border border-cream-200 bg-cream-50 p-6"
                >
                  <Quote className="absolute right-4 top-4 text-agro-200" size={28} />
                  <p className="text-sm italic text-stone-700">“{t.content}”</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < t.rating
                              ? "fill-sun-400 text-sun-400"
                              : "text-stone-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 font-bold text-stone-800">{t.author_name}</p>
                  {t.author_role && (
                    <p className="text-xs text-stone-500">{t.author_role}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-agro-800 px-8 py-10 text-center sm:px-12 md:flex-row md:text-left">
            <div>
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                ¿Eres agricultor? Publica hoy tu primera cosecha gratis.
              </h2>
              <p className="mt-2 text-agro-100">
                Únete a la comunidad y haz crecer tu negocio.
              </p>
            </div>
            <Link
              href="/publicar"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-sun-400 px-8 py-4 font-bold text-stone-900 shadow-md transition hover:bg-sun-300"
            >
              <ShoppingBasket size={20} /> Comenzar ahora
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
