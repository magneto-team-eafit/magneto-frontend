// Postulacion tal como la devuelve el backend (GET /postulaciones/:usuarioId).

export interface VacantePostulada {
  id: string;
  titulo: string;
  empresa: string;
  ubicacion: string;
  modalidad: string;
  nivelExperiencia: string | null;
}

export interface Postulacion {
  id: string;
  estado: string;
  createdAt: string;
  vacanteId: string;
  vacante: VacantePostulada;
}