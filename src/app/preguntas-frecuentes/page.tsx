import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, ArrowLeft } from "lucide-react";
import { getPublishedFaqsAction } from "@/lib/actions/faq";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Preguntas frecuentes — AgroConecta",
  description:
    "Resuelve tus dudas sobre cómo publicar, comprar, verificar tu cuenta y más.",
};

export default async function FaqsPage() {
  const faqs = await getPublishedFaqsAction();

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "FAQs" }]} />
      <Link
        href="/"
        className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-agro-700 hover:underline"
      >
        <ArrowLeft size={14} /> Volver
      </Link>

      <header className="mt-4 flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-agro-100 text-agro-700">
          <HelpCircle size={26} />
        </span>
        <h1 className="mt-3 text-3xl font-extrabold text-agro-800">
          Preguntas frecuentes
        </h1>
        <p className="mt-1 max-w-md text-sm text-stone-500">
          Las respuestas a las dudas más comunes. ¿No encuentras tu respuesta?
          Escríbenos a contacto@agroconecta.com.
        </p>
      </header>

      {faqs.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500">
          Aún no hay preguntas publicadas.
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.id}
              className="group rounded-2xl border border-cream-200 bg-white p-5 shadow-sm transition open:shadow-md"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-3 list-none [&::-webkit-details-marker]:hidden">
                <span className="flex-1 font-bold text-stone-800">
                  {faq.question}
                </span>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream-100 text-stone-500 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 border-t border-cream-100 pt-3 text-sm text-stone-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      )}

      <div className="mt-12 rounded-2xl border border-cream-200 bg-agro-50 p-6 text-center">
        <p className="text-sm font-bold text-agro-800">
          ¿Tienes otra pregunta?
        </p>
        <p className="mt-1 text-xs text-stone-500">
          Estamos disponibles en contacto@agroconecta.com y respondemos en
          menos de 24 horas.
        </p>
        <Link
          href="/equipo"
          className="mt-3 inline-block rounded-xl bg-agro-700 px-5 py-2 text-sm font-bold text-white transition hover:bg-agro-600"
        >
          Conoce al equipo
        </Link>
      </div>
    </section>
  );
}