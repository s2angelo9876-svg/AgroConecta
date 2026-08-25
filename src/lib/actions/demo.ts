import { createClient } from "@/lib/supabase/admin";

/**
 * Asegura que exista una cuenta demo para Agricultor o Comprador.
 * Usa service_role para bypass RLS y no requerir confirmación de email.
 *
 * Devuelve las credenciales finales (email + password) para que el cliente
 * pueda iniciar sesión con signInWithPassword.
 */
export async function ensureDemoAccount(role: "agricultor" | "comprador") {
  const email =
    role === "agricultor" ? "juan@agroconecta.pe" : "maria@agroconecta.pe";
  const password = "demo1234";
  const fullName =
    role === "agricultor" ? "Juan Pérez" : "María López";

  const supabaseAdmin = createClient();

  // Verificar si ya existe (sin filtrar por email en listUsers; usamos getUserByEmail si existe)
  let userId: string | undefined;
  try {
    const { data } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    userId = data.users.find((u) => u.email === email)?.id;
  } catch {
    // ignore, we'll try to create
  }

  if (!userId) {
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role },
    });
    if (error || !created.user) {
      return {
        ok: false as const,
        error:
          "No se pudo crear la cuenta demo. Verifica que SUPABASE_SERVICE_ROLE_KEY esté configurada.",
      };
    }
    userId = created.user.id;
  }

  return { ok: true as const, email, password, userId };
}