"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { reviewVerificationAction } from "@/lib/actions/admin";

export function ReviewForm({ docId }: { docId: string }) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState<"verified" | "rejected" | null>(null);
  const [error, setError] = useState("");

  const decide = async (decision: "verified" | "rejected") => {
    if (decision === "rejected" && !notes.trim()) {
      setError("Indica el motivo del rechazo.");
      return;
    }
    setError("");
    setLoading(decision);
    const res = await reviewVerificationAction({ docId, decision, notes: notes || undefined });
    setLoading(null);
    if (!res.ok) setError(res.error);
  };

  return (
    <div className="w-full max-w-xs space-y-2">
      <textarea
        rows={2}
        placeholder="Motivo (obligatorio para rechazar)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-agro-500"
      />
      <div className="flex gap-2">
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => decide("verified")}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-agro-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-agro-600 disabled:opacity-50"
        >
          {loading === "verified" ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
          Aprobar
        </button>
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => decide("rejected")}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-600 disabled:opacity-50"
        >
          {loading === "rejected" ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
          Rechazar
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}