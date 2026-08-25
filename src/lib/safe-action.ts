import { z, type ZodSchema } from "zod";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined> };

/**
 * Wrapper genérico de Server Action:
 * - Valida la entrada con Zod (rechaza campos sensibles extra)
 * - Captura errores y devuelve mensajes genéricos al cliente
 * - Loguea el detalle técnico en el servidor (sin PII)
 */
export function safeAction<TSchema extends ZodSchema, TOutput>(
  schema: TSchema,
  handler: (input: z.infer<TSchema>) => Promise<TOutput>
) {
  return async (rawInput: unknown): Promise<ActionResult<TOutput>> => {
    const parsed = schema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        ok: false,
        error: "Datos inválidos.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    try {
      const data = await handler(parsed.data);
      return { ok: true, data };
    } catch (err) {
      // Log técnico en servidor, mensaje genérico al cliente
      console.error("[server-action]", err);
      return {
        ok: false,
        error:
          "Algo salió mal. Por favor intenta nuevamente en unos minutos.",
      };
    }
  };
}