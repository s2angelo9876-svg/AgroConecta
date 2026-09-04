/**
 * Crea SOLO el usuario admin@agroconecta.pe (Admin1234, role=admin).
 * Borra cualquier otro usuario existente primero.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

function loadEnv(filePath) {
  try {
    const content = readFileSync(filePath, "utf8");
    for (const line of content.split("\n")) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?(.*?)"?\s*$/i);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {}
}
const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnv(resolve(__dirname, "../.env.local"));

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const ADMIN_EMAIL = "admin@agroconecta.pe";
const ADMIN_PASS = "Admin1234";

async function main() {
  console.log("\n🔐 Creando admin único\n");

  // 1. Borrar todos los usuarios existentes
  const { data: list } = await supabase.auth.admin.listUsers();
  console.log(`↺ Borrando ${list.users.length} usuarios existentes...`);
  for (const u of list.users) {
    await supabase.auth.admin.deleteUser(u.id);
  }

  // 2. Crear admin
  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASS,
    email_confirm: true,
    user_metadata: { full_name: "Administrador", role: "admin" },
  });

  if (error) {
    console.error("❌ Error creando admin:", error.message);
    return;
  }

  console.log(`✓ Usuario creado: ${data.user.email}`);
  console.log(`✓ ID: ${data.user.id}`);

  // 3. El trigger crea el profile con role=admin (gracias a raw_user_meta_data)
  // Verificamos
  await new Promise((r) => setTimeout(r, 500));
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", data.user.id)
    .single();

  if (profile) {
    console.log(`✓ Profile: role=${profile.role}, nombre=${profile.full_name}`);
  }

  console.log("\n✅ Listo. Credenciales:");
  console.log(`   Email:    ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASS}`);
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});