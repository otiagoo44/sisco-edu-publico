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
// Adapt the official export's Tailwind container and font lists to native CSS.
const css = exported
  .replace("@theme {", ":root {")
  .replace(/"Arial, system-ui, sans-serif"/g, 'Arial, system-ui, sans-serif')
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
