import type { Memory, MemoryMedia } from "./types";

export const memories: Memory[] = [
  {
    id: "dragon", navLabel: "Dragón", title: "¿Se acuerda de este?",
    description: "Nuestro dragón de robótica.",
    order: 1, composition: "construction",
    media: [
      { type: "image", order: 1, holdSeconds: 1.8, caption: "El esqueleto.", image: { src: "/media/recuerdos/dragon/esqueleto.webp", alt: "Estructura del dragón hecha con varillas, en el aula", fit: "contain" } },
      { type: "image", order: 2, holdSeconds: 1.8, caption: "Después, dentro de la caja.", image: { src: "/media/recuerdos/dragon/caja.webp", alt: "Dragón rojo y estructura de varillas guardados dentro de una caja de madera", fit: "contain" } },
    ],
  },
  {
    id: "robotica", navLabel: "Arca", title: "Y también estaba el arca.",
    description: "Sí, estábamos con los dos a la vez.",
    order: 2, composition: "blueprint",
    media: [
      { type: "image", order: 1, holdSeconds: 1.8, caption: "El interior del arca.", image: { src: "/media/recuerdos/arca/interior.webp", alt: "Interior del arca de madera con cableado visible", fit: "contain" } },
      { type: "image", order: 2, holdSeconds: 1.8, caption: "El proyecto completo.", image: { src: "/media/recuerdos/arca/completa.webp", alt: "Arca de madera completa sobre una mesa del aula", fit: "contain" } },
    ],
  },
  {
    id: "brasil", navLabel: "Brasil", title: "Y también nos fuimos hasta Brasil.",
    description: "Un rato de playa, fuera del aula.", order: 3, composition: "travel",
    media: [
      { type: "image", order: 1, holdSeconds: 1.8, caption: "Frente al mar.", image: { src: "/media/recuerdos/brasil/frente-al-mar.webp", alt: "Compañero de espaldas frente a las olas, con una camiseta del proyecto Arca", fit: "contain" } },
      { type: "image", order: 2, holdSeconds: 1.8, caption: "Música en la playa.", image: { src: "/media/recuerdos/brasil/playa.webp", alt: "Un compañero sentado en la arena con auriculares, junto a otros compañeros", fit: "contain" } },
      { type: "video", order: 3, chapter: "brasil", src: "/media/videos/brasil-playa.mp4", poster: "/media/videos/brasil-playa.webp", alt: "Una persona corre junto a un perro por la orilla del mar", caption: "También quedó en video.", duration: 5.734, width: 720, height: 1280, sound: "available" },
    ],
  },
  {
    id: "competencias", navLabel: "Competencias", title: "Entre competencias...", description: "También había tiempo para esto.", order: 4, composition: "competition",
    media: [
      { type: "image", order: 1, holdSeconds: 1.8, caption: "En la competencia.", image: { src: "/media/videos/competencia-contexto.webp", alt: "Público sentado en un evento escolar al aire libre, frente a un edificio verde", fit: "contain" } },
      { type: "video", order: 2, chapter: "competencias", src: "/media/videos/danilo-competencia.mp4", poster: "/media/videos/danilo-competencia.webp", alt: "Danilo sonríe y mueve los brazos al ritmo de la música entre el público de la competencia", caption: "El profe también se sumó.", duration: 5.91, width: 464, height: 832, sound: "available" },
    ],
  },
  {
    id: "sisco-edu", navLabel: "SISCO-EDU", title: "Ahora estamos con SISCO-EDU.", description: "Ahora nos toca terminar SISCO-EDU.", order: 5, composition: "workspace",
    media: [
      { type: "image", order: 1, holdSeconds: 1.8, caption: "Nosotros, en el aula.", image: { src: "/media/recuerdos/grupo-aula.webp", alt: "Foto del curso junto al profe en el aula de paredes amarillas", fit: "contain" } },
    ],
  },
];

// Su ubicación no está confirmada. No se atribuyen a un viaje o competencia.
export const extraMemories: MemoryMedia[] = [
  { type: "image", order: 1, caption: "En clase.", image: { src: "/media/recuerdos/extras/en-clase.webp", alt: "El profe en el aula, junto a una computadora", fit: "contain" } },
  { type: "image", order: 2, caption: "Una foto juntos.", image: { src: "/media/recuerdos/extras/selfie.webp", alt: "Selfie de dos alumnas junto al profe", fit: "contain" } },
  { type: "image", order: 3, caption: "En el colectivo.", image: { src: "/media/recuerdos/extras/colectivo.webp", alt: "El profe sonriendo en un colectivo con una almohada rosa alrededor de la cabeza", fit: "contain" } },
  { type: "image", order: 4, caption: "Otro recuerdo.", image: { src: "/media/recuerdos/extras/mesa.webp", alt: "El profe sentado frente a una mesa con mantel de flores", fit: "contain" } },
  { type: "image", order: 5, caption: "El profe.", image: { src: "/media/recuerdos/extras/retrato.webp", alt: "Retrato informal del profe con camisa azul oscura", fit: "contain" } },
  { type: "video", order: 6, chapter: "extras", src: "/media/videos/sombrero.mp4", poster: "/media/videos/sombrero.webp", alt: "El profe lleva un sombrero de vaquero y sonríe en el aula", caption: "Con sombrero.", duration: 3.8, width: 576, height: 1024, sound: "available" },
  { type: "video", order: 7, chapter: "extras", src: "/media/videos/encuentro.mp4", poster: "/media/videos/encuentro.webp", alt: "Tres personas de pie al frente de una reunión en un salón con un texto bíblico en la pared", caption: "Un encuentro compartido.", duration: 16.16, width: 720, height: 1280, sound: "available" },
  { type: "video", order: 8, chapter: "extras", src: "/media/videos/gesto.mp4", poster: "/media/videos/gesto.webp", alt: "El profe hace un gesto con la mano cerca de la cara, detrás de una división del aula", caption: "Un segundo que quedó grabado.", duration: 1.15, width: 464, height: 832, sound: "silent" },
];
