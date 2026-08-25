"use client";

/**
 * Componente de estado — no se usa en producción, sólo en build/development
 * para mostrar mensajes claros cuando faltan pasos de setup.
 */
export default function SetupNote({
  message,
  details,
}: {
  message: string;
  details?: string[];
}) {
  return (
    <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900">
      <p className="font-bold">{message}</p>
      {details && (
        <ul className="mt-2 list-disc pl-5 text-xs">
          {details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
    </div>
  );
}