"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MapPin, MessageCircle, Heart } from "lucide-react";
import type { UiProduct } from "@/lib/schemas";
import QualityBadge from "./QualityBadge";
import ContactModal from "./ContactModal";
import VerifiedBadge from "./VerifiedBadge";
import { useFavorites } from "./FavoritesProvider";

export default function ProductCard({ product }: { product: UiProduct }) {
  const [contactOpen, setContactOpen] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(product.id);

  const farmerName = product.farmerSummary?.name ?? "Agricultor";
  const farmerAvatar = product.farmerSummary?.avatar;
  const farmerVerified = product.farmerSummary?.verified ?? false;
  const farmerRating = product.farmerSummary?.rating ?? 0;

  return (
    <article className="flex gap-4 rounded-2xl border border-cream-200 bg-white p-3 shadow-sm transition hover:shadow-md">
      <Link
        href={`/producto/${product.id}`}
        className="relative h-32 w-28 shrink-0 overflow-hidden rounded-xl sm:w-36"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 112px, 144px"
          className="object-cover"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className="absolute right-2 top-2 rounded-full bg-white/80 p-1.5 text-stone-400 shadow-sm backdrop-blur transition hover:text-red-500"
          aria-label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <Heart
            size={18}
            className={favorite ? "fill-red-500 text-red-500" : ""}
          />
        </button>
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          href={`/producto/${product.id}`}
          className="truncate text-lg font-bold text-agro-800 hover:underline"
        >
          {product.name}
        </Link>
        {farmerVerified && (
          <div className="mt-0.5">
            <VerifiedBadge verified size="sm" />
          </div>
        )}
        <p className="mt-0.5 flex items-center gap-1 text-sm text-stone-500">
          <MapPin size={14} className="text-agro-600" /> {product.location}
        </p>
        <p className="text-sm text-stone-500">
          {product.quantity} {product.unit} disponibles
        </p>
        <p className="mt-1 text-lg font-extrabold text-agro-700">
          S/ {product.price.toFixed(2)}{" "}
          <span className="text-sm font-semibold text-stone-400">
            / {product.unit}
          </span>
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          <QualityBadge quality={product.quality} />
          <button
            onClick={() => setContactOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-agro-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-agro-600"
          >
            <MessageCircle size={14} /> Contactar
          </button>
        </div>
      </div>
      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        farmerName={farmerName}
        farmerAvatar={farmerAvatar}
      />
    </article>
  );
}