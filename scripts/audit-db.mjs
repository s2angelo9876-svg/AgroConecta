/**
 * Script de auditoría de Supabase.
 * Lee el estado actual de tu base de datos sin modificarla.
 * Uso: node scripts/audit-db.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, join, dirname } from "path";
import { fileURLToPath } from "url";

// Carga .env.local manualmente (sin dotenv)
function loadEnv(filePath) {
  try {
    const content = readFileSync(filePath, "utf8");
    for (const line of content.split("\n")) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?(.*?)"?\s*$/i);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2];
      }
    }
  } catch {}
}
const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnv(resolve(__dirname, "../.env.local"));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "❌ Faltan variables NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function check(label, query) {
  try {
    const { data, error, count } = await query;
    if (error) {
      console.log(`  ❌ ${label}: ${error.message}`);
      return null;
    }
    const total = count ?? data?.length ?? 0;
    console.log(`  ✓ ${label}: ${total} registro(s)`);
    return data;
  } catch (e) {
    console.log(`  ❌ ${label}: ${e.message}`);
    return null;
  }
}

async function main() {
  console.log("\n🔍 Auditoría de Supabase:", url);
  console.log("━".repeat(60));

  // 1. Auth users
  console.log("\n👥 Usuarios (auth.users):");
  const { data: users, error: uErr } = await supabase.auth.admin.listUsers({
    perPage: 100,
  });
  if (uErr) {
    console.log(`  ❌ ${uErr.message}`);
  } else {
    console.log(`  Total: ${users.users.length}`);
    users.users.forEach((u) => {
      const role = u.user_metadata?.role || "comprador";
      console.log(`    - ${u.email}  [${role}]  ${u.id.slice(0, 8)}...`);
    });
  }

  // 2. Tablas de aplicación
  console.log("\n📊 Tablas de aplicación:");
  const tables = [
    "profiles",
    "farmer_profiles",
    "products",
    "verification_docs",
    "faqs",
    "testimonials",
    "site_settings",
    "conversations",
    "messages",
    "orders",
  ];
  for (const t of tables) {
    await check(t, supabase.from(t).select("*", { count: "exact", head: true }));
  }

  // 3. RLS habilitado
  console.log("\n🔒 RLS habilitado en:");
  for (const t of tables) {
    const { data, error } = await supabase.rpc;
    // No tenemos RPC directo, así que probamos con un SELECT y la diferencia entre RLS activo/inactivo:
    // Hacemos SELECT * con anon key (simulada) — si hay RLS y no hay policy, devuelve 0 rows.
    const anon = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const { count } = await anon.from(t).select("*", { count: "exact", head: true });
    console.log(`  ${t}: ${count} filas visibles para anon (RLS activo si devuelve menos del total)`);
  }

  // 4. Storage
  console.log("\n📁 Storage buckets:");
  const { data: buckets } = await supabase.storage.listBuckets();
  if (buckets) {
    buckets.forEach((b) => {
      console.log(`  - ${b.id} (público: ${b.public})`);
    });
  }

  console.log("\n✅ Auditoría completa");
}

main().catch((e) => {
  console.error("Error fatal:", e);
  process.exit(1);
});