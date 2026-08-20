import {
  Sprout,
  Mail,
  Phone,
  Globe,
  Facebook,
  Instagram,
  MessageCircle,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-agro-900 text-agro-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <Sprout size={20} />
            </span>
            <span className="text-xl font-extrabold">
              <span className="text-agro-200">Agro</span>
              <span className="text-sun-400">Conecta</span>
            </span>
          </div>
          <p className="mt-4 text-lg font-semibold text-white">
            ¡Gracias por usar AgroConecta!
          </p>
          <p className="mt-1 text-sm text-agro-200">
            Del campo al comprador, sin intermediarios.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-agro-200">
            Contacto
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={16} /> contacto@agroconecta.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +51 987 654 321
            </li>
            <li className="flex items-center gap-2">
              <Globe size={16} /> www.agroconecta.pe
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-agro-200">
            Síguenos
          </h3>
          <div className="mt-4 flex gap-3">
            {[Facebook, Instagram, MessageCircle].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Red social"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 bg-agro-950/40 py-4 text-center text-xs text-agro-200">
        © {year} AgroConecta. Todos los derechos reservados.
      </div>
    </footer>
  );
}
