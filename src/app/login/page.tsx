import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import LoginForm from "@/components/LoginForm";

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
          <Image
            src="/logo-full.png"
            alt="AgroConecta — Tecnología que impulsa al agricultor"
            width={799}
            height={446}
            className="h-36 w-auto"
            priority
          />
          <h1 className="mt-2 text-2xl font-extrabold text-agro-800">
            Bienvenido de vuelta
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Inicia sesión para publicar tu cosecha o contactar agricultores.
          </p>
        </div>
        <LoginForm callbackUrl={callbackUrl ?? "/"} />
      </div>
    </section>
  );
}
