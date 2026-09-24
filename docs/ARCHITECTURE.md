# Architecture

## Overview

Black Sheep Sport es un sitio Astro que genera páginas estáticas. La landing presenta el producto y los eventos; una ruta dinámica genera una página compartida por cada evento registrado. Las galerías de fotos se descubren en build desde assets locales.

## Runtime model

- `astro.config.mjs` no configura un adaptador de servidor; Astro genera salida estática en `dist/` durante el build.
- Astro renderiza el HTML, metadatos, enlaces y contenido de página en build. `astro:assets` procesa las imágenes de la galería.
- El código cliente específico de galería está en `src/scripts/eventGallery.client.ts` y se carga desde `EventGallery.astro`. En páginas con fotos maneja selección, restauración/guardado en `localStorage`, barra de selección, lightbox y apertura de WhatsApp. Si no hay fotos, la galería renderiza el estado vacío sin esos controles.
- `Base.astro` también incluye el cargador y la configuración inline de Google Analytics 4. Las páginas, datos y navegación restantes son HTML estático.

## Project structure

| Ubicación | Responsabilidad |
| --- | --- |
| `src/components` | Secciones reutilizables de la landing y galería de eventos. |
| `src/layouts` | Documento HTML base, metadatos globales y recursos compartidos. |
| `src/pages` | Rutas estáticas y ruta dinámica de eventos. |
| `src/data` | Registro de eventos, pricing y datos compartidos del sitio. |
| `src/utils` | Transformaciones y validaciones reutilizables de datos de fotos. |
| `src/scripts` | Comportamiento JavaScript que corre en el navegador. |
| `src/styles` | Tokens y estilos globales y de la landing. |
| `src/assets` | Imágenes importadas y procesadas por Astro, incluidas fotos agrupadas por slug. |
| `public` | Archivos copiados como están a la salida estática: fuentes, iconos, SEO y `.htaccess`. |

## Data model

- `src/data/events.ts` define el registro `events` y sus campos de slug, nombre, fecha, lugar, estado y destacado; también deriva URL, fecha formateada, metadatos y clave de almacenamiento.
- `status` (`upcoming` o `past`) describe la etapa del evento; `featured` selecciona el evento principal de Home. No son equivalentes y el registro debe contener exactamente uno destacado.
- `src/data/pricing.ts` es la autoridad para tarifas y la etiqueta calculada de selección.
- `src/data/site.ts` contiene los datos comerciales compartidos, incluidos WhatsApp y contacto, y construye el enlace de WhatsApp.
- No copiar valores mutables de esas fuentes a documentos de arquitectura o memoria.

## Event routing

`src/pages/eventos/[slug].astro` exporta `getStaticPaths()`. Recorre `events` y devuelve los parámetros y props que Astro usa para emitir cada página estática. Los datos de la página y la clave de selección derivan del registro.

## Event photo discovery

La relación de build es:

```text
src/data/events.ts
    ↓
getStaticPaths()
    ↓
evento y slug
    ↓
glob literal de assets por slug
    ↓
buildEventPhotos()
    ↓
EventGallery
```

`[slug].astro` mantiene un `import.meta.glob` literal por slug porque el bundler analiza estos patrones durante el build. `src/utils/eventPhotos.ts` deriva el código de cada filename, valida formato/unicidad y ordena las fotos. Con cero fotos, `EventGallery.astro` conserva la página y muestra `PRÓXIMAMENTE`.

El procedimiento de alta y carga está en [EVENTOS.md](../EVENTOS.md).

## Gallery client behavior

`src/components/EventGallery.astro` renderiza la galería, controles accesibles, estado vacío y lightbox; sus estilos son scoped. `src/scripts/eventGallery.client.ts` activa los controles cuando hay fotos. Guarda los códigos seleccionados en `localStorage` bajo una clave derivada del slug, presenta la orientación de precio definida en `pricing.ts` y abre WhatsApp con los códigos seleccionados. El navegador mantiene la selección local; la página estática no implementa un carrito ni procesamiento de pagos.

## Styling

- `src/styles/tokens.css` define variables compartidas de color, tipografía, espaciado, capas y medidas.
- `src/styles/global.css` incluye reset, reglas globales y declaraciones de fuentes locales.
- `src/styles/home.css` ajusta la identidad tipográfica y los estilos propios de Home.
- Los componentes Astro tienen estilos scoped donde corresponde; `EventGallery.astro` incluye sus estilos de galería.
- Las fuentes WOFF2 relevantes viven en `public/fonts/`: Instrument Sans, Archivo Expanded y Archivo Variable.
- Para decisiones visuales conceptuales, consultar [DESIGN.md](./DESIGN.md).

## Assets

Las fotos de eventos viven en `src/assets/events/<slug>/` y entran al build por los globs de la ruta dinámica. `src/assets/photos/` contiene imágenes fuente usadas por la muestra de la landing. Recursos que deben conservar su ruta/archivo se ubican en `public/`.

## Analytics / external integrations

`src/layouts/Base.astro` carga Google Analytics 4 globalmente. `src/data/site.ts` centraliza el destino de WhatsApp; el navegador crea el enlace de compra desde la selección. No hay backend de pedidos en este repositorio.

## Hosting and delivery

El repositorio configura `site` como `https://sheepsport.com`; el build estático genera `dist/`, que es el artefacto publicado según `README.md`. Las reglas externas del proveedor de hosting no son verificables desde el repositorio.

## Security and caching

`public/.htaccess` se copia al artefacto y define redirects de HTTP/www a HTTPS, compatibilidad con una URL antigua, documento 404, headers de seguridad y políticas Cache-Control para assets Astro versionados y fuentes. Estas reglas dependen del servidor que las interprete; el repositorio no demuestra que un proveedor las tenga activas.

## Build-time invariants

- `getFeaturedEvent()` falla si el registro no tiene exactamente un evento destacado.
- `Events.astro` aplica `HOME_EVENT_LIMIT = 5` al total de registros; al superar el límite, el build falla. La estrategia de archivo/listado debe resolverse antes de aceptar un sexto evento.
- Todo slug de `events.ts` necesita una entrada de glob literal en `[slug].astro`; la ruta falla si falta.
- La ruta valida los datos obligatorios del evento. `buildEventPhotos()` rechaza códigos de filename inválidos, demasiado largos o duplicados sin distinción de mayúsculas. Una colección vacía sigue siendo válida.

## Where to make changes

| Quiero cambiar | Fuente |
| --- | --- |
| Datos o estado de un evento | `src/data/events.ts` |
| Pricing | `src/data/pricing.ts` |
| Contacto y datos comerciales compartidos | `src/data/site.ts` |
| Flujo operativo de eventos/fotografías | [EVENTOS.md](../EVENTOS.md) |
| Diseño conceptual | [DESIGN.md](./DESIGN.md) |
| Producto | [PRODUCT.md](./PRODUCT.md) |
| Responsabilidades técnicas | `docs/ARCHITECTURE.md` |
