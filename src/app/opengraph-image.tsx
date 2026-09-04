import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AgroConecta — Del campo al comprador, sin intermediarios";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 60%, #4caf50 100%)",
          padding: "80px",
          color: "white",
          fontFamily: "system-ui",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
            }}
          >
            🌱
          </div>
          <div style={{ fontSize: "44px", fontWeight: 800 }}>
            <span style={{ color: "#c8e6c9" }}>Agro</span>
            <span style={{ color: "#f9c513" }}>Conecta</span>
          </div>
        </div>

        <div
          style={{
            fontSize: "68px",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: "24px",
            maxWidth: "900px",
          }}
        >
          Del campo al comprador, sin intermediarios.
        </div>

        <div
          style={{
            fontSize: "24px",
            opacity: 0.9,
            maxWidth: "800px",
          }}
        >
          Publica tu cosecha, conecta con restaurantes y hoteles, y vende directo.
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "80px",
            fontSize: "20px",
            background: "#f9c513",
            color: "#1b1b1b",
            padding: "12px 24px",
            borderRadius: "12px",
            fontWeight: 700,
          }}
        >
          🌾 Tecnología que impulsa al agricultor
        </div>
      </div>
    ),
    { ...size }
  );
}