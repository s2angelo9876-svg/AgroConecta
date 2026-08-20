"use client";

import { X, Phone, MessageCircle } from "lucide-react";

export default function ContactModal({
  open,
  onClose,
  farmerName,
  phone,
}: {
  open: boolean;
  onClose: () => void;
  farmerName: string;
  phone?: string;
}) {
  if (!open) return null;
  const tel = phone ?? "+51 987 654 321";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold text-agro-800">
            Contactar a {farmerName}
          </h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-full p-1 text-stone-400 transition hover:bg-cream-100"
          >
            <X size={18} />
          </button>
        </div>
        <p className="mt-2 text-sm text-stone-500">
          Comunícate directamente con el agricultor, sin intermediarios.
        </p>
        <div className="mt-5 space-y-3">
          <a
            href={`tel:${tel.replace(/\s/g, "")}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-sun-400 px-4 py-3 text-sm font-bold text-stone-900 transition hover:bg-sun-300"
          >
            <Phone size={16} /> Llamar · {tel}
          </a>
          <a
            href="https://wa.me/51987654321"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-agro-600 px-4 py-3 text-sm font-bold text-agro-700 transition hover:bg-agro-50"
          >
            <MessageCircle size={16} /> WhatsApp
          </a>
        </div>
        <p className="mt-4 rounded-lg bg-cream-100 p-3 text-xs text-stone-500">
          Demo: en la versión final aquí se abrirá el chat interno de
          AgroConecta.
        </p>
      </div>
    </div>
  );
}
