import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * Cliente Supabase para componentes del servidor, Route Handlers y
 * Server Actions. Maneja automáticamente el ciclo de vida de las cookies.
 */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Server Components no pueden escribir cookies; el middleware
            // se encarga de refrescarlas.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {}
        },
      },
    }
  );
}

/** Devuelve el usuario autenticado o null. */
export async function getUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

/** Perfil del usuario (incluye role y teléfono) o null. */
export async function getProfile() {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, role, avatar_url, phone")
    .eq("id", user.id)
    .single();
  return data;
}