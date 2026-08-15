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