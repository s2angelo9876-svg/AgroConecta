"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import PasswordInput from "./PasswordInput";
import { updatePasswordAction } from "@/lib/actions/password";

export default function ResetPasswordForm({
  authenticated,
}: {
  authenticated: boolean;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!authenticated) {
    return (
      <div className="mt-8 text-center">
        <ShieldCheck size={56} className="mx-auto text-red-500" />
        <h2 className="mt-4 text-xl font-extrabold text-agro-800">
          Enlace inválido o expirado
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-stone-500">
          El enlace de recuperación no es válido o ya expiró. Vuelve a
          solicitarlo.
        </p>
        <a
          href="/recuperar-password"
          className="mt-6 inline-block rounded-xl bg-agro-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-agro-600"
        >
          Solicitar otro enlace
        </a>
      </div>
    );
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    const res = await updatePasswordAction({ password });
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    // Forzamos navegación al login
    router.push("/login?recovered=1");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-semibold">
          Nueva contraseña
        </label>
        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder="Mín. 6 caracteres"
          minLength={6}
          autoComplete="new-password"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold">
          Confirmar contraseña
        </label>
        <PasswordInput
          value={confirm}
          onChange={setConfirm}
          placeholder="Repite la contraseña"
          minLength={6}
          autoComplete="new-password"
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
          <CheckCircle2 size={18} />
        )}
        Cambiar contraseña
      </button>
    </form>
  );
}