"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tractor, ShoppingCart, UserPlus, Loader2 } from "lucide-react";
import type { UserRole } from "@/hooks/useCurrentUser";
import PasswordInput from "./PasswordInput";
import TurnstileWidget from "./TurnstileWidget";
import { registerAction } from "@/lib/actions/auth";

const inputCls =
  "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-agro-500 focus:ring-2 focus:ring-agro-100";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [role, setRole] = useState<Exclude<UserRole, "admin">>("agricultor");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Completa todos los campos obligatorios.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError("");
    setLoading(true);

    const res = await registerAction({
      email: form.email.trim(),
      password: form.password,
      name: form.name.trim(),
      role,
      turnstileToken: turnstileToken ?? undefined,
    });

    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }

    router.push(res.role === "agricultor" ? "/publicar" : "/");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setRole("agricultor")}
          className={`rounded-2xl border-2 p-4 text-center transition ${
            role === "agricultor"
              ? "border-agro-600 bg-agro-50"
              : "border-stone-200 hover:border-stone-300"
          }`}
        >
          <Tractor
            size={26}
            className={`mx-auto ${
              role === "agricultor" ? "text-agro-600" : "text-stone-400"
            }`}
          />
          <p className="mt-1 text-sm font-bold">Soy Agricultor</p>
          <p className="text-xs text-stone-500">Tengo productos para vender</p>
        </button>
        <button
          type="button"
          onClick={() => setRole("comprador")}
          className={`rounded-2xl border-2 p-4 text-center transition ${
            role === "comprador"
              ? "border-sun-400 bg-sun-300/20"
              : "border-stone-200 hover:border-stone-300"
          }`}
        >
          <ShoppingCart
            size={26}
            className={`mx-auto ${
              role === "comprador" ? "text-sun-600" : "text-stone-400"
            }`}
          />
          <p className="mt-1 text-sm font-bold">Soy Comprador</p>
          <p className="text-xs text-stone-500">Quiero comprar productos</p>
        </button>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold">
          Nombre completo
        </label>
        <input
          type="text"
          placeholder="Ej: Juan Pérez"
          value={form.name}
          onChange={(e) => update("name")(e.target.value)}
          className={inputCls}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold">
          Correo electrónico
        </label>
        <input
          type="email"
          placeholder="Ej: juan@agroconecta.pe"
          value={form.email}
          onChange={(e) => update("email")(e.target.value)}
          className={inputCls}
          autoComplete="email"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold">
          Teléfono <span className="font-normal text-stone-400">(opcional)</span>
        </label>
        <input
          type="tel"
          placeholder="Ej: 987 654 321"
          value={form.phone}
          onChange={(e) => update("phone")(e.target.value)}
          className={inputCls}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-semibold">
            Contraseña
          </label>
          <PasswordInput
            value={form.password}
            onChange={(v) => update("password")(v)}
            placeholder="Mín. 6 caracteres"
            minLength={6}
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold">
            Confirmar
          </label>
          <PasswordInput
            value={form.confirm}
            onChange={(v) => update("confirm")(v)}
            placeholder="Repite la contraseña"
            minLength={6}
            autoComplete="new-password"
          />
        </div>
      </div>

      <TurnstileWidget onVerify={setTurnstileToken} />

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-sun-400 px-4 py-3 text-sm font-bold text-stone-900 transition hover:bg-sun-300 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <UserPlus size={18} />
        )}
        Crear cuenta
      </button>

      <p className="text-center text-xs text-stone-500">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-bold text-agro-700 hover:underline">
          Inicia sesión
        </Link>
      </p>
      <p className="text-center text-xs text-stone-400">
        Protegido con rate-limiting (5 intentos / 5 min) y captcha opcional.
      </p>
    </form>
  );
}