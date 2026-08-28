import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-20">
      <Loader2 size={36} className="animate-spin text-agro-600" />
      <p className="mt-3 text-sm text-stone-500">Cargando...</p>
    </div>
  );
}