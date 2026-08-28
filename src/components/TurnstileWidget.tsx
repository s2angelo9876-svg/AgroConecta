"use client";

import { useEffect, useRef, useState } from "react";

interface TurnstileWidgetProps {
  siteKey?: string;
  onVerify: (token: string) => void;
  onError?: () => void;
}

/**
 * Cloudflare Turnstile widget. Solo se monta si NEXT_PUBLIC_TURNSTILE_SITE_KEY
 * está configurado. Si no, se vuelve no-op (no rompe el demo).
 */
export default function TurnstileWidget({
  siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  onVerify,
  onError,
}: TurnstileWidgetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!siteKey || !ref.current) return;

    // Cargar el script de Turnstile una sola vez
    if (document.getElementById("cf-turnstile-script")) {
      setLoaded(true);
      return;
    }
    const s = document.createElement("script");
    s.id = "cf-turnstile-script";
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad";
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
    setLoaded(true);

    // @ts-expect-error global
    window.onTurnstileLoad = () => {
      // @ts-expect-error global
      window.turnstile?.render(ref.current, {
        sitekey: siteKey,
        callback: onVerify,
        "error-callback": onError,
      });
    };

    return () => {
      // @ts-expect-error global
      window.turnstile?.remove?.();
    };
  }, [siteKey, onVerify, onError]);

  if (!siteKey) return null; // No-op
  return (
    <div ref={ref} className="my-2" data-loaded={loaded ? "true" : "false"} />
  );
}