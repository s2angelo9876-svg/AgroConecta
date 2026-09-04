"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { requestPasswordResetAction } from "@/lib/actions/password";

export default function RecoverPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Ingresa tu correo.");
      return;
    }
    setError("");
    setLoading(true);

    const res = await requestPasswordResetAction({ email: email.trim() });
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="mt-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-agro-100">
          <CheckCircle2 size={28} className="text-agro-600" />
        </div>
        <h2 className="mt-4 text-xl font-extrabold text-agro-800">
          ¡Solicitud enviada!
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-stone-500">
          Si <strong>{email}</strong> está registrado en AgroConecta, recibirás
          un correo con las instrucciones para restablecer tu contraseña.
        </p>
        <p className="mx-auto mt-2 max-w-sm text-xs text-stone-400">
          Revisa también tu carpeta de spam. Si no recibes nada en unos minutos,
          contacta al administrador.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-agro-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-agro-600"
        >
          <ArrowLeft size={14} /> Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-semibold">
          Correo electrónico
        </label>
        <input
          type="email"
          placeholder="Ej: juan@agroconecta.pe"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-agro-500 focus:ring-2 focus:ring-agro-100"
          autoComplete="email"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-agro-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-agro-600 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Mail size={18} />
        )}
        Enviar enlace de recuperación
      </button>

      <Link
        href="/login"
        className="flex items-center justify-center gap-1 text-xs text-stone-500 hover:text-agro-700"
      >
        <ArrowLeft size={12} /> Volver al inicio de sesión
      </Link>
    </form>
  );
}