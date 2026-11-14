# Profile Manager (Magneto) - Frontend

Aplicación web de la plataforma de gestión de perfiles de empleo y recomendación de vacantes para Magneto.
El candidato completa su perfil por pasos, explora vacantes, recibe recomendaciones y sigue sus postulaciones
en un tablero.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- React Router
- Iconos de lucide-react

## Puesta en marcha

Requisitos: Node.js 20 o superior y el [backend](https://github.com/magneto-team-eafit/magneto-backend) corriendo.

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Crear el archivo `.env` a partir del ejemplo:
   ```bash
   cp .env.example .env
   ```
   Debe contener `VITE_API_URL=http://localhost:4000`. Si se cambia el `.env`, hay que reiniciar el servidor de Vite.
3. Arrancar en modo desarrollo y abrir la dirección que muestre la terminal (normalmente `http://localhost:5173`):
   ```bash
   npm run dev
   ```

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Revisa los tipos y genera la versión de producción |
| `npm run lint` | Revisa el estilo del código |
| `npm run preview` | Sirve la versión de producción |

## Pantallas

| Ruta | Pantalla |
|---|---|
| `/login`, `/registro` | Acceso |
| `/dashboard` | Mi perfil: asistente de 5 pasos con barra de completitud |
| `/vacantes` | Catálogo con búsqueda y filtros |
| `/vacantes/:id` | Detalle de una vacante y botón para postularse |
| `/recomendaciones` | Vacantes recomendadas con su explicación |
| `/tablero` | Tablero de postulaciones por estado, con botones para cambiar de estado y ver la actividad de cada tarjeta |

Todas, salvo el acceso, están protegidas por sesión y comparten la barra de navegación (`components/layout`),
que incluye la campana de notificaciones.

## Estructura de `src`

| Carpeta | Contenido |
|---|---|
| `pages/` | Una pantalla por ruta |
| `components/ui/` | Componentes base reutilizables (botón, campos, selector...) |
| `components/layout/` | Barra de navegación y estructura común de las pantallas con sesión |
| `components/perfil/` | Pasos del asistente del perfil, barra de completitud e indicador de pasos |
| `components/tablero/` | Columnas y tarjetas del tablero de postulaciones |
| `lib/` | Llamadas a la API, validaciones y utilidades |
| `types/` | Tipos de los datos que devuelve el backend |

## Diseño

La identidad de la plataforma son los colores de Magneto, definidos como variables en `src/index.css`:
verde `#0CBB4E` (acciones principales) y azul oscuro `#1A324C` (texto y navegación). Para mantener la
coherencia visual, usar los componentes de `components/ui` y las clases de color del tema en lugar de colores sueltos.

## Trabajo en equipo

Cada cambio va en una rama propia creada desde `main` y entra por Pull Request con revisión de otra vertical.
Nadie sube directo a `main`.