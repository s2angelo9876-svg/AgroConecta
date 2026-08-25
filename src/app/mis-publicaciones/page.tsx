import { redirect } from "next/navigation";
import Link from "next/link";
import { Sprout, Plus } from "lucide-react";
import { getUser } from "@/lib/supabase/server";
import MyProductsList from "@/components/MyProductsList";

export const metadata = { title: "Mis publicaciones — AgroConecta" };

export default async function MisPublicacionesPage() {
  const user = await getUser();
  if (!user) redirect("/login?callbackUrl=/mis-publicaciones");

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-agro-800">
            <Sprout className="text-agro-600" /> Mis publicaciones
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Administra las cosechas que has publicado.
          </p>
        </div>
        <Link
          href="/publicar"
          className="inline-flex items-center gap-1.5 rounded-xl bg-sun-400 px-4 py-2.5 text-sm font-bold text-stone-900 transition hover:bg-sun-300"
        >
          <Plus size={18} /> Publicar nuevo
        </Link>
      </div>
      <MyProductsList userId={user.id} />
    </section>
  );
}