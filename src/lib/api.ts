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

interface PerfilData {
  id?: string;
  nombreCompleto: string;
  telefono: string | null;
  ubicacion: string | null;
  resumen: string;
  modalidadPreferida: string;
  expectativaSalarial: number;
  disponibilidad: string;
  completitud: number;
}

// Funcion pequena que arma el header de autenticacion, para no
// repetir "Bearer " + token en cada llamada protegida.
function authHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function obtenerPerfil(): Promise<{ perfil: PerfilData | null; completitud: number }> {
  const respuesta = await fetch(`${API_URL}/perfil`, {
    headers: authHeaders(),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.error || "Error al obtener el perfil");
  }

  return datos;
}

export async function actualizarPerfil(input: Omit<PerfilData, "id" | "completitud">): Promise<PerfilData> {
  const respuesta = await fetch(`${API_URL}/perfil`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(input),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.error || "Error al actualizar el perfil");
  }

  return datos;
}