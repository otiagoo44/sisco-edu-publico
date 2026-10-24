import { test, expect, type Route } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

test("recorrido completo, orden de escenas y duración cinematográfica", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator("main")).toHaveAttribute("data-state", "boot");
  await mkdir("artifacts", { recursive: true });
  await page.screenshot({
    path: `artifacts/${testInfo.project.name}-boot.png`,
    fullPage: true,
  });
  await page.evaluate(() => {
    const main = document.querySelector("main")!;
    (window as unknown as { sceneLog: string[] }).sceneLog = ["boot"];
    new MutationObserver(() =>
      (window as unknown as { sceneLog: string[] }).sceneLog.push(
        main.getAttribute("data-state")!,
      ),
    ).observe(main, { attributes: true, attributeFilter: ["data-state"] });
  });
  const start = Date.now();
  await page.getByRole("button", { name: "Iniciar sistema" }).click();
  await expect(page.locator("main")).toHaveAttribute("data-state", "montage", {
    timeout: 8000,
  });
  await expect(page.locator(".montage-second")).toHaveCSS("opacity", "1");
  await page.screenshot({
    path: `artifacts/${testInfo.project.name}-montage.png`,
    fullPage: true,
  });
  await expect(page.locator("main")).toHaveAttribute(
    "data-state",
    "invitation",
    { timeout: 8000 },
  );
  expect(Date.now() - start).toBeGreaterThan(9000);
  expect(Date.now() - start).toBeLessThan(13_000);
  expect(
    await page.evaluate(
      () => (window as unknown as { sceneLog: string[] }).sceneLog,
    ),
  ).toEqual(["boot", "diagnostic", "glitch", "montage", "invitation"]);
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await page.screenshot({
    path: `artifacts/${testInfo.project.name}-invitation.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("saltar no espera assets ni necesita iniciar; aceptar celebra y permite replay", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Saltar intro" }).click();
  await expect(page.locator("main")).toHaveAttribute(
    "data-state",
    "invitation",
  );
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.getByRole("button", { name: "Sí, ¡acepto la misión!" }).click();
  await expect(
    page.getByRole("heading", { name: "¡Felicidades!" }),
  ).toBeVisible();
  await expect(
    page.getByText("Sos el padrino de la mejor promo de", { exact: false }),
  ).toContainText("Bachillerato Técnico en Informática");
  await expect(page.locator("canvas")).toHaveCount(1);
  await expect(page.locator("canvas")).toHaveAttribute("width", /\d+/);
  await mkdir("artifacts", { recursive: true });
  await page.screenshot({
    path: `artifacts/${testInfo.project.name}-accepted.png`,
    fullPage: true,
  });
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    })),
  ).toEqual({ local: 0, session: 0 });
  await page.getByRole("button", { name: "Volver a vivirlo" }).click();
  await expect(page.locator("main")).toHaveAttribute("data-state", "boot");
  await expect(
    page.getByRole("button", { name: "Iniciar sistema" }),
  ).toBeVisible();
});

test("pausa conserva la escena y Escape salta durante reproducción", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Iniciar sistema" }).click();
  await page.getByRole("button", { name: "Pausar presentación" }).click();
  const pausedStage = await page.locator("main").getAttribute("data-state");
  await page.waitForTimeout(2400); // Longer than boot: verifies pause, not a loading delay.
  await expect(page.locator("main")).toHaveAttribute(
    "data-state",
    pausedStage!,
  );
  await page.getByRole("button", { name: "Continuar presentación" }).click();
  await expect(page.locator("main")).not.toHaveAttribute(
    "data-state",
    pausedStage!,
    { timeout: 6000 },
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("main")).toHaveAttribute(
    "data-state",
    "invitation",
  );
});

test("No sigue siendo una respuesta real; pensar y volver son libres", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Saltar intro" }).click();
  const no = page.getByRole("button", { name: "No, gracias" });
  if (!isMobile) {
    await no.hover();
    await expect(no).toHaveClass(/escaped/);
    await page.mouse.move(0, 0);
    await no.hover();
    await expect(no).toHaveClass(/escaped/);
  }
  await no.click();
  await expect(page.locator("main")).toHaveAttribute("data-state", "declined");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "El cariño no depende",
  );
  await page.getByRole("button", { name: "Volver a la invitación" }).click();
  await page.getByRole("button", { name: "Quiero pensarlo" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "se piensan con calma",
  );
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("teclado puede rechazar sin persecución y el dialog restaura foco", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Escape");
  const no = page.getByRole("button", { name: "No, gracias" });
  await no.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toHaveAttribute("data-state", "declined");
  await page.getByRole("button", { name: "Volver a la invitación" }).click();
  const memories = page.getByRole("button", {
    name: "Nuestros recuerdos",
    exact: false,
  });
  await memories.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").locator("img")).toHaveCount(11);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(memories).toBeFocused();
});

test("movimiento reducido lleva directamente a la pregunta sin canvas", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("main")).toHaveAttribute(
    "data-state",
    "invitation",
  );
  await page.getByRole("button", { name: "No, gracias" }).hover();
  await expect(
    page.getByRole("button", { name: "No, gracias" }),
  ).not.toHaveClass(/escaped/);
  await page.getByRole("button", { name: "Sí, ¡acepto la misión!" }).click();
  await expect(
    page.getByRole("heading", { name: "¡Felicidades!" }),
  ).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.getByRole("button", { name: "Volver a vivirlo" }).click();
  await expect(page.locator("main")).toHaveAttribute(
    "data-state",
    "invitation",
  );
});

test("manifest ausente no bloquea la invitación ni aceptar", async ({
  page,
}) => {
  await page.route("**/photos/profe/manifest.json", (route) =>
    route.fulfill({ status: 404, body: "" }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Saltar intro" }).click();
  await expect(
    page.getByRole("img", {
      name: "Un lugar reservado para nuestros recuerdos",
    }),
  ).toHaveCount(2);
  await page.getByRole("button", { name: "Sí, ¡acepto la misión!" }).click();
  await expect(
    page.getByRole("heading", { name: "¡Felicidades!" }),
  ).toBeVisible();
});

test("foto fallida degrada a placeholder y permite rechazar", async ({
  page,
}) => {
  await page.route("**/photos/profe/*.webp", (route) => route.abort());
  await page.goto("/");
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("img", {
      name: "Un lugar reservado para nuestros recuerdos",
    }),
  ).toHaveCount(2);
  await page.getByRole("button", { name: "No, gracias" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toHaveAttribute("data-state", "declined");
});

test("audio es opt-in y cambia su estado al apagar", async ({ page }) => {
  await page.goto("/");
  const audio = page.getByRole("button", { name: "Activar audio ambiental" });
  await expect(audio).toHaveAttribute("aria-pressed", "false");
  await audio.click();
  await expect(
    page.getByRole("button", { name: "Desactivar audio" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Desactivar audio" }).click();
  await expect(audio).toHaveAttribute("aria-pressed", "false");
});

test("manifest pendiente no bloquea saltar ni pensar la respuesta", async ({
  page,
}) => {
  let held: Route | undefined;
  await page.route("**/photos/profe/manifest.json", (route) => {
    held = route;
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Saltar intro" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "padrino",
  );
  await page.getByRole("button", { name: "Quiero pensarlo" }).click();
  await expect(page.locator("main")).toHaveAttribute("data-state", "declined");
  await held?.fulfill({ json: { photos: [] } });
});

test("cambiar preferencia de movimiento en reproducción cancela la coreografía", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Iniciar sistema" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("main")).toHaveAttribute(
    "data-state",
    "invitation",
  );
  await page.getByRole("button", { name: "Quiero pensarlo" }).click();
  await page.waitForTimeout(2500);
  await expect(page.locator("main")).toHaveAttribute("data-state", "declined");
});

test("auditoría axe en boot, invitación, dialog, rechazo y aceptación", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const audit = async () =>
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
  await audit();
  await page.keyboard.press("Escape");
  await audit();
  await page
    .getByRole("button", { name: "Nuestros recuerdos", exact: false })
    .click();
  await audit();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Quiero pensarlo" }).click();
  await audit();
  await page.getByRole("button", { name: "Volver a la invitación" }).click();
  await page.getByRole("button", { name: "Sí, ¡acepto la misión!" }).click();
  await audit();
});

test("responsive sin desbordes y acciones disponibles a distintos anchos", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Escape");
  for (const width of [360, 390, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const size = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(size.scroll, `desborde a ${width}px`).toBeLessThanOrEqual(
      size.client,
    );
    await expect(
      page.getByRole("button", { name: "Sí, ¡acepto la misión!" }),
    ).toBeVisible();
    const bounds = await page
      .getByRole("button", { name: "No, gracias" })
      .boundingBox();
    expect(bounds!.height).toBeGreaterThanOrEqual(44);
  }
  await page.setViewportSize({ width: 768, height: 900 });
  await page.evaluate(() => {
    document.documentElement.style.zoom = "2";
  });
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Quiero pensarlo" }).click();
  await expect(page.locator("main")).toHaveAttribute("data-state", "declined");
});

test("sin JavaScript hay invitación y explicación accesibles", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(
    page.getByRole("heading", { name: "Profe, ¿quiere ser nuestro padrino?" }),
  ).toBeVisible();
  await expect(page.locator("noscript p").last()).toBeVisible();
  await expect(page.locator("noscript p").last()).toContainText(
    "También podés decírnosla en persona.",
  );
  await context.close();
});
