# Montaje sin fotografías repetidas

La última selección sustituye las ubicaciones anteriores del inventario original. No modifica ni borra los archivos originales.

| Escena | Fotos |
|---|---|
| Candidato encontrado | Retrato de brazos cruzados 1000160942, foto del aula 1000164122 y foto grupal 1000164125 |
| No hay dudas | Exterior 1000160927, filtro aportado 1000160931 y selfie 1000164123 |
| Estamos 100% seguros | Viaje 1000160924, personaje aportado 1000160946 y colectivo 1000164126 |
| Es por acá, profe | SMILE 1000160923 y mesa 1000164129 |
| Dragón | Esqueleto y caja, una vez cada uno |
| Arca | Interior y exterior, una vez cada uno |
| Brasil | Frente al mar y auriculares; luego video de playa |
| Competencias | Fotograma de contexto, seguido por el video de Danilo bailando |
| SISCO-EDU | foto-danilo-gracioso.jpg, una sola vez aunque fue adjuntada dos veces |
| Antes de los alumnos | Gesto en bucle de tres vueltas; sombrero; encuentro en bucle de dos vueltas |
| Alumnos | Ocho retratos, una vez cada uno; Arturo último |
| Pregunta | Retrato sonriente 1000160940, reservado para esta escena |
| Celebración | Perfil 1000160938, reservado para el cierre, más confeti |

Se excluye del recorrido 1000160932 porque es un recorte de la nueva foto del colectivo. Los retratos 1000160944 y 1000160948 se reservan fuera del montaje por similitud de pose con otras tomas. Ningún original se elimina. Tampoco se vuelve a exponer el material en una galería o un botón de repetir.

`scripts/check-content.mjs` verifica unicidad de rutas y hashes de las fotos seleccionadas entre montaje, recuerdos, alumnos, pregunta y celebración. Los posters de video y el fotograma de contexto son derivados del metraje, no nuevas fotografías originales. El video duplicado de playa sigue excluido. Los bucles de video son intencionales y finitos; no duplican el recurso entre capítulos.

Fio: cambio autorizado por el usuario a «Sos mas pesado que mi ex.»; se conserva el resto del mensaje y el original aportado.

Los textos de cada capítulo se animan una sola vez. Cambiar solamente la foto o el video no reinicia la animación de título ni descripción. Al terminar los ocho testimonios, «Seguir viendo» abre cuatro frases de agradecimiento antes de revelar la invitación. No hay botón en la cabecera para saltar a la pregunta ni controles de salto/repetición de la película.

Evidencia actual: `docs/screenshots/curated/`. La captura recorre la interfaz por tiempo; acelera el final de los videos sólo para capturar las composiciones. La reproducción completa y los bucles reales se verifican por separado en `tests/autopilot.spec.ts`.

## Validación de esta distribución

- Build aprobado con seis capítulos, cinco videos únicos y ocho testimonios publicados.
- Dieciséis pruebas de escritorio/móvil aprobadas. Cubren los cinco videos completos, sonido permitido/bloqueado, tres vueltas reales del gesto y dos del encuentro, unicidad de imágenes durante el recorrido completo, estabilidad del texto del arca, textos íntegros, Fio corregida, Arturo último, botones de invitación, ausencia de salto/repetición y accesibilidad.
- Dos pruebas adicionales aprobadas tras retirar el botón de cabecera: sólo «Seguir viendo» inicia el agradecimiento y después la pregunta, en ambos tamaños.
- Lint oficial de diseño sin errores ni advertencias; diff sin errores de espacios.
- Ciento veintiocho capturas a 1440, 768, 390 y 360px, con cero errores de consola y cero desbordes horizontales en el registro. El montaje inicial se regeneró después de ajustar marcos y solapamientos de fotografías.
- Las pruebas anteriores que dependían de controles de salto/repetición y galerías se sustituyeron por pruebas del flujo solicitado; no se marcaron como omitidas.
- Vista previa: http://127.0.0.1:4173/. No se ejecuta un despliegue manual a producción.
