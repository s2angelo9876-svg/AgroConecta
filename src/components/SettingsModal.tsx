"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, Save, Loader2, Settings as SettingsIcon, KeyRound } from "lucide-react";
import { updateProfileAction } from "@/lib/actions/profile";

export default function SettingsModal({
  open,
  onClose,
  currentName,
  currentPhone,
}: {
  open: boolean;
  onClose: () => void;
  currentName: string;
  currentPhone: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(currentName);
  const [phone, setPhone] = useState(currentPhone);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  if (!open) return null;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    setLoading(true);
    const res = await updateProfileAction({
      full_name: name,
      phone: phone || null,
    });
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setSaved(true);
    router.refresh();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-extrabold text-agro-800">
              <SettingsIcon size={18} /> Configuración
            </h3>
            <p className="text-xs text-stone-500">
              Actualiza tus datos personales.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-full p-1 text-stone-400 transition hover:bg-cream-100"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold">
              Nombre completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={200}
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-agro-500 focus:ring-2 focus:ring-agro-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold">
              Teléfono <span className="text-xs font-normal text-stone-400">(opcional)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={20}
              placeholder="+51 987 654 321"
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-agro-500 focus:ring-2 focus:ring-agro-100"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
              {error}
            </p>
          )}
          {saved && !error && (
            <p className="rounded-lg bg-agro-50 px-4 py-2 text-sm font-semibold text-agro-700">
              ✓ Cambios guardados
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-agro-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-agro-600 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Guardar cambios
          </button>
        </form>

        <div className="mt-5 border-t border-cream-200 pt-4">
          <Link
            href="/recuperar-password"
            className="flex items-center justify-between rounded-xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm font-bold text-stone-700 transition hover:border-agro-300"
          >
            <span className="flex items-center gap-2">
              <KeyRound size={16} className="text-agro-600" />
              Cambiar contraseña
            </span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}