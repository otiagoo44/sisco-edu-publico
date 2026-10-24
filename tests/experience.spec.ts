import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

const devURL = "http://127.0.0.1:4175";
async function start(page: Page) {
  await page.getByRole("button", { name: "Iniciar sistema" }).click();
}
async function openInvitation(page: Page) {
  await page.goto("/");
  await start(page);
  await page.getByRole("button", { name: "Saltar intro" }).click();
  await expect(page.locator("main")).toHaveAttribute(
    "data-state",
    "invitation",
  );
}
async function memoriesScene(page: Page, url = "/") {
  await page.clock.install();
  await page.goto(url);
  await start(page);
  await page.clock.runFor(30100);
  await expect(page.locator("main")).toHaveAttribute("data-state", "memories");
  await page.getByRole("button", { name: "Pausar presentación" }).click();
}
async function goStudents(page: Page) {
  await page
    .getByRole("navigation", { name: "Capítulos de recuerdos" })
    .getByRole("button", { name: "SISCO-EDU", exact: true })
    .click();
  await page.getByRole("button", { name: "Ver mensajes" }).click();
  await expect(page.locator("main")).toHaveAttribute("data-state", "students");
}
async function fakeImage(page: Page) {
  await page.route("**/media/e2e-*.svg", (route) =>
    route.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000"><rect width="800" height="1000" fill="#526277"/><text x="80" y="480" fill="white" font-size="46">PRUEBA AUTOMATIZADA</text><text x="80" y="550" fill="white" font-size="34">No es una foto real</text></svg>',
    }),
  );
}
async function mockStudents(page: Page, count = 3) {
  const items = Array.from({ length: count }, (_, i) => ({
    id: "test-" + i,
    name: "Prueba E2E " + String(i + 1).padStart(3, "0"),
    photo: {
      src: "/media/e2e-" + i + ".svg",
      alt: "Imagen sintética de prueba automatizada, sin persona real",
    },
    message:
      "Mensaje de prueba automatizada. No es una opinión ni un testimonio real. " +
      (i === 1
        ? "Prueba de texto largo y lectura sin avance automático. ".repeat(8)
        : ""),
    order: i + 1,
    status: "published",
  }));
  items.push({
    ...items[0],
    id: "draft",
    name: "BORRADOR OCULTO",
    status: "draft",
  });
  items.push({
    ...items[0],
    id: "incomplete",
    name: "INCOMPLETO OCULTO",
    message: "",
  });
  await page.route("**/src/content/students.ts*", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: "export const students = " + JSON.stringify(items) + ";",
    }),
  );
  await fakeImage(page);
}

test("entrada sin pistas, metadatos neutrales y módulos auténticos", async ({
  page,
  request,
  isMobile,
}) => {
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Bienvenido a SISCO-EDU" }),
  ).toBeVisible();
  const text = await page.locator("body").innerText();
  expect(text).not.toMatch(
    /padrino|sorpresa|recuerdos|invitación|promo|alumnos|profe Danilo|misión|entorno de presentación/i,
  );
  expect(await page.title()).toBe("SISCO-EDU | Gestión académica");
  for (const selector of [
    'meta[name="description"]',
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[name="twitter:title"]',
  ]) {
    expect(await page.locator(selector).getAttribute("content")).not.toMatch(
      /padrino|promo|sorpresa|invitación|recuerdos/i,
    );
  }
  expect(requests.some((url) => url.includes("/photos/profe/"))).toBe(false);
  await page.keyboard.press("Escape");
  await expect(page.locator("main")).toHaveAttribute("data-running", "false");
  await expect(page.getByRole("button", { name: "Saltar intro" })).toHaveCount(
    0,
  );
  await expect(page.locator("input[type=password]")).toHaveCount(0);
  await page
    .locator(".sisco-modules")
    .getByRole("button", { name: /Profesores Gestionar profesores/ })
    .click();
  await expect(
    page.getByRole("heading", { name: "Profesores", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Volver al Dashboard" }).click();
  if (isMobile) {
    await page.getByRole("button", { name: "Menú", exact: false }).click();
    await expect(
      page.getByRole("navigation", { name: "Módulos del sistema" }),
    ).toBeVisible();
    await page
      .getByRole("navigation", { name: "Módulos del sistema" })
      .getByRole("button", { name: "Horarios", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Horarios", exact: true }),
    ).toBeVisible();
  }
  const html = await (await request.get("/")).text();
  expect(html).not.toMatch(/padrino|sorpresa|recuerdos|promo|invitación/i);
  expect(await (await request.get("/favicon.svg")).text()).not.toMatch(
    /padrino|promo|corazón/i,
  );
});

test("recorrido real, nueve fotos y tiempos de lectura después de aparecer", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.evaluate(() => {
    const records: { text: string; read?: number; hidden?: number }[] = [];
    const photos = new Set<string>();
    (
      window as unknown as { beats: typeof records; seenPhotos: Set<string> }
    ).beats = records;
    (window as unknown as { seenPhotos: Set<string> }).seenPhotos = photos;
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const node = mutation.target as HTMLElement;
        if (!node.matches?.("[data-beat]")) continue;
        const text = node.textContent!.replace(/\s+/g, " ").trim();
        let record = records.find((r) => r.text === text);
        if (
          mutation.attributeName === "data-readable" &&
          node.dataset.readable === "true"
        ) {
          if (!record) {
            record = { text };
            records.push(record);
          }
          record.read = performance.now();
          node
            .querySelectorAll<HTMLElement>("[data-photo-id]")
            .forEach((photo) => photos.add(photo.dataset.photoId!));
        }
        if (
          mutation.attributeName === "data-active" &&
          node.dataset.active === "false" &&
          record
        )
          record.hidden = performance.now();
      }
    }).observe(document.querySelector("main")!, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-readable", "data-active"],
    });
  });
  const beginning = Date.now();
  await start(page);
  await expect(page.locator("main")).toHaveAttribute("data-state", "memories", {
    timeout: 36_000,
  });
  expect(Date.now() - beginning).toBeGreaterThan(28_000);
  expect(Date.now() - beginning).toBeLessThan(35_000);
  const result = await page.evaluate(() => {
    const w = window as unknown as {
      beats: { text: string; read?: number; hidden?: number }[];
      seenPhotos: Set<string>;
    };
    return { beats: w.beats, photos: [...w.seenPhotos] };
  });
  expect(result.photos.length).toBeGreaterThanOrEqual(9);
  const holds = result.beats.filter(
    (b) => b.read !== undefined && b.hidden !== undefined,
  );
  expect(holds.length).toBeGreaterThanOrEqual(6);
  for (const beat of holds)
    expect(beat.hidden! - beat.read!, beat.text).toBeGreaterThanOrEqual(3100);
  await expect(page.locator(".memory-journey")).toHaveAttribute(
    "data-memory",
    "dragon",
  );
  await expect(page.locator("main")).toHaveAttribute("data-state", "students", {
    timeout: 30_000,
  });
  await expect(page.locator("[data-development-only]")).toHaveCount(0);
  await page.getByRole("button", { name: "Ir a la pregunta" }).click();
  await expect(
    page.getByRole("heading", {
      name: "PROFE DANILO, ¿QUIERE SER NUESTRO PADRINO?",
    }),
  ).toBeVisible();
  await page.waitForTimeout(3500);
  await expect(page.locator("main")).toHaveAttribute(
    "data-state",
    "invitation",
  );
  expect(errors).toEqual([]);
});

test("pausa, continuar, salto y repetir conservan el control", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/");
  await start(page);
  await page.clock.runFor(1300);
  await page.getByRole("button", { name: "Pausar presentación" }).click();
  await page.clock.runFor(10000);
  await expect(page.locator("main")).toHaveAttribute("data-state", "boot");
  await page.getByRole("button", { name: "Continuar presentación" }).click();
  await page.clock.runFor(3200);
  await expect(page.locator("main")).toHaveAttribute(
    "data-state",
    "diagnostic",
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("main")).toHaveAttribute(
    "data-state",
    "invitation",
  );
  await page.getByRole("button", { name: "SÍ", exact: true }).click();
  await page.getByRole("button", { name: "Ver de nuevo", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Iniciar sistema" }),
  ).toBeVisible();
  await expect(page.locator("main")).toHaveAttribute("data-running", "false");
});

test("NO se escapa repetidamente por ratón o tacto y sólo SÍ acepta", async ({
  page,
  isMobile,
}) => {
  await openInvitation(page);
  const no = page.getByRole("button", { name: "NO", exact: true });
  const yes = page.getByRole("button", { name: "SÍ", exact: true });
  for (let i = 0; i < 6; i++) {
    const before = await no.boundingBox();
    const count = Number(await no.getAttribute("data-escapes"));
    if (isMobile)
      await page.touchscreen.tap(
        before!.x + before!.width / 2,
        before!.y + before!.height / 2,
      );
    else
      await page.mouse.move(
        before!.x + before!.width / 2,
        before!.y + before!.height / 2,
      );
    await expect
      .poll(async () => Number(await no.getAttribute("data-escapes")))
      .toBeGreaterThan(count);
    await page.waitForTimeout(200);
    const after = await no.boundingBox();
    const affirmative = await yes.boundingBox();
    expect(
      Math.hypot(after!.x - before!.x, after!.y - before!.y),
    ).toBeGreaterThan(10);
    expect(after!.x).toBeGreaterThanOrEqual(0);
    expect(after!.x + after!.width).toBeLessThanOrEqual(
      page.viewportSize()!.width,
    );
    expect(after!.y + after!.height).toBeLessThanOrEqual(
      page.viewportSize()!.height,
    );
    expect(after!.x).toBeGreaterThan(affirmative!.x + affirmative!.width);
    await expect(page.locator("main")).toHaveAttribute(
      "data-state",
      "invitation",
    );
  }
  await no.focus();
  const beforeKeyboard = Number(await no.getAttribute("data-escapes"));
  await page.keyboard.press("Enter");
  await page.keyboard.press("Space");
  expect(Number(await no.getAttribute("data-escapes"))).toBeGreaterThanOrEqual(
    beforeKeyboard + 2,
  );
  await expect(no).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(yes).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toHaveAttribute("data-state", "accepted");
  await expect(
    page.getByRole("heading", { name: "¡FELICIDADES, PROFE!" }),
  ).toBeVisible();
  await expect(
    page.locator(".celebration-collage [data-photo-id]"),
  ).toHaveCount(6);
  await expect(page.locator("canvas")).toHaveCount(1);
  await page.getByRole("button", { name: "Ver las fotos" }).click();
  await expect(page.getByRole("dialog").locator("img")).toHaveCount(11);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("reduced-motion nunca revela antes de iniciar y mantiene la broma sin interpolación", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Iniciar sistema" }),
  ).toBeVisible();
  await expect(page.locator("body")).not.toContainText("padrino");
  await start(page);
  await page.getByRole("button", { name: "Saltar intro" }).click();
  const no = page.getByRole("button", { name: "NO", exact: true });
  await no.focus();
  const before = await no.boundingBox();
  await page.keyboard.press("Enter");
  const after = await no.boundingBox();
  expect(after!.x !== before!.x || after!.y !== before!.y).toBe(true);
  await page.getByRole("button", { name: "SÍ", exact: true }).click();
  await expect(page.locator("main")).toHaveAttribute("data-state", "accepted");
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("recuerdos configurables, navegación, pausa y contenido pendiente sólo en desarrollo", async ({
  page,
}) => {
  await memoriesScene(page);
  for (const label of ["Robótica", "Brasil", "SISCO-EDU", "Dragón"]) {
    await page
      .getByRole("navigation", { name: "Capítulos de recuerdos" })
      .getByRole("button", { name: label, exact: true })
      .click();
    await expect(page.locator(".memory-copy h1")).toBeVisible();
    await expect(page.locator("[data-development-only]")).toHaveCount(0);
  }
  await page.clock.runFor(20000);
  await expect(page.locator(".memory-journey")).toHaveAttribute(
    "data-memory",
    "dragon",
  );
  await goStudents(page);
  await expect(page.locator(".student-feature")).toHaveCount(0);
  await expect(page.locator(".student-pending")).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText("Daniel");
});

test("alumnos variables, mensajes manuales, borradores filtrados y vista general accesible", async ({
  page,
}, testInfo) => {
  await mockStudents(page, 27);
  await memoriesScene(page, devURL);
  await goStudents(page);
  await expect(page.getByText("Prueba E2E 001", { exact: true })).toBeVisible();
  await expect(page.locator(".student-counter")).toHaveText("1 de 27");
  await expect(page.locator(".student-portrait img")).toBeVisible();
  await page.locator(".students-heading h1").focus();
  await page.evaluate(() => window.scrollTo(0, 0));
  const statement = await page.locator(".student-statement").boundingBox();
  const playback = await page.locator(".skip-controls").boundingBox();
  expect(playback!.y).toBeGreaterThanOrEqual(statement!.y + statement!.height);
  await mkdir("artifacts", { recursive: true });
  await page.screenshot({
    path: "artifacts/students-demo-" + testInfo.project.name + ".png",
    fullPage: true,
    animations: "disabled",
  });
  await expect(page.locator("body")).not.toContainText("BORRADOR OCULTO");
  await expect(page.locator("body")).not.toContainText("INCOMPLETO OCULTO");
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
  await page.clock.runFor(90000);
  await expect(page.getByText("Prueba E2E 001", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Siguiente compañero" }).click();
  await expect(page.getByText("Prueba E2E 002", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Anterior compañero" }).click();
  const overview = page.getByRole("button", { name: "Ver todos (27)" });
  await overview.click();
  await expect(page.getByRole("dialog").locator("li")).toHaveCount(27);
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "27 Prueba E2E 027" })
    .click();
  await expect(page.locator(".student-name")).toHaveText("Prueba E2E 027");
  await overview.click();
  await page.keyboard.press("Escape");
  await expect(overview).toBeFocused();
  await page.getByRole("button", { name: "Ir a la pregunta" }).click();
  await expect(page.locator("main")).toHaveAttribute(
    "data-state",
    "invitation",
  );
});

test("fotos variables del recuerdo se exploran sin avanzar automáticamente", async ({
  page,
}) => {
  await fakeImage(page);
  const content = [
    {
      id: "prueba-configurable",
      title: "Capítulo de prueba automatizada",
      description: "Contenido de prueba. No es un recuerdo real.",
      order: 1,
      composition: "construction",
      photos: Array.from({ length: 5 }, (_, i) => ({
        src: "/media/e2e-memory-" + i + ".svg",
        alt: "Material de prueba automatizada " + i,
      })),
    },
  ];
  await page.route("**/src/content/memories.ts*", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: "export const memories = " + JSON.stringify(content) + ";",
    }),
  );
  await memoriesScene(page, devURL);
  await expect(page.locator(".memory-journey")).toHaveAttribute(
    "data-memory",
    "prueba-configurable",
  );
  await page.getByRole("button", { name: "Continuar presentación" }).click();
  await page
    .getByRole("button", { name: "Foto siguiente", exact: true })
    .click();
  await page.clock.runFor(20000);
  await expect(page.locator("main")).toHaveAttribute("data-state", "memories");
  await expect(page.locator(".photo-navigation > span")).toHaveText("2 / 5");
  await page
    .getByRole("button", { name: "Foto anterior", exact: true })
    .click();
  await expect(page.locator(".photo-navigation > span")).toHaveText("1 / 5");
  await page.getByRole("button", { name: "Ver mensajes" }).click();
  await expect(page.locator("main")).toHaveAttribute("data-state", "students");
});

test("manifest ausente no bloquea decisiones", async ({ page }) => {
  await page.route("**/photos/profe/manifest.json", (route) =>
    route.fulfill({ status: 404, body: "" }),
  );
  await openInvitation(page);
  await expect(
    page.getByRole("img", { name: "Fotografía no disponible" }),
  ).toHaveCount(1);
  await page.getByRole("button", { name: "SÍ", exact: true }).click();
  await expect(page.locator("main")).toHaveAttribute("data-state", "accepted");
});

test("manifest pendiente no retrasa aceptar y una foto fallida tiene alternativa", async ({
  page,
}) => {
  let release: (() => Promise<void>) | undefined;
  await page.route("**/photos/profe/manifest.json", (route) => {
    release = () => route.fulfill({ json: { photos: [] } });
  });
  await openInvitation(page);
  await page.getByRole("button", { name: "SÍ", exact: true }).click();
  await expect(page.locator("main")).toHaveAttribute("data-state", "accepted");
  await release?.();
  await page.unroute("**/photos/profe/manifest.json");
  await page.route("**/photos/profe/*.webp", (route) => route.abort());
  await openInvitation(page);
  await expect(
    page.getByRole("img", { name: "Fotografía no disponible" }),
  ).toHaveCount(1);
  await page.getByRole("button", { name: "SÍ", exact: true }).click();
  await expect(page.locator("main")).toHaveAttribute("data-state", "accepted");
});

test("desarrollo identifica placeholders y alumnos sin testimonios inventados", async ({
  page,
}) => {
  await memoriesScene(page, devURL);
  await expect(page.locator("[data-development-only]")).toContainText(
    "Fotografías pendientes",
  );
  await goStudents(page);
  await expect(page.locator(".student-pending")).toContainText(
    "Mensajes pendientes",
  );
  await expect(page.locator(".student-feature")).toHaveCount(0);
  await expect(page.locator(".student-name")).toHaveCount(0);
});

test("audio sigue apagado hasta la acción explícita y no se guardan respuestas", async ({
  page,
}) => {
  await page.goto("/");
  await start(page);
  const audio = page.getByRole("button", {
    name: "Activar audio ambiental",
    exact: false,
  });
  await expect(audio).toHaveAttribute("aria-pressed", "false");
  await audio.click();
  await expect(
    page.getByRole("button", { name: "Desactivar audio", exact: false }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Desactivar audio", exact: false })
    .click();
  await page.getByRole("button", { name: "Saltar intro" }).click();
  await page.getByRole("button", { name: "SÍ", exact: true }).click();
  expect(
    await page.evaluate(() => [localStorage.length, sessionStorage.length]),
  ).toEqual([0, 0]);
});

test("axe en entrada, recuerdos, alumnos, pregunta y celebración", async ({
  page,
}) => {
  const audit = async () =>
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
  await page.clock.install();
  await page.goto("/");
  await audit();
  await start(page);
  await page.clock.runFor(30100);
  await expect(page.locator("main")).toHaveAttribute("data-state", "memories");
  await page.getByRole("button", { name: "Pausar presentación" }).click();
  await audit();
  await goStudents(page);
  await audit();
  await page.getByRole("button", { name: "Ir a la pregunta" }).click();
  await audit();
  await page.getByRole("button", { name: "SÍ", exact: true }).click();
  await audit();
});

test("responsive 360, 390, 768 y 1440 sin desbordes ni controles fuera del área", async ({
  page,
}) => {
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
    await start(page);
    await page.getByRole("button", { name: "Saltar intro" }).click();
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
    await expect(
      page.getByRole("button", { name: "SÍ", exact: true }),
    ).toBeInViewport();
    const no = await page
      .getByRole("button", { name: "NO", exact: true })
      .boundingBox();
    expect(no!.height).toBeGreaterThanOrEqual(44);
  }
});

test("sin JavaScript sólo muestra SISCO-EDU, sin revelar la invitación", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(
    page.getByRole("heading", { name: "SISCO-EDU", exact: true }),
  ).toBeVisible();
  expect(await page.locator("body").innerText()).not.toMatch(
    /padrino|sorpresa|promo|invitación|Danilo/i,
  );
  await context.close();
});
