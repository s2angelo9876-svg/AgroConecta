"use client";

import { useState } from "react";
import { Eye, Pause, Play, Trash2 } from "lucide-react";
import { setProductStatusAction } from "@/lib/actions/admin";

interface Row {
  id: string;
  name: string;
  status: "active" | "paused" | "deleted";
  quality: string;
  price: number;
  quantity: number;
  unit: string;
  location: string;
  created_at: string;
  farmer?: { full_name?: string; email?: string } | null;
}

export function ProductsAdminList({ products }: { products: any[] }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const setStatus = async (id: string, status: Row["status"]) => {
    if (!confirm(`Cambiar estado a "${status}"?`)) return;
    setError("");
    setBusy(id);
    const res = await setProductStatusAction({ productId: id, status });
    setBusy(null);
    if (!res.ok) setError(res.error);
  };

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-cream-50 text-xs uppercase text-stone-500">
          <tr>
            <th className="px-4 py-3 text-left">Producto</th>
            <th className="px-4 py-3 text-left">Agricultor</th>
            <th className="px-4 py-3 text-left">Estado</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cream-100">
          {products.map((p: Row) => (
            <tr key={p.id}>
              <td className="px-4 py-3">
                <p className="font-bold">{p.name}</p>
                <p className="text-xs text-stone-500">
                  {p.quantity} {p.unit} · S/ {p.price} · {p.quality} · {p.location}
                </p>
              </td>
              <td className="px-4 py-3">
                <p>{p.farmer?.full_name}</p>
                <p className="text-xs text-stone-500">{p.farmer?.email}</p>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={p.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {p.status !== "paused" && (
                    <button
                      disabled={busy === p.id}
                      onClick={() => setStatus(p.id, "paused")}
                      title="Pausar"
                      className="rounded p-1 text-yellow-700 hover:bg-yellow-50 disabled:opacity-50"
                    >
                      <Pause size={16} />
                    </button>
                  )}
                  {p.status === "paused" && (
                    <button
                      disabled={busy === p.id}
                      onClick={() => setStatus(p.id, "active")}
                      title="Reactivar"
                      className="rounded p-1 text-agro-700 hover:bg-agro-50 disabled:opacity-50"
                    >
                      <Play size={16} />
                    </button>
                  )}
                  <a
                    href={`/producto/${p.id}`}
                    target="_blank"
                    rel="noreferrer"
                    title="Ver público"
                    className="rounded p-1 text-stone-500 hover:bg-stone-50"
                  >
                    <Eye size={16} />
                  </a>
                  <button
                    disabled={busy === p.id}
                    onClick={() => setStatus(p.id, "deleted")}
                    title="Eliminar"
                    className="rounded p-1 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {busy === p.id && <span className="ml-2 text-xs text-stone-400">Procesando...</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && (
        <p className="border-t border-cream-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Row["status"] }) {
  const map = {
    active: "bg-agro-100 text-agro-800",
    paused: "bg-yellow-100 text-yellow-800",
    deleted: "bg-red-100 text-red-700",
  } as const;
  const label = { active: "Activo", paused: "Pausado", deleted: "Eliminado" }[status];
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${map[status]}`}>
      {label}
    </span>
  );
}