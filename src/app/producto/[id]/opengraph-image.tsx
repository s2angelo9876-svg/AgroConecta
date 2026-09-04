import { ImageResponse } from "next/og";
import { fetchProductsAction } from "@/lib/actions/products";

export const runtime = "edge";
export const alt = "Producto en AgroConecta";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * OG image dinámica por producto: muestra foto + nombre + precio + agricultor.
 */
export default async function ProductOpenGraph({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Intentamos buscar el producto (en BD o fallback)
  let product: any = null;
  try {
    const all = await fetchProductsAction();
    product = all.find((p) => p.id === id);
  } catch {}

  if (!product) {
    // Fallback genérico
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#1b5e20",
            color: "white",
            fontSize: "60px",
          }}
        >
          AgroConecta
        </div>
      ),
      { ...size }
    );
  }

  const farmerName = product.farmerSummary?.name ?? "Agricultor";
  const location = product.location;
  const quality = product.quality;
  const price = `S/ ${Number(product.price).toFixed(2)}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          background: "#FAF7EF",
        }}
      >
        {/* Imagen izquierda */}
        <div
          style={{
            width: "50%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: `url(${product.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Info derecha */}
        <div
          style={{
            width: "50%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px",
            color: "#1b5e20",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              color: "#2e7d32",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            🌱 AgroConecta
          </div>
          <div
            style={{
              fontSize: "48px",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            {product.name}
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#5d4037",
              marginBottom: "24px",
            }}
          >
            {farmerName} · 📍 {location} · ✨ {quality}
          </div>
          <div
            style={{
              display: "inline-block",
              background: "#2e7d32",
              color: "white",
              padding: "12px 24px",
              borderRadius: "10px",
              fontSize: "32px",
              fontWeight: 800,
              alignSelf: "flex-start",
            }}
          >
            {price} / {product.unit}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}