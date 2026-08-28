import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones — AgroConecta",
  description: "Términos de uso de la plataforma AgroConecta.",
};

export default function TerminosPage() {
  return (
    <article className="prose mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-agro-800">
        Términos y Condiciones
      </h1>
      <p className="text-sm text-stone-500">Última actualización: hoy</p>

      <h2>1. Aceptación</h2>
      <p>
        Al usar AgroConecta aceptas estos términos. Si no estás de acuerdo, no
        uses la plataforma.
      </p>

      <h2>2. Roles</h2>
      <ul>
        <li>
          <strong>Agricultor:</strong> publica cosechas y responde consultas.
        </li>
        <li>
          <strong>Comprador:</strong> busca productos y contacta agricultores.
        </li>
        <li>
          <strong>Administrador:</strong> modera el sitio, verifica
          agricultores y aprueba contenido.
        </li>
      </ul>

      <h2>3. Verificación de agricultores</h2>
      <p>
        Para aparecer como Agricultor Verificado, el usuario debe subir un
        documento válido (PPA del MIDAGRI o recibo de agua de riego) y pasar
        validación manual. AgroConecta se reserva el derecho de rechazar o
        revocar la verificación.
      </p>

      <h2>4. Conducta</h2>
      <ul>
        <li>No publicar información falsa o engañosa.</li>
        <li>No acosar a otros usuarios.</li>
        <li>No usar AgroConecta para actividades ilegales.</li>
      </ul>

      <h2>5. Pagos</h2>
      <p>
        Las transacciones entre compradores y agricultores se acuerdan
        directamente entre las partes. AgroConecta no es parte del contrato
        de compraventa.
      </p>

      <h2>6. Limitación de responsabilidad</h2>
      <p>
        AgroConecta no garantiza la calidad, seguridad o legalidad de los
        productos ofrecidos. Cada usuario es responsable de verificar la
        información antes de realizar una transacción.
      </p>

      <h2>7. Modificaciones</h2>
      <p>
        Podemos modificar estos términos en cualquier momento. Los cambios
        entran en vigencia al publicarlos en esta página.
      </p>
    </article>
  );
}