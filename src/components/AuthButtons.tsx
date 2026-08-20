"use client";

import { signIn } from "next-auth/react";
import { Tractor, ShoppingCart } from "lucide-react";

export default function AuthButtons({ callbackUrl }: { callbackUrl: string }) {
  return (
    <div className="mt-8 space-y-3">
      <button
        onClick={() => signIn("demo", { role: "agricultor", callbackUrl })}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-agro-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-agro-600"
      >
        <Tractor size={18} /> Soy Agricultor (demo)
      </button>
      <button
        onClick={() => signIn("demo", { role: "comprador", callbackUrl })}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-sun-400 px-4 py-3 text-sm font-bold text-stone-900 transition hover:bg-sun-300"
      >
        <ShoppingCart size={18} /> Soy Comprador (demo)
      </button>
    </div>
  );
}
