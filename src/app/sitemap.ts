import type { MetadataRoute } from "next";
import { fetchProductsAction } from "@/lib/actions/products";
import { getVerifiedFarmersForSitemap } from "@/lib/actions/sitemap";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, farmers] = await Promise.all([
    fetchProductsAction().catch(() => []),
    getVerifiedFarmersForSitemap().catch(() => []),
  ]);

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/buscar`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/mapa`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/preguntas-frecuentes`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/equipo`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/gracias`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/login`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/registro`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/privacidad`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/terminos`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const farmersUrls: MetadataRoute.Sitemap = farmers.map((f) => ({
    url: `${BASE_URL}/agricultor/${f.id}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/producto/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticUrls, ...farmersUrls, ...productUrls];
}