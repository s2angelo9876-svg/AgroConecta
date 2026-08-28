/**
 * Constantes de UI del catálogo (opciones, imágenes por defecto, ubicaciones).
 * NO contiene datos demo — todo viene de la base de datos.
 */

export const PRODUCT_OPTIONS = [
  "Palta Hass",
  "Tomate",
  "Maíz Amarillo",
  "Limón",
  "Cebolla Roja",
  "Mango",
  "Uva Red Globe",
  "Zanahoria",
  "Papa",
] as const;

export type ProductOption = (typeof PRODUCT_OPTIONS)[number];

/**
 * Imágenes por defecto que se asignan al publicar una cosecha nueva
 * (cuando el agricultor no sube foto propia). Las URLs son CDN de Unsplash.
 */
export const PRODUCT_IMAGES: Record<string, string> = {
  "Palta Hass":
    "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80",
  Tomate:
    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
  "Maíz Amarillo":
    "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
  Limón:
    "https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=800&q=80",
  "Cebolla Roja":
    "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=800&q=80",
  Mango:
    "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80",
  "Uva Red Globe":
    "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80",
  Zanahoria:
    "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80",
  Papa: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
};

export const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80";

export const LOCATIONS = ["Ica", "Pisco", "Chincha"] as const;
export type Location = (typeof LOCATIONS)[number];

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1200&q=80";

/** Logo del sitio (favicon ya viene de src/app/icon.png). */
export const LOGO_MARK = "/logo-mark.png";
export const LOGO_FULL = "/logo-full.png";
export const LOGO_WORDMARK = "/logo-wordmark.png";