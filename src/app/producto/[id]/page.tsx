"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Package,
  Star,
  Calendar,
  Phone,
  MessageCircle,
  BadgeCheck,
  Heart,
  ShoppingBag,
} from "lucide-react";
import { useProducts } from "@/components/ProductsProvider";
import QualityBadge from "@/components/QualityBadge";
import ContactModal from "@/components/ContactModal";
import CheckoutModal from "@/components/CheckoutModal";
import VerifiedBadge from "@/components/VerifiedBadge";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ProductJsonLd } from "@/components/JsonLd";
import { useFavorites } from "@/components/FavoritesProvider";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { products } = useProducts();
  const [contactOpen, setContactOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-extrabold text-agro-800">
          Producto no encontrado
        </h1>
        <p className="mt-2 text-stone-500">
          Es posible que la publicación ya no esté disponible.
        </p>
        <Link
          href="/buscar"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-agro-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-agro-600"
        >
          <ArrowLeft size={16} /> Volver a buscar
        </Link>
      </section>
    );
  }

  const farmerName = product.farmerSummary?.name ?? "Agricultor";
  const farmerAvatar = product.farmerSummary?.avatar;
  const farmerVerified = product.farmerSummary?.verified ?? false;
  const farmerRating = product.farmerSummary?.rating ?? 0;
  const farmerReviews = product.farmerSummary?.reviews ?? 0;
  const farmerId = product.farmerId;

  const info = [
    {
      Icon: Package,
      label: "Cantidad disponible",
      value: `${product.quantity} ${product.unit}`,
    },
    { Icon: MapPin, label: "Ubicación", value: product.location },
    { Icon: Star, label: "Calidad", value: product.quality },
    {
      Icon: Calendar,
      label: "Fecha de cosecha",
      value: new Date(`${product.harvestDate}T00:00:00`).toLocaleDateString(
        "es-PE",
        { day: "2-digit", month: "2-digit", year: "numeric" }
      ),
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Buscar", href: "/buscar" },
          { label: product.name },
        ]}
      />
      <Link
        href="/buscar"
        className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-agro-700 hover:underline"
      >
        <ArrowLeft size={16} /> Volver a resultados
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="relative h-72 overflow-hidden rounded-3xl shadow-md sm:h-96">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold text-agro-800">
              {product.name}
            </h1>
            <QualityBadge quality={product.quality} />
            {farmerVerified && <VerifiedBadge verified />}
            <button
              type="button"
              onClick={() => toggleFavorite(product.id)}
              aria-label={isFavorite(product.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
              className="rounded-full border border-cream-200 p-2 text-stone-400 transition hover:text-red-500"
            >
              <Heart
                size={20}
                className={
                  isFavorite(product.id)
                    ? "fill-red-500 text-red-500"
                    : ""
                }
              />
            </button>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-agro-700">
            S/ {product.price.toFixed(2)}{" "}
            <span className="text-base font-semibold text-stone-400">
              / {product.unit}
            </span>
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {info.map(({ Icon, label, value }) => (
              <div
                key={label}
                className="rounded-xl border border-cream-200 bg-white p-3"
              >
                <p className="flex items-center gap-1.5 text-xs font-semibold text-stone-400">
                  <Icon size={14} className="text-agro-600" /> {label}
                </p>
                <p className="mt-1 font-bold text-stone-700">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-stone-400">
              Descripción
            </h2>
            <p className="mt-1 text-stone-600">
              {product.description || "Sin descripción."}
            </p>
          </div>

          <Link
            href={`/agricultor/${farmerId}`}
            className="mt-6 flex items-center gap-4 rounded-2xl border border-cream-200 bg-white p-4 transition hover:border-agro-300"
          >
            {farmerAvatar ? (
              <Image
                src={farmerAvatar}
                alt={farmerName}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-agro-600 text-xl font-bold text-white">
                {farmerName[0]?.toUpperCase() ?? "A"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 font-bold text-stone-800">
                {farmerName}
                {farmerVerified && (
                  <BadgeCheck size={16} className="shrink-0 text-agro-600" />
                )}
              </p>
              {farmerRating > 0 && (
                <p className="truncate text-sm text-stone-500">
                  ⭐ {farmerRating} ({farmerReviews}) · {product.location}
                </p>
              )}
            </div>
            <span className="shrink-0 text-xs font-bold text-agro-700">
              Ver perfil →
            </span>
          </Link>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setCheckoutOpen(true)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-sun-400 px-6 py-3.5 font-bold text-stone-900 transition hover:bg-sun-300"
            >
              <ShoppingBag size={18} /> Comprar ahora
            </button>
            <button
              onClick={() => setContactOpen(true)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-agro-700 px-6 py-3.5 font-bold text-white transition hover:bg-agro-600"
            >
              <Phone size={18} /> Contactar
            </button>
          </div>
        </div>
      </div>

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        farmerName={farmerName}
        farmerAvatar={farmerAvatar}
      />
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        product={product}
      />
      <ProductJsonLd
        name={product.name}
        description={product.description}
        image={product.image}
        price={product.price}
        location={product.location}
        farmerName={farmerName}
        url={typeof window !== "undefined" ? window.location.href : ""}
      />
    </section>
  );
}