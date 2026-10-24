import { access } from "node:fs/promises";
import path from "node:path";
import { memories } from "../src/content/memories.ts";
import { students } from "../src/content/students.ts";
import { publishedStudents } from "../src/content/validation.ts";

function unique(items, label) {
  const ids = new Set();
  for (const item of items) {
    if (!item.id?.trim() || ids.has(item.id))
      throw new Error(label + ": identificador vacío o repetido: " + item.id);
    if (!Number.isFinite(item.order))
      throw new Error(label + ": order debe ser un número.");
    ids.add(item.id);
  }
}
async function imageExists(image) {
  if (!image.alt?.trim())
    throw new Error("Falta la descripción alt de " + image.src);
  const root = path.resolve("public");
  const file = path.resolve(root, "." + image.src);
  if (!image.src.startsWith("/media/") || !file.startsWith(root + path.sep))
    throw new Error("Usá una ruta pública dentro de /media/: " + image.src);
  try {
    await access(file);
  } catch {
    throw new Error(
      "No se encuentra public" +
        image.src +
        ". Cargá la foto o quitá esa referencia.",
    );
  }
}
unique(memories, "Recuerdos");
unique(students, "Alumnos");
for (const memory of memories) {
  if (memory.date && memory.date.confirmed !== true)
    throw new Error("Sólo se admiten fechas confirmadas: " + memory.id);
  for (const image of memory.photos) await imageExists(image);
}
const published = publishedStudents(students);
for (const student of published) await imageExists(student.photo);
console.log(
  memories.length +
    " recuerdos; " +
    memories.reduce((n, m) => n + m.photos.length, 0) +
    " fotos históricas; " +
    published.length +
    " mensajes publicables.",
);
