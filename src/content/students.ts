import type { Student } from "./types";

// Completá cada registro y cambiá status a 'published' para mostrarlo.
// Los borradores incompletos sólo generan un espacio pendiente en desarrollo.
// No se han recibido todavía nombres, fotos ni declaraciones de los alumnos.
export const students: Student[] = [
  {
    id: "pendiente-01",
    name: "",
    photo: null,
    message: "",
    order: 1,
    status: "draft",
  },
];
