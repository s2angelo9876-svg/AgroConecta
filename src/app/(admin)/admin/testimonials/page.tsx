import Link from "next/link";
import { ArrowLeft, Quote } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { TestimonialsAdminList } from "./TestimonialsAdminList";

export const metadata = { title: "Testimonios — Admin" };

export default async function TestimonialsAdminPage() {
  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm font-semibold text-agro-700 hover:underline"
      >
        <ArrowLeft size={14} /> Volver al panel
      </Link>
      <h1 className="mt-2 flex items-center gap-2 text-2xl font-extrabold text-agro-800">
        <Quote className="text-agro-600" /> Testimonios
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Gestiona lo que dicen los compradores y restaurantes sobre AgroConecta.
      </p>

      <TestimonialsAdminList testimonials={testimonials ?? []} />
    </>
  );
}