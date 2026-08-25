import { redirect } from "next/navigation";
import Image from "next/image";
import { getUser } from "@/lib/supabase/server";
import RegisterForm from "@/components/RegisterForm";

export const metadata = { title: "Crear cuenta — AgroConecta" };

export default async function RegistroPage() {
  const user = await getUser();
  if (user) redirect("/");

  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
      <div className="w-full rounded-3xl border border-cream-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/logo-full.png"
            alt="AgroConecta — Tecnología que impulsa al agricultor"
            width={799}
            height={446}
            className="h-36 w-auto"
            priority
          />
          <h1 className="mt-2 text-2xl font-extrabold text-agro-800">
            Crea tu cuenta
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Únete a la comunidad del campo al comprador, sin intermediarios.
          </p>
        </div>
        <RegisterForm />
      </div>
    </section>
  );
}
