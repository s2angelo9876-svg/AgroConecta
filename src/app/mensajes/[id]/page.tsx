"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, Send } from "lucide-react";
import { MOCK_CONVERSATIONS, type Message } from "@/data/conversations";

export default function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const conversation = MOCK_CONVERSATIONS.find((c) => c.id === id);

  const [messages, setMessages] = useState<Message[]>(
    conversation?.messages ?? []
  );
  const [text, setText] = useState("");

  if (!conversation) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-xl font-extrabold text-agro-800">
          Conversación no encontrada
        </h1>
        <Link
          href="/mensajes"
          className="mt-4 inline-block rounded-xl bg-agro-700 px-5 py-2.5 text-sm font-bold text-white"
        >
          Volver a mensajes
        </Link>
      </section>
    );
  }

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      senderId: "me",
      text: text.trim(),
      time: new Date().toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setText("");
  };

  const otherName = session?.user?.name === conversation.name
    ? "Tú"
    : conversation.name;

  return (
    <section className="mx-auto flex max-w-2xl flex-col px-4 pb-28 pt-6 sm:px-6">
      <div className="flex items-center gap-3 border-b border-cream-200 pb-4">
        <Link href="/mensajes" className="text-stone-500 hover:text-agro-700">
          <ArrowLeft size={22} />
        </Link>
        <Image
          src={conversation.avatar}
          alt={conversation.name}
          width={44}
          height={44}
          className="h-11 w-11 rounded-full object-cover"
        />
        <div>
          <h1 className="font-bold text-stone-800">{conversation.name}</h1>
          <p className="text-xs text-stone-500">{conversation.productName}</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 py-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderId === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.senderId === "me"
                  ? "rounded-br-none bg-agro-600 text-white"
                  : "rounded-bl-none bg-cream-100 text-stone-700"
              }`}
            >
              <p>{msg.text}</p>
              <p
                className={`mt-1 text-right text-[10px] ${
                  msg.senderId === "me" ? "text-agro-100" : "text-stone-400"
                }`}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={send}
        className="fixed bottom-16 left-0 right-0 border-t border-cream-200 bg-white p-3 md:bottom-0"
      >
        <div className="mx-auto flex max-w-2xl gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-agro-500"
          />
          <button
            type="submit"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-sun-400 text-stone-900 transition hover:bg-sun-300"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </section>
  );
}
