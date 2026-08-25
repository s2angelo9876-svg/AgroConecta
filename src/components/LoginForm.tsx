"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Tractor, ShoppingCart, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ensureDemoAccount } from "@/lib/actions/demo";

const inputCls =
  "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-agro-500 focus:ring-2 focus:ring-agro-100";

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const supabase = createClient();
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

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      setError("Credenciales inválidas o error al iniciar sesión.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  const quickLogin = async (role: "agricultor" | "comprador") => {
    setError("");
    setLoading(true);
    const result = await ensureDemoAccount(role);
    if (!result.ok) {
      setLoading(false);
      setError(result.error);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: result.email,
      password: result.password,
    });
    setLoading(false);
    if (error) {
      setError("Cuenta creada pero no se pudo iniciar sesión.");
      return;
    }
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
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold">
            Contraseña
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
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
          <span className="text-stone-400">¿Olvidaste tu contraseña?</span>
          <Link
            href="/registro"
            className="font-bold text-agro-700 hover:underline"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </form>

      <div className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase text-stone-400">
        <span className="h-px flex-1 bg-stone-200" /> acceso rápido demo{" "}
        <span className="h-px flex-1 bg-stone-200" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          onClick={() => quickLogin("agricultor")}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-agro-200 bg-agro-50 px-3 py-2.5 text-xs font-bold text-agro-800 transition hover:bg-agro-100"
        >
          <Tractor size={16} /> Agricultor
        </button>
        <button
          onClick={() => quickLogin("comprador")}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-sun-400 bg-sun-300/30 px-3 py-2.5 text-xs font-bold text-yellow-800 transition hover:bg-sun-300/50"
        >
          <ShoppingCart size={16} /> Comprador
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-stone-400">
        Demo: cualquier correo y contraseña funcionan (se crea la cuenta al
        primer inicio).
      </p>
    </div>
  );
}