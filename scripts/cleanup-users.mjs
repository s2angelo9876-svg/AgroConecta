/**
 * Script de limpieza: elimina todos los usuarios EXCEPTO admin@agroconecta.pe.
 * Cascada: al borrar auth.user → profile → farmer_profile → products → favorites etc.
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

const ADMIN_EMAIL = "admin@agroconecta.pe";

async function main() {
  console.log("\n🧹 Limpiando usuarios no-admin...\n");

  const { data: usersData } = await supabase.auth.admin.listUsers({ perPage: 100 });
  const users = usersData.users;
  console.log(`👥 Usuarios encontrados: ${users.length}`);

  const admin = users.find((u) => u.email === ADMIN_EMAIL);
  if (!admin) {
    console.log(`  ❌ No existe ${ADMIN_EMAIL}. Abortando para no borrar todo.`);
    return;
  }
  console.log(`  ✓ Admin preservado: ${admin.email} (${admin.id.slice(0, 8)}...)`);

  const toDelete = users.filter((u) => u.email !== ADMIN_EMAIL);
  console.log(`  🗑️  A eliminar: ${toDelete.length}`);
  for (const u of toDelete) {
    console.log(`     - ${u.email}`);
  }

  // Borrar usuarios (cascada a profiles → farmer_profiles → products)
  let deleted = 0;
  for (const u of toDelete) {
    const { error } = await supabase.auth.admin.deleteUser(u.id);
    if (error) {
      console.log(`  ❌ No se pudo borrar ${u.email}: ${error.message}`);
    } else {
      deleted++;
    }
  }
  console.log(`\n  ✓ ${deleted}/${toDelete.length} usuarios eliminados`);

  // Verificar estado final
  console.log("\n📊 Estado final:");
  const { data: finalUsers } = await supabase.auth.admin.listUsers({ perPage: 100 });
  console.log(`  Usuarios auth: ${finalUsers.users.length}`);
  const { count: profiles } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });
  const { count: farmers } = await supabase
    .from("farmer_profiles")
    .select("*", { count: "exact", head: true });
  const { count: products } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");
  console.log(`  profiles: ${profiles}`);
  console.log(`  farmer_profiles: ${farmers}`);
  console.log(`  products activos: ${products}`);

  console.log("\n✅ Limpieza completa");
}

main().catch((e) => {
  console.error("Error fatal:", e);
  process.exit(1);
});