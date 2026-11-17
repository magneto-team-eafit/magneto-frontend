export const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:4000";
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
        throw new Error(datos.error || "Error al iniciar sesión");
    }
    return datos;
}

interface RegistroInput {
    email: string;
    password: string;
}

interface RegistroResponse {
    id: string;
    email: string;
    createdAt: string;
}

export async function registrar(input: RegistroInput): Promise<RegistroResponse> {
    const respuesta = await fetch(`${API_URL}/auth/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    const datos = await respuesta.json();
    if (!respuesta.ok) {
        throw new Error(datos.error || "Error al crear la cuenta");
    }
    return datos;
}

export function authHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

export interface Vacante {
    id: string;
    titulo: string;
    empresa: string;
    ubicacion: string | null;
    modalidad: string | null;
    nivelExperiencia: string | null;
    salarioMin: number | null;
    salarioMax: number | null;
    moneda: string | null;
    descripcion: string;
    urlOriginal: string | null;
    fechaPublicacion: string | null;
    // true = rango estimado (la oferta no decia el salario)
    salarioEstimado: boolean;
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
    nivelExperiencia?: string;
    salarioMin?: number;
    salarioMax?: number;
    q?: string;
}): Promise<RespuestaVacantes> {
    const query = new URLSearchParams({ pagina: String(params.pagina), limite: "12" });
    if (params.ubicacion) query.set("ubicacion", params.ubicacion);
    if (params.modalidad) query.set("modalidad", params.modalidad);
    if (params.nivelExperiencia) query.set("nivelExperiencia", params.nivelExperiencia);
    if (params.salarioMin !== undefined) query.set("salarioMin", String(params.salarioMin));
    if (params.salarioMax !== undefined) query.set("salarioMax", String(params.salarioMax));
    if (params.q) query.set("q", params.q);
    const respuesta = await fetch(`${API_URL}/vacantes?${query}`);
    const datos = await respuesta.json();
    if (!respuesta.ok) {
        throw new Error(datos.error || "Error al cargar las vacantes");
    }
    return datos;
}


// Puntaje por criterio y su maximo posible. Los maximos vienen del backend,
// asi el frontend no tiene los pesos escritos a mano.
export interface DesgloseRecomendacion {
    habilidades: number;
    palabrasClave: number;
    ubicacion: number;
    modalidad: number;
    maximos: {
        habilidades: number;
        palabrasClave: number;
        ubicacion: number;
        modalidad: number;
    };
}

export interface Recomendacion {
    vacanteId: string;
    titulo: string;
    empresa: string;
    ubicacion: string | null;
    modalidad: string | null;
    score: number;
    desglose: DesgloseRecomendacion;
    motivos: string[];
}

export interface EntradaHistorial {
    id: string;
    usuarioId: string;
    vacanteId: string;
    score: number;
    desglose: DesgloseRecomendacion;
    motivos: string[];
    createdAt: string;
    vacante: {
        titulo: string;
        empresa: string;
        ubicacion: string | null;
        modalidad: string | null;
    };
}

export async function obtenerRecomendaciones(
    usuarioId: string
): Promise<Recomendacion[]> {
    const respuesta = await fetch(
        `${API_URL}/recomendaciones/${encodeURIComponent(usuarioId)}`,
        { headers: authHeaders() }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            datos.error || "Error al obtener las recomendaciones."
        );
    }

    return datos as Recomendacion[];
}

export async function obtenerHistorialRecomendaciones(
    usuarioId: string
): Promise<EntradaHistorial[]> {
    const respuesta = await fetch(
        `${API_URL}/recomendaciones/${encodeURIComponent(usuarioId)}/historial`,
        { headers: authHeaders() }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            datos.error || "Error al consultar el historial."
        );
    }

    return datos as EntradaHistorial[];
}

// "No me interesa": la vacante deja de aparecer en las recomendaciones.
export async function descartarRecomendacion(
    usuarioId: string,
    vacanteId: string
): Promise<void> {
    const respuesta = await fetch(
        `${API_URL}/recomendaciones/${encodeURIComponent(usuarioId)}/descartes`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeaders() },
            body: JSON.stringify({ vacanteId }),
        }
    );

    if (!respuesta.ok) {
        const datos = await respuesta.json().catch(() => ({}));
        throw new Error(datos.error || "No se pudo descartar la vacante.");
    }
}

export async function obtenerVacante(id: string): Promise<Vacante> {
    const respuesta = await fetch(`${API_URL}/vacantes/${id}`);
    const datos = await respuesta.json();
    if (!respuesta.ok) {
        throw new Error(datos.error || "Error al cargar la vacante");
    }
    return datos;
}
