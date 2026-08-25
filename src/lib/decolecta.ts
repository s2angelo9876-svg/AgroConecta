/**
 * Cliente de Decolecta (RENIEC/ApiPerú-like).
 * Solo se usa desde Server Actions — nunca exponer el token al cliente.
 *
 * https://decolecta.com — endpoint esperado: GET /api/v1/dni?dni=NUMBER
 *   Authorization: Bearer <sk_xxx>
 */
export interface DecolectaDniResponse {
  full_name: string;
  names: string;
  surname: string;
  document_number: string;
}

export interface DecolectaError {
  message: string;
  code?: number;
}

const ENDPOINT = "https://api.decolecta.com/api/v1/dni";

export async function lookupDni(dni: string): Promise<DecolectaDniResponse> {
  if (!/^\d{8}$/.test(dni)) {
    throw new Error("El DNI debe tener 8 dígitos.");
  }

  const token = process.env.DECOLECTA_API_KEY;
  if (!token) {
    throw new Error(
      "DECOLECTA_API_KEY no está configurada. Agrega la clave en .env.local (ver .env.example)."
    );
  }

  const url = `${ENDPOINT}?dni=${dni}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    // Cacheamos poco (DNI podría actualizarse en RENIEC)
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Token de Decolecta inválido o expirado.");
    }
    if (res.status === 404) {
      throw new Error("DNI no existe en RENIEC.");
    }
    throw new Error(`Decolecta respondió con error ${res.status}.`);
  }

  const data = await res.json();

  // Normalizar: la API puede devolver varias formas
  const fullName =
    data.full_name ||
    data.nombre_completo ||
    [data.nombres, data.apellido_paterno, data.apellido_materno]
      .filter(Boolean)
      .join(" ")
      .trim();

  const names = data.names || data.nombres || "";
  const surname = data.surname || data.apellidos || "";

  return {
    full_name: fullName,
    names,
    surname,
    document_number: data.document_number || data.dni || dni,
  };
}