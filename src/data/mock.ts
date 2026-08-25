// ===========================================================
// Datos mock (estaticos) usados mientras se conecta la DB.
// En Fases 4-5 esto se reemplazará con datos de Supabase.
// ===========================================================

export type Quality = "Premium" | "Primera" | "Segunda";

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
}

export interface MapPin {
  id: string;
  name: string;
  type: "farmer" | "product";
  latPct: number; // 0-100 dentro del contenedor del mapa
  lngPct: number; // 0-100
  image: string;
}

export interface Farmer {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  verified: boolean;
  memberSince: string;
  avatar: string;
  phone: string;
  cover: string;
}

// (El tipo Product ya no se exporta desde aquí: la UI usa UiProduct
// de @/lib/schemas, que viene de la base de datos.)

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1200&q=80";

export const FARMERS: Farmer[] = [
  {
    id: "f1",
    name: "Juan Pérez",
    location: "Pisco, Ica",
    rating: 4.8,
    reviews: 24,
    verified: true,
    memberSince: "Enero 2024",
    avatar: img("photo-1507003211169-0a1dd7228f2d"),
    phone: "+51 987 654 321",
    cover: img("photo-1500937386664-56d1dfef3854"),
  },
  {
    id: "f2",
    name: "María Quispe",
    location: "Chincha, Ica",
    rating: 4.6,
    reviews: 18,
    verified: true,
    memberSince: "Marzo 2024",
    avatar: img("photo-1573496359142-b8d87734a5a2"),
    phone: "+51 912 345 678",
    cover: img("photo-1500937386664-56d1dfef3854"),
  },
  {
    id: "f3",
    name: "Carlos Huamán",
    location: "Ica",
    rating: 4.9,
    reviews: 31,
    verified: true,
    memberSince: "Noviembre 2023",
    avatar: img("photo-1560250097-0b93528c311a"),
    phone: "+51 999 888 777",
    cover: img("photo-1500937386664-56d1dfef3854"),
  },
];

/** Imágenes sugeridas al publicar una cosecha (demo). */
export const PRODUCT_IMAGES: Record<string, string> = {
  "Palta Hass": img("photo-1523049673857-eb18f1d7b578"),
  Tomate: img("photo-1592924357228-91a4daadcfea"),
  "Maíz Amarillo": img("photo-1551754655-cd27e38d2076"),
  Limón: img("photo-1590502593747-42a996133562"),
  "Cebolla Roja": img("photo-1518977956812-cd3dbadaaf31"),
  Mango: img("photo-1553279768-865429fa0078"),
  "Uva Red Globe": img("photo-1537640538966-79f369143f8f"),
  Zanahoria: img("photo-1598170845058-32b9d6a5da37"),
  Papa: img("photo-1518977676601-b53f82aba655"),
};

export const DEFAULT_PRODUCT_IMAGE = img("photo-1540420773420-3366772f4999");

export const PRODUCT_OPTIONS = Object.keys(PRODUCT_IMAGES);

export const LOCATIONS = ["Ica", "Pisco", "Chincha"];

export const REVIEWS: Record<string, Review[]> = {
  f1: [
    {
      id: "r1",
      author: "Restaurante Sol Naciente",
      rating: 5,
      date: "15/07/2026",
      text: "Tomates de excelente calidad y entrega puntual. Juan es muy responsable.",
    },
    {
      id: "r2",
      author: "Doña Rosa (Compradora)",
      rating: 4,
      date: "02/07/2026",
      text: "Buena pala, aunque algunas llegaron muy maduras. En general recomendado.",
    },
  ],
  f2: [
    {
      id: "r3",
      author: "Hotel Paracas",
      rating: 5,
      date: "10/07/2026",
      text: "Limón jugoso y fresco. María siempre cumple con los tiempos de entrega.",
    },
  ],
  f3: [
    {
      id: "r4",
      author: "Exportadora Andina",
      rating: 5,
      date: "20/07/2026",
      text: "Uva Red Globe de exportación. Calidad premium y empaque impecable.",
    },
  ],
};

/** Puntos aproximados sobre el mapa embebido de Ica (porcentajes CSS). */
export const MAP_PINS: MapPin[] = [
  { id: "pin-f1", name: "Juan Pérez — Pisco", type: "farmer", latPct: 52, lngPct: 58, image: img("photo-1507003211169-0a1dd7228f2d") },
  { id: "pin-f2", name: "María Quispe — Chincha", type: "farmer", latPct: 22, lngPct: 34, image: img("photo-1573496359142-b8d87734a5a2") },
  { id: "pin-f3", name: "Carlos Huamán — Ica", type: "farmer", latPct: 60, lngPct: 42, image: img("photo-1560250097-0b93528c311a") },
  { id: "pin-p1", name: "Palta Hass — Ica", type: "product", latPct: 56, lngPct: 46, image: PRODUCT_IMAGES["Palta Hass"] },
  { id: "pin-p4", name: "Limón — Ica", type: "product", latPct: 50, lngPct: 40, image: PRODUCT_IMAGES["Limón"] },
];

export function findFarmer(id: string): Farmer | undefined {
  return FARMERS.find((f) => f.id === id);
}
