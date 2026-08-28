"use client";

import { useEffect, useState } from "react";
import { X, Phone, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function ContactModal({
  open,
  onClose,
  farmerName,
  farmerAvatar,
  phone,
}: {
  open: boolean;
  onClose: () => void;
  farmerName: string;
  farmerAvatar?: string;
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
        <div className="mb-4 flex items-center gap-3">
          {farmerAvatar ? (
            <Image
              src={farmerAvatar}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-full border border-cream-200 object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-agro-600 text-lg font-bold text-white">
              {farmerName[0]?.toUpperCase() ?? "A"}
            </div>
          )}
          <div>
            <h3 className="text-lg font-extrabold text-agro-800">
              {farmerName}
            </h3>
            <p className="text-xs text-stone-500">
              Contacta directamente sin intermediarios
            </p>
          </div>
        </div>

        <div className="space-y-3">
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
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 rounded-full p-1.5 text-stone-400 hover:bg-cream-100"
        >
          <X size={18} />
        </button>
        <p className="mt-4 rounded-lg bg-cream-100 p-3 text-xs text-stone-500">
          Demo: en la versión final aquí se abrirá el chat interno de
          AgroConecta.
        </p>
      </div>
    </div>
  );
}