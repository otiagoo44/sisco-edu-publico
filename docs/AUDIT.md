# Auditoría de rediseño y ampliación — OPERACIÓN PADRINO

Revisión realizada con la [adaptación local de Impeccable](../.agents/skills/impeccable/SKILL.md) y su [guía de revisión](../.agents/skills/impeccable/references/design-review.md). No se ejecutó una CLI de Impeccable: esta skill no la incluye. Las otras cuatro skills se aplicaron según el registro de [referencias](REFERENCE-STUDY.md). Se revisaron también efectos, limpieza de listeners, referencias transitorias y carga condicional con las reglas React de Vercel.

## Alcance y contenido real

Se conserva React, TypeScript, Vite, GSAP, el manifest y las once fotografías existentes del profesor. El nombre correcto es **Danilo**. La nueva dirección separa el dashboard académico inicial de una secuencia editorial con fotografías, tipografía grande y fondos planos.

Los cuatro hechos históricos fueron proporcionados por la promoción: dragón, arca de robótica, Brasil y SISCO-EDU. No se recibieron fotos de esos proyectos ni declaraciones individuales. Hay cuatro recuerdos configurados y **cero fotografías históricas/cero testimonios publicables**. Los espacios pendientes sólo aparecen en desarrollo; producción no contiene declaraciones, nombres o imágenes históricas inventadas. Los fixtures de pruebas están claramente rotulados y sólo se inyectan en el navegador de tests.

## Evidencia visual

Se generaron capturas reales de Chrome contra el build local en **1440, 768, 390 y 360px**: entrada, tres composiciones del profesor, cuatro recuerdos, alumnos, invitación y aceptación. Se inspeccionaron composiciones de escritorio, tablet y móvil; además, placeholders de desarrollo y una sección de alumnos poblada con material de prueba. Los fotogramas se capturan después de una entrada real y se pausan mediante los controles; Clock permite reproducir posiciones de la coreografía. No son mockups dibujados.

| Pantalla | Evidencia |
| --- | --- |
| SISCO-EDU inicial | [1440](screenshots/sisco-1440.webp), [768](screenshots/sisco-768.webp), [390](screenshots/sisco-390.webp), [360](screenshots/sisco-360.webp) |
| Profesor: selección formal | [1440](screenshots/montage-formal-1440.webp), [390](screenshots/montage-formal-390.webp) |
| Profesor: momento espontáneo | [1440](screenshots/montage-playful-1440.webp), [390](screenshots/montage-playful-390.webp) |
| Dragón | [1440](screenshots/memory-dragon-1440.webp), [390](screenshots/memory-dragon-390.webp) |
| Robótica | [1440](screenshots/memory-robotica-1440.webp), [390](screenshots/memory-robotica-390.webp) |
| Brasil | [1440](screenshots/memory-brasil-1440.webp), [390](screenshots/memory-brasil-390.webp) |
| SISCO-EDU actual | [1440](screenshots/memory-sisco-edu-1440.webp), [390](screenshots/memory-sisco-edu-390.webp) |
| Pendientes visibles sólo en desarrollo | [Dragón 390](screenshots/development-memory-dragon-390.webp), [alumnos 390](screenshots/development-students-390.webp) |
| Alumnos: fixture explícito, sin personas ni testimonios reales | [Escritorio](screenshots/students-demo-1440.webp), [móvil](screenshots/students-demo-360.webp) |
| Pregunta | [1440](screenshots/invitation-1440.webp), [768](screenshots/invitation-768.webp), [390](screenshots/invitation-390.webp), [360](screenshots/invitation-360.webp) |
| Celebración | [1440](screenshots/accepted-1440.webp), [390](screenshots/accepted-390.webp) |

## Hallazgos corregidos

| Ubicación | Evidencia / efecto | Gravedad | Corrección comprobada |
| --- | --- | --- | --- |
| Entrada, metadatos, noscript y estado inicial | La versión anterior revelaba la intención antes de empezar; Escape/reduced-motion también podían adelantarla. | Alta | Dashboard derivado del frontend original, título/favicon/vista previa neutrales, inicio explícito; test sin JS y sin solicitudes de fotos previas. |
| Timelines y `state.ts` | Mensajes anteriores avanzaban antes de poder leerlos. | Alta | Separar entrada, lectura y salida; al menos 3,2s de lectura completa en cada beat importante; prueba con reloj normal y MutationObserver. |
| Montaje formal | El título grande se superponía a una fotografía en la primera revisión desktop/tablet. | Media | Reducir su medida y reservar un área propia a los retratos; nueva captura en 1440 y 768px. |
| `KineticText.tsx` | Axe detectó `aria-label` prohibido sobre un span genérico. | Alta | Texto completo para lector de pantalla y palabras animadas ocultas a accesibilidad; la suite axe pasa. |
| Vista general de alumnos | Escape cerraba el diálogo y además saltaba toda la narración. | Alta | El listener global ignora Escape cuando hay un diálogo abierto; prueba de cierre y retorno del foco en ambos dispositivos. |
| Recuerdos/alumnos al navegar con pausa | La nueva imagen podía quedar detenida dentro de su máscara de entrada. | Media | Mostrar la composición legible al cambiar manualmente con pausa; fotos y mensajes siguen explorables sin autoplay. |
| Exploración de fotos y capítulos | El temporizador podía continuar mientras el profesor exploraba controles. | Media | Uso o foco de controles activa modo manual; el test espera 20s y verifica que no cambia de capítulo. |
| Fotografías futuras del grupo | Un recorte por defecto podía ocultar compañeros o parte del proyecto. | Media | Recuerdos completos con `contain`, ajuste opcional de encuadre; capturas del sistema siempre completas. |
| Alumnos en móvil | La captura poblada mostró controles flotantes sobre una línea del mensaje. | Media | En esta escena manual los controles pasan al pie en flujo normal; comprobación de que quedan después del mensaje y nueva captura. |
| Cambio de recuerdos a alumnos | CI detectó controles con contraste de 4,48:1 mientras el color heredado se interpolaba sobre el nuevo fondo oscuro. | Alta | Retirar la transición global del color del texto: los cambios de escena aplican el contraste final inmediatamente; se conservan las transiciones de fondo y borde. |
| Botón NO | El comportamiento anterior se detenía y ofrecía otra pantalla. | Funcional | Reposición repetida por proximidad, tacto y Enter/Espacio, zona acotada sin cruzar SÍ; sólo SÍ cambia a aceptación. |

## Verificación funcional y accesibilidad

La ejecución completa local pasó **30/30 pruebas** en 5,4 minutos: quince pruebas en Chrome de escritorio y quince en móvil con tacto emulado. El recorrido principal se ejecutó con reloj normal en ambos; los otros escenarios usan Clock instalado antes de navegar. La suite cubre:

- Entrada sin pistas, navegación académica local, metadatos, favicon y alternativa sin JavaScript.
- Nueve fotografías distintas en el montaje; tiempos contados después de completar las entradas y lectura de mensajes; unos 29,15s hasta los recuerdos y alrededor de 51s hasta alumnos.
- Los cuatro recuerdos, configuración con cinco fotos variables, pausa, continuar, navegación manual, repetición y salto.
- Veintisiete alumnos de prueba, sin límite fijo; borradores/incompletos ocultos; mensajes sin avance tras 90s; anterior/siguiente, selección general, cierre con Escape, foco y continuación sin leer todos.
- NO se escapa en seis intentos sucesivos con ratón/tacto, mantiene el chiste con Enter/Espacio y nunca acepta. SÍ activa fotos y confeti.
- Reduced-motion conserva la entrada, simplifica movimiento y elimina confeti; audio sigue apagado hasta acción explícita.
- Manifest ausente o pendiente, fotos fallidas, ausencia de persistencia y reflow en los cuatro anchos requeridos.
- Axe en entrada, recuerdos, alumnos, invitación y celebración; también en alumnos con contenido de prueba. Sin violaciones detectadas de las reglas WCAG incluidas.

Axe y pruebas de teclado automatizadas no constituyen certificación WCAG ni una revisión completa con lector de pantalla. Se conserva foco visible, controles táctiles de al menos 44px, navegación de diálogo y nombres accesibles. La broma de NO es una excepción solicitada expresamente; no se presenta como un sistema de consentimiento.

Después del último ajuste de encuadre se repitieron las dos pruebas de fotografías variables. Tras mover los controles móviles de alumnos se repitieron seis pruebas de alumnos, axe y responsive: todas pasaron. Se regeneraron las capturas afectadas para que reflejen ese ajuste.

La primera ejecución remota pasó 28/30 y detectó el contraste transitorio registrado arriba. Tras corregirlo se ejecutaron cuatro pruebas de alumnos y axe con Chromium, en la configuración de CI: **4/4 correctas**. El resultado remoto posterior se informa por separado mediante el enlace a GitHub Actions.

## Calidad y rendimiento

- Google DESIGN.md: **cero errores y cero advertencias**; exportación real de tokens a CSS.
- Build de TypeScript y Vite correcto; valida existencia/alt de medios, identificadores y fechas confirmadas. Estado actual informado por el chequeo: cuatro recuerdos, cero fotos históricas, cero mensajes publicables.
- `npm audit`: **cero vulnerabilidades**. No se agregaron dependencias.
- JavaScript principal: aproximadamente **106,69 KB gzip**; CSS **8,31 KB gzip**; confeti separado **0,67 KB gzip**, importado únicamente al aceptar.
- Las once fotografías existentes se conservan; sin rostros generados, sustituciones históricas ni retoques de identidad. Preload no bloqueante después de iniciar, fallback de errores y dimensiones reservadas.
- GSAP usa contextos y limpieza; reposición de NO por refs, sin renderizar React en cada movimiento del puntero. Pestaña oculta pausa la secuencia. Sin canvas permanente, video ni backend.
- [Lighthouse móvil](lighthouse-summary.json): rendimiento 77, accesibilidad 100, buenas prácticas 100; LCP 1,7s y CLS 0. El tiempo de bloqueo total fue 1010ms bajo emulación: queda como límite observado de carga inicial, sin presentarlo como rendimiento perfecto. Es una medición de laboratorio de la entrada local, no datos reales de Vercel o dispositivos físicos.

## Entrega y límites

[CONTENT.md](CONTENT.md) explica cómo cargar las fotos y mensajes sin editar componentes o animaciones. Hay carpetas preparadas, cuatro composiciones y fechas opcionales confirmadas. Los alumnos incompletos nunca se publican como personas reales.

La emulación se realizó con Chrome/Playwright; no se probó físicamente en Safari/iPhone o Android. Las futuras fotos y declaraciones requieren revisar su contenido y encuadre cuando se carguen. No hay backend, autenticación, guardado ni notificación de aceptación. `vercel.json` conserva salida estática y no exige variables de entorno. No se ejecutó un despliegue de producción; GitHub Actions verifica el push a main y no despliega.
