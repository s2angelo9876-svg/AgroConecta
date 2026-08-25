import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente con service_role: SOLO en el servidor (Server Actions de admin).
 * Bypasea RLS — usar con cuidado, jamás exponer al cliente.
 */
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}