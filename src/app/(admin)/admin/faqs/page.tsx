import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { FaqsAdminList } from "./FaqsAdminList";

export const metadata = { title: "FAQs — Admin" };

export default async function FaqsAdminPage() {
  const supabase = await createClient();
  const { data: faqs } = await supabase
    .from("faqs")
    .select("*")
    .order("order_index", { ascending: true });

  return (
    <>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm font-semibold text-agro-700 hover:underline"
      >
        <ArrowLeft size={14} /> Volver al panel
      </Link>
      <h1 className="mt-2 flex items-center gap-2 text-2xl font-extrabold text-agro-800">
        <HelpCircle className="text-agro-600" /> FAQs
      </h1>
      <p className="mt-1 text-sm text-stone-500">Crea, edita y publica preguntas frecuentes.</p>

      <FaqsAdminList faqs={faqs ?? []} />
    </>
  );
}