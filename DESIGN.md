---
version: alpha
name: SISCO-EDU / OPERACIÓN PADRINO
description: Acceso académico fiel al proyecto original y revelación editorial fotográfica.
colors:
  primary: "#182de0"
  primary-hover: "#1020ae"
  on-primary: "#ffffff"
  canvas: "#111429"
  surface: "#202746"
  surface-raised: "#30395e"
  ink: "#f5f2ea"
  muted: "#bbc4d6"
  cyan: "#c6ee72"
  warm: "#ff9e6c"
  border: "#657190"
  paper: "#f5f2ea"
  dark-ink: "#11172c"
  system-background: "#f8fafc"
  system-card: "#ffffff"
  system-primary: "#2563eb"
  system-primary-dark: "#1e40af"
  system-sidebar: "#0f172a"
  system-muted: "#526277"
  system-border: "#e2e8f0"
  system-nav: "#cbd5e1"
  system-tint: "#eff6ff"
  system-active: "#60a5fa"
typography:
  display:
    fontFamily: Space Grotesk, Arial, sans-serif
    fontSize: 96px
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: -0.065em
  headline:
    fontFamily: Space Grotesk, Arial, sans-serif
    fontSize: 64px
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: -0.055em
  body:
    fontFamily: Space Grotesk, Arial, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  code:
    fontFamily: IBM Plex Mono, Consolas, monospace
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.6
  system:
    fontFamily: Arial, system-ui, sans-serif
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px
rounded:
  none: 0px
  sm: 4px
  md: 12px
  lg: 16px
  full: 9999px
components:
  affirmative:
    backgroundColor: "{colors.cyan}"
    textColor: "{colors.dark-ink}"
    rounded: "{rounded.none}"
  negative:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  diagnostic:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
  photo-beat:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
  photo-beat-light:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.dark-ink}"
  system-panel:
    backgroundColor: "{colors.system-card}"
    textColor: "{colors.system-sidebar}"
    rounded: "{rounded.lg}"
    typography: "{typography.system}"
  system-nav:
    backgroundColor: "{colors.system-sidebar}"
    textColor: "{colors.system-nav}"
  system-page:
    backgroundColor: "{colors.system-background}"
    textColor: "{colors.system-muted}"
  system-action:
    backgroundColor: "{colors.system-primary}"
    textColor: "{colors.system-card}"
  system-action-hover:
    backgroundColor: "{colors.system-primary-dark}"
    textColor: "{colors.system-card}"
  system-accent:
    backgroundColor: "{colors.system-tint}"
    textColor: "{colors.system-muted}"
  system-focus:
    backgroundColor: "{colors.system-sidebar}"
    textColor: "{colors.system-active}"
  paper-detail:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.dark-ink}"
  status:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.muted}"
  warning:
    backgroundColor: "{colors.warm}"
    textColor: "{colors.dark-ink}"
  placeholder:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
  placeholder-base:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
  control-border:
    backgroundColor: "{colors.border}"
  system-divider:
    backgroundColor: "{colors.system-border}"
---

## Overview

Rediseño profundo de la dirección visual sobre la base existente React, TypeScript, Vite y GSAP. Se conservan componentes, manifest, fotos, audio, confeti y máquina de estados; se sustituye la narrativa anterior. Público: el profe Danilo y los alumnos paraguayos de BTI. Lenguaje: interfaz académica comprobada que se transforma en una pieza fotográfica directa y divertida, seguida por recuerdos confirmados y exploración manual de mensajes.

Dos mundos deliberados, autorizados por el brief. Antes de iniciar: SISCO-EDU claro, sidebar navy, Arial y módulos funcionales. Después: planos navy, azul ultramarino, papel, fotos grandes y tipografía contundente. No hay terminal decorativa, partículas ambientales, órbitas, mallas, notas cursis ni metáforas de programación.

Taste: modo redesign-overhaul para la dirección artística, preserve para arquitectura y assets. Diales DESIGN_VARIANCE 8, MOTION_INTENSITY 7, VISUAL_DENSITY 3 en la sorpresa; 3/2/5 en el dashboard. Se retiran texto sentimental, capítulos que anticipaban la pregunta y el salto automático por reduced-motion. La excepción a la recomendación de un solo tema es intencional: el cambio de mundo es el recurso narrativo solicitado.

Referencia auténtica investigada: [SISCO-EDU](https://github.com/dfranco906/sisco-edu). Main `906d8c1` y develop tienen `src/views/dashboard.php` sin estilos; frontend `f633007` contiene `mvc/views/dashboard.php`, sidebar, header y `public/css/theme.css`. También se contrastó frontend-recovery-audit `1cfb785`. Se toman módulos, estructura y colores comprobados de frontend, sin importar PHP, usuarios, credenciales, datos académicos ni backend. Los tokens system-* corresponden a esa interfaz, con un texto secundario algo más oscuro para contraste.

Awesome Design MD: se leyeron completos los análisis Nike y Spotify. Nike: imagen protagonista, tipografía de campaña, contraste de escala y poca interfaz alrededor. Se descartan marca, comercio, logos y fuentes propietarias. Spotify: controles discretos y contenido visual que concentra la atención; se descartan identidad verde, grillas de productos y densidad del reproductor. Se consultaron los sitios oficiales y se intentaron capturas reales, cuyo resultado se documenta en la auditoría; no se equipara una guía con una inspección visual.

UI UX Pro Max: consulta `photography editorial playful --design-system` devuelve Motion-Driven y Archivo/Space Grotesk. Se toma la prioridad de imagen y movimiento contextual, conservando Space Grotesk ya instalada; se rechaza cualquier estructura Hero + Features + CTA. Consultas `timeline sequence stagger --domain gsap`, `editorial bold --domain typography` y `touch pointer interaction --domain ux` contrastan alternativas. Los presets de stagger no sustituyen el tiempo real de lectura.

## Colors

{colors.system-background}, {colors.system-sidebar} y {colors.system-primary} reproducen el mundo académico. El único gradiente está en la cabecera del dashboard y proviene de la referencia real. No se extiende a la sorpresa.

{colors.primary} es una tinta plana y saturada para las fotografías y la pregunta. {colors.canvas} da pausa a diagnóstico y pre-pregunta. {colors.paper} diferencia el collage más gracioso y la celebración. {colors.cyan} conserva su nombre técnico de compatibilidad pero cambia a lima para el SÍ y el signo de pregunta: no es un brillo. {colors.warm} queda reservado al pendiente y un detalle de composición. {colors.dark-ink} sobre papel; {colors.ink} sobre navy/cobalto. Los colores sólo se definen en YAML y se exportan a CSS nativo.

## Typography

Arial/system-ui en la entrada, igual al fallback del frontend original sin tipografía personalizada. Space Grotesk local 400/500/600/700 para el resto. IBM Plex Mono sólo para números del álbum y ayudas de teclado, no para etiquetas decorativas. No se agrega una familia nueva.

Mensajes de 2–6 palabras, títulos de 40–118px según viewport, cuerpo 16–20px. La pregunta usa mayúsculas porque es el momento destacado solicitado; el resto evita el exceso de rótulos. No hay frases sentimentales. El mensaje de aceptación conserva literalmente el texto pedido, dividido entre título y párrafo.

## Layout

Dashboard: sidebar de 256px, contenido claro, seis módulos auténticos; menú operable en móvil. La entrada no muestra controles cinematográficos, fotos, alusiones a promoción, recuerdos, invitación, padrino o sorpresa. Tampoco los muestra title, description, OG, Twitter, favicon o noscript. Escape antes de iniciar no revela nada. No se piden credenciales.

Sorpresa: encabezado y pie discretos, un solo escenario, lectura central de mensajes y tres collages que cambian de composición. No es una landing con secciones. En móvil los títulos ocupan la franja superior y tres retratos escalonados la inferior; las caras permanecen visibles. No hay scroll hijacking; pantallas bajas pueden desplazarse.

Pregunta: composición de texto grande y una foto formal sonriente, con un área independiente para SÍ/NO. Celebración: composición festiva de seis fotografías, mensaje grande y confeti finito. El álbum completo queda como función secundaria después de aceptar.

## Elevation & Depth

Dashboard: bordes y sombra suave de la referencia. Sorpresa: profundidad a través de recorte, solapamiento y tamaño de fotografías; bordes finos de papel, sin sombras de tarjetas ni glassmorphism. Capas: escenario 1, collage 2, confeti 3, controles 4, menú 8, acceso por teclado 10, dialog en top layer nativa.

Las fotos no se filtran ni se retocan. Los filtros y el collage de personaje ya estaban en los originales aportados; se usan como parte del chiste.

## Shapes

Paneles académicos con {rounded.lg}, navegación con {rounded.md}, controles de reproducción redondeados por función, botones de decisión rectangulares. Fotos con esquinas rectas. No hay stickers con frases ni decoraciones técnicas sin propósito. La marca inicial es SISCO-EDU en texto, sin inventar un logo del proyecto original; favicon S funcional.

## Components

BootIntro tiene dos modos: dashboard inactivo y verificación después del clic. Diagnostic muestra primero “Se encontró un pendiente.” y después “Analizando candidatos...”, en planos separados. GlitchTransition hace un corte mediante tres máscaras, sin texto rápido ni destellos.

PhotoMontage organiza nueve originales diferentes en tres composiciones: [7,5,10] retratos normales; [2,3,4] espontáneas y filtro; [1,9,0] viaje, personaje y sonrisa. El índice 6 acompaña la pregunta. Son diez fotos diferentes hasta la pregunta; seis reaparecen al aceptar. Se precargan al iniciar, nunca antes, sin esperar a la red para decidir. Manifest ausente y errores de imágenes tienen fallback sobrio.

Timing explícito en state.ts: boot 4s, diagnostic 7,7s, corte 0,45s, montage 17s, total 29,15s hasta los recuerdos. Cada beat distingue entrada, lectura y salida. Diagnóstico conserva 3,3–3,4s totalmente visible; collage entra en hasta 0,9s y mantiene 3,3s con los tres retratos completos; “¿Se acuerda de esto, profe?” mantiene 3,2s tras la entrada. Cada imagen del recuerdo tiene 0,85s de entrada, 5–9s de lectura según contenido y 0,25s de margen. Dragón y arca tienen 8s por fotografía; Brasil 7s, contexto de competencia 5s y foto del curso 9s. La secuencia recorre todas las imágenes, no sólo la primera. Todo video espera un clic y no avanza al terminar: el visitante elige cuándo seguir. No existe una duración total impuesta. Interactuar con los controles pasa ese capítulo a exploración manual; reduced-motion también deja manual el álbum. Los alumnos nunca tienen autoplay. Timeline principal y pausa son GSAP, con limpieza por contexto y conservación de posición al cambiar reduced-motion en la introducción. La invitación nunca avanza sola.

Invitation: sólo SÍ puede aceptar. NO se mueve repetidamente con proximidad de ratón, pointerdown táctil, Enter/Espacio o click de asistencia. Su área está acotada al lado del SÍ y no lo cruza. Los eventos se previenen sólo sobre NO; Tab, Escape, navegación y scroll permanecen libres. Con reduced-motion el salto es inmediato, sin interpolación. Esta interacción lúdica se solicita explícitamente en el brief; no es una confirmación persistida ni una implementación de consentimiento. No hay estado declined ni pantalla de rechazo.

AudioControl se conserva apagado, visible sólo después de iniciar. SkipControl aparece tras iniciar con pausa/continuar/salto y Escape. Reduced-motion conserva la entrada SISCO-EDU y la narrativa, simplificando las entradas a cortes estáticos y eliminando el confeti. Nunca revela la sorpresa antes del clic. Sin JavaScript sólo queda SISCO-EDU y la indicación para iniciarlo.

MemoryJourney conserva cinco capítulos y arquitectura React/GSAP. Público: Danilo y su curso; propósito: reconocer recuerdos reales antes de leer los testimonios; lenguaje visual: álbum editorial cinematográfico, con interfaz académica inicial intacta. En esta integración se conservan los diales 8/7/3 de la sorpresa; la intensidad baja en lectura y reproducción, donde los controles importan más que el movimiento. Dragón y arca se presentan como proyectos de robótica simultáneos, confirmado por el usuario: esqueleto y luego caja, sin inventar etapas. El arca muestra dos fotografías completas en paralelo en escritorio y una grande a la vez en celular. Brasil usa collage inclinado con entradas verticales alternadas. Competencias muestra primero público real del clip y después revela a Danilo bailando con acercamiento suave, sin subtítulos inventados. SISCO-EDU conecta con la fotografía del curso; no se recibieron capturas específicas del sistema. Los cinco extras fotográficos y tres videos de contexto no confirmado tienen galería manual complementaria. No se adjudican por nombre de carpeta.

`src/content/memories.ts` define una secuencia discriminada `MemoryMedia` de imágenes y videos, con orden, descripción, poster, dimensiones, duración, sonido y recorte opcional. ChapterVideo monta sólo el video activo, carga sus metadatos, usa MP4 H.264/AAC y playsInline, comienza silenciado y ofrece reproducción, pausa, repetición y sonido explícitos. Durante reproducción bloquea cambios de capítulo; un fallo conserva poster y navegación. Al abrir la galería se pausa el reproductor del capítulo. No se monta ningún video antes de iniciar SISCO-EDU. Se contrastó la implementación con [MDN video](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video) y [HTMLMediaElement.play](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play).

Aplicación de las cinco skills en esta integración: Awesome Design MD conserva Nike (fotografía protagonista) y Spotify (controles funcionales discretos), sin copiar sus marcas, paletas o fuentes. UI UX Pro Max, consulta local `video playback controls --domain ux`, confirmó click-to-play, controles de avance, pausa y foco visible; se aplican sin inventar subtítulos. Google DESIGN.md conserva los tokens aprobados y su lint oficial. Taste guía el montaje según contenido y la variación de entradas, sin librerías nuevas. Impeccable dirige la revisión de capturas a 360/390/768/1440, el tamaño de las fotos del arca en móvil, el scroll de textos largos y la eliminación de solapamientos con controles. También se revisa React Best Practices para hooks, limpieza, semántica y carga de medios. Evidencia: docs/MEDIA-INVENTORY.md y docs/screenshots/final/.

StudentsChapter usa retrato grande, nombre y mensaje real con entrada individual. Anterior/siguiente, vista general nativa con todos los nombres y salida directa a la pregunta permiten cualquier cantidad de alumnos sin lectura obligatoria. Sólo aparecen registros completos y publicados de `src/content/students.ts`: seis mensajes reales, con Arturo y Nahuel reservados en borrador hasta recibir texto. Ortega se amplió por pedido expreso del autor; Flor y Zarate llevan los emojis indicados, autorizados por el usuario. Los demás testimonios conservan sus palabras. Los mensajes largos usan 22–29px e interlineado 1,5, con scroll natural y sin límite de altura. La pregunta final nombra correctamente a **Danilo**.

En la escena manual de alumnos, los controles globales de móvil se mantienen en el flujo del pie para no tapar declaraciones largas. En la introducción automática siguen disponibles como control flotante con espacio inferior reservado.

Los cambios de tema aplican el color del texto sin interpolación, para conservar contraste durante el corte entre papel y navy. Las microinteracciones de controles pueden animar fondo y borde.

## Do's and Don'ts

Actualización cinematográfica: fotografías con dimensiones intrínsecas, fondos transparentes y máximo de altura adaptado al viewport. El arca presenta una foto distinta por paso; Brasil introduce un collage en el segundo paso. Títulos separados por palabras con máscaras GSAP, entradas distintas por composición y salida visible de cada foto. Permanencia de 1,8 segundos después de la entrada, más 0,25 de salida. Los videos del recorrido intentan autoplay con sonido tras iniciar el sistema; ante rechazo se intenta reproducción silenciada y se ofrece activar sonido. Al finalizar avanzan al siguiente recuerdo. La navegación explícita permite explorar manualmente. Testimonios siempre manuales. Esta actualización sustituye las reglas anteriores de 5–9 segundos y videos click-to-play. Las referencias Nike/Spotify se aplican a protagonismo fotográfico y controles discretos, conservando tokens; Taste 8/7/3, UI UX stagger 35ms y revisión Impeccable en cuatro tamaños.

- Sí: partir del frontend comprobado y documentar rama/commit; diferenciar reconstrucción estática de una sesión del backend real.
- Sí: leer textos después de que aparezcan, reconocer las fotos y mantener la pregunta estable.
- Sí: comprobar ratón, tacto, teclado, reduced-motion, cambios de tamaño y contraste con capturas.
- Sí: conservar los assets autorizados y el motor existente, sin nuevas dependencias de runtime.
- No: cursilería, metáforas de commits, terminales decorativas, partículas ambientales o callbacks de aceptación desde NO.
- No: credenciales, datos académicos inventados, cifras de alumnado o sesiones falsas.
- No: afirmar envío, guardado, notificación, métricas de campo ni certificación de accesibilidad.
- No: publicar producción sin autorización explícita; el push a main sí está autorizado.
