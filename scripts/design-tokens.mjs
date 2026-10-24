import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
const exported = execFileSync(
  process.execPath,
  [
    ".agents/skills/google-design-md/scripts/google-cli/index.mjs",
    "export",
    "--format",
    "css-tailwind",
    "DESIGN.md",
  ],
  { encoding: "utf8" },
);
// Vite uses native CSS, so adapt the official export's Tailwind container only.
const css = exported
  .replace("@theme {", ":root {")
  .replace(
    /"Space Grotesk, Arial, sans-serif"/g,
    '"Space Grotesk", Arial, sans-serif',
  )
  .replace(
    /"IBM Plex Mono, Consolas, monospace"/g,
    '"IBM Plex Mono", Consolas, monospace',
  );
writeFileSync(
  "src/tokens.css",
  "/* Generated from DESIGN.md via the bundled official CLI. Do not edit. */\n" +
    css,
);
