# Project Memory

## Producto actual

- Black Sheep Sport es un MVP de fotografía deportiva: lleva a atletas desde el evento hasta una galería y coordina la compra por WhatsApp.
- El sitio se construye con Astro como salida estática. La landing y las páginas de evento se generan en build.

## Estado actual

- El flujo de galería propia es parte del MVP: listado de eventos, selección de fotos, indicación de precio y contacto de compra.
- La ruta compartida `src/pages/eventos/[slug].astro` genera las páginas de eventos registrados.
- Una galería con cero fotos es un estado válido y muestra `PRÓXIMAMENTE`.

## Decisiones arquitectónicas

- `src/data/events.ts` es el registro central de eventos. `status` y `featured` expresan decisiones distintas; debe haber exactamente un evento destacado.
- Los eventos comparten una ruta dinámica y cada slug tiene un glob literal de assets. No crear páginas Astro individuales por evento.
- `HOME_EVENT_LIMIT` en `Events.astro` limita actualmente el registro a cinco eventos. Antes de registrar un sexto debe resolverse la estrategia de archivo/listado. No retirar eventos antiguos para eludir el límite.
- Un slug publicado se mantiene estable: determina la URL y la clave de selección local; cambiarlo requiere plan de migración.
- La selección de fotos, su persistencia en `localStorage`, el lightbox y el inicio de compra por WhatsApp pertenecen al MVP actual.
- El deploy produce archivos estáticos. Las reglas de redirects, headers y caché versionada están en `public/.htaccess`.
- `Muestra/` y `design/` son material local de referencia; no son fuentes del runtime.

## Invariantes

- Debe existir exactamente un `featured: true`; `status` acepta `upcoming` o `past` y no se infiere automáticamente de la fecha.
- Un evento registrado necesita un glob de assets literal por slug. La validación del build protege esta correspondencia y los datos mínimos del evento.
- Los códigos de foto salen de los nombres de archivo y deben ser válidos y únicos sin distinguir mayúsculas.
- Pricing y datos comerciales/contacto son mutables: se consultan en `src/data/pricing.ts` y `src/data/site.ts`; no duplicar sus valores aquí.

## Restricciones deliberadas

- Los cambios operativos de eventos y fotografías siguen el procedimiento de [EVENTOS.md](./EVENTOS.md).
- La galería sin fotos no es un error de build ni una razón para ocultar o borrar el evento.

## Deuda técnica consciente

- Antes de añadir el sexto registro se debe implementar el archivo/listado de eventos correspondiente y adaptar el límite actual.

## Fuentes de verdad

- [AGENTS.md](./AGENTS.md): instrucciones globales del repositorio.
- Código y configuración actuales: fuente para hechos de implementación.
- [EVENTOS.md](./EVENTOS.md): operación de eventos y fotografías.
- [docs/PRODUCT.md](./docs/PRODUCT.md): definición de producto.
- [docs/DESIGN.md](./docs/DESIGN.md): decisiones conceptuales de diseño.
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md): responsabilidades de las piezas técnicas.
