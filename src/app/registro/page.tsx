import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sprout } from "lucide-react";
import RegisterForm from "@/components/RegisterForm";

export const metadata = { title: "Crear cuenta — AgroConecta" };

export default async function RegistroPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
      <div className="w-full rounded-3xl border border-cream-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-agro-600 text-white">
            <Sprout size={28} />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-agro-800">
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
