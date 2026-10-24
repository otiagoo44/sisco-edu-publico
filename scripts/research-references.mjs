import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
await mkdir("artifacts/references", { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const [name, url] of [
    ["nike", "https://www.nike.com/dk/en/"],
    ["spotify", "https://open.spotify.com/"],
  ]) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    try {
      const response = await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 25000,
      });
      await page.waitForTimeout(2000);
      if (name === "nike") {
        const close = page.getByRole("button", { name: /close/i }).first();
        if (await close.isVisible().catch(() => false)) await close.click();
        else await page.keyboard.press("Escape");
      }
      if (name === "spotify")
        await page
          .locator("main img")
          .first()
          .waitFor({ state: "visible", timeout: 10000 })
          .catch(() => {});
      await page.waitForTimeout(1000);
      await page.screenshot({ path: "artifacts/references/" + name + ".png" });
      console.log(
        JSON.stringify({
          name,
          status: response?.status(),
          title: await page.title(),
          url: page.url(),
        }),
      );
    } catch (error) {
      console.log(name + ": " + error.message.split("\n")[0]);
    }
    await page.close();
  }
} finally {
  await browser.close();
}
