---
version: alpha
name: OPERACIÓN PADRINO
description: Un expediente digital que se convierte en una invitación de la promo 2026.
colors:
  primary: "#255ce5"
  primary-hover: "#194bc7"
  on-primary: "#ffffff"
  canvas: "#080e1b"
  surface: "#0e1829"
  surface-raised: "#142137"
  ink: "#f4f7fc"
  muted: "#a5b2c8"
  cyan: "#77dfee"
  warm: "#ffc38c"
  border: "#596b86"
typography:
  display:
    fontFamily: Space Grotesk, Arial, sans-serif
    fontSize: 80px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.05em
  headline:
    fontFamily: Space Grotesk, Arial, sans-serif
    fontSize: 56px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -0.04em
  body:
    fontFamily: Space Grotesk, Arial, sans-serif
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  code:
    fontFamily: IBM Plex Mono, Consolas, monospace
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: IBM Plex Mono, Consolas, monospace
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.08em
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
  md: 8px
  full: 9999px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.lg}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
  terminal:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    typography: "{typography.code}"
    rounded: "{rounded.md}"
  narrative:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
  label:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
  highlight:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.cyan}"
  photo-note:
    backgroundColor: "{colors.warm}"
    textColor: "{colors.canvas}"
  secondary-hover:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
  divider:
    backgroundColor: "{colors.border}"
---

## Overview

Una experiencia cinematográfica interactiva para un profesor de Informática y sus alumnos. El visitante cree abrir SISCO-EDU; la terminal descubre recuerdos y revela una invitación personal. No es un sitio comercial: hay un escenario que cambia, cuatro capítulos y una decisión libre.

Dirección: expediente tecnológico nocturno, composición editorial asimétrica y fotografías reales con cercanía de álbum. Diales Taste: DESIGN_VARIANCE 7, MOTION_INTENSITY 7, VISUAL_DENSITY 3. La complejidad de movimiento se concentra en los 10,05 segundos de narración; las decisiones descansan en una composición estable.

Referencias Awesome Design MD leídas: Warp y Wired. De Warp se toma el rigor de terminal, la separación mono/narrativa y las superficies contenidas; se descartan paleta marrón, producto y tipografías. De Wired se toma la jerarquía editorial, el peso de la fotografía y las reglas finas; se descartan serif propietaria, blanco y negro, grilla de noticias y marca. Son análisis de terceros; procedencia y licencias originales permanecen en `.agents/skills/awesome-design-md/references/`.

UI UX Pro Max se ejecutó con `cinematic interactive storytelling dark --design-system`. Devolvió Hero + Features + CTA e Inter, poco apropiados para este encargo. No se persistió ese sistema: se rechazaron estructura SaaS, paleta clara y tipografía. El reintento dirigido `interactive storytelling --domain product` devolvió cero resultados; no hay una coincidencia de producto verificada. Se usan los criterios generales del brief, no un supuesto preset cinematográfico. Las consultas UX `reduced motion animation` y React `animation cleanup effects` sí devolvieron resultados relevantes sobre movimiento y limpieza. Este documento resuelve cualquier discrepancia.

## Colors

{colors.canvas} domina. {colors.primary} identifica acciones positivas; {colors.cyan} identifica conexión y énfasis técnico, nunca párrafos enteros. {colors.warm} aparece al revelar el afecto y la celebración. {colors.ink} es el texto principal; {colors.muted} conserva legibilidad en metadatos. Las luces azules son localizadas, de baja opacidad, debajo de las superficies; no hay malla multicolor ni gradientes de texto.

Los controles secundarios usan {colors.border}; los separadores puramente ornamentales pueden ser más tenues. Foco de 2px en cian y offset de 5px. El lint mide pares declarados y las pruebas inspeccionan estados renderizados; ninguno certifica WCAG por sí solo.

## Typography

Space Grotesk da una voz geométrica humana al título y la pregunta. IBM Plex Mono queda reservada para terminal, capítulos y metadatos. Fuentes locales con `font-display: swap`, sin peticiones a Google Fonts. Display fluido: 76–156px en el logotipo inicial; pregunta 44–80px; cuerpo 16–20px; etiquetas 12px. En 360px se reorganiza la pregunta antes que reducir el cuerpo. Líneas cortas, títulos equilibrados, información esencial sin truncar.

## Layout

Un escenario con `min-height: 100svh`, cabecera de 88px, contenido flexible y capítulos al pie en flujo normal. Ancho máximo 1440px; márgenes 56px en desktop y 24px en móvil (20px a 360px). Grilla asimétrica texto/imagen que se apila a 768px. No se intercepta scroll ni se bloquea el historial; en pantallas bajas el contenido puede crecer y desplazarse.

Espaciado base 8px con paso de 4px. La terminal tiene su propio espacio y evita tarjetas decorativas. El escenario de invitación respira: pregunta a la izquierda, retratos escalonados a la derecha; móvil prioriza pregunta y acciones. Los recuerdos se abren en un dialog nativo, cerrable con Escape y con restitución de foco.

## Elevation & Depth

Capas CSS: ambiente 0, contenido 1, confeti 3, controles 4; dialog usa top layer nativa. Fondos opacos bajo todo texto extenso. Profundidad de las fotos mediante pequeños giros y sombras navy, no desenfoque de rostros ni filtros de belleza. Una órbita fina contextualiza la conexión; no se repite como adorno en cada escena.

## Shapes

Terminal con {rounded.md}, botones con {rounded.sm}, fotografías con {rounded.none}. Esto representa objetos distintos con reglas constantes. El subrayado de padrino es SVG ligero original; los pequeños símbolos de consola se componen con tipografía. Evitar familias de iconos mezcladas y dependencias para flechas.

## Components

BootIntro: SISCO-EDU grande y terminal lista, sin cuenta atrás ni espera forzada. Iniciar activa boot 2s → Diagnostic 2,4s → GlitchTransition 0,55s → PhotoMontage 5,1s → Invitation. GSAP controla la coreografía, progreso narrativo y avance; cada timeline se revierte al desmontar. El progreso es de presentación, no de carga de red. La falla es desplazamiento breve sin destellos blancos ni estroboscopia.

PhotoMontage: tres fotos en máscaras, escala suave y texto por palabras. PhotoFrame tiene dimensiones reservadas y placeholder editorial cuando falla una foto. Manifest local; preload no bloqueante de las tres fotos usadas en la narración. WebP con escala, orientación y compresión sin retoque facial; originales intactos. Las fotos con filtros o collages ya aportados por la promo se conservan en el álbum y se describen como tales, sin generar nuevas modificaciones.

Invitation: aceptar, rechazar o pensarlo. El No se desplaza una sola vez ante un ratón; teclado y tacto responden inmediatamente, y reduced-motion elimina la broma. El rechazo y la duda tienen mensajes respetuosos y retorno voluntario. AcceptanceCelebration usa confeti canvas finito, cargado sólo al aceptar, con menos partículas en móvil y ninguna con movimiento reducido. No se comunica persistencia inexistente.

AudioControl: desactivado de inicio; acorde sintetizado local y discreto tras click explícito. Se suspende al ocultar la pestaña. SkipControl permanece disponible durante toda la introducción; Escape salta. Hay pausa; ocultar la pestaña pausa la coreografía. Reduced-motion muestra la invitación directamente, sin glitch ni confeti. La navegación y el foco permanecen libres. Sin JavaScript se muestra la invitación textual.

## Do's and Don'ts

- Sí: fotos autorizadas, palabras precisas, contraste medido, objetivos táctiles de al menos 44px y foco visible.
- Sí: una escena por estado, controles estables, pausa/salto, degradación de imágenes/audio.
- Sí: voz paraguaya cálida y pregunta respetuosa al profe; conservar literalmente los textos pedidos.
- No: bento, tarjetas de métricas, testimonios inventados, logotipos ajenos, morado automático o secciones comerciales.
- No: carga artificial, cursor reemplazado, navegación bloqueada, flash de pantalla, audio automático, rechazo imposible.
- No: decir que se envió o guardó una respuesta; no hay backend, analítica ni almacenamiento de respuestas.
- No: afirmar pruebas, capturas, puntuaciones o despliegues que no se ejecutaron.
