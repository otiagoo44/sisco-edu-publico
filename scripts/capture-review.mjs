import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
await mkdir("docs/screenshots", { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const base = process.env.REVIEW_URL ?? "http://127.0.0.1:4174";
const prefix = process.env.REVIEW_PREFIX ?? '';
const widths = process.env.REVIEW_WIDTHS ? process.env.REVIEW_WIDTHS.split(',').map(Number) : [1440, 768, 390, 360];
async function save(page, name) {
  if (process.env.REVIEW_ONLY_CONTENT === '1' && !/^(memory|students)-/.test(name)) return;
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((img) => img.decode().catch(() => {})),
    );
  });
  const png = await page.screenshot({ fullPage: true, animations: "disabled" });
  await sharp(png)
    .webp({ quality: 85 })
    .toFile("docs/screenshots/" + prefix + name + ".webp");
  console.log(name);
}
try {
  for (const width of widths) {
    const page = await browser.newPage({
      viewport: { width, height: width < 768 ? 820 : 1000 },
    });
    page.on("pageerror", (error) =>
      console.log("PAGE ERROR: " + error.message),
    );
    await page.clock.install();
    await page.goto(base);
    await save(page, "sisco-" + width);
    await page.getByRole("button", { name: "Iniciar sistema" }).click();
    await page.clock.runFor(14000);
    console.log(
      "State at 14s: " +
        (await page.locator("main").getAttribute("data-state")),
    );
    await save(page, "montage-formal-" + width);
    await page.clock.runFor(4400);
    await save(page, "montage-playful-" + width);
    await page.clock.runFor(4400);
    await save(page, "montage-confirmed-" + width);
    await page.clock.runFor(7600);
    await page.getByRole("button", { name: "Pausar presentación" }).click();
    for (const [name, label] of [
      ["dragon", "Dragón"],
      ["robotica", "Robótica"],
      ["brasil", "Brasil"],
      ["sisco-edu", "SISCO-EDU"],
    ]) {
      if (name !== "dragon") {
        await page
          .getByRole("navigation", { name: "Capítulos de recuerdos" })
          .getByRole("button", { name: label, exact: true })
          .click();
        await page
          .getByRole("button", { name: "Continuar presentación" })
          .click();
        await page.clock.runFor(1000);
        await page.getByRole("button", { name: "Pausar presentación" }).click();
      }
      await save(page, "memory-" + name + "-" + width);
    }
    await page
      .getByRole("button", { name: "Ver mensajes", exact: false })
      .click();
    await page.clock.runFor(1000);
    await save(page, "students-" + width);
    await page.getByRole("button", { name: "Ir a la pregunta" }).click();
    await page.clock.runFor(1000);
    await save(page, "invitation-" + width);
    await page.getByRole("button", { name: "SÍ", exact: true }).click();
    await page.clock.runFor(1000);
    await save(page, "accepted-" + width);
    await page.close();
  }
} finally {
  await browser.close();
}
