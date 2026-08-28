"use client";

import { useState } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import SettingsModal from "./SettingsModal";

export default function PerfilSettings({
  currentName,
  currentPhone,
}: {
  currentName: string;
  currentPhone: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-stone-200 px-4 py-3 text-sm font-bold text-stone-600 transition hover:bg-cream-50"
      >
        <SettingsIcon size={16} /> Configuración
      </button>
      <SettingsModal
        open={open}
        onClose={() => setOpen(false)}
        currentName={currentName}
        currentPhone={currentPhone}
      />
    </>
  );
}