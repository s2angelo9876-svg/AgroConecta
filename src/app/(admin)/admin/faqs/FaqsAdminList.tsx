"use client";

import { useState } from "react";
import { Plus, Trash2, Save, X, Pencil } from "lucide-react";
import {
  upsertFaqAction,
  deleteFaqAction,
} from "@/lib/actions/cms";

interface Faq {
  id: string;
  question: string;
  answer: string;
  order_index: number;
  published: boolean;
}

export function FaqsAdminList({ faqs }: { faqs: Faq[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const blank = { id: "", question: "", answer: "", order_index: 0, published: true };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar esta FAQ?")) return;
    setBusy(true);
    await deleteFaqAction({ id });
    setBusy(false);
  };

  return (
    <div className="mt-6 space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!creating && (
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-agro-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-agro-600"
        >
          <Plus size={16} /> Nueva FAQ
        </button>
      )}

      {creating && (
        <FaqEditor
          faq={blank}
          isNew
          onClose={() => setCreating(false)}
          onSaved={() => setCreating(false)}
        />
      )}

      {faqs.map((faq) =>
        editing === faq.id ? (
          <FaqEditor
            key={faq.id}
            faq={faq}
            onClose={() => setEditing(null)}
            onSaved={() => setEditing(null)}
          />
        ) : (
          <div
            key={faq.id}
            className="rounded-2xl border border-cream-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-bold text-stone-800">{faq.question}</p>
                <p className="mt-1 text-sm text-stone-600">{faq.answer}</p>
                <p className="mt-2 text-xs text-stone-400">
                  Orden: {faq.order_index} · {faq.published ? "Publicada" : "Borrador"}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => setEditing(faq.id)}
                  className="rounded p-1.5 text-agro-700 hover:bg-agro-50"
                  title="Editar"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => remove(faq.id)}
                  disabled={busy}
                  className="rounded p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

function FaqEditor({
  faq,
  isNew,
  onClose,
  onSaved,
}: {
  faq: Faq;
  isNew?: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
    order_index: faq.order_index,
    published: faq.published,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const res = await upsertFaqAction(form);
    setSaving(false);
    if (res.ok) onSaved();
  };

  return (
    <div className="rounded-2xl border-2 border-agro-300 bg-white p-4 shadow-sm">
      <div className="grid gap-2">
        <input
          type="text"
          placeholder="Pregunta"
          value={form.question}
          onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm font-bold"
        />
        <textarea
          rows={3}
          placeholder="Respuesta"
          value={form.answer}
          onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
        />
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1 text-sm">
            Orden:
            <input
              type="number"
              value={form.order_index}
              onChange={(e) =>
                setForm((f) => ({ ...f, order_index: Number(e.target.value) }))
              }
              className="ml-1 w-16 rounded border border-stone-200 px-2 py-1 text-sm"
            />
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) =>
                setForm((f) => ({ ...f, published: e.target.checked }))
              }
            />
            Publicada
          </label>
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-stone-500 hover:bg-cream-100"
        >
          <X size={14} /> Cancelar
        </button>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-1 rounded-lg bg-agro-700 px-3 py-1.5 text-sm font-bold text-white hover:bg-agro-600 disabled:opacity-50"
        >
          <Save size={14} /> {isNew ? "Crear" : "Guardar"}
        </button>
      </div>
    </div>
  );
}