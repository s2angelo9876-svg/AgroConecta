import { MapPin } from "lucide-react";
import { MAP_PINS } from "@/data/mock";
import Image from "next/image";

export const metadata = { title: "Mapa de productores — AgroConecta" };

export default function MapaPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-extrabold text-agro-800">
        Geolocalización de productores
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Encuentra agricultores y cosechas cercanas a tu zona.
      </p>

      <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden rounded-3xl border border-cream-200 bg-cream-100 shadow-sm">
        <iframe
          title="Mapa de productores en Ica"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-76.35%2C-14.15%2C-75.55%2C-13.55&layer=mapnik"
          className="absolute inset-0 h-full w-full border-0"
        />
        {MAP_PINS.map((pin) => (
          <div
            key={pin.id}
            className="group absolute"
            style={{ top: `${pin.latPct}%`, left: `${pin.lngPct}%` }}
          >
            <span className="relative flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-agro-600 shadow-md transition group-hover:scale-110">
              <MapPin size={12} className="text-white" />
            </span>
            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-40 -translate-x-1/2 rounded-xl border border-cream-200 bg-white p-2 opacity-0 shadow-lg transition group-hover:opacity-100">
              <div className="flex items-center gap-2">
                <Image
                  src={pin.image}
                  alt={pin.name}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <p className="text-xs font-bold leading-tight text-stone-800">
                  {pin.name}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-stone-400">
        Demo: ubicaciones aproximadas. En la versión final se usará el mapa real
        de cada agricultor.
      </p>
    </section>
  );
}
