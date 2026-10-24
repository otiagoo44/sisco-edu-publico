import { readFileSync, writeFileSync } from 'node:fs';
const report = JSON.parse(readFileSync('artifacts/lighthouse-mobile.json', 'utf8'));
const metricIds = ['first-contentful-paint', 'largest-contentful-paint', 'cumulative-layout-shift', 'total-blocking-time', 'speed-index'];
const summary = {
  tool: `Lighthouse ${report.lighthouseVersion}`,
  fetchTime: report.fetchTime,
  url: report.finalDisplayedUrl,
  scope: 'Build de producción local, navegación inicial SISCO-EDU, emulación móvil de laboratorio. No es una medición de campo ni de Vercel.',
  categories: Object.fromEntries(Object.entries(report.categories).map(([key, value]) => [key, Math.round(value.score * 100)])),
  metrics: Object.fromEntries(metricIds.map(id => [id, { value: report.audits[id].numericValue, unit: report.audits[id].numericUnit, display: report.audits[id].displayValue }])),
  notes: ['La accesibilidad automática no sustituye pruebas con lector de pantalla.', 'El objetivo LCP es 2500 ms; se informa el resultado observado sin redondearlo a una aprobación.'],
};
writeFileSync('docs/lighthouse-summary.json', JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
