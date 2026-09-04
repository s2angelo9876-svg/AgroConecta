/**
 * Crea una solicitud de verificación pendiente de prueba para armando01.
 * Útil para probar el panel admin sin tener que completar el formulario.
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

const TEST_EMAIL = "armando01@gmail.com";
const TEST_DNI = "12345678";

async function main() {
  console.log("\n🧪 Creando solicitud de verificación de prueba\n");

  const { data: userData } = await supabase.auth.admin.listUsers();
  const user = userData.users.find((u) => u.email === TEST_EMAIL);
  if (!user) {
    console.log(`❌ No existe ${TEST_EMAIL}. Créalo primero.`);
    return;
  }

  // Crear farmer_profile
  const { error: fpErr } = await supabase.from("farmer_profiles").upsert(
    {
      user_id: user.id,
      location: "Pisco, Ica",
      lat: -13.71,
      lng: -76.2,
      bio: "Agricultor de prueba",
    },
    { onConflict: "user_id" }
  );
  if (fpErr) console.log("❌ farmer_profile:", fpErr.message);
  else console.log("✓ farmer_profile creado");

  // Crear verification_doc pending
  const { error: docErr } = await supabase.from("verification_docs").insert({
    user_id: user.id,
    doc_type: "ppa",
    file_path: `${user.id}/test-doc.pdf`,
    file_size_bytes: 102400,
    mime_type: "application/pdf",
    status: "pending",
  });
  if (docErr) console.log("❌ verification_docs:", docErr.message);
  else console.log("✓ verification_doc pending creado");

  console.log(`\n✅ Listo. Ahora ve a /admin/verificaciones (login como admin) y deberías ver la solicitud de ${TEST_EMAIL}.`);
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});