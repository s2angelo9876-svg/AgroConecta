"use client";

import { useState } from "react";
import { Plus, Trash2, Save, X, Pencil, Star } from "lucide-react";
import {
  upsertTestimonialAction,
  deleteTestimonialAction,
} from "@/lib/actions/cms";

interface Testimonial {
  id: string;
  author_name: string;
  author_role: string | null;
  content: string;
  avatar_url: string | null;
  rating: number;
  published: boolean;
}

export function TestimonialsAdminList({ testimonials }: { testimonials: Testimonial[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);

  const blank: Testimonial = {
    id: "",
    author_name: "",
    author_role: "",
    content: "",
    avatar_url: null,
    rating: 5,
    published: true,
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar este testimonio?")) return;
    setBusy(true);
    await deleteTestimonialAction({ id });
    setBusy(false);
  };

  return (
    <div className="mt-6 space-y-3">
      {!creating && (
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-agro-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-agro-600"
        >
          <Plus size={16} /> Nuevo testimonio
        </button>
      )}

      {creating && (
        <TestimonialEditor
          testimonial={blank}
          isNew
          onClose={() => setCreating(false)}
          onSaved={() => setCreating(false)}
        />
      )}

      {testimonials.map((t) =>
        editing === t.id ? (
          <TestimonialEditor
            key={t.id}
            testimonial={t}
            onClose={() => setEditing(null)}
            onSaved={() => setEditing(null)}
          />
        ) : (
          <div
            key={t.id}
            className="rounded-2xl border border-cream-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-stone-800">{t.author_name}</p>
                  {t.author_role && (
                    <p className="text-xs text-stone-500">· {t.author_role}</p>
                  )}
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < t.rating
                            ? "fill-sun-400 text-sun-400"
                            : "text-stone-300"
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-sm text-stone-600">{t.content}</p>
                <p className="mt-2 text-xs text-stone-400">
                  {t.published ? "Publicado" : "Borrador"}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => setEditing(t.id)}
                  className="rounded p-1.5 text-agro-700 hover:bg-agro-50"
                  title="Editar"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => remove(t.id)}
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

function TestimonialEditor({
  testimonial,
  isNew,
  onClose,
  onSaved,
}: {
  testimonial: Testimonial;
  isNew?: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(testimonial);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const res = await upsertTestimonialAction(form);
    setSaving(false);
    if (res.ok) onSaved();
  };

  return (
    <div className="rounded-2xl border-2 border-agro-300 bg-white p-4 shadow-sm">
      <div className="grid gap-2">
        <input
          type="text"
          placeholder="Nombre del autor"
          value={form.author_name}
          onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))}
          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm font-bold"
        />
        <input
          type="text"
          placeholder="Rol / cargo (opcional)"
          value={form.author_role ?? ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, author_role: e.target.value }))
          }
          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
        />
        <textarea
          rows={3}
          placeholder="Testimonio"
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
        />
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1 text-sm">
            Rating:
            <input
              type="number"
              min={1}
              max={5}
              value={form.rating}
              onChange={(e) =>
                setForm((f) => ({ ...f, rating: Number(e.target.value) }))
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
            Publicado
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