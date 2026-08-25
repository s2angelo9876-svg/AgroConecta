"use client";

import Image from "next/image";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { MOCK_CONVERSATIONS } from "@/data/conversations";
import { MessageCircle } from "lucide-react";

export default function MensajesPage() {
  const { user } = useCurrentUser();

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-extrabold text-agro-800">Mensajes</h1>
      <p className="mt-1 text-sm text-stone-500">
        {user
          ? "Tus conversaciones con agricultores y compradores."
          : "Inicia sesión para ver tus mensajes."}
      </p>

      <div className="mt-6 space-y-3">
        {MOCK_CONVERSATIONS.map((conv) => (
          <Link
            key={conv.id}
            href={`/mensajes/${conv.id}`}
            className="flex items-center gap-4 rounded-2xl border border-cream-200 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <Image
              src={conv.avatar}
              alt={conv.name}
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-bold text-stone-800">{conv.name}</p>
                {conv.unread && (
                  <span className="h-2.5 w-2.5 rounded-full bg-sun-400" />
                )}
              </div>
              <p className="text-xs font-semibold text-agro-600">
                {conv.productName}
              </p>
              <p className="truncate text-sm text-stone-500">
                {conv.lastMessage}
              </p>
            </div>
            <MessageCircle
              size={20}
              className="shrink-0 text-stone-300"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
