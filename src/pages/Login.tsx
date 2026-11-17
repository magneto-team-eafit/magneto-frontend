import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AtSign, Lock, Eye, EyeOff, Check } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Field } from "../components/ui/Field";
import { Logo } from "../components/marca/Logo";
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
    if (!email.trim()) nuevosErrores.email = "Escribe tu correo electrónico.";
    if (!password.trim()) nuevosErrores.password = "Escribe tu contraseña.";
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
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-7 overflow-hidden bg-surface px-5 py-8">
      {/* Fondo decorativo: anillos concentricos (campo de atraccion) y circulos de color */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute left-1/2 top-[46%] size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-primary/25" />
        <span className="absolute left-1/2 top-[46%] size-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-primary/15" />
        <span className="absolute left-1/2 top-[46%] size-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-navy/10" />
        <span className="absolute left-1/2 top-[46%] size-[1400px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-navy/5" />
        <span className="absolute -left-40 -top-48 size-[520px] rounded-full bg-primary/10" />
        <span className="absolute -bottom-32 -right-28 size-[380px] rounded-full bg-navy/[0.07]" />
        <span className="absolute right-[17%] top-[13%] hidden size-[120px] rounded-full border-2 border-primary/40 md:block" />
        <span className="absolute bottom-[20%] left-[19%] size-[18px] rounded-full bg-primary/55" />
      </div>

      <div className="relative flex w-full max-w-[440px] flex-col gap-6 rounded-[20px] border border-border bg-card p-8 shadow-[0_16px_40px_rgba(30,50,73,0.10)] sm:p-9">
        <div className="flex justify-center">
          <Logo size={60} disposicion="columna" />
        </div>

        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-navy">
            Te damos la bienvenida
          </h1>
          <p className="text-sm text-muted-foreground">
            Inicia sesión para ver tus recomendaciones
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Correo electrónico" htmlFor="email" error={errors.email}>
            <div className="relative">
              <AtSign className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                className="h-12 rounded-xl pl-10"
              />
            </div>
          </Field>

          <Field label="Contraseña" htmlFor="password" error={errors.password}>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                className="h-12 rounded-xl pl-10 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy"
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </Field>

          {errorGeneral && <p className="text-sm text-danger">{errorGeneral}</p>}

          <Button type="submit" loading={loading} className="mt-1 h-[50px] w-full rounded-xl text-base font-bold">
            Iniciar sesión
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          ¿Primera vez aquí?{" "}
          <Link to="/registro" className="font-bold text-navy underline underline-offset-4">
            Crea tu cuenta
          </Link>
        </p>
      </div>

      <ul className="relative flex flex-wrap justify-center gap-2.5">
        {["Más de 2.800 vacantes", "Compatibilidad explicada", "Seguimiento de postulaciones"].map((t) => (
          <li
            key={t}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-[13px] font-semibold text-navy"
          >
            <Check className="size-4 text-[#15803D]" strokeWidth={2.5} />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
