const API_URL = import.meta.env.VITE_API_URL;

interface LoginInput {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
    usuarioId: string;
    email: string;
}

export async function login(input: LoginInput): Promise<LoginResponse> {
  const respuesta = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    // El backend devuelve { error: "mensaje" } cuando algo sale mal.
    throw new Error(datos.error || "Error al iniciar sesion");
  }

  return datos;
}
interface Vacante {
    id: string;
    titulo: string;
    empresa: string;
    ubicacion: string | null;
    modalidad: string | null;
    salarioMin: number | null;
    salarioMax: number | null;
    moneda: string | null;
}

interface RespuestaVacantes {
    vacantes: Vacante[];
    total: number;
    pagina: number;
    totalPaginas: number;
}

export async function listarVacantes(params: {
    pagina: number;
    ubicacion?: string;
    modalidad?: string;
}): Promise<RespuestaVacantes> {
    const query = new URLSearchParams({ pagina: String(params.pagina), limite: "12" });
    if (params.ubicacion) query.set("ubicacion", params.ubicacion);
    if (params.modalidad) query.set("modalidad", params.modalidad);

    const respuesta = await fetch(`${API_URL}/vacantes?${query}`);
    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.error || "Error al cargar las vacantes");
    }

    return datos;
}