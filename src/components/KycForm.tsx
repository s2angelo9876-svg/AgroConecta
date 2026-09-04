"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  CheckCircle2,
  Search,
  Upload,
  FileText,
  AlertCircle,
  Clock,
  Pencil,
  Sparkles,
} from "lucide-react";
import { lookupDniAction, submitVerificationAction } from "@/lib/actions/kyc";

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED_MIME = ["application/pdf", "image/jpeg", "image/png"] as const;

export default function KycForm({ initialStatus }: { initialStatus: string }) {
  const router = useRouter();
  const [dni, setDni] = useState("");
  const [lookupName, setLookupName] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [manualMode, setManualMode] = useState(false);

  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [docType, setDocType] = useState<"ppa" | "recibo_agua">("ppa");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(initialStatus === "pending");

  const onLookup = async () => {
    setLookupError("");
    if (!/^\d{8}$/.test(dni)) {
      setLookupError("Ingresa un DNI válido de 8 dígitos.");
      return;
    }
    setLookupLoading(true);
    const res = await lookupDniAction({ dni });
    setLookupLoading(false);
    if (!res.ok) {
      setLookupError(res.error);
      return;
    }
    setLookupName(res.data.full_name);
    setNameConfirmed(false);
  };

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    setFileError("");
    if (!picked) return;
    if (!ACCEPTED_MIME.includes(picked.type as typeof ACCEPTED_MIME[number])) {
      setFileError("Solo PDF, JPG o PNG.");
      return;
    }
    if (picked.size > MAX_SIZE) {
      setFileError("Máximo 5MB.");
      return;
    }
    setFile(picked);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!nameConfirmed) {
      setSubmitError("Confirma que tu nombre coincide con el del DNI.");
      return;
    }
    if (!file) {
      setSubmitError("Adjunta tu documento.");
      return;
    }

    setSubmitLoading(true);
    const res = await submitVerificationAction({
      dni,
      dniConfirmedName: lookupName,
      docType,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    });
    if (!res.ok) {
      setSubmitLoading(false);
      setSubmitError(res.error);
      return;
    }

    const uploadRes = await fetch(res.data.uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    setSubmitLoading(false);
    if (!uploadRes.ok) {
      setSubmitError("No se pudo subir el archivo al servidor.");
      return;
    }

    setSubmitted(true);
    router.refresh();
  };

  if (submitted) {
    return (
      <div className="mt-6 space-y-5">
        <div className="rounded-3xl border border-yellow-300 bg-yellow-50 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-200">
            <Clock size={28} className="text-yellow-700" />
          </div>
          <h2 className="mt-4 text-xl font-extrabold text-yellow-900">
            Solicitud enviada — pendiente de revisión
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-yellow-800">
            Tu solicitud fue recibida. Un administrador la revisará en menos de
            24 horas hábiles y te avisaremos por email cuando sea aprobada o
            rechazada.
          </p>
        </div>

        <div className="rounded-2xl border border-cream-200 bg-cream-50 p-5">
          <h3 className="text-sm font-bold text-stone-800">
            ¿Cuándo me aprueban?
          </h3>
          <ul className="mt-3 space-y-2 text-xs text-stone-600">
            <li>✓ Tu DNI fue validado contra RENIEC</li>
            <li>✓ Tu documento fue subido de forma segura</li>
            <li>⏳ Pendiente: revisión manual del administrador</li>
            <li>⏳ Pendiente: badge de &ldquo;Agricultor Verificado&rdquo;</li>
          </ul>
          <p className="mt-4 text-xs text-stone-500">
            Mientras esperas, puedes publicar productos. Aparecerán con tu
            nombre normalmente. Una vez aprobado, aparecerán con el badge de
            confianza.
          </p>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-agro-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-agro-600"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-6">
      {/* Paso 1: DNI */}
      <section className="rounded-2xl border border-cream-200 bg-white p-5 shadow-sm">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase text-agro-700">
          <Search size={16} /> 1. Validar tu DNI
        </h3>

        {!manualMode && (
          <>
            <div className="mt-3 flex flex-wrap gap-3">
              <input
                type="text"
                inputMode="numeric"
                maxLength={8}
                placeholder="Tu DNI (8 dígitos)"
                value={dni}
                onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))}
                className="w-44 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-agro-500"
              />
              <button
                type="button"
                onClick={onLookup}
                disabled={lookupLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-agro-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-agro-600 disabled:opacity-60"
              >
                {lookupLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Search size={16} />
                )}
                Buscar en RENIEC
              </button>
            </div>

            {lookupError && (
              <p className="mt-3 flex items-start gap-2 text-sm text-red-600">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>
                  {lookupError}{" "}
                  <button
                    type="button"
                    onClick={() => setManualMode(true)}
                    className="font-bold text-stone-700 underline hover:text-agro-700"
                  >
                    Ingresar mi nombre manualmente
                  </button>
                </span>
              </p>
            )}

            {!lookupError && (
              <p className="mt-3 text-xs text-stone-500">
                ¿La consulta no responde?{" "}
                <button
                  type="button"
                  onClick={() => setManualMode(true)}
                  className="font-bold text-agro-700 underline hover:text-agro-800"
                >
                  Ingresar mi nombre manualmente
                </button>
              </p>
            )}
          </>
        )}

        {manualMode && (
          <div className="mt-3 rounded-xl border border-yellow-300 bg-yellow-50 p-4">
            <p className="flex items-center gap-2 text-xs font-bold text-yellow-800">
              <Sparkles size={14} /> Modo manual (demo): escribe tu nombre como
              aparece en tu DNI
            </p>
            <div className="mt-3 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-stone-700">
                  Tu DNI
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="Tu DNI (8 dígitos)"
                  value={dni}
                  onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-agro-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-stone-700">
                  Nombre completo
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre y apellidos"
                  value={lookupName}
                  onChange={(e) => {
                    setLookupName(e.target.value);
                    setNameConfirmed(false);
                  }}
                  className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-agro-500"
                />
              </div>
              <label className="flex items-start gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={nameConfirmed}
                  onChange={(e) => setNameConfirmed(e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  Confirmo que <strong>{lookupName || "mi nombre"}</strong> es
                  correcto
                </span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setManualMode(false);
                  setLookupName("");
                  setNameConfirmed(false);
                }}
                className="mt-2 inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-700"
              >
                <Search size={12} /> Volver a buscar en RENIEC
              </button>
            </div>
          </div>
        )}

        {!manualMode && lookupName && (
          <div className="mt-4 rounded-xl bg-agro-50 p-4">
            <p className="text-xs font-bold text-agro-700">
              Resultado de Decolecta / RENIEC
            </p>
            <p className="mt-1 text-lg font-bold text-stone-800">{lookupName}</p>
            <label className="mt-3 flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={nameConfirmed}
                onChange={(e) => setNameConfirmed(e.target.checked)}
                className="mt-0.5"
              />
              Confirmo que <strong>{lookupName}</strong> es mi nombre legal.
            </label>
          </div>
        )}
      </section>

      {/* Paso 2: Documento */}
      <section className="rounded-2xl border border-cream-200 bg-white p-5 shadow-sm">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase text-agro-700">
          <Upload size={16} /> 2. Subir documento
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {(
            [
              { value: "ppa", label: "PPA del MIDAGRI" },
              { value: "recibo_agua", label: "Recibo de agua de riego" },
            ] as const
          ).map((opt) => (
            <label
              key={opt.value}
              className={`cursor-pointer rounded-xl p-3 text-center transition ${
                docType === opt.value
                  ? "border-2 border-agro-600 bg-agro-50"
                  : "border border-stone-200 hover:border-stone-300"
              }`}
            >
              <input
                type="radio"
                name="docType"
                value={opt.value}
                checked={docType === opt.value}
                onChange={() => setDocType(opt.value)}
                className="sr-only"
              />
              <p className="text-sm font-bold">{opt.label}</p>
            </label>
          ))}
        </div>

        <label className="mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-cream-50 px-4 py-6 text-sm text-stone-500 transition hover:border-agro-400 hover:bg-agro-50">
          {file ? (
            <>
              <FileText size={24} className="text-agro-600" />
              <p className="font-bold text-stone-700">{file.name}</p>
              <p className="text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <p className="text-xs text-agro-600">Cambiar archivo</p>
            </>
          ) : (
            <>
              <Upload size={24} className="text-stone-400" />
              <p>Adjuntar PDF, JPG o PNG (máx. 5MB)</p>
            </>
          )}
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={onFile} className="hidden" />
        </label>
        {fileError && (
          <p className="mt-2 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle size={16} /> {fileError}
          </p>
        )}
      </section>

      {submitError && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitLoading || !nameConfirmed || !file}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-sun-400 px-4 py-3.5 font-bold text-stone-900 shadow-sm transition hover:bg-sun-300 disabled:opacity-50"
      >
        {submitLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
        Enviar verificación
      </button>
    </form>
  );
}