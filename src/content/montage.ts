// Each photograph appears once in the full journey. Index 4 is an older crop of
// colectivo.webp; indices 8/10 are near-identical poses, intentionally omitted.
export const montageGroups = [
  { title: "Candidato encontrado.", className: "formal", items: [7, "/media/recuerdos/extras/en-clase.webp", "/media/recuerdos/grupo-aula.webp"] },
  { title: "No hay dudas.", className: "playful", items: [2, 3, "/media/recuerdos/extras/selfie.webp"] },
  { title: "Estamos 100% seguros.", className: "confirmed", items: [1, 9, "/media/recuerdos/extras/colectivo.webp"] },
  { title: "Es por acá, profe.", className: "formal", items: [0, "/media/recuerdos/extras/mesa.webp"] },
] as const;
export const montageDescriptions: Record<string, string> = {
  "/media/recuerdos/extras/en-clase.webp": "El profe con camisa celeste en el aula, con la mano junto a la cara",
  "/media/recuerdos/grupo-aula.webp": "El curso junto al profe en el aula amarilla",
  "/media/recuerdos/extras/selfie.webp": "Selfie de dos alumnas junto al profe",
  "/media/recuerdos/extras/colectivo.webp": "El profe sonriendo en el colectivo con una almohada rosa",
  "/media/recuerdos/extras/mesa.webp": "El profe ante una mesa con mantel floral",
};
