import type { Memory } from "./types";

// Hechos aportados por la promoción. No hay fechas ni fotos históricas inventadas.
// Para agregar fotos: { src: '/media/recuerdos/dragon/archivo.webp', alt: 'Descripción real' }
export const memories: Memory[] = [
  {
    id: "dragon",
    navLabel: "Dragón",
    title: "Primer curso. Nuestro dragón.",
    description: "Empezamos construyendo un dragón.",
    photos: [],
    order: 1,
    composition: "construction",
  },
  {
    id: "robotica",
    navLabel: "Robótica",
    title: "Después vino la robótica.",
    description: "El proyecto del arca.",
    photos: [],
    order: 2,
    composition: "blueprint",
  },
  {
    id: "brasil",
    navLabel: "Brasil",
    title: "Y también nos fuimos hasta Brasil.",
    description: "Con el profe Danilo, fuera del aula.",
    photos: [],
    order: 3,
    composition: "travel",
  },
  {
    id: "sisco-edu",
    navLabel: "SISCO-EDU",
    title: "Ahora estamos con SISCO-EDU.",
    description: "Nuestro proyecto de grado.",
    photos: [],
    order: 4,
    composition: "workspace",
  },
];
