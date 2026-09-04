/**
 * Seed rico para demo.
 *
 * Crea:
 *   - 1 admin (admin@agroconecta.pe / Admin1234) — debe existir ya
 *   - 2 agricultores:
 *       juan@agroconecta.pe (VERIFICADO, con 4 productos)
 *       maria@agroconecta.pe (PENDIENTE de verificación, con 1 verification_doc)
 *   - 1 comprador (lucia@agroconecta.pe)
 *
 * Todas las passwords son "demo1234" para facilidad.
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

const PASSWORD = "demo1234";

const IMG = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

const USERS = [
  {
    email: "admin@agroconecta.pe",
    password: "Admin1234",
    full_name: "Administrador",
    role: "admin",
  },
  {
    email: "juan@agroconecta.pe",
    password: PASSWORD,
    full_name: "Juan Pérez",
    role: "agricultor",
    farmer: {
      farm_name: "Finca San Juan",
      location: "Pisco, Ica",
      lat: -13.71,
      lng: -76.2,
      rating: 4.8,
      reviews_count: 24,
      verified: true,
      verification_status: "verified",
      member_since: "2024-01-15",
      bio: "Productor de hortalizas desde hace 15 años. Especializado en palta y tomate.",
    },
    products: [
      {
        name: "Palta Hass",
        quantity: 500,
        price: 4.5,
        harvest_date: "2026-08-15",
        quality: "Premium",
        location: "Ica",
        description:
          "Palta Hass de exportación, pulpa cremosa y calibre uniforme. Lista para empaque.",
        image_url: IMG("photo-1523049673857-eb18f1d7b578"),
      },
      {
        name: "Tomate",
        quantity: 300,
        price: 2.8,
        harvest_date: "2026-08-12",
        quality: "Primera",
        location: "Pisco",
        description: "Tomate fresco cultivado con abono orgánico.",
        image_url: IMG("photo-1592924357228-91a4daadcfea"),
      },
      {
        name: "Maíz Amarillo",
        quantity: 1000,
        price: 1.2,
        harvest_date: "2026-08-18",
        quality: "Primera",
        location: "Chincha",
        description: "Maíz amarillo duro seleccionado, ideal para molienda.",
        image_url: IMG("photo-1551754655-cd27e38d2076"),
      },
      {
        name: "Espárrago verde",
        quantity: 80,
        price: 12.5,
        harvest_date: "2026-08-20",
        quality: "Premium",
        location: "Ica",
        description: "Espárrago verde fresco de exportación. Sin fibras.",
        image_url: IMG("photo-1515476669854-44f377f86b04"),
      },
    ],
  },
  {
    email: "maria@agroconecta.pe",
    password: PASSWORD,
    full_name: "María Quispe",
    role: "agricultor",
    farmer: {
      farm_name: "Quinta María",
      location: "Chincha, Ica",
      lat: -13.45,
      lng: -76.13,
      rating: 4.6,
      reviews_count: 18,
      verified: false,
      verification_status: "pending",
      member_since: "2024-03-20",
      bio: "Cultivos orgánicos certificados. Cebolla y zanahoria.",
    },
    products: [
      {
        name: "Cebolla Roja",
        quantity: 2000,
        price: 1.5,
        harvest_date: "2026-08-10",
        quality: "Segunda",
        location: "Chincha",
        description: "Cebolla roja curada, lista para almacenamiento prolongado.",
        image_url: IMG("photo-1518977956812-cd3dbadaaf31"),
      },
      {
        name: "Zanahoria",
        quantity: 400,
        price: 1.8,
        harvest_date: "2026-08-14",
        quality: "Primera",
        location: "Pisco",
        description: "Zanahoria fresca, dulce y crocante.",
        image_url: IMG("photo-1598170845058-32b9d6a5da37"),
      },
    ],
    pendingVerification: true,
  },
  {
    email: "lucia@agroconecta.pe",
    password: PASSWORD,
    full_name: "Lucía Méndez",
    role: "comprador",
  },
];

async function main() {
  console.log("\n🌱 Sembrando datos de demo\n");

  // 1. Borrar usuarios existentes
  const { data: list } = await supabase.auth.admin.listUsers();
  console.log(`↺ Borrando ${list.users.length} usuarios existentes...`);
  for (const u of list.users) {
    await supabase.auth.admin.deleteUser(u.id);
  }

  // 2. Crear cada usuario
  for (const u of USERS) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { full_name: u.full_name, role: u.role },
    });
    if (error) {
      console.log(`❌ ${u.email}: ${error.message}`);
      continue;
    }
    console.log(`✓ ${u.email} [${u.role}]`);

    // 3. Si es agricultor, crear farmer_profile + products
    if (u.farmer) {
      const { error: fpErr } = await supabase.from("farmer_profiles").insert({
        user_id: data.user.id,
        ...u.farmer,
      });
      if (fpErr) console.log(`  ❌ farmer_profile: ${fpErr.message}`);
      else console.log(`  ✓ farmer_profile`);

      // Products
      if (u.products) {
        const rows = u.products.map((p) => ({
          ...p,
          farmer_id: data.user.id,
          unit: "kg",
          status: "active",
        }));
        const { error: pErr } = await supabase.from("products").insert(rows);
        if (pErr) console.log(`  ❌ products: ${pErr.message}`);
        else console.log(`  ✓ ${rows.length} productos`);

        // Documento pendiente (solo maría)
        if (u.pendingVerification) {
          const { error: dErr } = await supabase
            .from("verification_docs")
            .insert({
              user_id: data.user.id,
              doc_type: "ppa",
              file_path: `${data.user.id}/demo-ppa.pdf`,
              file_size_bytes: 245000,
              mime_type: "application/pdf",
              status: "pending",
            });
          if (dErr) console.log(`  ❌ verification_docs: ${dErr.message}`);
          else console.log(`  ✓ verification_doc (pending)`);
        }
      }
    }
  }

  // 4. CMS adicional — testimonios extra
  await supabase.from("testimonials").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("testimonials").insert([
    {
      author_name: "Restaurante Sol Naciente",
      author_role: "Restaurante en Ica",
      content:
        "Desde AgroConecta compramos directamente al agricultor. La calidad y frescura son notables, y el precio mucho mejor.",
      rating: 5,
      published: true,
    },
    {
      author_name: "Hotel Paracas",
      author_role: "Hotel en Pisco",
      content:
        "Recibimos palta y tomate de primer nivel cada semana. La comunicación con el agricultor es directa y rápida.",
      rating: 5,
      published: true,
    },
    {
      author_name: "Exportadora Andina",
      author_role: "Empresa agroindustrial",
      content:
        "Como compradores de volumen, AgroConecta nos ahorró meses de búsqueda. Encontramos proveedores confiables y verificados.",
      rating: 4,
      published: true,
    },
    {
      author_name: "Doña Rosa",
      author_role: "Compradora en Chincha",
      content:
        "Por fin una plataforma para el agricultor pequeño. Vendo mi cosecha de cebolla sin intermediarios y gano más.",
      rating: 5,
      published: true,
    },
  ]);

  console.log("\n✅ Seed completo\n");
  console.log("Credenciales:");
  console.log("  admin@agroconecta.pe   / Admin1234");
  console.log("  juan@agroconecta.pe    / demo1234  (agricultor verificado)");
  console.log("  maria@agroconecta.pe   / demo1234  (agricultor PENDIENTE)");
  console.log("  lucia@agroconecta.pe   / demo1234  (comprador)");
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});