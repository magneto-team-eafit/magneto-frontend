import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AtSign, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Field } from "../components/ui/Field";
import { login } from "../lib/api";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorGeneral("");

    const nuevosErrores: typeof errors = {};
    if (!email.trim()) nuevosErrores.email = "Escribe tu correo electronico.";
    if (!password.trim()) nuevosErrores.password = "Escribe tu contrasena.";
    setErrors(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setLoading(true);
    try {
      const resultado = await login({ email, password });

      // Guardamos el token en localStorage: persiste aunque el usuario
      // cierre la pestana o recargue la pagina, a diferencia de guardarlo
      // solo en un useState (que se perderia al recargar).
      localStorage.setItem("token", resultado.token);
      localStorage.setItem("usuarioId", resultado.usuarioId);

      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setErrorGeneral(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Panel izquierdo: solo desktop */}
        <div className="hidden flex-col justify-between bg-navy p-10 text-navy-foreground lg:flex">
          <span className="text-base font-semibold tracking-tight">
            Profile Manager · Magneto
          </span>
          <blockquote className="max-w-md text-3xl font-semibold leading-tight">
            "Dame tu hoja de vida y tus expectativas; nosotros te conseguimos entrevistas."
          </blockquote>
          <p className="text-sm opacity-70">© {new Date().getFullYear()} Magneto</p>
        </div>

        {/* Derecha: formulario */}
        <div className="flex flex-col items-center justify-center px-6 py-12 sm:px-12">
          <div className="mb-8 text-base font-semibold tracking-tight text-navy lg:hidden">
            Profile Manager · Magneto
          </div>

          <div className="w-full max-w-[400px]">
            <div className="mb-8 flex flex-col gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-navy">Inicia sesion</h1>
              <p className="text-sm text-muted-foreground">
                Continua gestionando tu busqueda de empleo
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Field label="Correo electronico" htmlFor="email" error={errors.email}>
                <div className="relative">
                  <AtSign className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!errors.email}
                    className="pl-10"
                  />
                </div>
              </Field>

              <Field label="Contrasena" htmlFor="password" error={errors.password}>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!errors.password}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy"
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </Field>

              {errorGeneral && (
                <p className="text-sm text-danger">{errorGeneral}</p>
              )}

              <Button type="submit" loading={loading} className="w-full">
                Iniciar sesion
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                No tienes cuenta?{" "}
                <Link to="/registro" className="font-semibold text-navy underline underline-offset-4">
                  Registrate aqui
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}