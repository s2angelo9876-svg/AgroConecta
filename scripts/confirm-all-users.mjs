/**
 * Confirma el email de TODOS los usuarios que aún no lo han confirmado.
 * Ejecuta: node scripts/confirm-all-users.mjs
 *
 * Útil cuando dejaste activado "Confirm email" en Supabase y necesitas
 * desbloquear cuentas existentes sin esperar el email.
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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log("\n🔧 Confirmando todos los usuarios con email pendiente...\n");

  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 200 });
  if (error) {
    console.error("❌ Error listando usuarios:", error.message);
    return;
  }

  const unconfirmed = data.users.filter((u) => !u.email_confirmed_at);
  console.log(`📋 Usuarios totales: ${data.users.length}`);
  console.log(`📋 Pendientes de confirmar: ${unconfirmed.length}\n`);

  if (unconfirmed.length === 0) {
    console.log("✅ Todos los usuarios ya están confirmados.");
    return;
  }

  let confirmed = 0;
  for (const u of unconfirmed) {
    const { error: err } = await supabase.auth.admin.updateUserById(u.id, {
      email_confirm: true,
    });
    if (err) {
      console.log(`  ❌ ${u.email}: ${err.message}`);
    } else {
      console.log(`  ✓ ${u.email}`);
      confirmed++;
    }
  }

  console.log(`\n✅ ${confirmed}/${unconfirmed.length} usuarios confirmados.`);
  console.log("\n📌 IMPORTANTE: Para futuros registros, desactiva 'Confirm email'");
  console.log("   en Supabase → Authentication → Sign In/Up");
}

main().catch((e) => {
  console.error("Error fatal:", e);
  process.exit(1);
});