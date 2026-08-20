"use client";

import { useState } from "react";
import { Bell, X } from "lucide-react";
import { MOCK_NOTIFICATIONS } from "@/data/notifications";

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unread = notifications.filter((n) => !n.read).length;

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

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
              className="text-stone-400 transition hover:text-stone-600"
            >
              <X size={16} />
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-sm text-stone-500">
                Sin notificaciones
              </p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => markRead(n.id)}
                  className={`flex w-full flex-col gap-1 border-b border-cream-100 px-4 py-3 text-left transition hover:bg-cream-50 ${
                    !n.read ? "bg-agro-50/40" : ""
                  }`}
                >
                  <p className="text-sm font-bold text-stone-800">{n.title}</p>
                  <p className="text-xs text-stone-500">{n.message}</p>
                  <p className="text-[10px] font-semibold text-agro-600">
                    {n.time}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
