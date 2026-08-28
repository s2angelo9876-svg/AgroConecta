"use client";

import { Bell, Check } from "lucide-react";
import { useState } from "react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

/**
 * Dropdown de notificaciones. Por ahora muestra estado vacío; en la
 * siguiente fase se conecta a la tabla `notifications` de Supabase.
 */
export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications] = useState<NotificationItem[]>([]);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notificaciones"
        className="relative rounded-full p-2 text-stone-600 transition hover:bg-cream-100"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-cream-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-cream-200 px-4 py-3">
            <p className="font-bold text-agro-800">Notificaciones</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-stone-400 hover:text-stone-600"
            >
              Cerrar
            </button>
          </div>
          <div className="p-6 text-center text-sm text-stone-500">
            <Bell size={28} className="mx-auto text-stone-300" />
            <p className="mt-2">Sin notificaciones</p>
            <p className="mt-1 text-xs">
              Te avisaremos cuando alguien compre o publique algo relevante.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}