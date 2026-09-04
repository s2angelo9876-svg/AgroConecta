/**
 * RESET TOTAL: borra todos los datos de prueba del proyecto.
 * ⚠️ USAR SOLO EN DESARROLLO / DEMOS. Borra usuarios también.
 *
 * Estado final:
 *   - 0 usuarios
 *   - 0 productos / farmer_profiles
 *   - FAQs + testimonials + site_settings re-poblados con el seed
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

console.log("\n🔥 RESET TOTAL\n");

// 1. Borrar usuarios (cascade a profiles → farmer_profiles → products → ...)
const { data: listData } = await supabase.auth.admin.listUsers();
const users = listData?.users ?? [];
console.log(`↺ Borrando ${users.length} usuarios...`);
for (const u of users) {
  await supabase.auth.admin.deleteUser(u.id);
}

// 2. Vitrales: limpiar tablas que no tienen cascade
console.log("↺ Limpiando conversaciones, mensajes, notificaciones...");
await supabase.from("messages").delete().neq("id", "00000000-0000-0000-0000-000000000000");
await supabase.from("conversations").delete().neq("id", "00000000-0000-0000-0000-000000000000");
await supabase.from("notifications").delete().neq("id", "00000000-0000-0000-0000-000000000000");
await supabase.from("orders").delete().neq("id", "00000000-0000-0000-0000-000000000000");
await supabase.from("matches").delete().neq("id", "00000000-0000-0000-0000-000000000000");
await supabase.from("demands").delete().neq("id", "00000000-0000-0000-0000-000000000000");
await supabase.from("favorites").delete().neq("user_id", "00000000-0000-0000-0000-000000000000");

// 3. CMS: borrar y re-poblar
console.log("↺ Limpiando y re-seeding CMS...");
await supabase.from("faqs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
await supabase.from("testimonials").delete().neq("id", "00000000-0000-0000-0000-000000000000");
await supabase.from("site_settings").delete().neq("key", "___never___");

await supabase.from("faqs").insert([
  { question: "¿Cómo publico mi cosecha?", answer: 'Ve a "Publicar cosecha", completa el formulario con producto, cantidad, precio, fecha y ubicación. La publicación es gratuita.', order_index: 1, published: true },
  { question: "¿Tiene algún costo usar AgroConecta?", answer: "No. La publicación y búsqueda son gratuitas.", order_index: 2, published: true },
  { question: "¿Cómo pago mi compra?", answer: "Directamente al agricultor: tarjeta, Yape, Plin o transferencia. AgroConecta no procesa pagos.", order_index: 3, published: true },
  { question: "¿Cómo verifico mi identidad?", answer: "Al registrarte como agricultor sube tu PPA del MIDAGRI o recibo de agua de riego. Un administrador revisa en menos de 24h.", order_index: 4, published: true },
  { question: "¿Puedo usar AgroConecta desde el celular?", answer: "Sí. La web es responsive. Próximamente lanzaremos una PWA y aplicación móvil.", order_index: 5, published: true },
]);

await supabase.from("testimonials").insert([
  { author_name: "Restaurante Sol Naciente", author_role: "Restaurante en Ica", content: "Desde AgroConecta compramos directamente al agricultor. La calidad y frescura son notables, y el precio mucho mejor.", rating: 5, published: true },
  { author_name: "Hotel Paracas", author_role: "Hotel en Pisco", content: "Recibimos palta y tomate de primer nivel cada semana.", rating: 5, published: true },
  { author_name: "Exportadora Andina", author_role: "Empresa agroindustrial", content: "Encontramos proveedores confiables y verificados en minutos.", rating: 4, published: true },
  { author_name: "Doña Rosa", author_role: "Compradora en Chincha", content: "Por fin una plataforma para el agricultor pequeño. Vendo mi cosecha de cebolla sin intermediarios y gano más.", rating: 5, published: true },
]);

await supabase.from("site_settings").insert([
  { key: "contact_email", value: '"contacto@agroconecta.com"' },
  { key: "contact_phone", value: '"+51 987 654 321"' },
  { key: "response_time", value: '"Respondemos en menos de 24 horas"' },
  { key: "social", value: '{"instagram":"@agroconecta","facebook":"agroconecta","whatsapp":"+51987654321"}' },
]);

console.log("\n✅ DB limpia y re-seedeada");
console.log("\n📌 Próximos pasos:");
console.log("   1. Crea tu primer admin en Authentication > Users (admin@agroconecta.pe)");
console.log("   2. Ejecuta: update profiles set role='admin' where email='admin@agroconecta.pe';");
console.log("   3. Crea usuarios agricultores/compradores según necesites");