import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sprout } from "lucide-react";
import AuthButtons from "@/components/AuthButtons";

export const metadata = { title: "Ingresar — AgroConecta" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const session = await auth();
  if (session?.user) redirect(callbackUrl ?? "/");

  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
      <div className="w-full rounded-3xl border border-cream-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-agro-600 text-white">
            <Sprout size={28} />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-agro-800">
            Bienvenido a AgroConecta
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Inicia sesión para publicar tu cosecha o contactar agricultores.
          </p>
        </div>
        <AuthButtons callbackUrl={callbackUrl ?? "/"} />
      </div>
    </section>
  );
}
