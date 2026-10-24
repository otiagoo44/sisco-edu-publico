# OPERACIÓN PADRINO

Una sorpresa de la promoción 2026 del Bachillerato Técnico en Informática. Empieza como una presentación de SISCO-EDU y se convierte en una invitación al profesor. React + TypeScript + Vite, GSAP y CSS/SVG. Sin backend.

## Probar localmente

Requiere Node 22.12+ (validado con Node 24) y npm.

```sh
npm ci
npm run dev
```

Abrir la URL indicada por Vite. “Iniciar sistema” reproduce 10,05 segundos de narración: boot 2s, diagnostic 2,4s, glitch 0,55s y montage 5,1s. La invitación espera la decisión sin límite de tiempo. Se puede pausar, saltar con el botón o Escape y repetir desde la celebración. Cambiar de pestaña pausa la presentación; se reanuda explícitamente.

El audio está apagado de inicio y usa un acorde sintetizado local tras activar el control. No requiere archivos ni permisos de micrófono. Reduced-motion abre la pregunta directamente y elimina el confeti y la broma del botón. El No se mueve una vez al entrar con ratón; teclado y tacto pueden rechazar inmediatamente. “Quiero pensarlo” es una salida real y respetuosa.

## Verificar producción

```sh
npm run build
npm run preview
npm test
npm run design:lint
```

Playwright arranca el preview de producción automáticamente. En Windows local utiliza Chrome instalado. En CI utiliza Chromium: `npx playwright install --with-deps chromium`. Las pruebas cubren el recorrido, duración, pausa/salto, aceptación/rechazo/duda, teclado, foco del dialog, audio, imágenes fallidas, reduced-motion, JavaScript desactivado, anchos 360/390/768/1280/1440 y axe. Los informes están en `playwright-report/` y las capturas en `artifacts/`; no se versionan automáticamente. La emulación móvil no equivale a una prueba física en iOS/Android.

## Fotos autorizadas

Los originales aportados se encuentran en `fotos-profe/` en el entorno de trabajo y permanecen intactos. Se excluyen de Git para no duplicarlos. Las 11 versiones WebP y sus miniaturas sí se incluyen en `public/photos/profe/` junto al manifest. No se aplican IA, retoque facial, filtros nuevos ni deformaciones. Algunas imágenes originales ya contienen filtros o collages de la promoción; sus alt lo indican.

Para reemplazarlas, colocar originales autorizados en `fotos-profe/` y ejecutar:

```sh
npm run photos
```

El script orienta según EXIF, reduce sin ampliar y comprime. Si no hay originales conserva el manifest actual. El manifest define id, src, thumbnail, alt, width y height; permite reemplazar el contenido sin editar componentes. No borrar los archivos publicados hasta actualizar sus referencias. Si falta el manifest, está vacío o una imagen falla, aparece un placeholder y se puede decidir igual. Las tres fotos críticas se precargan sin bloquear la interfaz. El álbum usa miniaturas lazy y `object-fit: contain` para ver la foto completa.

## Arquitectura y diseño

- `src/state.ts`: máquina explícita `boot → diagnostic → glitch → montage → invitation → accepted | declined`. Eventos inválidos conservan el estado; reconsiderar retorna a la invitación y replay al comienzo.
- `src/hooks.ts`: timeline GSAP por escena con limpieza de contexto, pausa y avance; reduced-motion dinámico.
- `src/components/`: BootIntro, Diagnostic, GlitchTransition, PhotoMontage, Invitation, AcceptanceCelebration, AudioControl, SkipControl y MemoriesDialog aislados.
- `src/confetti.ts`: importación dinámica sólo al aceptar, 65/110 partículas, duración máxima 4,8 segundos, sin listeners permanentes.
- `DESIGN.md`: dirección, fuentes, tokens y criterios. `npm run design:tokens` exporta a CSS nativo mediante la CLI oficial incluida en la skill local. Regenerar tokens si cambia el YAML; no editar `src/tokens.css` a mano.
- `docs/AUDIT.md`: auditoría final guiada por Impeccable y sus límites.

No hay almacenamiento de respuestas, notificaciones, analítica, cookies ni llamadas a servicios de terceros en el navegador. Recargar vuelve al inicio. Los textos no afirman envío ni persistencia. Sin JavaScript queda una invitación textual en `noscript`. Los controles no bloquean navegación ni historial.

## Publicar en Vercel cuando se autorice

El repositorio incluye `vercel.json`, lockfile y configuración Vite. No requiere variables de entorno ni servicios.

1. Importar `otiagoo44/sisco-edu-publico` en Vercel y seleccionar `main` cuando corresponda publicar.
2. Root Directory: raíz del repositorio. Framework Preset: Vite.
3. Install: `npm ci`. Build: `npm run build`. Output: `dist`. Node: 24.x.
4. Revisar el preview, las fotos y la experiencia con el dispositivo que se usará frente al profe antes de compartir el enlace.

La preparación local y el push no ejecutan comandos de despliegue. Si se conecta la integración Git de Vercel, los pushes posteriores pueden generar despliegues automáticos según la configuración de ese proyecto. `noindex` reduce indexación pero no sustituye un control de acceso.

## Fuentes y licencias

Skills revisadas: Awesome Design MD, UI UX Pro Max, Google DESIGN.md, Taste e Impeccable. Sus instrucciones, procedencias y licencias permanecen en `.agents/skills/`. Se aplicaron criterios de diseño y auditoría; no se ejecutó una supuesta CLI de Impeccable. UI UX Pro Max devolvió un sistema genérico inapropiado y cero coincidencias en el reintento de producto; ese resultado se documenta en DESIGN.md y no se presenta como una recomendación cinematográfica validada.

Fuentes autoalojadas desde Fontsource: Space Grotesk e IBM Plex Mono, con sus licencias en los paquetes. Documentación primaria consultada: [GSAP y React](https://gsap.com/resources/React/), [deploy estático de Vite](https://vite.dev/guide/static-deploy.html), [configuración de Playwright](https://playwright.dev/docs/test-configuration).
