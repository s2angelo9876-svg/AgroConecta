/**
 * Diagnostica si Resend entrega emails a una dirección dada.
 * Envía un email de prueba y reporta el resultado.
 */
import { Resend } from "resend";
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

const FROM = process.env.RESEND_FROM_EMAIL || "noreply@agroconecta.pe";
const TO = process.argv[2];

if (!TO) {
  console.log("Uso: node scripts/test-email.mjs tu@correo.com");
  process.exit(1);
}

const resend = new Resend(process.env.RESEND_API_KEY);

console.log(`\n📧 Enviando email de prueba`);
console.log(`   De:   ${FROM}`);
console.log(`   Para: ${TO}`);
console.log(`   Key:  ${process.env.RESEND_API_KEY?.slice(0, 10)}...\n`);

const { data, error } = await resend.emails.send({
  from: FROM,
  to: TO,
  subject: "✅ Test desde AgroConecta",
  html: "<h1>¡Funciona!</h1><p>Tu servidor de emails está configurado correctamente.</p>",
});

if (error) {
  console.log("❌ Resend rechazó el envío:");
  console.log(`   ${error.message}`);
  console.log("\n💡 Causa más probable: el dominio 'agroconecta.pe'");
  console.log("   no está verificado en Resend.");
  console.log("   Para el demo, el script de recovery genera el link");
  console.log("   y lo muestra en consola del servidor como fallback.");
  process.exit(1);
}

console.log("✅ Email enviado correctamente");
console.log(`   Resend ID: ${data?.id}`);
console.log("\n💡 Revisa la bandeja de entrada (y spam) de:", TO);