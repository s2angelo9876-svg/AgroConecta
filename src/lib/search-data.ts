export interface SearchResultItem {
  type: "page" | "product" | "faq" | "farmer";
  title: string;
  subtitle?: string;
  href: string;
}

export const ADMIN_PAGES: SearchResultItem[] = [
  { type: "page", title: "Admin · Resumen", href: "/admin" },
  { type: "page", title: "Admin · Verificaciones", href: "/admin/verificaciones" },
  { type: "page", title: "Admin · Publicaciones", href: "/admin/publicaciones" },
  { type: "page", title: "Admin · FAQs", href: "/admin/faqs" },
  { type: "page", title: "Admin · Testimonios", href: "/admin/testimonials" },
];