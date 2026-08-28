import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad — AgroConecta",
  description: "Cómo AgroConecta recopila, usa y protege tus datos personales.",
};

export default function PrivacidadPage() {
  return (
    <article className="prose mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-agro-800">
        Política de Privacidad
      </h1>
      <p className="text-sm text-stone-500">Última actualización: hoy</p>

      <h2>1. Datos que recopilamos</h2>
      <ul>
        <li>
          <strong>Cuenta:</strong> nombre, correo electrónico, teléfono
          opcional.
        </li>
        <li>
          <strong>Agricultores:</strong> DNI, dirección, coordenadas, foto de
          documento (PPA o recibo de agua) para verificación.
        </li>
        <li>
          <strong>Publicaciones:</strong> producto, descripción, fotos,
          ubicación, precio.
        </li>
        <li>
          <strong>Uso:</strong> dirección IP, dispositivo, páginas visitadas.
        </li>
      </ul>

      <h2>2. Para qué usamos tus datos</h2>
      <ul>
        <li>Crear y mantener tu cuenta.</li>
        <li>Permitir la interacción entre compradores y vendedores.</li>
        <li>Verificar la identidad de los agricultores.</li>
        <li>Mejorar el servicio.</li>
      </ul>

      <h2>3. Almacenamiento y seguridad</h2>
      <p>
        Los datos se guardan en Supabase (Postgres con Row Level Security).
        Los documentos de verificación se almacenan en un bucket privado con
        URL firmadas. La contraseña nunca se almacena en texto plano.
      </p>

      <h2>4. Pagos</h2>
      <p>
        AgroConecta no procesa pagos en su fase demo. Cuando se integre una
        pasarela, los datos de tarjeta se tokenizarán directamente con el
        proveedor; AgroConecta nunca tendrá acceso al número completo.
      </p>

      <h2>5. Tus derechos</h2>
      <p>
        Puedes solicitar acceso, rectificación o eliminación de tus datos
        escribiendo a <strong>contacto@agroconecta.com</strong>.
      </p>

      <h2>6. Cookies</h2>
      <p>
        Usamos cookies HttpOnly y Secure para mantener tu sesión iniciada.
        No usamos cookies publicitarias de terceros.
      </p>
    </article>
  );
}