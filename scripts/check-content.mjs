import { access, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { execFileSync } from "node:child_process";
import { memories, extraMemories } from "../src/content/memories.ts";
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
    await sharp(file).stats();
  } catch {
    throw new Error(
      "No se encuentra public" +
        image.src +
        ". Cargá la foto o quitá esa referencia.",
    );
  }
}
async function mediaExists(items, chapter) {
  const orders = new Set();
  if (!items.length) throw new Error("Capítulo sin material: " + chapter);
  let lastOrder = -Infinity;
  for (const media of items) {
    if (!Number.isFinite(media.order) || orders.has(media.order) || media.order <= lastOrder)
      throw new Error("Orden de medios inválido: " + chapter);
    orders.add(media.order); lastOrder = media.order;
    if (!media.caption?.trim()) throw new Error("Falta caption: " + chapter);
    if (media.type === "image") {
      await imageExists(media.image);
      if (media.holdSeconds !== undefined && media.holdSeconds < 1.5) throw new Error("Tiempo insuficiente de lectura");
    } else if (media.type === "video") {
      await imageExists({src:media.poster,alt:media.alt});
      const root = path.resolve('public/media');
      const file = path.resolve('public', '.' + media.src);
      if (!media.src.startsWith('/media/') || !file.startsWith(root + path.sep) || !media.src.endsWith('.mp4')) throw new Error('Ruta de video inválida: ' + media.src);
      if (media.chapter !== chapter || !media.alt?.trim() || !['available','silent'].includes(media.sound)) throw new Error('Metadatos de video incompletos: ' + media.src);
      if (![media.width,media.height,media.duration].every(n=>Number.isFinite(n)&&n>0)) throw new Error('Dimensiones o duración inválidas: ' + media.src);
      const start=media.start??0, end=media.end??media.duration;
      if (!(start >= 0 && end > start && end <= media.duration)) throw new Error('Fragmento inválido: ' + media.src);
      const bytes=await readFile(file);
      if (bytes.toString('ascii',4,8)!=='ftyp' || !bytes.includes(Buffer.from('avc1'))) throw new Error('Se requiere MP4/H.264: '+media.src);
      if (media.sound==='available' && !bytes.includes(Buffer.from('mp4a'))) throw new Error('Falta pista AAC: '+media.src);
      if (bytes.indexOf(Buffer.from('moov')) > bytes.indexOf(Buffer.from('mdat'))) throw new Error('Video sin faststart: '+media.src);
      try {
        const result = JSON.parse(execFileSync('ffprobe',['-v','error','-show_format','-show_streams','-of','json',file],{encoding:'utf8'}));
        const video=result.streams.find(s=>s.codec_type==='video');
        if(Math.abs(Number(result.format.duration)-media.duration)>0.15 || video.width!==media.width || video.height!==media.height) throw new Error('Metadatos no coinciden: '+media.src);
      } catch(error) { if(error.code!=='ENOENT') throw error; }
    } else throw new Error('Tipo de medio inválido');
  }
}
unique(memories, "Recuerdos");
unique(students, "Alumnos");
for (const memory of memories) {
  if (memory.date && memory.date.confirmed !== true)
    throw new Error("Sólo se admiten fechas confirmadas: " + memory.id);
  await mediaExists(memory.media, memory.id);
}
await mediaExists(extraMemories, 'extras');
const published = publishedStudents(students);
if (published.length !== students.filter(s=>s.status==='published').length) throw new Error('Alumno publicado incompleto');
for (const student of published) await imageExists(student.photo);
const allMedia = [...memories.flatMap(m=>m.media), ...extraMemories];
console.log(
  memories.length +
    " recuerdos; " +
    allMedia.filter(m=>m.type==='image').length +
    " imágenes de recuerdos (incluye un fotograma de contexto); " +
    allMedia.filter(m=>m.type==='video').length + " videos; " +
    published.length +
    " mensajes publicables.",
);
