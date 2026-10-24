# Cargar recuerdos y mensajes de la promo

El nombre confirmado es **Danilo**. Los hechos del dragón, arca, Brasil y proyecto de grado fueron aportados por la promoción. Todavía no se recibieron sus fotos históricas ni mensajes individuales: no se generaron sustitutos ni testimonios.

## Recuerdos

1. Copiá fotos autorizadas a la carpeta correspondiente:
   - `public/media/recuerdos/dragon/`
   - `public/media/recuerdos/robotica/`
   - `public/media/recuerdos/brasil/`
   - `public/media/recuerdos/sisco-edu/`
2. Abrí `src/content/memories.ts` y completá `photos` en el recuerdo.
3. Guardá el archivo. Vite actualiza la vista; para publicar el cambio hay que generar un build nuevo.

```ts
{
  id: 'dragon',
  title: 'Primer curso. Nuestro dragón.',
  description: 'Empezamos construyendo un dragón.',
  order: 1,
  composition: 'construction',
  photos: [
    { src: '/media/recuerdos/dragon/construccion.webp', alt: 'Describí lo que realmente muestra esta fotografía' },
    { src: '/media/recuerdos/dragon/resultado.webp', alt: 'Describí la fotografía del resultado' },
  ],
}
```

Los nombres de archivo anteriores son instrucciones; esos archivos no existen hasta que los cargues. La ruta pública empieza en `/media`, sin `public`. Se admiten WebP, JPEG y PNG. Usá nombres simples sin espacios. Recomendación: WebP de 1200–1600px en su lado mayor, manteniendo la orientación y el rostro sin modificar. Conservá los originales por separado.

Las fotos de recuerdos se muestran completas por defecto para no cortar compañeros o partes del proyecto. Cada foto admite `fit: 'cover'` si preferís llenar el marco y `position: '50% 25%'` para ajustar ese encuadre sin modificar el archivo. Los retratos de alumnos usan `cover` por defecto y también admiten `fit: 'contain'`. Las capturas auténticas deben usar `kind: 'screenshot'` y siempre se muestran completas.

`order` define el orden de capítulos. `navLabel` es un nombre corto opcional para su botón; si se omite se usa el título. `photos` admite una cantidad variable, sin cambiar componentes. Se muestran hasta dos imágenes como composición inicial; anterior/siguiente recorre todas. Al usar o enfocar los controles del capítulo se detiene el avance automático para explorar con calma. “Siguiente capítulo” cambia manualmente de etapa y “Repetir capítulo” reinicia el adelanto automático. El tiempo de lectura se adapta al largo del texto.

Las composiciones disponibles son:

| Valor          | Uso                                                     |
| -------------- | ------------------------------------------------------- |
| `construction` | Construcción y resultado, fotografías a dos escalas     |
| `blueprint`    | Arca/robótica, plano gráfico abstracto y fotografías    |
| `travel`       | Viaje, collage inclinado y cambio de color              |
| `workspace`    | Trabajo y capturas, encuadres rectos y captura completa |

Podés agregar recuerdos con identificadores únicos y una de esas composiciones. No hay un límite de fotos o de recuerdos codificado. No agregues fechas aproximadas: si una fecha está comprobada podés incluir `date: { label: 'Texto de la fecha confirmada', confirmed: true }`. De lo contrario omití el campo.

Si `photos` está vacío, desarrollo muestra “Fotografías pendientes / Sólo visible en desarrollo”. El build de producción conserva únicamente el capítulo tipográfico con los hechos confirmados, sin fotos ficticias ni rótulos técnicos de relleno. Si una foto configurada falla, se informa “Imagen no disponible”; la navegación sigue funcionando.

## Alumnos

1. Copiá cada retrato autorizado a `public/media/alumnos/`.
2. Editá `src/content/students.ts`.
3. Reemplazá el borrador por datos reales. No uses un nombre o una declaración sin confirmar.

```ts
{
  id: 'identificador-unico',
  name: '', // Escribí el nombre real.
  photo: {
    src: '/media/alumnos/retrato.webp',
    alt: '', // Descripción real del retrato.
    position: '50% 25%', // Opcional.
  },
  message: '', // Pegá las palabras reales del compañero.
  order: 1,
  status: 'draft', // Cambiá a 'published' cuando esté completo.
}
```

Los campos vacíos del ejemplo son deliberados: no son testimonios. Sólo se muestran alumnos con `status: 'published'`, nombre, foto, alt y mensaje completos. Un registro incompleto sigue oculto incluso si por error se marca como publicado. No se inventa ningún dato para completarlo.

El profesor puede avanzar o retroceder entre compañeros, abrir “Ver todos” y seleccionar cualquier nombre. Los mensajes no tienen autoplay. “Ir a la pregunta” permite continuar sin leerlos todos. La cantidad es variable y los controles usan el total de registros completos, no posiciones fijas.

Con cero testimonios completos, producción no muestra personas, citas ni nombres de relleno: queda la cabecera de la sección y la acción para continuar. Desarrollo muestra un panel claramente pendiente. Para revisar el contenido pendiente usá `npm run dev`; `npm run preview` sirve exactamente la versión de producción.

## Verificar antes de compartir

```sh
npm run build
npm run preview
npm test
npm run content:check
```

El build verifica identificadores únicos, alt y existencia de los archivos configurados. Los alumnos incompletos se mantienen ocultos; los borradores no exigen tener archivos terminados. Comprobá nombres, texto real, permisos de las fotos, encuadre y lectura en celular. Los tests usan material sintético rotulado como prueba dentro del navegador de desarrollo; ese contenido no se agrega a la configuración publicada. No hay backend, panel, contraseñas, guardado de respuestas ni envíos.
