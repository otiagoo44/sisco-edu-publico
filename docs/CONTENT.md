# Contenido final y mantenimiento

Última actualización: el recorrido ya no tiene galerías repetidas ni controles de capítulos, salto o repetición. Los extras seleccionados forman parte del montaje inicial y los videos forman un capítulo antes de los alumnos. Los bucles nativos se limitan con `repeatCount` (gesto: 3; encuentro: 2), y continúan automáticamente. Tras el último testimonio, sólo «Seguir viendo» inicia el nuevo estado `before-question` y sus cuatro frases. La distribución vigente está en [MEDIA-PLACEMENT.md](MEDIA-PLACEMENT.md), que sustituye las ubicaciones históricas indicadas más abajo.

Actualización de reproducción: el recorrido principal ahora avanza automáticamente con 1,8 segundos de permanencia por foto, además de sus transiciones. Los videos intentan iniciar con sonido y continúan al siguiente recuerdo al terminar. Si el navegador bloquea el sonido, se intenta autoplay silenciado con un control explícito para activarlo. Usar la navegación de capítulos/fotos cambia a exploración manual; Repetir capítulo retoma el montaje. Los testimonios y la galería complementaria siguen siendo manuales. Estas reglas reemplazan las indicaciones anteriores de click-to-play para el recorrido principal.

El material original está en `material-final/` y permanece intacto. El inventario completo con clasificación visual, duplicados, destinos y hashes está en [MEDIA-INVENTORY.md](MEDIA-INVENTORY.md). El dragón y el arca fueron proyectos de robótica simultáneos, confirmado por el autor.

## Mantener los mensajes

En `src/content/students.ts` están los ocho mensajes publicados con sus retratos. Nahuel es el séptimo y Arturo cierra la sección con una composición destacada. Sus mensajes llegaron después de la entrega inicial y sus fuentes literales están en `docs/NAHUEL-MESSAGE.txt` y `docs/ARTURO-MESSAGE.txt`. Para agregar otro alumno, completá nombre, retrato, mensaje real y orden, y usá `status: "published"`.

No reejecutes `scripts/import-final-students.mjs` después de editar manualmente testimonios: ese script reproduce la importación inicial desde `material-final/mensajes.txt` y sobrescribe students.ts. Si elegís usarlo, actualizá primero el documento fuente. Ortega tiene una ampliación expresamente solicitada por su autor. Las instrucciones editoriales de emojis de Flor y Zarate se aplicaron con autorización. Los demás textos mantienen sus palabras y errores originales.

Cada mensaje es manual, con anterior/siguiente, índice y selector de todos los nombres. Nunca tiene autoplay ni límite de altura. Los retratos se muestran completos. No se publica un registro en borrador; marcar como publicado un registro incompleto hace fallar la validación.

## Fotos y videos

`src/content/memories.ts` contiene cinco capítulos con una propiedad `media`, que intercala imágenes y videos. Las imágenes usan `{ type: "image", order, caption, holdSeconds, image: { src, alt, fit } }`. Las rutas públicas empiezan en `/media/` y sus archivos viven bajo `public/media/`.

Los videos usan `{ type: "video", src, poster, alt, caption, chapter, order, duration, width, height, sound }`. `sound` admite `available` o `silent`; todos empiezan silenciados. Se pueden agregar `start` y `end` en segundos del archivo servido, con `0 <= start < end <= duration`. No se recorta ni transforma el original. Cada video activo carga sólo metadatos hasta reproducir. Los capítulos no avanzan mientras se reproduce y esperan una acción manual incluso después de terminar.

Para un video nuevo, prepará MP4 H.264 y AAC con faststart, además de un poster WebP que represente el contenido. Las dimensiones y duración deben corresponder al archivo servido. No agregues voces, acciones, identidades, fechas o subtítulos no comprobados.

`extraMemories` es la galería complementaria manual: fotos del aula, selfie, colectivo, mesa y retrato; videos de sombrero, encuentro y gesto. Allí se conservan recuerdos que no pueden adjudicarse con certeza a un viaje o competencia. Se monta un único video a la vez. No hay nuevas dependencias de runtime.

Las fotos usan WebP, orientación original y `contain` para conservar caras y proyectos. Un fotograma del público del video de competencia funciona como contexto, no como una foto original adicional. No se recibieron capturas específicas del desarrollo de SISCO-EDU: se usa la foto real del curso como conexión narrativa, con descripción fiel al aula.

## Herramientas reproducibles

```sh
node scripts/inspect-final-media.mjs
node scripts/prepare-final-media.mjs
node scripts/write-media-inventory.mjs
npm run content:check
npm run design:lint
npm run build
npm test
```

Los tres scripts de medios requieren FFmpeg y FFprobe; generan derivados, metadatos y hojas de contacto, sin modificar originales. El build utiliza Sharp para verificar imágenes y la estructura MP4 para validar codec y faststart; si FFprobe está disponible también contrasta duración y dimensiones reales. No requiere FFmpeg para publicar los derivados ya preparados.

```sh
npm run preview -- --port 4173 --strictPort
node scripts/capture-final-review.mjs
```

La vista previa está en `http://127.0.0.1:4173/`. El script de capturas requiere Chrome instalado y guarda vistas reales de escritorio, tablet y celular en `docs/screenshots/final/`. El build no despliega ni envía respuestas. No hay backend, guardado, mensajes a terceros ni credenciales.
