/**
 * Diagnostica si el proyecto Supabase requiere confirmación de email.
 * NO modifica nada.
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

const TEST_EMAIL = `diag-${Date.now()}@example-test.com`;

async function main() {
  console.log("\n🔍 Diagnóstico de confirmación de email\n");

  const { data, error } = await supabase.auth.signUp({
    email: TEST_EMAIL,
    password: "test1234",
  });

  if (error) {
    console.log(`❌ signUp falló: ${error.message}`);
    return;
  }

  console.log("Respuesta de signUp:");
  console.log(`  user.id: ${data.user?.id?.slice(0, 8)}...`);
  console.log(`  user.email_confirmed_at: ${data.user?.email_confirmed_at ?? "(NULL → requiere confirmación)"}`);
  console.log(`  session: ${data.session === null ? "NULL (❌ no logueado automáticamente)" : "presente ✅"}`);

  if (data.session === null) {
    console.log("\n⚠️  Tu proyecto SUPABASE REQUIERE CONFIRMACIÓN DE EMAIL.");
    console.log("    El usuario se crea pero NO inicia sesión.");
    console.log("    Eso explica el comportamiento que viste.");
    console.log("\n    Para arreglarlo (modo demo):");
    console.log("    Supabase Dashboard → Authentication → Sign In/Up");
    console.log("    → desactivar 'Confirm email'");
  } else {
    console.log("\n✓  El usuario inicia sesión automáticamente (no requiere confirmación).");
  }

  // Limpiar el usuario de prueba
  if (data.user?.id) {
    await supabase.auth.admin.deleteUser(data.user.id);
    console.log(`\n🧹 Usuario de prueba ${TEST_EMAIL} eliminado`);
  }
}

main().catch((e) => {
  console.error("Error fatal:", e);
  process.exit(1);
});