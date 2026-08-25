import { redirect } from "next/navigation";
import { ShieldCheck, BadgeCheck } from "lucide-react";
import { getUser } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import KycForm from "@/components/KycForm";

export const metadata = {
  title: "Verificar mi cuenta — AgroConecta",
};

export default async function VerificarPage() {
  const user = await getUser();
  if (!user) redirect("/login?callbackUrl=/verificar");

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "agricultor") {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 text-center">
        <ShieldCheck size={56} className="mx-auto text-agro-600" />
        <h1 className="mt-4 text-2xl font-extrabold text-agro-800">
          Verificación exclusiva para agricultores
        </h1>
        <p className="mt-2 text-stone-500">
          Esta página es solo para usuarios con rol de agricultor.
        </p>
      </section>
    );
  }

  // Traer estado actual de verificación
  const { data: fp } = await supabase
    .from("farmer_profiles")
    .select("verification_status")
    .eq("user_id", user.id)
    .maybeSingle();

  const status = fp?.verification_status ?? "pending";

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="flex items-center gap-2 text-2xl font-extrabold text-agro-800">
        <ShieldCheck className="text-agro-600" /> Verificación de agricultor
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Valida tu identidad con tu DNI y un documento oficial para aparecer como{" "}
        <strong>Agricultor Verificado</strong> en la plataforma.
      </p>

      <div className="mt-4 rounded-2xl border border-cream-200 bg-cream-50 p-4 text-sm">
        Estado actual:{" "}
        {status === "verified" ? (
          <span className="inline-flex items-center gap-1 font-bold text-agro-700">
            <BadgeCheck size={16} /> Verificado
          </span>
        ) : status === "rejected" ? (
          <span className="font-bold text-red-600">Rechazado — vuelve a intentarlo</span>
        ) : (
          <span className="font-bold text-yellow-700">Pendiente de revisión</span>
        )}
      </div>

      {status !== "verified" && <KycForm initialStatus={status} />}
    </section>
  );
}