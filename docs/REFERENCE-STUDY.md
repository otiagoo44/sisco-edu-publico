# Referencias revisadas

## SISCO-EDU auténtico

Se consultó el repositorio mediante la conexión GitHub y se leyó:

- `main` / `develop`: `src/views/dashboard.php`, un panel PHP básico sin estilos.
- `frontend` (`f633007`): `mvc/views/dashboard.php`, `mvc/views/layouts/sidebar.php`, `mvc/views/layouts/header.php`, login y `public/css/theme.css` completos.
- `frontend-recovery-audit` (`1cfb785`): dashboard, tema y estructura de navegación como contraste de una versión más extensa.

Se conservaron colores del frontend, barra lateral navy, panel claro, módulos y vocabulario académico. No se importó la autenticación ni el backend. La captura local representa una reconstrucción visual desde el código, no una sesión autenticada del sistema original. No se inventaron estadísticas de asistencia, usuarios ni contraseñas.

## Awesome Design MD y sitios reales

Se leyeron completos los análisis locales de **Nike** y **Spotify**, manteniendo su procedencia y licencias en `.agents/skills/awesome-design-md/references/`.

También se abrieron los sitios oficiales con web y Chrome/Playwright. Las capturas originales de investigación están en `artifacts/references/` (no se redistribuyen assets de esas marcas). Nike respondió 200 y mostró inicialmente el selector de país; se cerró y se inspeccionó la navegación/pie. El intento de abrir directamente un asset de campaña mediante web falló, por lo que no se presenta como una captura inspeccionada de esa campaña. Spotify respondió 200, permitió inspeccionar estructura, tipografía y controles; parte del artwork quedó en bloques de color por la carga del servicio en este entorno.

De Nike se aplicó el principio documentado de fotografía protagonista y contraste tipográfico; no se copiaron comercio, marca, logos ni fuentes. De Spotify se aplicó el principio de controles discretos alrededor del contenido; no su paleta, densidad de catálogo ni paneles repetidos. Las limitaciones de las capturas no se reemplazan con imágenes inventadas.

## Aplicación de las otras skills

- **Taste:** se revisaron brief/diales, arquitectura, composición, movimiento, accesibilidad, protocolo de rediseño y preflight. Se conservó la base técnica y se cambió la dirección artística autorizada; diales y excepciones quedan en DESIGN.md.
- **UI UX Pro Max:** se ejecutaron consultas reales de sistema editorial/fotográfico, tipografía, GSAP e interacción táctil. El resultado Motion-Driven fue relevante para el movimiento; se descartó la estructura comercial y se conservó la fuente instalada. No se instaló Archivo ni una librería adicional por seguir una recomendación genérica.
- **Google DESIGN.md:** se revisaron especificación y CLI, se actualizaron tokens y se exportó CSS nativo. El lint oficial incluido informó cero errores y cero advertencias.
- **Impeccable:** se usa su adaptación local de revisión con evidencia de pantallas reales, controles, foco, contraste y rendimiento. No se invoca ni se atribuye una CLI de Impeccable que esta skill no contiene.

Documentación primaria consultada para implementación y pruebas: [GSAP Timeline](https://gsap.com/docs/v3/GSAP/Timeline/), [reloj de Playwright](https://playwright.dev/docs/clock). La suite combina un recorrido real de lectura con reloj normal y recorridos auxiliares mediante Clock instalado antes de navegar.
