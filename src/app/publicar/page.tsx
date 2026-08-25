import { redirect } from "next/navigation";
import { Sprout } from "lucide-react";
import { getUser } from "@/lib/supabase/server";
import PublishForm from "@/components/PublishForm";

export const metadata = { title: "Publicar mi cosecha — AgroConecta" };

export default async function PublicarPage() {
  const user = await getUser();
  if (!user) redirect("/login?callbackUrl=/publicar");

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="flex items-center gap-2 text-2xl font-extrabold text-agro-800">
        <Sprout className="text-agro-600" /> Publica tu cosecha
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Completa los datos de tu producto para que los compradores te
        encuentren.
      </p>
      <PublishForm />
    </section>
  );
}