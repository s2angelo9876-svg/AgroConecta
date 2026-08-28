/**
 * Sentry server-side initialization.
 * Solo se inicializa si SENTRY_DSN está configurado.
 * Si no está, todas las llamadas son no-op (sin romper el código).
 */

type SentryLike = {
  captureException: (err: unknown, ctx?: Record<string, unknown>) => void;
  captureMessage: (msg: string, level?: string) => void;
};

let sentry: SentryLike | null = null;

async function init(): Promise<void> {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return; // No-op sin Sentry configurado

  try {
    // Importación dinámica para no cargar si no se usa
    const Sentry = await import("@sentry/nextjs");
    Sentry.init({
      dsn,
      tracesSampleRate: 0.1,
      // No capturar PII accidentalmente
      beforeSend(event) {
        if (event.request) {
          delete event.request.cookies;
          if (event.request.headers) delete event.request.headers.authorization;
        }
        return event;
      },
    });
    sentry = {
      captureException: Sentry.captureException as (
        err: unknown,
        ctx?: Record<string, unknown>
      ) => void,
      captureMessage: Sentry.captureMessage as (
        msg: string,
        level?: string
      ) => void,
    };
  } catch (err) {
    console.warn("[sentry] No se pudo inicializar (¿paquete no instalado?):", err);
  }
}

init();

export function captureException(err: unknown, context?: Record<string, unknown>) {
  // Siempre log en consola
  console.error("[error]", err, context ?? {});
  if (sentry) sentry.captureException(err, context);
}

export function captureMessage(msg: string, level: "info" | "warning" | "error" = "info") {
  if (sentry) sentry.captureMessage(msg, level);
}