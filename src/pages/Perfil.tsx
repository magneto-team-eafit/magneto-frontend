import { Link } from "react-router-dom";
import { useState, useEffect, type FormEvent } from "react";
import { User, Phone, MapPin, FileText, Briefcase, DollarSign, Clock } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Field } from "../components/ui/Field";
import { obtenerPerfil, actualizarPerfil } from "../lib/api";

export function Perfil() {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [resumen, setResumen] = useState("");
  const [modalidadPreferida, setModalidadPreferida] = useState("");
  const [expectativaSalarial, setExpectativaSalarial] = useState("");
  const [disponibilidad, setDisponibilidad] = useState("");

  const [completitud, setCompletitud] = useState(0);
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [errorGeneral, setErrorGeneral] = useState("");

  // Al entrar a la pantalla, traemos el perfil actual (si ya existe)
  // para pre-llenar el formulario, en vez de empezar siempre en blanco.
  useEffect(() => {
    async function cargar() {
      try {
        const { perfil, completitud } = await obtenerPerfil();

        if (perfil) {
          setNombreCompleto(perfil.nombreCompleto);
          setTelefono(perfil.telefono ?? "");
          setUbicacion(perfil.ubicacion ?? "");
          setResumen(perfil.resumen);
          setModalidadPreferida(perfil.modalidadPreferida);
          setExpectativaSalarial(perfil.expectativaSalarial ? String(perfil.expectativaSalarial) : "");
          setDisponibilidad(perfil.disponibilidad);
        } else {
          // Perfil nuevo: usamos el nombre que quedo pendiente del
          // registro (ver comentario en Registro.tsx).
          const nombrePendiente = localStorage.getItem("nombrePendiente");
          if (nombrePendiente) setNombreCompleto(nombrePendiente);
        }

        setCompletitud(completitud);
      } catch (error) {
        if (error instanceof Error) setErrorGeneral(error.message);
      } finally {
        setCargandoInicial(false);
      }
    }

    cargar();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorGeneral("");
    setMensaje("");

    if (!nombreCompleto.trim()) {
      setErrorGeneral("El nombre completo es obligatorio.");
      return;
    }

    setGuardando(true);
    try {
      const resultado = await actualizarPerfil({
        nombreCompleto,
        telefono: telefono || null,
        ubicacion: ubicacion || null,
        resumen,
        modalidadPreferida,
        expectativaSalarial: expectativaSalarial ? Number(expectativaSalarial) : 0,
        disponibilidad,
      });

      setCompletitud(resultado.completitud);
      setMensaje("Perfil guardado correctamente.");
      localStorage.removeItem("nombrePendiente");
    } catch (error) {
      if (error instanceof Error) setErrorGeneral(error.message);
    } finally {
      setGuardando(false);
    }
  }

  if (cargandoInicial) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-sm text-muted-foreground">Cargando tu perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface px-6 py-10">
      <div className="mx-auto max-w-[600px]">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-navy">Tu perfil</h1>
          <p className="text-sm text-muted-foreground">
            <p className="mt-3 text-sm">
              <Link to="/vacantes" className="font-semibold text-primary underline underline-offset-4">
                Ver vacantes disponibles →
              </Link>
            </p>
            Con estos datos las empresas podrán comunicarse contigo y te mostramos vacantes 
            cerca de ti.
          </p>
        </div>

        {/* Barra de completitud: usa directamente el numero que calculo
            calcularCompletitud() en el backend, no un calculo duplicado aqui. */}
        <div className="mb-8 rounded-xl border border-border bg-card p-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-navy">Completitud del perfil</span>
            <span className="font-semibold text-primary">{completitud}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${completitud}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6">
          <Field label="Nombre completo" htmlFor="nombreCompleto">
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="nombreCompleto"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                className="pl-10"
              />
            </div>
          </Field>

          <Field label="Telefono" htmlFor="telefono">
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="telefono"
                placeholder="300 000 0000"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="pl-10"
              />
            </div>
          </Field>

          <Field label="Ubicacion" htmlFor="ubicacion">
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="ubicacion"
                placeholder="Medellin, Antioquia"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                className="pl-10"
              />
            </div>
          </Field>

          <Field label="Resumen profesional" htmlFor="resumen">
            <div className="relative">
              <FileText className="pointer-events-none absolute left-3 top-3 size-5 text-muted-foreground" />
              <textarea
                id="resumen"
                rows={3}
                placeholder="Cuentanos brevemente sobre tu experiencia..."
                value={resumen}
                onChange={(e) => setResumen(e.target.value)}
                className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>
          </Field>

          <Field label="Modalidad preferida" htmlFor="modalidadPreferida">
            <div className="relative">
              <Briefcase className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <select
                id="modalidadPreferida"
                value={modalidadPreferida}
                onChange={(e) => setModalidadPreferida(e.target.value)}
                className="w-full appearance-none rounded-lg border border-border bg-card py-2.5 pl-10 pr-3 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              >
                <option value="">Selecciona una opcion</option>
                <option value="Remoto">Remoto</option>
                <option value="Presencial">Presencial</option>
                <option value="Hibrido">Hibrido</option>
              </select>
            </div>
          </Field>

          <Field label="Expectativa salarial (COP)" htmlFor="expectativaSalarial">
            <div className="relative">
              <DollarSign className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="expectativaSalarial"
                type="number"
                placeholder="3000000"
                value={expectativaSalarial}
                onChange={(e) => setExpectativaSalarial(e.target.value)}
                className="pl-10"
              />
            </div>
          </Field>

          <Field label="Disponibilidad" htmlFor="disponibilidad">
            <div className="relative">
              <Clock className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <select
                id="disponibilidad"
                value={disponibilidad}
                onChange={(e) => setDisponibilidad(e.target.value)}
                className="w-full appearance-none rounded-lg border border-border bg-card py-2.5 pl-10 pr-3 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              >
                <option value="">Selecciona una opcion</option>
                <option value="Inmediata">Inmediata</option>
                <option value="1-2 semanas">1-2 semanas</option>
                <option value="1 mes">1 mes o mas</option>
              </select>
            </div>
          </Field>

          {mensaje && <p className="text-sm text-primary">{mensaje}</p>}
          {errorGeneral && <p className="text-sm text-danger">{errorGeneral}</p>}

          <Button type="submit" loading={guardando} className="w-full">
            Guardar perfil
          </Button>
        </form>
      </div>
    </div>
  );
}