"use client";

import { Toaster } from "sonner";

/**
 * Proveedor global de toasts (notificaciones efímeras).
 * Se monta una sola vez en el Providers del layout.
 */
export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      visibleToasts={4}
      toastOptions={{
        classNames: {
          toast:
            "rounded-2xl border-2 shadow-lg font-semibold text-sm",
          title: "text-sm font-bold",
          description: "text-xs font-normal",
        },
      }}
    />
  );
}