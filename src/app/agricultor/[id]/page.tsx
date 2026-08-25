import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  CalendarDays,
  BadgeCheck,
  Star,
  ArrowLeft,
} from "lucide-react";
import { FARMERS, findFarmer, REVIEWS } from "@/data/mock";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import FarmerContact from "@/components/FarmerContact";
import type { UiProduct } from "@/lib/schemas";

export function generateStaticParams() {
  return FARMERS.map((f) => ({ id: f.id }));
}

export default async function FarmerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const farmer = findFarmer(id);
  if (!farmer) notFound();

  const supabase = await createClient();

  // Buscar el farmer por nombre en profiles (los UUIDs de Supabase son distintos a f1/f2/f3)
  // Como simplificación del demo: usamos el mock Farmer + buscamos productos del nombre.
  const { data: farmerProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("full_name", farmer.name)
    .maybeSingle();

  let products: UiProduct[] = [];
  if (farmerProfile) {
    const { data } = await supabase
      .from("products")
      .select("*, farmer:profiles!farmer_id(full_name)")
      .eq("farmer_id", farmerProfile.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) {
      products = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        quantity: Number(p.quantity),
        unit: p.unit,
        price: Number(p.price),
        location: p.location,
        harvestDate: p.harvest_date,
        quality: p.quality,
        image: p.image_url || "/placeholder.png",
        description: p.description || "",
        farmerId: p.farmer_id,
        farmerName: p.farmer?.full_name,
      }));
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link
        href="/buscar"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-agro-700 hover:underline"
      >
        <ArrowLeft size={16} /> Volver a productos
      </Link>

      <div className="mt-6 overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-sm">
        <div className="relative h-44 sm:h-56">
          <Image
            src={farmer.cover}
            alt={`Campo de ${farmer.name}`}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <Image
                src={farmer.avatar}
                alt={farmer.name}
                width={96}
                height={96}
                className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
              />
              <div className="pb-1">
                <h1 className="flex items-center gap-2 text-2xl font-extrabold text-stone-800">
                  {farmer.name}
                  {farmer.verified && (
                    <BadgeCheck size={22} className="text-agro-600" />
                  )}
                </h1>
                <div className="mt-1 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.round(farmer.rating)
                          ? "fill-sun-400 text-sun-400"
                          : "text-stone-300"
                      }
                    />
                  ))}
                  <span className="ml-1 text-sm text-stone-500">
                    ({farmer.reviews})
                  </span>
                </div>
              </div>
            </div>
            <FarmerContact farmerName={farmer.name} phone={farmer.phone} />
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-stone-500">
            <span className="flex items-center gap-1.5">
              <MapPin size={15} className="text-agro-600" /> {farmer.location}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays size={15} className="text-agro-600" /> Miembro
              desde: {farmer.memberSince}
            </span>
            {farmer.verified && (
              <span className="flex items-center gap-1.5 font-semibold text-agro-700">
                <BadgeCheck size={15} /> Agricultor verificado
              </span>
            )}
          </div>
        </div>
      </div>

      <h2 className="mt-8 text-xl font-extrabold text-agro-800">
        Productos publicados ({products.length})
      </h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} farmer={farmer} />
        ))}
      </div>

      {REVIEWS[farmer.id] && REVIEWS[farmer.id].length > 0 && (
        <>
          <h2 className="mt-10 text-xl font-extrabold text-agro-800">
            Reseñas ({REVIEWS[farmer.id].length})
          </h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {REVIEWS[farmer.id].map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-cream-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-stone-800">{review.author}</p>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < review.rating
                            ? "fill-sun-400 text-sun-400"
                            : "text-stone-300"
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-xs text-stone-400">{review.date}</p>
                <p className="mt-2 text-sm text-stone-600">{review.text}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
