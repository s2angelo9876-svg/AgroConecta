/**
 * Script de inicialización de DB.
 * Crea el admin, farmer_profiles y productos de ejemplo.
 * ⚠️ Usar solo una vez. Idempotente: si ya existe, no duplica.
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

const log = (s) => console.log(s);
const ok = (s) => console.log(`  ✓ ${s}`);
const fail = (s) => console.log(`  ❌ ${s}`);

async function main() {
  log("\n🌱 Inicializando DB de AgroConecta...\n");

  // 1) Listar usuarios existentes
  const { data: users } = await supabase.auth.admin.listUsers();
  log(`📋 Usuarios encontrados: ${users.users.length}`);
  const admin = users.users.find((u) => u.email === "admin@agroconecta.pe");
  const juan = users.users.find((u) => u.email === "alejo01@gmail.com");
  const carlos = users.users.find((u) =>
    u.email === "s2angelo9876@gmail.com"
  );
  // maria no existe, la creamos
  let maria = users.users.find((u) => u.email === "maria@agroconecta.pe");
  if (!maria) {
    log("  + Creando maria@agroconecta.pe...");
    const { data: created, error } = await supabase.auth.admin.createUser({
      email: "maria@agroconecta.pe",
      password: "demo1234",
      email_confirm: true,
      user_metadata: {
        full_name: "María Quispe",
        role: "agricultor",
      },
    });
    if (error || !created.user) {
      fail(`No se pudo crear maria: ${error?.message}`);
    } else {
      ok(`maria@agroconecta.pe creada (${created.user.id.slice(0, 8)}...)`);
      maria = created.user;
    }
  }

  if (!admin) {
    fail("No existe admin@agroconecta.pe. Créalo desde Auth UI.");
    return;
  }
  if (!juan) {
    fail("No existe alejo01@gmail.com. Verifica.");
    return;
  }
  if (!carlos) {
    fail("No existe s2angelo9876@gmail.com. Verifica.");
    return;
  }

  log("");

  // 2) Promover al admin
  log("👑 Promoviendo admin@agroconecta.pe a admin...");
  const { error: e1 } = await supabase
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", admin.id);
  if (e1) fail(e1.message);
  else ok("Admin promovido");

  // 3) Promover agricultores y crear farmer_profiles
  log("\n👨‍🌾 Promoviendo agricultores...");
  const farmers = [
    { user: juan, name: "Juan Pérez", farm: "Finca San Juan", loc: "Pisco, Ica", lat: -13.71, lng: -76.20, rating: 4.8, reviews: 24, since: "2024-01-15", bio: "Productor de hortalizas desde hace 15 años." },
    { user: maria, name: "María Quispe", farm: "Quinta María", loc: "Chincha, Ica", lat: -13.45, lng: -76.13, rating: 4.6, reviews: 18, since: "2024-03-20", bio: "Cultivos orgánicos certificados." },
    { user: carlos, name: "Carlos Huamán", farm: "Viñedos Carlos", loc: "Ica", lat: -14.06, lng: -75.73, rating: 4.9, reviews: 31, since: "2023-11-10", bio: "Frutas premium para exportación." },
  ];

  for (const f of farmers) {
    if (!f.user) continue;
    // Promover role
    await supabase.from("profiles").update({ role: "agricultor" }).eq("id", f.user.id);
    // Sincronizar full_name
    await supabase
      .from("profiles")
      .update({ full_name: f.name })
      .eq("id", f.user.id);
    // Verificar que exista el profile (si no, crearlo)
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", f.user.id)
      .maybeSingle();
    if (!existing) {
      await supabase
        .from("profiles")
        .insert({ id: f.user.id, full_name: f.name, role: "agricultor" });
    }
    // Upsert farmer_profile
    const { error } = await supabase.from("farmer_profiles").upsert(
      {
        user_id: f.user.id,
        farm_name: f.farm,
        location: f.loc,
        lat: f.lat,
        lng: f.lng,
        rating: f.rating,
        reviews_count: f.reviews,
        verified: true,
        verification_status: "verified",
        member_since: f.since,
        bio: f.bio,
      },
      { onConflict: "user_id" }
    );
    if (error) fail(`${f.name}: ${error.message}`);
    else ok(`${f.name} listo (verified, rating ${f.rating})`);
  }

  // 4) Insertar productos de ejemplo (solo si no existen)
  log("\n📦 Insertando productos de ejemplo...");
  const { count: prodCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });
  if ((prodCount ?? 0) > 0) {
    log(`  Ya hay ${prodCount} productos, saltando.`);
  } else {
    const PRODUCTS = [
      // juan
      { f: "juan", name: "Palta Hass", qty: 500, price: 4.50, date: "2026-07-12", quality: "Premium", loc: "Ica", img: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80", desc: "Palta Hass de exportación." },
      { f: "juan", name: "Tomate", qty: 300, price: 2.80, date: "2026-07-10", quality: "Primera", loc: "Pisco", img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80", desc: "Tomate fresco con abono orgánico." },
      { f: "juan", name: "Maíz Amarillo", qty: 1000, price: 1.20, date: "2026-07-15", quality: "Primera", loc: "Chincha", img: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80", desc: "Maíz duro seleccionado." },
      // maria
      { f: "maria", name: "Limón", qty: 800, price: 2.00, date: "2026-08-01", quality: "Primera", loc: "Ica", img: "https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=800&q=80", desc: "Limón sutil con alto jugo." },
      { f: "maria", name: "Cebolla Roja", qty: 2000, price: 1.50, date: "2026-07-20", quality: "Segunda", loc: "Chincha", img: "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=800&q=80", desc: "Cebolla curada." },
      // carlos
      { f: "carlos", name: "Mango", qty: 600, price: 3.20, date: "2026-08-05", quality: "Premium", loc: "Ica", img: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80", desc: "Mango dulce sin fibra." },
      { f: "carlos", name: "Uva Red Globe", qty: 1200, price: 5.00, date: "2026-08-10", quality: "Premium", loc: "Ica", img: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80", desc: "Uva de mesa exportación." },
      // maria
      { f: "maria", name: "Zanahoria", qty: 400, price: 1.80, date: "2026-07-25", quality: "Primera", loc: "Pisco", img: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80", desc: "Zanahoria dulce y crocante." },
    ];
    const farmerMap = { juan, maria, carlos };
    const rows = PRODUCTS.map((p) => ({
      farmer_id: farmerMap[p.f].id,
      name: p.name,
      quantity: p.qty,
      unit: "kg",
      price: p.price,
      harvest_date: p.date,
      quality: p.quality,
      location: p.loc,
      description: p.desc,
      image_url: p.img,
      status: "active",
    }));
    const { error } = await supabase.from("products").insert(rows);
    if (error) fail(error.message);
    else ok(`${rows.length} productos insertados`);
  }

  // 5) Resumen final
  log("\n📊 Resumen final:");
  const { data: profiles } = await supabase.from("profiles").select("role, full_name");
  profiles?.forEach((p) => log(`  - ${p.role.padEnd(10)} | ${p.full_name}`));
  const { count: pCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");
  const { count: fCount } = await supabase
    .from("farmer_profiles")
    .select("*", { count: "exact", head: true });
  log(`\n  Total: ${pCount} productos, ${fCount} agricultores en farmer_profiles`);

  log("\n✅ Inicialización completa");
  log("\n🔑 Credenciales para login:");
  log("   admin@agroconecta.pe  (la contraseña que le pusiste)");
  log("   alejo01@gmail.com / maria@agroconecta.pe / s2angelo9876@gmail.com  (password: demo1234)");
}

main().catch((e) => {
  console.error("Error fatal:", e);
  process.exit(1);
});