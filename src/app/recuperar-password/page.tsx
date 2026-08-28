import type { Metadata } from "next";
import Image from "next/image";
import { Mail } from "lucide-react";
import RecoverPasswordForm from "@/components/RecoverPasswordForm";

export const metadata: Metadata = {
  title: "Recuperar contraseña — AgroConecta",
};

export default function RecuperarPasswordPage() {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
      <div className="w-full rounded-3xl border border-cream-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-agro-600 text-white">
            <Mail size={26} />
          </span>
          <Image
            src="/logo-wordmark.png"
            alt="AgroConecta"
            width={799}
            height={120}
            className="mt-4 h-7 w-auto"
          />
          <h1 className="mt-3 text-2xl font-extrabold text-agro-800">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Ingresa tu correo y te enviaremos un enlace para restablecerla.
          </p>
        </div>
        <RecoverPasswordForm />
      </div>
    </section>
  );
}