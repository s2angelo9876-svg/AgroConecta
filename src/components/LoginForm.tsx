"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Tractor, ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { loginAction } from "@/lib/actions/auth";
import PasswordInput from "./PasswordInput";

const inputCls =
  "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-agro-500 focus:ring-2 focus:ring-agro-100";

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }
    setError("");
    setLoading(true);
    const res = await loginAction({ email: email.trim(), password });
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    toast.success("Sesión iniciada");
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="mt-8">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold">
            Correo electrónico
          </label>
          <input
            type="email"
            placeholder="Ej: juan@agroconecta.pe"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
            autoComplete="email"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold">
            Contraseña
          </label>
          <PasswordInput
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            autoComplete="current-password"
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
            <LogIn size={18} />
          )}
          Ingresar
        </button>

        <div className="flex items-center justify-between text-xs">
          <Link
            href="/recuperar-password"
            className="font-bold text-agro-700 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
          <Link
            href="/registro"
            className="font-bold text-agro-700 hover:underline"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </form>

      <p className="mt-4 text-center text-xs text-stone-400">
        Protegido con rate-limiting (5 intentos / 5 min).
      </p>
    </div>
  );
}