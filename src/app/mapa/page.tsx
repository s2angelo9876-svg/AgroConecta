import { MapPin } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = { title: "Mapa de productores — AgroConecta" };

// Bounds geográficos del Perú
const BOUNDS = { north: -0.04, south: -18.4, west: -81.4, east: -68.6 };

function latLngToPct(lat: number | null, lng: number | null) {
  if (lat == null || lng == null) return null;
  const latPct = ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * 100;
  const lngPct = ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * 100;
  if (latPct < 0 || latPct > 100 || lngPct < 0 || lngPct > 100) return null;
  return { top: latPct, left: lngPct };
}

export default async function MapaPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("farmer_profiles")
    .select(
      "user_id, location, lat, lng, profiles!user_id(full_name, avatar_url)"
    )
    .eq("verified", true);

  const pins = (rows ?? [])
    .map((r: any) => {
      const pos = latLngToPct(r.lat, r.lng);
      if (!pos) return null;
      return {
        id: r.user_id,
        name: r.profiles?.full_name ?? "Agricultor",
        avatar: r.profiles?.avatar_url ?? "/logo-mark.png",
        location: r.location ?? "Ica",
        ...pos,
      };
    })
    .filter(Boolean) as Array<{
      id: string;
      name: string;
      avatar: string;
      location: string;
      top: number;
      left: number;
    }>;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Mapa" }]} />
      <h1 className="mt-2 text-2xl font-extrabold text-agro-800">
        Geolocalización de productores
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Encuentra agricultores verificados cerca de tu zona.
      </p>

      <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden rounded-3xl border border-cream-200 bg-cream-100 shadow-sm">
        <iframe
          title="Mapa de productores en el Perú"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${BOUNDS.west}%2C${BOUNDS.south}%2C${BOUNDS.east}%2C${BOUNDS.north}&layer=mapnik`}
          className="absolute inset-0 h-full w-full border-0"
        />
        {pins.map((pin) => (
          <div
            key={pin.id}
            className="group absolute"
            style={{ top: `${pin.top}%`, left: `${pin.left}%` }}
          >
            <span className="relative flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-agro-600 shadow-md transition group-hover:scale-110">
              <MapPin size={12} className="text-white" />
            </span>
            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-44 -translate-x-1/2 rounded-xl border border-cream-200 bg-white p-3 opacity-0 shadow-lg transition group-hover:opacity-100">
              <div className="flex items-center gap-2">
                <Image
                  src={pin.avatar}
                  alt={pin.name}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-bold leading-tight text-stone-800">
                    {pin.name}
                  </p>
                  <p className="text-[10px] text-stone-500">
                    <MapPin size={9} className="mr-0.5 inline" />
                    {pin.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-stone-400">
        {pins.length} agricultor{pins.length === 1 ? "" : "es"} verificado
        {pins.length === 1 ? "" : "s"} en el mapa.
      </p>
    </section>
  );
}