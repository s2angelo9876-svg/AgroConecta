/**
 * Logo de AgroConecta recreado en SVG (hoja + nodos de conexión).
 * Colores de marca: verde #2E7D32 / #1F6B33, amarillo #F5B301, azul #1B5FAA.
 */

function MarkShapes() {
  return (
    <>
      {/* Hoja */}
      <path
        d="M66 102 C48 88 44 58 58 36 C76 12 106 2 128 6 C126 44 108 80 82 96 C76 100 70 102 66 102 Z"
        fill="#2E7D32"
      />
      {/* Nervadura (espacio blanco) */}
      <path
        d="M68 96 C80 72 100 40 122 12"
        stroke="#fff"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Tallo curvo */}
      <path
        d="M66 102 C62 111 53 115 45 111 C40 109 37 105 37 100"
        stroke="#2E7D32"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      {/* Conexiones */}
      <g stroke="#F5B301" strokeWidth="5">
        <line x1="18" y1="100" x2="34" y2="84" />
        <line x1="34" y1="84" x2="50" y2="66" />
        <line x1="50" y1="66" x2="62" y2="50" />
        <line x1="84" y1="78" x2="100" y2="92" />
        <line x1="100" y1="92" x2="114" y2="106" />
      </g>
      {/* Nodos */}
      <g fill="#fff" stroke="#F5B301" strokeWidth="5">
        <circle cx="18" cy="100" r="7.5" />
        <circle cx="34" cy="84" r="7.5" />
        <circle cx="50" cy="66" r="7.5" />
        <circle cx="62" cy="50" r="7.5" />
        <circle cx="84" cy="78" r="7.5" />
        <circle cx="100" cy="92" r="7.5" />
        <circle cx="114" cy="106" r="7.5" />
      </g>
    </>
  );
}

/** Solo el isotipo (hoja + nodos), para espacios pequeños. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 120" className={className} aria-hidden>
      <MarkShapes />
    </svg>
  );
}

const WORDMARK = (
  <>
    <tspan fill="#1F6B33">agro</tspan>
    <tspan fill="#1B5FAA">conecta</tspan>
  </>
);

export default function Logo({
  layout = "inline",
  tagline = false,
  className,
}: {
  /** inline: isotipo + texto a la derecha (navbar). stacked: texto debajo (login/registro). */
  layout?: "inline" | "stacked";
  tagline?: boolean;
  className?: string;
}) {
  if (layout === "stacked") {
    return (
      <svg
        viewBox="0 0 380 250"
        className={className}
        role="img"
        aria-label="AgroConecta"
      >
        <g transform="translate(120,0)">
          <MarkShapes />
        </g>
        <text
          x="190"
          y="188"
          textAnchor="middle"
          fontFamily="var(--font-poppins), sans-serif"
          fontSize="56"
          fontWeight="800"
          letterSpacing="-2"
        >
          {WORDMARK}
        </text>
        {tagline && (
          <text
            x="190"
            y="224"
            textAnchor="middle"
            fontFamily="var(--font-poppins), sans-serif"
            fontSize="19"
            fontWeight="500"
            fill="#1F6B33"
          >
            Tecnología que impulsa al agricultor.
          </text>
        )}
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 460 130"
      className={className}
      role="img"
      aria-label="AgroConecta"
    >
      <g transform="translate(0,5)">
        <MarkShapes />
      </g>
      <text
        x="152"
        y="92"
        fontFamily="var(--font-poppins), sans-serif"
        fontSize="54"
        fontWeight="800"
        letterSpacing="-2"
      >
        {WORDMARK}
      </text>
    </svg>
  );
}
