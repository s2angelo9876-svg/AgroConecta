/**
 * Lista los usuarios registrados con sus datos públicos.
 * ⚠️ Las contraseñas NO se pueden recuperar (Supabase solo guarda hashes).
 *     Las que conoce el script son las que seed-demo.mjs asignó.
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

// Mapa de passwords conocidas (creadas por seed-demo.mjs y create-admin-only.mjs)
const KNOWN_PASSWORDS = {
  "admin@agroconecta.pe": "Admin1234",
  "juan@agroconecta.pe": "demo1234",
  "maria@agroconecta.pe": "demo1234",
  "lucia@agroconecta.pe": "demo1234",
};

async function main() {
  console.log("\n👥 Usuarios registrados en tu proyecto\n");

  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 200 });
  if (error) {
    console.error("❌", error.message);
    return;
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, role, phone, created_at");

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  // Ordenar por email
  const sorted = data.users.sort((a, b) =>
    (a.email ?? "").localeCompare(b.email ?? "")
  );

  for (const u of sorted) {
    const profile = profileById.get(u.id);
    const role = profile?.role ?? "—";
    const name = profile?.full_name ?? "—";
    const password = KNOWN_PASSWORDS[u.email] ?? "(desconocida)";
    const created = new Date(u.created_at).toLocaleString("es-PE");
    const lastSignIn = u.last_sign_in_at
      ? new Date(u.last_sign_in_at).toLocaleString("es-PE")
      : "nunca";

    console.log(`📧 ${u.email}`);
    console.log(`   nombre:   ${name}`);
    console.log(`   rol:      ${role}`);
    console.log(`   password: ${password}`);
    console.log(`   creado:   ${created}`);
    console.log(`   último acceso: ${lastSignIn}`);
    console.log("");
  }

  console.log(`Total: ${sorted.length} usuario(s)\n`);
  console.log("⚠️  Las contraseñas que dicen '(desconocida)' no las conozco yo.");
  console.log("    Para los usuarios que olvidaste su contraseña, usa la opción");
  console.log("    '¿Olvidaste tu contraseña?' desde /login (ahora muestra un card");
  console.log("    de éxito en lugar de enviar email real, en modo demo).\n");
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});