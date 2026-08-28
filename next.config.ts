import type { NextConfig } from "next";

/**
 * Cabeceras de seguridad globales (OWASP recommended).
 * Se aplican a TODAS las rutas. CSP es estricto pero permite Unsplash/Resend.
 */
const securityHeaders = [
  // Forzar HTTPS por 1 año (incluye subdominios)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // Anti-clickjacking: no permitir ser embebido en iframes
  { key: "X-Frame-Options", value: "DENY" },
  // Anti-MIME sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // XSS protector básico
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Política de referrers
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Permisos del navegador: bloquear cosas que no usamos
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
  // CSP — ajusta si añades nuevos dominios externos
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.decolecta.com https://api.resend.com https://challenges.cloudflare.com",
      "frame-src https://challenges.cloudflare.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  // Forzar HTTPS cuando hay proxy (Vercel lo maneja automáticamente)
  async rewrites() {
    return [];
  },
  // Ocultar powered-by para no exponer Next.js
  poweredByHeader: false,
};

export default nextConfig;