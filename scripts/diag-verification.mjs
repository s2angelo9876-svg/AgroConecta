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

console.log("\n📋 Estado de verificación\n");

const { data: docs, error: dErr } = await supabase
  .from("verification_docs")
  .select("id, user_id, doc_type, status, created_at")
  .order("created_at", { ascending: false });

if (dErr) {
  console.log("❌ Error:", dErr.message);
} else {
  console.log(`Total docs: ${docs.length}\n`);
  docs.forEach((d) => {
    console.log(`• Doc ${d.id.slice(0, 8)}... | user: ${d.user_id}`);
    console.log(`   Tipo: ${d.doc_type} | Status: ${d.status}`);
    console.log(`   Subido: ${new Date(d.created_at).toLocaleString("es-PE")}\n`);
  });
}

const { data: farmers } = await supabase
  .from("farmer_profiles")
  .select("user_id, location, verified, verification_status, profiles:user_id(full_name, email)");
console.log("🚜 farmer_profiles:");
farmers?.forEach((f) => {
  console.log(`  ${f.profiles?.email} → verified=${f.verified}, status=${f.verification_status}`);
});