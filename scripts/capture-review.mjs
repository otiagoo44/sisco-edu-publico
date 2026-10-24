import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

await mkdir("docs/screenshots", { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const width of [360, 390, 768, 1280, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: width < 768 ? 800 : 900 },
      reducedMotion: "reduce",
    });
    await page.goto("http://127.0.0.1:4174/");
    await page.locator(".invite-main img").waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [...document.images].map((img) => img.decode().catch(() => {})),
      );
    });
    const screenshot = await page.screenshot({ fullPage: true });
    await sharp(screenshot)
      .webp({ quality: 85 })
      .toFile(`docs/screenshots/invitation-${width}.webp`);
    console.log(`Captura real ${width}px`);
    await page.close();
  }
  for (const name of [
    "desktop-boot",
    "desktop-montage",
    "desktop-accepted",
    "mobile-boot",
    "mobile-accepted",
  ]) {
    try {
      await sharp(`artifacts/${name}.png`)
        .resize({
          width: name.startsWith("mobile") ? 390 : 1280,
          withoutEnlargement: true,
        })
        .webp({ quality: 82 })
        .toFile(`docs/screenshots/${name}.webp`);
    } catch {
      console.log(`Sin captura previa: ${name}`);
    }
  }
} finally {
  await browser.close();
}
