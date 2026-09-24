# Modelo de eventos y fotografías

Este documento describe el contrato operativo estable de eventos y fotos. Los datos concretos viven en `src/data/events.ts`; los procedimientos para modificarlos están en las skills indicadas al final.

## Registro y significado

Cada evento representa una competencia o actividad deportiva con una página compartida bajo `/eventos/<slug>/`. `src/data/events.ts` es la fuente de verdad y define estos campos principales:

- `slug`: identificador único y estable, compartido por registro, URL, glob y carpeta de fotos.
- `name`: nombre público.
- `isoDate`: fecha del evento en formato ISO `YYYY-MM-DD`; la fecha visible y metadata relacionada se derivan de este dato.
- `location`: lugar público del evento.
- `status`: `upcoming` o `past`; describe su etapa y se cambia manualmente, no por el paso del tiempo.
- `featured`: booleano que decide cuál evento es el destacado principal de Home/Hero, independientemente de `status`.

Debe haber exactamente un `featured: true`. Un evento `past` puede seguir destacado hasta que se transfiera el destacado. No se debe inferir `status` a partir de la fecha.

El slug publicado debe mantenerse estable. De él dependen la URL y la clave de almacenamiento de selección (`black-sheep-selection-<slug>`); cambiarlo altera ambas y no migra la selección anterior automáticamente.

## Límite actual de Home

`HOME_EVENT_LIMIT` tiene actualmente el valor `5` en `src/components/Events.astro`. Limita el total de registros, no cinco eventos anteriores más el destacado. Home muestra el destacado y hasta cuatro eventos pasados no destacados. Antes de registrar un sexto evento debe resolverse la estrategia de archivo/listado y ajustarse la arquitectura; no se deben retirar ni ocultar eventos para eludir el límite.

## Registro, ruta y fotos

La ruta dinámica `src/pages/eventos/[slug].astro` genera las páginas estáticas a partir de los registros de `src/data/events.ts`. Cada slug registrado requiere un `import.meta.glob` literal correspondiente en esa ruta porque Astro/Vite analiza los patrones durante el build. El glob descubre imágenes en `src/assets/events/<slug>/`; el slug debe coincidir exactamente entre registro, glob y carpeta.

El procesamiento deriva código, URL de imagen y metadata de cada archivo y del evento. No se registran fotos una por una ni se configuran por evento el pricing, WhatsApp o la clave de almacenamiento. Pricing y datos comerciales/contacto son globales. La galería, Hero y listado de Home son componentes compartidos.

Una carpeta sin fotos compatibles es válida. Con el evento y glob correctamente registrados, cero fotos produce una página válida en estado `PRÓXIMAMENTE`; la página mantiene sus datos y metadata, sin controles de selección o compra. El marker `README.md` permite versionar la carpeta antes de que lleguen fotografías.

## Convenciones de fotografías

Estas reglas describen el contrato del descubrimiento y validación de archivos:

- Las imágenes publicadas en la galería web son previews y deben llegar preparadas con la marca de agua correspondiente antes de publicarse. La entrega final vendida puede ser el original en alta resolución y sin marca de agua, según el producto actual. La aplicación no genera ni añade la marca de agua automáticamente salvo cambio explícito de arquitectura.
- Las fotos van directamente en `src/assets/events/<slug>/`; no se procesan subdirectorios.
- Las extensiones admitidas son `.webp`, `.jpg`, `.jpeg`, `.png` y `.avif`, siempre en minúsculas. Otras extensiones o extensiones en mayúsculas pueden quedar fuera del glob y ser ignoradas.
- El código se deriva del filename sin extensión y debe cumplir `^[A-Za-z0-9_-]+$`.
- El código puede tener como máximo 40 caracteres.
- Los códigos duplicados se rechazan sin distinguir mayúsculas/minúsculas.
- El orden de la galería es natural por código/filename (por ejemplo, `DSC2` antes de `DSC10`).
- Una carpeta sin fotos compatibles es válida y representa el estado `PRÓXIMAMENTE`.

## Invariantes y errores relevantes

- Debe existir exactamente un evento destacado; cero o varios provocan un error de build.
- Cada registro necesita su glob literal. Un slug sin correspondencia entre registro, glob y carpeta puede impedir el build o dejar una galería vacía.
- Datos obligatorios inválidos, códigos de archivo inválidos, códigos duplicados o superar `HOME_EVENT_LIMIT` provocan errores detectables durante el build.
- Un evento `upcoming` sin destacar es válido y conserva su URL, aunque no aparezca en Home.
- Una carpeta vacía no es un error ni motivo para ocultar el evento.

## Procedimientos

Para crear/modificar eventos: usar la skill [manage-event](../../.agents/skills/manage-event/SKILL.md).

Para publicar/cambiar fotografías: usar la skill [publish-event-photos](../../.agents/skills/publish-event-photos/SKILL.md).
