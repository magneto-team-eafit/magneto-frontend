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