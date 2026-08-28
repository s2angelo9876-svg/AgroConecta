import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  CalendarDays,
  BadgeCheck,
  Star,
  ArrowLeft,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import FarmerContact from "@/components/FarmerContact";
import Breadcrumbs from "@/components/Breadcrumbs";
import type { UiProduct } from "@/lib/schemas";

export const metadata = { title: "Perfil de agricultor — AgroConecta" };

export default async function FarmerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Traer perfil + farmer_profile del usuario
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      `
      id,
      full_name,
      avatar_url,
      farmer_profile:farmer_profiles!user_id(
        farm_name, location, lat, lng, verified, verification_status,
        rating, reviews_count, member_since, bio
      )
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (!profile) notFound();

  const farmerProfile = profile.farmer_profile?.[0] ?? profile.farmer_profile;

  // Productos del agricultor
  const { data: productsRows } = await supabase
    .from("products")
    .select(
      `
      *,
      farmer:profiles!farmer_id(
        full_name, avatar_url,
        farmer_profile:farmer_profiles!user_id(verified, location, rating, reviews_count)
      )
    `
    )
    .eq("farmer_id", id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(50);

  const products: UiProduct[] = (productsRows ?? []).map((p: any) => {
    const farmer = p.farmer;
    const fp = farmer?.farmer_profile?.[0] ?? farmer?.farmer_profile;
    return {
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
      farmerSummary: fp
        ? {
            id: p.farmer_id,
            name: farmer?.full_name ?? profile.full_name,
            avatar: farmer?.avatar_url ?? "/logo-mark.png",
            location: fp.location ?? "Perú",
            verified: Boolean(fp.verified),
            rating: Number(fp.rating ?? 0),
            reviews: Number(fp.reviews_count ?? 0),
          }
        : undefined,
    };
  });

  const name = profile.full_name;
  const avatar = profile.avatar_url ?? "/logo-mark.png";
  const location = farmerProfile?.location ?? "Perú";
  const verified = Boolean(farmerProfile?.verified);
  const rating = Number(farmerProfile?.rating ?? 0);
  const reviews = Number(farmerProfile?.reviews_count ?? 0);
  const memberSince =
    farmerProfile?.member_since
      ? new Date(farmerProfile.member_since).toLocaleDateString("es-PE", {
          year: "numeric",
          month: "long",
        })
      : null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Buscar", href: "/buscar" },
          { label: name },
        ]}
      />
      <Link
        href="/buscar"
        className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-agro-700 hover:underline"
      >
        <ArrowLeft size={16} /> Volver a productos
      </Link>

      <div className="mt-6 overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-sm">
        <div className="px-6 pb-6 pt-12 sm:pt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <Image
                src={avatar}
                alt={name}
                width={96}
                height={96}
                className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
              />
              <div className="pb-1">
                <h1 className="flex items-center gap-2 text-2xl font-extrabold text-stone-800">
                  {name}
                  {verified && (
                    <BadgeCheck size={22} className="text-agro-600" />
                  )}
                </h1>
                {rating > 0 && (
                  <div className="mt-1 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.round(rating)
                            ? "fill-sun-400 text-sun-400"
                            : "text-stone-300"
                        }
                      />
                    ))}
                    <span className="ml-1 text-sm text-stone-500">
                      ({reviews})
                    </span>
                  </div>
                )}
              </div>
            </div>
            <FarmerContact farmerName={name} />
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-stone-500">
            <span className="flex items-center gap-1.5">
              <MapPin size={15} className="text-agro-600" /> {location}
            </span>
            {memberSince && (
              <span className="flex items-center gap-1.5">
                <CalendarDays size={15} className="text-agro-600" /> Miembro
                desde: {memberSince}
              </span>
            )}
            {verified && (
              <span className="flex items-center gap-1.5 font-semibold text-agro-700">
                <BadgeCheck size={15} /> Agricultor verificado
              </span>
            )}
          </div>

          {farmerProfile?.bio && (
            <p className="mt-4 text-sm text-stone-600">{farmerProfile.bio}</p>
          )}
        </div>
      </div>

      <h2 className="mt-8 text-xl font-extrabold text-agro-800">
        Productos publicados ({products.length})
      </h2>
      {products.length > 0 ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center text-sm text-stone-500">
          <User size={28} className="mx-auto text-stone-300" />
          <p className="mt-2">
            Este agricultor aún no tiene publicaciones activas.
          </p>
        </div>
      )}
    </section>
  );
}