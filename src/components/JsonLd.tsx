const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface LocalBusinessJsonLdProps {
  farmersCount?: number;
}

export function LocalBusinessJsonLd({
  farmersCount = 0,
}: LocalBusinessJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": BASE_URL,
    name: "AgroConecta",
    description:
      "Plataforma que conecta agricultores con compradores (restaurantes, hoteles, supermercados, agroindustrias) sin intermediarios.",
    url: BASE_URL,
    logo: `${BASE_URL}/logo-mark.png`,
    image: `${BASE_URL}/logo-full.png`,
    slogan: "Tecnología que impulsa al agricultor.",
    areaServed: { "@type": "Country", name: "Perú" },
    address: {
      "@type": "PostalAddress",
      addressRegion: "Ica",
      addressCountry: "PE",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "contacto@agroconecta.com",
      telephone: "+51 987 654 321",
      availableLanguage: ["Spanish"],
    },
    knowsAbout: [
      "Agricultura",
      "Comercio local",
      "Paltas Hass",
      "Tomates",
      "Maíz",
      "Yape",
      "Plin",
    ],
    aggregateRating: farmersCount > 0 ? {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: farmersCount,
    } : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  image,
  price,
  currency = "PEN",
  location,
  farmerName,
  url,
}: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  location: string;
  farmerName: string;
  url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    brand: { "@type": "Brand", name: "AgroConecta" },
    offers: {
      "@type": "Offer",
      priceCurrency: currency,
      price,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: farmerName },
      areaServed: location,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}