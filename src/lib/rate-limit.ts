/**
 * Rate limiting simple.
 *
 * En producción real se debe usar Upstash Ratelimit + Redis (no se carga
 * si las variables no están). Mientras tanto, se usa un bucket en memoria
 * por proceso (suficiente para un único servidor Next.js).
 *
 * Limpieza: cada CLEANUP_INTERVAL llamadas se barren los buckets cuyo
 * último timestamp tenga más de MAX_WINDOW_MS (1 hora). Esto evita
 * crecimiento ilimitado del Map por tráfico viejo.
 */

type Bucket = number[]; // timestamps ordenados

const memoryStore = new Map<string, Bucket>();
const CLEANUP_INTERVAL = 100;
const MAX_WINDOW_MS = 60 * 60 * 1000; // 1 hora (mayor que cualquier ventana usada)

let callsSinceLastCleanup = 0;

interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterMs: number;
}

function cleanupExpired() {
  const now = Date.now();
  const cutoff = now - MAX_WINDOW_MS;
  for (const [k, b] of memoryStore) {
    if (b.length === 0 || b[b.length - 1] < cutoff) {
      memoryStore.delete(k);
    }
  }
}

/**
 * Limita a `limit` eventos por `windowMs` milisegundos por `key`.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  // Cleanup lazy cada N llamadas
  if (++callsSinceLastCleanup >= CLEANUP_INTERVAL) {
    cleanupExpired();
    callsSinceLastCleanup = 0;
  }

  const now = Date.now();
  const cutoff = now - windowMs;
  let bucket = memoryStore.get(key);
  if (!bucket) {
    bucket = [];
    memoryStore.set(key, bucket);
  }
  while (bucket.length && bucket[0] < cutoff) bucket.shift();

  if (bucket.length >= limit) {
    const retryAfterMs = windowMs - (now - bucket[0]);
    return { ok: false, remaining: 0, retryAfterMs };
  }

  bucket.push(now);
  return { ok: true, remaining: limit - bucket.length, retryAfterMs: 0 };
}

/**
 * Extrae la IP del cliente desde headers (compatible con Vercel/proxies).
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

/** Limpia el bucket de un key (para testing). */
export function _resetRateLimit(key?: string) {
  if (key) memoryStore.delete(key);
  else memoryStore.clear();
}