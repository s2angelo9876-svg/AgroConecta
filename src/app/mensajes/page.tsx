import Link from "next/link";
import { MessageCircle, Sparkles } from "lucide-react";

export const metadata = { title: "Mensajes — AgroConecta" };

export default function MensajesPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-16 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-agro-50 text-agro-700">
        <MessageCircle size={28} />
      </span>
      <h1 className="mt-4 text-2xl font-extrabold text-agro-800">Mensajes</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-stone-500">
        El chat en tiempo real estará disponible próximamente. Por ahora, usa
        los botones <strong>Contactar</strong> o <strong>Llamar</strong> en
        cada producto para comunicarte directamente con el agricultor.
      </p>

      <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-3">
        <Link
          href="/buscar"
          className="rounded-xl bg-agro-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-agro-600"
        >
          Buscar productos
        </Link>
        <Link
          href="/favoritos"
          className="rounded-xl border-2 border-agro-700 px-4 py-3 text-sm font-bold text-agro-700 transition hover:bg-agro-50"
        >
          Mis favoritos
        </Link>
      </div>

      <div className="mx-auto mt-10 flex max-w-md items-start gap-2 rounded-2xl bg-cream-50 p-4 text-left text-xs text-stone-500">
        <Sparkles size={14} className="mt-0.5 shrink-0 text-agro-600" />
        El chat con Supabase Realtime / Pusher es la siguiente fase del
        proyecto (ya está el modelo de datos en Supabase).
      </div>
    </section>
  );
}