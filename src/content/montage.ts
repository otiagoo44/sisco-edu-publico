// No repeats before acceptance. The restored closing collage deliberately
// reprises the professor's photographs, as requested by the promotion.
export const montageGroups = [
  { title: "Candidato encontrado.", className: "formal", items: [7, "/media/recuerdos/extras/en-clase.webp", 0] },
  { title: "No hay dudas.", className: "playful", items: [2, 3, "/media/recuerdos/extras/selfie.webp"] },
  { title: "Estamos 100% seguros.", className: "confirmed", items: [1, 9, "/media/recuerdos/extras/colectivo.webp"] },
  { title: "Es por acá, profe.", className: "formal", items: [5, "/media/recuerdos/extras/mesa.webp"] },
] as const;
export const montageDescriptions: Record<string, string> = {
  "/media/recuerdos/extras/en-clase.webp": "El profe con camisa celeste en el aula, con la mano junto a la cara",
  "/media/recuerdos/grupo-aula.webp": "El curso junto al profe en el aula amarilla",
  "/media/recuerdos/extras/selfie.webp": "Selfie de dos alumnas junto al profe",
  "/media/recuerdos/extras/colectivo.webp": "El profe sonriendo en el colectivo con una almohada rosa",
  "/media/recuerdos/extras/mesa.webp": "El profe ante una mesa con mantel floral",
};
