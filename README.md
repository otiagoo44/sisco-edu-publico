# SISCO-EDU / OPERACIÓN PADRINO

Experiencia local de la promoción 2026 de Bachillerato Técnico en Informática para el **profe Danilo**. La entrada reproduce la identidad del frontend real de SISCO-EDU; sólo después de “Iniciar sistema” empieza la sorpresa.

React + TypeScript + Vite, GSAP, CSS/SVG y confeti canvas cargado al aceptar. Se conserva la base del proyecto; no hay backend, cuentas, almacenamiento de respuestas, analítica ni notificaciones.

## Probar

Requiere Node 22.12+; validado con Node 24.

```sh
npm ci
npm run dev
```

Desarrollo muestra espacios pendientes para las fotos históricas y mensajes que todavía no se recibieron. Para ver exactamente lo que se publicaría:

```sh
npm run build
npm run preview
```

## Cargar fotos y alumnos

**[Instrucciones completas de contenido](docs/CONTENT.md)**

- `src/content/memories.ts`: recuerdos, descripción, fotos múltiples, orden, composición y fecha confirmada opcional.
- `src/content/students.ts`: nombre, retrato, mensaje real, orden y estado borrador/publicado.
- `public/media/recuerdos/{dragon,robotica,brasil,sisco-edu}/`: fotografías y capturas auténticas.
- `public/media/alumnos/`: retratos autorizados.
- `public/photos/profe/manifest.json`: las 11 fotos previas del profesor, sin retoque facial.

Podés cargar cualquier cantidad de fotos o alumnos modificando únicamente contenido. Los borradores y alumnos incompletos no aparecen como testimonios publicados. No se inventaron nombres, opiniones, fechas o recuerdos visuales. Las fotos previas del profe no se presentan como prueba del dragón, del arca o del viaje.

## Recorrido y controles

1. Dashboard SISCO-EDU: módulos académicos y navegación local, sin credenciales ni pistas de la sorpresa. Reduced-motion y Escape tampoco adelantan la invitación.
2. Verificación, pendiente, análisis y corte visual.
3. Tres collages: nueve fotos diferentes del profesor, ordenadas de normales a espontáneas/graciosas.
4. Recuerdos: dragón, robótica, Brasil y SISCO-EDU. Adelantos automáticos breves con anterior/siguiente capítulo; explorar fotos vuelve manual el avance.
5. Mensajes: retratos y declaraciones a ritmo del profesor, navegación anterior/siguiente y vista general; se puede ir a la pregunta sin leerlos todos.
6. “PROFE DANILO, ¿QUIERE SER NUESTRO PADRINO?” permanece hasta pulsar SÍ. NO se escapa repetidamente con ratón, tacto y teclado dentro de un área separada.
7. Celebración con seis fotos, confeti y el mensaje solicitado. Permite ver las once fotos y repetir.

La introducción conserva 29,15s hasta los recuerdos. Con los cuatro capítulos actuales se llega a la sección de alumnos alrededor de los 51s. No se espera a la red ni se agrega una carga artificial; los tiempos corresponden a lectura y reconocimiento. Pausa/continuar, saltar y Escape permanecen disponibles; se pausa al ocultar la pestaña. Los mensajes no avanzan solos. Las fotos y el audio tienen fallbacks.

Audio apagado hasta activación explícita. Reduced-motion sustituye movimiento por cortes simples, mantiene la entrada inicial y elimina el confeti. NO se reposiciona instantáneamente en ese modo. La interacción de NO es el chiste visual solicitado, sin persistencia ni notificación.

## Verificación

```sh
npm run build
npm run design:lint
npm test
```

Playwright prueba el build real de producción en 4173 y arranca un servidor de desarrollo en 4175 para verificar contenido configurable con fixtures rotulados como prueba. Los fixtures se interceptan dentro del navegador de tests; no modifican archivos publicados ni generan declaraciones reales. Localmente se utiliza Chrome instalado; CI instala Chromium.

Los tests cubren entrada sin pistas, metadatos y favicon, recorrido real y lectura, nueve fotos, pausa/salto/replay, NO repetido por ratón/tacto/teclado, aceptación exclusiva de SÍ, recuerdos variables, alumnos variables y borradores, exploración manual, reduced-motion, audio, fallos de manifest, axe y responsive. Las capturas revisadas están en `docs/screenshots/`; el informe de auditoría en [docs/AUDIT.md](docs/AUDIT.md). Emulación móvil no equivale a una prueba física en iOS/Android.

`scripts/capture-review.mjs` captura el build local de 4174 en 1440, 768, 390 y 360px. `REVIEW_URL` permite capturar desarrollo y ver placeholders. `scripts/research-references.mjs` documenta capturas de las referencias públicas. No hay generadores de imágenes ni alteración de rostros.

## Diseño y procedencia

[DESIGN.md](DESIGN.md) es la autoridad de tokens, composición y ritmo. `npm run design:tokens` exporta los tokens con la CLI oficial de Google DESIGN.md incluida en las skills; no editar `src/tokens.css` a mano.

Se leyeron y aplicaron Awesome Design MD, UI UX Pro Max, Google DESIGN.md, Taste e Impeccable. Las licencias y procedencia permanecen en `.agents/skills/`. La auditoría usa la adaptación local de Impeccable, no una CLI inexistente.

SISCO-EDU original: [repositorio](https://github.com/dfranco906/sisco-edu), [dashboard frontend](https://github.com/dfranco906/sisco-edu/blob/frontend/mvc/views/dashboard.php), [tema](https://github.com/dfranco906/sisco-edu/blob/frontend/public/css/theme.css). Main/develop sólo ofrecen un dashboard básico sin estilos; frontend contiene la interfaz sobria de panel claro, sidebar navy y módulos que se reconstruye aquí. No se copió el backend ni una sesión de usuario.

Referencias artísticas: los análisis completos Nike y Spotify de Awesome Design MD y sus sitios oficiales. Se toma protagonismo fotográfico y tipografía de campaña de Nike, y discreción de controles de Spotify; no se copian marcas ni secciones comerciales. Fuentes locales Space Grotesk e IBM Plex Mono con licencias en `public/licenses/`.

## Vercel

Preparado mediante `vercel.json`, lockfile y salida estática `dist`, sin variables de entorno.

Cuando se autorice publicar: importar `otiagoo44/sisco-edu-publico`, raíz del repositorio, preset Vite, instalación `npm ci`, build `npm run build`, salida `dist`, Node 24.x. La integración Git de Vercel puede generar despliegues automáticos si se conecta posteriormente. GitHub Actions sólo verifica; no despliega.

No se ejecuta un despliegue de producción sin instrucción expresa.
