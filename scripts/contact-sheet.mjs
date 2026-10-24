import sharp from "sharp";
import { mkdir, readFile } from "node:fs/promises";
await mkdir("artifacts", { recursive: true });
const manifest = JSON.parse(
  await readFile("public/photos/profe/manifest.json", "utf8"),
);
const tiles = await Promise.all(
  manifest.photos.map(async (photo, i) => ({
    input: await sharp("public" + photo.thumbnail)
      .resize(180, 220, { fit: "contain", background: "#142137" })
      .png()
      .toBuffer(),
    left: (i % 4) * 180,
    top: Math.floor(i / 4) * 250,
  })),
);
await sharp({
  create: {
    width: 720,
    height: Math.ceil(tiles.length / 4) * 250,
    channels: 3,
    background: "#080e1b",
  },
})
  .composite(tiles)
  .png()
  .toFile("artifacts/contact-sheet.png");
