"use client";

import { useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import ContactModal from "./ContactModal";

export default function FarmerContact({
  farmerName,
  phone,
}: {
  farmerName: string;
  phone: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex gap-3 pb-1">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-sun-400 px-5 py-2.5 text-sm font-bold text-stone-900 transition hover:bg-sun-300"
        >
          <MessageCircle size={16} /> Chatear
        </button>
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-stone-200 px-5 py-2.5 text-sm font-bold text-stone-600 transition hover:bg-cream-50"
        >
          <Phone size={16} /> Llamar
        </a>
      </div>
      <ContactModal
        open={open}
        onClose={() => setOpen(false)}
        farmerName={farmerName}
        phone={phone}
      />
    </>
  );
}
