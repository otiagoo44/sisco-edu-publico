# Integración final: Operación Padrino / SISCO-EDU

Actualización posterior: los ocho alumnos ya tienen mensaje y fotografía publicados. Nahuel ocupa el séptimo lugar y Arturo cierra con tipografía grande, retrato y «Seguir viendo» hacia la invitación. Los dos textos nuevos se conservan literalmente en `docs/ARTURO-MESSAGE.txt` y `docs/NAHUEL-MESSAGE.txt`. Ahora hay veinte fotografías nuevas publicadas, además de las once anteriores del profesor. No quedan testimonios pendientes. El registro siguiente describe la integración original. El ritmo, encuadres y autoplay fueron revisados posteriormente según `VISUAL-REVISION.md`.

Fecha: 28 de octubre de 2026. Repositorio: `otiagoo44/sisco-edu-publico`. Arquitectura React, TypeScript, Vite y GSAP conservada; sin dependencias nuevas de runtime.

## Fotografías y mensajes

Se integraron **18 fotografías nuevas publicadas**: 12 recuerdos y 6 retratos de alumnos. Se conservan además las 11 fotografías anteriores del profesor: **29 fotografías disponibles** en la experiencia. No se cuentan como fotografías nuevas los cinco posters ni el fotograma de contexto extraído del video de competencia. Otras dos fotos de alumnos están preparadas para Arturo y Nahuel, cuyos testimonios permanecen en borrador.

| Destino | Fotografías nuevas | Contenido |
|---|---:|---|
| Dragón | 2 | Esqueleto, luego caja. Ocho segundos de lectura por etapa. |
| Arca | 2 | Interior y arca completa. Se presenta como proyecto de robótica simultáneo al dragón. |
| Brasil | 2 | Frente al mar y compañero con auriculares en la playa. |
| SISCO-EDU | 1 | Fotografía del curso en el aula como puente al proyecto actual. |
| Más recuerdos | 5 | Aula, selfie, colectivo, mesa y retrato informal. |
| Testimonios | 6 | Retratos individuales relacionados por los nombres de los archivos. |

**Seis mensajes publicados**, en orden: Ortega, Fio, Flor, Zarate, Mati y Thiago. Ortega fue ampliado por pedido expreso del autor, incorporando su inspiración en la fe, proyectos, excelencia, dedicación y paciencia del profesor. En Flor y Zarate se aplicaron las instrucciones editoriales de emojis con autorización explícita del usuario. Los demás testimonios conservan sus palabras, errores y puntuación; sólo se adaptan los saltos de línea a la composición. Los errores preservados se detallan en el inventario.

Cada testimonio tiene retrato completo, nombre, texto completo, índice, anterior/siguiente y selector de todos los nombres. No hay autoplay. El mensaje más largo usa al menos 22px, interlineado 1,5 y scroll natural, sin recorte ni límite de altura.

## Videos

**Cinco videos únicos integrados**; todos se muestran completos y empiezan silenciados. El baile se conserva en Competencias, precedido por cinco segundos de contexto real del mismo evento. No se añadieron subtítulos, voces, música ni acciones.

| Archivo original | Archivo web | Ubicación | Duración | Sonido |
|---|---|---|---:|---|
| `brasil/1000164097.mp4` | `brasil-playa.mp4` | Brasil, después de las fotografías | 5,734 s | AAC, activación manual |
| `competencias/1000164120.mp4` | `danilo-competencia.mp4` | Competencias, después del público del evento | 5,910 s | AAC, activación manual |
| `videos/1000164121.mp4` | `sombrero.mp4` | Más recuerdos, orden 6 | 3,800 s | AAC, activación manual |
| `videos/1000164127.mp4` | `encuentro.mp4` | Más recuerdos, orden 7 | 16,160 s | AAC, activación manual |
| `videos/video-danilo-gracioso.mp4` | `gesto.mp4` | Más recuerdos, orden 8 | 1,150 s | Original sin audio |

MP4 H.264/AAC con faststart, posters WebP, orientación y proporción originales, playsInline y controles nativos más botones claros de reproducción y sonido. Sólo se monta el video seleccionado y se precargan sus metadatos. Hay pausa, repetición, tratamiento del rechazo de play(), poster y aviso ante fallo. Se bloquea el cambio de capítulo mientras se reproduce; al terminar espera que el visitante continúe. Abrir la galería pausa el video del capítulo.

## Archivos reservados o descartados

| Archivo | Motivo |
|---|---|
| `videos/1000164124.mp4` | Duplicado exacto de `brasil/1000164097.mp4`, confirmado por SHA-256. Se publica una sola copia. |
| `alumnos/arturo.jpg` | Retrato preparado; no se publica como testimonio porque falta el mensaje. |
| `alumnos/nahuel.jpg` | Retrato preparado; no se publica como testimonio porque falta el mensaje. |

Los 27 originales se conservaron y sus hashes fueron contrastados después de preparar derivados. No hay archivos dañados o sin clasificar. `arca/1000164107.jpg` se reclasificó como Brasil tras comprobar que muestra la playa. Ninguna fotografía extra fue ignorada.

Los derivados nuevos, incluidos los dos retratos reservados, pesan aproximadamente **8 MiB más posters**, frente al material original sin optimizar. Se conserva calidad WebP 88, sin ampliación ni cambios de rostros. Los videos se recodifican sólo cuando reducen peso; de otro modo se remuxean sin pérdida. No se cargan todos simultáneamente.

## Validación

- `npm run build`: aprobado, TypeScript + validación de contenido + Vite. Bundle JS principal 334,97 kB, 110,38 kB gzip; CSS 41,61 kB, 8,90 kB gzip.
- `npm run content:check`: aprobado. Cinco capítulos, trece imágenes de recuerdos (doce fotografías y un fotograma de contexto), cinco videos y seis testimonios publicables. Verifica rutas, decodificación de imágenes, órdenes, descripciones, posters, codecs, faststart, sonido, duración, dimensiones y límites de recorte.
- `npm run design:lint`: aprobado, cero errores y cero advertencias.
- `npm test -- --workers=2`: **40 pruebas aprobadas**, escritorio y móvil, en 6,1 minutos. Se corrigió durante la primera pasada un selector de la propia prueba que confundía reproductor de fondo y galería; la suite final completa pasó sin fallos.
- Reproducción real de los cinco videos en ambos viewports: avance de currentTime, carga de frames, finalización, replay, mute/unmute, orientación inline, capítulos bloqueados mientras se reproduce y espera manual posterior. Ningún evento de reproducción fue simulado.
- Fallo intencional de un video: poster y aviso visibles, navegación disponible; no bloquea el recorrido.
- Mensajes reales: todos completos, retratos correctos por nombre de archivo, espera de 90 segundos virtuales por testimonio sin avance automático, fuente mínima de 22px y ausencia de texto cortado. Prueba adicional con 27 testimonios sintéticos, aislados en desarrollo, verifica escalabilidad y filtrado de borradores.
- Axe sin violaciones en las escenas auditadas; teclado, foco de modales, reduced-motion, pantalla neutral sin JavaScript, botones de la invitación, confeti, pausa, repetir y salto aprobados.
- **72 capturas** en 1440, 768, 390 y 360px. Revisión visual de hojas completas y vistas individuales, con correcciones de tamaño del arca en móvil, orden del collage de Brasil y enlace de salto fuera de pantalla. El registro final muestra cero errores de consola y cero desbordes horizontales en los cuatro tamaños.
- Sharp decodificó las veinte fotografías; FFmpeg decodificó completos los seis videos originales. Se revisaron seis fotogramas por archivo. Los hashes de los 27 originales coinciden tras la preparación. Git conserva también sus bytes originales, incluidos los finales de línea del documento de mensajes.
- `git diff --check` y `git diff --cached --check`: aprobados.

Las capturas reales cubren entrada, ambas etapas del dragón, ambas vistas del arca, Brasil, contexto y video de Competencias, SISCO-EDU, galería, los seis testimonios, pregunta e invitación aceptada. Tamaños: 1440, 768, 390 y 360px. Evidencia en [screenshots/final/](screenshots/final/), con registro de errores en [review.json](screenshots/final/review.json). Las hojas de revisión de todo el material original están en [media-review/](media-review/).

Las pruebas móviles usan emulación Chromium/Pixel 5; no equivalen a una prueba en un teléfono físico o Safari. Se verifican metadatos y decodificación de audio y controles de mute/unmute en navegador; no se certifica una escucha humana ni una transcripción de lo hablado. No se prometen métricas de campo ni certificación de accesibilidad.

## Pendientes y vista previa

- Faltan solamente los textos de Arturo y Nahuel para publicar los ocho testimonios. Sus fotos y registros ya están listos.
- No se proporcionaron capturas específicas del sistema ni fotos que documenten el desarrollo de SISCO-EDU. Se usó la foto real del curso, descrita como foto del aula, sin fabricar pantallas o resultados.
- La ubicación o fecha exacta de los extras no está confirmada; se conservaron en la galería complementaria sin atribuciones inventadas. El fotograma con auriculares es una fotografía de playa, diferente del baile del evento.
- Vista previa local: **http://127.0.0.1:4173/**. Pulsar «Iniciar sistema». La entrada continúa siendo SISCO-EDU y sólo revela la sorpresa después de esa interacción.
- No se ejecutó un despliegue manual a producción. El usuario autorizó el push a `main` al terminar. El repositorio conserva su configuración de CI y hosting existente.

Detalles de cada archivo y procedencia de las decisiones: [MEDIA-INVENTORY.md](MEDIA-INVENTORY.md). Instrucciones para incorporar los mensajes pendientes: [CONTENT.md](CONTENT.md).
