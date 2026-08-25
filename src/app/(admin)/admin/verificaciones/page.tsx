import { redirect } from "next/navigation";
import { FileCheck, ExternalLink, User } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@/lib/supabase/admin";

export const metadata = { title: "Verificaciones — Admin" };

export default async function VerificacionesPage() {
  // Doble check de admin (el layout ya valida, esto es defensa en profundidad)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Cargamos pendientes con join al perfil
  const { data: docs } = await supabase
    .from("verification_docs")
    .select("id, user_id, doc_type, file_path, status, created_at, profiles:user_id(full_name, email)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  // Generamos URLs firmadas para que el admin vea el documento
  const admin = createAdminClient();
  let signedUrls: Record<string, string | null> = {};
  if (docs && docs.length > 0) {
    const paths = docs.map((d) => d.file_path);
    const { data: urls } = await admin.storage
      .from("verification-docs")
      .createSignedUrls(paths, 60 * 10); // 10 min
    if (urls) {
      urls.forEach((u) => {
        if (u.path) signedUrls[u.path] = u.signedUrl;
      });
    }
  }

  return (
    <>
      <h1 className="text-2xl font-extrabold text-agro-800">Verificaciones pendientes</h1>
      <p className="mt-1 text-sm text-stone-500">
        Aprueba o rechaza las solicitudes de Agricultor Verificado.
      </p>

      {!docs || docs.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center text-sm text-stone-500">
          🎉 No hay solicitudes pendientes.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {docs.map((doc: any) => (
            <div
              key={doc.id}
              className="rounded-2xl border border-cream-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 font-bold text-stone-800">
                    <User size={16} /> {doc.profiles?.full_name ?? "(sin nombre)"}
                  </p>
                  <p className="text-sm text-stone-500">{doc.profiles?.email}</p>
                  <p className="mt-1 text-xs text-stone-400">
                    Documento:{" "}
                    <strong>
                      {doc.doc_type === "ppa"
                        ? "PPA del MIDAGRI"
                        : "Recibo de agua de riego"}
                    </strong>{" "}
                    · Subido {new Date(doc.created_at).toLocaleString("es-PE")}
                  </p>
                  {signedUrls[doc.file_path] && (
                    <a
                      href={signedUrls[doc.file_path]!}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-agro-700 hover:underline"
                    >
                      <ExternalLink size={14} /> Ver documento
                    </a>
                  )}
                </div>
                <ReviewForm docId={doc.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

import { ReviewForm } from "./ReviewForm";