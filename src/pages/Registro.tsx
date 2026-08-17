import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AtSign, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Field } from "../components/ui/Field";
import { Checkbox } from "../components/ui/Checkbox";
import { registrar, login } from "../lib/api";

// Regla de negocio simple para medir que tan fuerte es el password,
// solo para dar retroalimentacion visual. La validacion real y
// definitiva siempre pasa por el backend, esto es solo UX.
function calcularFuerza(password: string): number {
  let puntos = 0;
  if (password.length >= 8) puntos++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) puntos++;
  if (/[0-9]/.test(password)) puntos++;
  return puntos;
}

export function Registro() {
  const navigate = useNavigate();
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [loading, setLoading] = useState(false);

  const fuerza = calcularFuerza(password);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorGeneral("");

    const nuevosErrores: Record<string, string> = {};
    if (!nombreCompleto.trim()) nuevosErrores.nombreCompleto = "Escribe tu nombre completo.";
    if (!email.trim()) nuevosErrores.email = "Escribe tu correo electronico.";
    if (password.length < 8) nuevosErrores.password = "Minimo 8 caracteres.";
    if (confirmarPassword !== password) nuevosErrores.confirmarPassword = "Las contrasenas no coinciden.";
    if (!aceptaTerminos) nuevosErrores.terminos = "Debes aceptar los terminos para continuar.";
    setErrors(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setLoading(true);
    try {
      // El registro solo crea el usuario (email + password). El nombre
      // completo vive en el perfil, asi que despues de registrar hacemos
      // login automatico para tener el token, y en el siguiente paso
      // (que construimos despues) se guarda el nombre en /perfil.
      await registrar({ email, password });
      const resultado = await login({ email, password });

      localStorage.setItem("token", resultado.token);
      localStorage.setItem("usuarioId", resultado.usuarioId);
      localStorage.setItem("nombrePendiente", nombreCompleto);

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
        <div className="hidden flex-col justify-between bg-navy p-10 text-navy-foreground lg:flex">
          <span className="text-base font-semibold tracking-tight">
            Profile Manager · Magneto
          </span>
          <blockquote className="max-w-md text-3xl font-semibold leading-tight">
            "Dame tu hoja de vida y tus expectativas; nosotros te conseguimos entrevistas."
          </blockquote>
          <p className="text-sm opacity-70">© {new Date().getFullYear()} Magneto</p>
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-12 sm:px-12">
          <div className="mb-8 text-base font-semibold tracking-tight text-navy lg:hidden">
            Profile Manager · Magneto
          </div>

          <div className="w-full max-w-[400px]">
            <div className="mb-8 flex flex-col gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-navy">Crea tu cuenta</h1>
              <p className="text-sm text-muted-foreground">
                Empecemos a construir tu perfil profesional
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Field label="Nombre completo" htmlFor="nombreCompleto" error={errors.nombreCompleto}>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="nombreCompleto"
                    placeholder="Laura Gomez"
                    value={nombreCompleto}
                    onChange={(e) => setNombreCompleto(e.target.value)}
                    error={!!errors.nombreCompleto}
                    className="pl-10"
                  />
                </div>
              </Field>

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
                {password.length > 0 && (
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i < fuerza ? "bg-primary" : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </Field>

              <Field label="Confirmar contrasena" htmlFor="confirmarPassword" error={errors.confirmarPassword}>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmarPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                    error={!!errors.confirmarPassword}
                    className="pl-10"
                  />
                </div>
              </Field>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-start gap-2.5">
                  <Checkbox
                    id="terminos"
                    checked={aceptaTerminos}
                    onChange={(e) => setAceptaTerminos(e.target.checked)}
                  />
                  <label htmlFor="terminos" className="text-sm leading-tight text-muted-foreground">
                    Acepto los terminos y condiciones y la politica de tratamiento de datos
                  </label>
                </div>
                {errors.terminos && <p className="text-xs text-danger">{errors.terminos}</p>}
              </div>

              {errorGeneral && <p className="text-sm text-danger">{errorGeneral}</p>}

              <Button type="submit" loading={loading} className="w-full">
                Crear cuenta
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Ya tienes cuenta?{" "}
                <Link to="/login" className="font-semibold text-navy underline underline-offset-4">
                  Inicia sesion
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}