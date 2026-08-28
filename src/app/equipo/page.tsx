import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Nuestro equipo — AgroConecta",
  description:
    "Conoce al equipo detrás de AgroConecta: la plataforma que conecta el campo con el comprador.",
};

const TEAM = [
  {
    name: "Equipo fundador",
    role: "Agricultura + Tecnología",
    avatar: "/logo-mark.png",
    bio: "Combinamos experiencia en el campo agrícola con desarrollo de software para construir una plataforma que realmente entienda al agricultor peruano.",
  },
];

export default function EquipoPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-center text-3xl font-extrabold text-agro-800">
        Nuestro equipo
      </h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-stone-500">
        Estamos construyendo la herramienta que el agricultor peruano
        necesitaba: simple, directa y sin intermediarios.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {TEAM.map((m) => (
          <div
            key={m.name}
            className="flex flex-col items-center rounded-3xl border border-cream-200 bg-white p-6 text-center shadow-sm"
          >
            <Image
              src={m.avatar}
              alt={m.name}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full bg-white object-contain p-2"
            />
            <h2 className="mt-3 text-xl font-bold text-stone-800">{m.name}</h2>
            <p className="text-sm font-semibold text-agro-700">{m.role}</p>
            <p className="mt-2 text-sm text-stone-500">{m.bio}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        <Commitment icon={Clock} label="Respondemos en menos de 24 horas" />
        <Commitment icon={MapPin} label="Operamos en Ica y Chincha" />
        <Commitment icon={Mail} label="contacto@agroconecta.com" />
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/"
          className="inline-block rounded-xl bg-sun-400 px-6 py-3 font-bold text-stone-900 transition hover:bg-sun-300"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}

function Commitment({
  icon: Icon,
  label,
}: {
  icon: typeof Mail;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-cream-200 bg-cream-50 p-4 text-center">
      <Icon size={22} className="mx-auto text-agro-600" />
      <p className="mt-1 text-xs font-semibold text-stone-700">{label}</p>
    </div>
  );
}