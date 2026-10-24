import sharp from "sharp";
import { readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const input = path.resolve("fotos-profe");
const output = path.resolve("public/photos/profe");
await mkdir(output, { recursive: true });
let files = [];
try {
  files = (await readdir(input))
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort();
} catch {
  console.log(
    "No hay originales: se conserva el manifest existente y funciona el placeholder.",
  );
  process.exit(0);
}
const descriptions = {
  1000160923: "El profe sonriendo con un cartel que dice SMILE",
  1000160924: "Un recuerdo del profe durante un viaje",
  1000160927: "El profe al aire libre detrás de una silla",
  1000160931:
    "Foto del profe con un filtro de orejas y corazones aportada por la promo",
  1000160932: "Un recuerdo espontáneo del profe durante un viaje",
  1000160938: "El profe de perfil con su camisa celeste",
  1000160940: "El profe sonriendo con su camisa celeste",
  1000160942: "Retrato del profe con los brazos cruzados",
  1000160944: "Un segundo retrato del profe de perfil",
  1000160946:
    "Collage del rostro del profe sobre un personaje de traje aportado por la promo",
  1000160948: "El profe frente a la cámara con su camisa celeste",
};
const photos = [];
for (const [i, file] of files.entries()) {
  const id = path.parse(file).name;
  const source = path.join(input, file);
  const full = await sharp(source)
    .rotate()
    .resize({
      width: 1200,
      height: 1500,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 84 })
    .toFile(path.join(output, `${id}.webp`));
  await sharp(source)
    .rotate()
    .resize({
      width: 480,
      height: 600,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toFile(path.join(output, `${id}-small.webp`));
  photos.push({
    id,
    src: `/photos/profe/${id}.webp`,
    thumbnail: `/photos/profe/${id}-small.webp`,
    alt:
      descriptions[id] ??
      `Recuerdo ${i + 1} del profe compartido por la promoción`,
    width: full.width,
    height: full.height,
  });
}
await writeFile(
  path.join(output, "manifest.json"),
  JSON.stringify(
    {
      version: 1,
      source:
        "Fotos aportadas por la promoción. Sin retoque facial; sólo orientación, escala y compresión.",
      photos,
    },
    null,
    2,
  ) + "\n",
);
console.log(`${photos.length} fotos preparadas; originales intactos.`);
