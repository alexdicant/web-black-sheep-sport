# Handoff — Black Sheep Sport (landing)

> **Estado actualizado:** 18 de septiembre de 2026  
> **Producción:** https://sheepsport.com/  
> **Rama principal:** `main`
> **Rama de evolución en curso:** `feature/event-gallery-selection` (5 commits por delante de `main`, todavía sin merge al verificar este documento)
>
> Este documento es la fuente de verdad operativa del proyecto para quien continúe el trabajo sin contexto previo. Resume el producto, el estado real del código, decisiones de diseño, SEO, analítica, despliegue, datos comerciales y pendientes. Si algo cambia posteriormente, **el código y producción mandan sobre este documento**.

---

## 1. Qué es este proyecto

**Black Sheep Sport** es una división de **Black Sheep Studio** dedicada a fotografía deportiva en Mérida, Venezuela.

El negocio fotografía participantes de eventos deportivos —por ejemplo running, ciclismo, CrossFit y competencias similares— y vende las imágenes directamente al atleta. La web no es un portafolio tradicional ni una tienda con carrito: es el puente entre el QR del evento, la galería y la compra.

### Público principal

El visitante típico es un atleta que acaba de competir:

- llega desde un QR impreso o desde un enlace directo;
- está usando principalmente el teléfono;
- puede estar conectado por datos móviles;
- no necesariamente conoce la marca;
- quiere encontrar sus fotos con el menor número de pasos posible.

### Preguntas que la landing debe responder rápido

1. ¿Dónde están mis fotos?
2. ¿Cómo las compro?
3. ¿Cuánto cuestan?

### Funnel operativo original del MVP en producción

```text
QR del evento
→ sheepsport.com
→ identificar el evento
→ abrir galería de Google Drive
→ localizar fotos por código
→ enviar nombre + códigos por WhatsApp
→ coordinar pago
→ recibir fotos finales por WhatsApp como archivos
```

Este flujo con Google Drive describe el MVP original que sigue siendo el contexto histórico de producción. En la rama `feature/event-gallery-selection` existe una evolución funcional que reemplaza el paso de Drive para HAPPY WOOD por una galería propia:

```text
QR del evento
→ sheepsport.com
→ identificar el evento
→ abrir /eventos/<slug>/
→ seleccionar fotografías
→ ver orientación de precio o paquete
→ abrir WhatsApp con los códigos ya escritos
→ coordinar el pago
→ recibir las fotos finales por WhatsApp como archivos
```

La evolución todavía no está fusionada en `main`. No describir la galería propia como desplegada en producción hasta verificar un merge y deploy reales.

El éxito de la landing se mide principalmente por dos acciones:

1. que el atleta abra la galería de su evento;
2. que avance a WhatsApp para cerrar la compra.

La fotografía es el producto y la principal prueba visual. El copy se mantiene corto, directo y funcional.

Fuente de producto complementaria: `PRODUCT.md`.

---

## 2. Estado actual del MVP

El MVP está **publicado y probado online** en:

**https://sheepsport.com/**

El sitio ya tiene cerrados los bloques visuales, legales, SEO básico, analítica base, Search Console, 404 personalizado, OG social, favicons y flujo hacia WhatsApp.

### Evolución en la rama feature

En `feature/event-gallery-selection`, HAPPY WOOD ya no usa un placeholder de Google Drive:

- `Events.astro` enlaza a `/eventos/happy-wood/`;
- existe una página Astro propia para el evento;
- las 162 fotografías anteriores de HAPPY WOOD eran de prueba y fueron retiradas;
- HAPPY WOOD está actualmente en estado vacío y muestra “Próximamente” mientras se espera el lote real;
- Fogueo Be Fit contiene 194 fotografías reales y su galería propia ya fue probada manualmente;
- la galería seleccionable, localStorage, pricing orientativo y WhatsApp dinámico funcionan;
- existe un estado vacío reutilizable para crear páginas antes de recibir las fotos.

La galería fue probada físicamente y el flujo funciona. Esta funcionalidad sigue aislada en la rama feature y no debe darse por publicada en `main` hasta hacer merge y deploy con autorización explícita.

### Rutas públicas

| Ruta | Estado |
|---|---|
| `/` | Home / landing principal |
| `/terminos/` | Términos y condiciones |
| `/privacidad/` | Política de privacidad |
| `/cookies/` | Política de cookies |
| `/eventos/happy-wood/` | Galería propia de HAPPY WOOD; actualmente con 0 fotos y estado “Próximamente” |
| `/eventos/fogueo-be-fit/` | Galería propia activa de Fogueo Be Fit; evento pasado con 194 fotografías reales |
| `404.html` | Página de error personalizada, `noindex, nofollow` |

Astro genera **7 páginas estáticas** en el build de la rama feature. El MVP original de `main` generaba 5 antes de incorporar las rutas de eventos.

### Estado por componente

| Sección | Archivo | Estado actual |
|---|---|---|
| Header | `src/components/Header.astro` | Funcional. Wordmark + ubicación. CTA desktop **“Buscar mis fotos”** hacia `/#tu-evento`. |
| Hero | `src/components/Hero.astro` | Funcional. Foto real. H1: **“ASÍ SE VE DAR TODO”**. Encuadre móvil corregido para evitar que el copy cubra el rostro. |
| Eventos | `src/components/Events.astro` | **HAPPY WOOD** permanece activo y **Fogueo Be Fit** figura como evento pasado. Ambos CTA apuntan a sus galerías propias. |
| Galería seleccionable | `src/components/EventGallery.astro` | Componente reutilizable con estado vacío, selección accesible, localStorage, pricing informativo y WhatsApp dinámico. |
| Páginas de evento | `src/pages/eventos/*.astro` | Descubren automáticamente las fotos de cada evento mediante `import.meta.glob()`. |
| Cómo comprar | `src/components/HowToBuy.astro` | Funcional. Semántica `ol` / `li`; proceso real explicado en 3 pasos. |
| Precios | `src/components/Pricing.astro` | 1 foto: US$4 / 2 fotos: US$7 / Todas tus fotos: US$12 por atleta. Layout móvil corregido y CTA **“Buscar mis fotos”** hacia `/#tu-evento`. |
| Muestra | `src/components/Gallery.astro` | 6 fotos reales. Variantes optimizadas `widths={[400, 675, 800]}`. |
| FAQ | `src/components/Faq.astro` | 4 preguntas, visibles sin acordeón. Copy alineado con el proceso real. |
| CTA final | `src/components/FinalCta.astro` | **“Buscar mis fotos”** hacia `/#tu-evento`; la compra pasa primero por la galería seleccionable. |
| Footer | `src/components/Footer.astro` | Enlaces a Privacidad, Cookies y Términos; copy “Un servicio de Black Sheep Studio”. |
| Back to top | `src/components/BackToTop.astro` | Control pequeño con JS vanilla; aparece tras hacer scroll y respeta `prefers-reduced-motion`. |
| 404 | `src/pages/404.astro` | Página personalizada; en producción se sirve correctamente mediante `.htaccess`. |

---

## 3. Datos comerciales reales

### Marca

**Black Sheep Sport**

División de:

**Black Sheep Studio**

### Ubicación operativa

**Mérida, Venezuela**

### Contacto

**WhatsApp:** +58 424-7438483  
**Formato `wa.me`:** `584247438483`  
**Correo:** `info@sheepsport.com`

### Mensajes dinámicos de WhatsApp

Los CTA generales de la Home ya no abren WhatsApp directamente: llevan a `/#tu-evento` para que el cliente entre primero a la galería y seleccione sus fotos.

`EventGallery.astro` genera el mensaje en el momento de pulsar **“Comprar seleccionada(s)”**. Los códigos se obtienen de la selección actual; el cliente no tiene que copiarlos ni escribirlos.

Para 1 o 2 fotos:

```text
Hola, vi mis fotos de <EVENTO> y quiero comprar estas fotos: <CODIGOS>. ¿Me ayudas con el proceso de pago?
```

Para 3 o más:

```text
Hola, vi mis fotos de <EVENTO> y seleccioné estas fotos: <CODIGOS>. Vi que tienen el paquete Todas tus fotos por US$12 por atleta. ¿Me ayudas con la compra?
```

La URL usa `https://wa.me/584247438483?text=...` con el mensaje procesado mediante `encodeURIComponent()`. WhatsApp se abre en una pestaña nueva con `noopener noreferrer`.

### Precios vigentes

| Producto | Precio |
|---|---:|
| 1 foto | US$4 |
| 2 fotos | US$7 |
| Todas tus fotos | US$12 por atleta |

**“Todas tus fotos”** significa todas las fotografías disponibles y utilizables del atleta en la galería. Cada atleta se compra por separado.

### Métodos de pago

- Pago móvil.
- Binance.

La compra se considera confirmada una vez verificado el pago.

### Entrega

- La galería general se publica dentro de las 24 horas posteriores al evento.
- La galería inicial contiene imágenes con marca de agua para selección.
- Cada archivo tiene un código.
- El cliente selecciona las fotografías directamente dentro de la galería del evento.
- La selección se conserva en el navegador mediante localStorage.
- Al pulsar **“Comprar seleccionadas”**, la web abre WhatsApp con los códigos seleccionados ya incluidos.
- Las fotos compradas se entregan editadas, en alta resolución y sin marca de agua.
- La entrega final se realiza por WhatsApp como archivos.
- Después de confirmar el pago, la entrega se realiza normalmente al día siguiente.

### Política operativa relevante

- Si una persona solicita retirar una fotografía en la que aparece, Black Sheep Sport puede atender la solicitud por WhatsApp o correo.
- Si el cliente selecciona por error una fotografía equivocada o existe una discrepancia en los códigos, se revisa la selección y se intenta localizar la foto correcta.
- No existe reembolso automático por errores atribuibles a una selección equivocada del cliente.
- La disponibilidad depende de que existan fotografías utilizables del participante.

---

## 4. Evento activo

El primer evento real cargado es:

**Nombre:** HAPPY WOOD  
**Lugar:** Be Happy  
**Fecha visible:** 19 de septiembre de 2026  
**Fecha ISO:** `2026-09-19`  
**Estado:** activo

La tarjeta conserva el badge **“Activo ahora”**.

### Estado en la rama `feature/event-gallery-selection`

- URL desde Home: `/eventos/happy-wood/`.
- Página: `src/pages/eventos/happy-wood.astro`.
- Carpeta: `src/assets/events/happy-wood/`.
- Fotografías actuales: 0.
- Las 162 fotografías anteriores eran de prueba y fueron retiradas.
- Estado actual: muestra automáticamente “Próximamente”, sin grid ni controles de selección o compra.
- Pendiente: recibir y copiar el lote real mañana.
- Key de selección: `black-sheep-selection-happy-wood`.
- WhatsApp de compra: `584247438483`.
- Estado: página y galería creadas, todavía sin merge a `main`.

La referencia anterior a `url: "#"` y a una URL pendiente de Google Drive corresponde al MVP original; ya no describe esta rama. Google Drive no forma parte del flujo comercial propuesto por la feature.

### Evento pasado: Fogueo Be Fit

- **Nombre:** Fogueo Be Fit.
- **Lugar:** Be Fit Mérida.
- **Fecha visible:** 16 de octubre de 2025.
- **Fecha ISO:** `2025-10-16`.
- **Slug:** `fogueo-be-fit`.
- **Estado:** evento pasado; no muestra el badge “Activo ahora” en Home.
- **Página creada:** `src/pages/eventos/fogueo-be-fit.astro`.
- **URL:** `/eventos/fogueo-be-fit/`.
- **Galería propia:** usa `EventGallery.astro` y la carpeta `src/assets/events/fogueo-be-fit/`.
- **Fotografías actuales:** 194 fotografías reales incorporadas.
- **Estado:** galería activa y probada manualmente; selección, pricing y WhatsApp funcionan.
- **Key de selección:** `black-sheep-selection-fogueo-be-fit`.

---

## Crear un nuevo evento con galería seleccionable

Esta sección es el procedimiento operativo para una IA o desarrollador que llegue al repositorio sin contexto. Describe exclusivamente la implementación existente en `feature/event-gallery-selection`; no propone un CMS, una colección de contenido ni una arquitectura futura.

### Estado y principio operativo

Cada evento con galería propia tiene actualmente:

1. una entrada/tarjeta declarada en `src/components/Events.astro`;
2. una ruta Astro propia bajo `/eventos/`;
3. una carpeta de imágenes propia bajo `src/assets/events/`;
4. un `import.meta.glob()` específico en la página del evento;
5. el componente compartido `src/components/EventGallery.astro`;
6. un estado vacío automático cuando `photos.length === 0`;
7. selección persistente mediante una key de localStorage exclusiva;
8. un enlace de WhatsApp generado en el navegador con los códigos seleccionados.

El flujo operativo intencional es:

```text
crear evento y ruta
→ publicar la página aunque la carpeta todavía no tenga fotos
→ mostrar “Próximamente”
→ recibir el export de Lightroom
→ copiar las fotos a la carpeta del evento
→ ejecutar build/deploy
→ mostrar automáticamente la galería seleccionable
```

No se declara cada fotografía manualmente. Añadir fotos no debe exigir modificar la página si la ruta, la carpeta y el glob ya se crearon correctamente.

### Antes de empezar: datos obligatorios

No crear el evento con valores supuestos. Obtener o confirmar este checklist:

- [ ] nombre público exacto del evento;
- [ ] slug definitivo;
- [ ] lugar visible;
- [ ] fecha visible en español;
- [ ] fecha ISO en formato `YYYY-MM-DD`;
- [ ] si el evento lleva el badge `Activo ahora`;
- [ ] carpeta de imágenes que corresponde al slug;
- [ ] convención real de nombres/códigos de los archivos;
- [ ] si se mantiene el WhatsApp global actual;
- [ ] si los precios continúan vigentes;
- [ ] cantidad esperada de fotos, cuando ya exista un export;
- [ ] decisión SEO expresa si se pretende algo distinto de `noindex`.

Valores globales actuales que no deben cambiarse sin autorización:

| Dato | Valor actual |
|---|---|
| WhatsApp visible | `+58 424-7438483` |
| Número para `wa.me` | `584247438483` |
| 1 foto | `US$4` |
| 2 fotos | `US$7` |
| Todas tus fotos | `US$12 por atleta` |

El paquete “Todas tus fotos” es por atleta. La galería no identifica personas y no sabe si varias fotos seleccionadas pertenecen al mismo atleta.

### Convención obligatoria de slug

El slug debe usar:

- minúsculas;
- palabras separadas por guiones;
- ningún espacio;
- ninguna tilde;
- ningún carácter especial.

Ejemplo real:

| Concepto | Valor |
|---|---|
| Nombre | `HAPPY WOOD` |
| Slug | `happy-wood` |
| URL | `/eventos/happy-wood/` |
| Carpeta | `src/assets/events/happy-wood/` |
| Página | `src/pages/eventos/happy-wood.astro` |

Ejemplos adicionales:

```text
Copa Mérida 2026 → copa-merida-2026
Reto Los Andes → reto-los-andes
Gran Fondo El Páramo → gran-fondo-el-paramo
```

El mismo slug debe usarse sin variaciones en la carpeta, el nombre de la página, la URL de Home y la key de localStorage.

#### El slug se vuelve inmutable al publicar

Considerar el slug definitivo desde el primer deploy público. Cambiarlo después altera simultáneamente:

- la URL pública del evento;
- el nombre de la página Astro;
- la carpeta de fotografías;
- el enlace declarado en `Events.astro`;
- la key `black-sheep-selection-<slug>`.

El sistema actual no crea redirecciones ni migra `localStorage` automáticamente. Un cambio posterior puede romper enlaces compartidos y dejar inaccesible la selección guardada bajo la key anterior. No cambiar un slug publicado sin autorización y sin un plan explícito de migración y redirección.

### Paso 1 — Crear la carpeta del evento

Crear:

```text
src/assets/events/<slug>/
```

Ejemplo:

```text
src/assets/events/copa-merida-2026/
```

La carpeta puede existir sin fotografías. Siguiendo la convención actual, debe incluir un `README.md` específico del evento que explique:

- dónde copiar las previews finales;
- formatos soportados;
- que el filename se convierte en código;
- que el código solo admite `^[A-Za-z0-9_-]+$`, máximo 40 caracteres y unicidad case-insensitive;
- que el build falla si un filename contiene espacios, tildes, símbolos, caracteres especiales, es demasiado largo o produce un código duplicado;
- que la página muestra “Próximamente” si no hay imágenes compatibles;
- que no se añade otra marca de agua desde la web;
- que no hay que editar un array manual para publicar fotos.

El README no interfiere con el glob porque el patrón solo coincide con extensiones de imagen.

Reglas obligatorias:

- no copiar fotos de otro evento como fallback;
- no reutilizar imágenes ajenas “para que no se vea vacío”;
- no importar fotos desde `src/assets/photos/` en una página de evento;
- una carpeta sin imágenes compatibles debe dejar `photos` vacío y activar el estado “Próximamente”.

#### Export actual desde Lightroom

Las previews de selección llegan preparadas antes de copiarse al repositorio:

- ya tienen marca de agua;
- ya están optimizadas para navegar y seleccionar;
- el lote real actual de Fogueo Be Fit contiene verticales de `267×400` y horizontales de `600×400`;
- el formato real actual de Fogueo Be Fit es `.jpg`.

El glob actual admite exactamente estas extensiones en minúsculas:

```text
.webp
.jpg
.jpeg
.png
.avif
```

El patrón actual no incluye GIF ni extensiones en mayúsculas como `.JPG`. Si el export usa otra extensión o capitalización, no asumir que Astro la detectará: corregir el export con autorización o actualizar explícitamente el glob.

La web no debe:

- añadir una segunda marca de agua;
- reescalar manualmente una por una las fotos fuente;
- renombrar archivos automáticamente sin autorización;
- eliminar o modificar los originales recibidos.

`EventGallery.astro` usa `<Image>` de Astro con `widths={[200, 400]}`, `loading="lazy"`, `decoding="async"` y `object-fit: contain`. La generación de variantes ocurre durante el build.

#### Filenames: código comercial e identidad de selección

El filename no es un detalle interno: es el código que ve el cliente y que llega a WhatsApp.

Ejemplo:

```text
Archivo: DSC07521.jpg
Código visible: DSC07521
Identificador de selección: DSC07521
Código enviado a WhatsApp: DSC07521
```

La página del evento:

1. obtiene el último segmento del path;
2. elimina únicamente la extensión mediante `/\.[^.]+$/`;
3. valida el código con `^[A-Za-z0-9_-]+$` y un máximo de 40 caracteres;
4. rechaza el lote si el código es inválido;
5. rechaza el lote si otro filename produce el mismo código sin distinguir mayúsculas/minúsculas;
6. lo asigna a `photo.code`.

Usar nombres:

- con basename único dentro del evento, independientemente de la extensión;
- de hasta 40 caracteres;
- compuestos únicamente por letras sin tilde, números, `_` y `-`;
- sin signos extraños;
- estables después de publicar.

Evitar nombres como:

```text
foto final nueva 2.jpg
IMG prueba!!.jpg
seleccion definitiva (3).jpg
```

Preferir códigos consistentes como:

```text
DSC07521.jpg
HW-001.webp
CME-014.jpg
```

La unicidad debe evaluarse después de eliminar la extensión. Este par es inválido aunque el filesystem considere que son dos archivos distintos:

```text
DSC001.jpg  → código DSC001
DSC001.webp → código DSC001
```

Ambos botones terminarían compartiendo el mismo identificador lógico en el `Set`: seleccionar uno podría marcar los dos y WhatsApp recibiría un único código ambiguo. Evitar también variantes que solo cambien mayúsculas y minúsculas.

Cambiar un filename después de publicar cambia el código visible. También puede invalidar una selección guardada: al restaurar localStorage, el componente conserva únicamente códigos que todavía existen en la galería actual.

### Paso 2 — Crear la página del evento

Usar como template real:

```text
src/pages/eventos/happy-wood.astro
```

Crear:

```text
src/pages/eventos/<slug>.astro
```

No copiar mecánicamente valores de HAPPY WOOD. En la página actual están hardcodeados estos datos específicos y todos deben revisarse:

- segmento `happy-wood` dentro del patrón del glob;
- `title="HAPPY WOOD | Black Sheep Sport"`;
- description con `HAPPY WOOD`;
- `eventName="HAPPY WOOD"`;
- `venue="Be Happy"`;
- `date="19 de septiembre de 2026"`;
- `isoDate="2026-09-19"`;
- `storageKey="black-sheep-selection-happy-wood"`;
- `whatsappNumber="584247438483"` si el evento fuera autorizado a usar otro número.

La estructura real que debe conservarse es:

1. imports de `Base`, `Header`, `EventGallery`, `Footer`, `BackToTop` y la utilidad `buildEventPhotos`;
2. tipo compartido `EventImageModule` importado desde `src/utils/eventPhotos.ts`;
3. glob eager y literal de la carpeta específica;
4. constante con el nombre real del evento;
5. llamada a `buildEventPhotos()`, que valida filenames, detecta duplicados y aplica el orden natural;
6. `Base` con metadata;
7. `Header`, `<main>`, `EventGallery`, `Footer` y `BackToTop`.

La validación reusable vive en `src/utils/eventPhotos.ts` y debe seguir siendo compartida por todas las páginas. No volver a copiar su regex, límite, detección de duplicados ni orden natural dentro de cada evento. El `import.meta.glob()` sí permanece en cada página como string literal porque Vite necesita conocer el patrón durante el build.

#### Template completo listo para copiar

El siguiente archivo reproduce la estructura real. Sustituir **todos** los valores `REEMPLAZAR...` antes de ejecutar el build. El path de `import.meta.glob()` debe permanecer como string literal: Vite no admite construir este patrón con una variable dinámica.

```astro
---
import Base from "../../layouts/Base.astro";
import Header from "../../components/Header.astro";
import EventGallery from "../../components/EventGallery.astro";
import Footer from "../../components/Footer.astro";
import BackToTop from "../../components/BackToTop.astro";
import { buildEventPhotos, type EventImageModule } from "../../utils/eventPhotos";

const eventPhotoModules = import.meta.glob<EventImageModule>(
  "../../assets/events/REEMPLAZAR-SLUG/*.{webp,jpg,jpeg,png,avif}",
  { eager: true },
);

const EVENT_NAME = "REEMPLAZAR NOMBRE";
const photos = buildEventPhotos(eventPhotoModules, EVENT_NAME);
---

<Base
  title="REEMPLAZAR NOMBRE | Black Sheep Sport"
  description="Galería de fotografías de REEMPLAZAR NOMBRE. Encuentra y selecciona tus fotos del evento."
  robots="noindex, follow"
>
  <Header />
  <main>
    <EventGallery
      eventName="REEMPLAZAR NOMBRE"
      venue="REEMPLAZAR LUGAR"
      date="REEMPLAZAR FECHA VISIBLE"
      isoDate="REEMPLAZAR-FECHA-ISO"
      photos={photos}
      storageKey="black-sheep-selection-REEMPLAZAR-SLUG"
      whatsappNumber="584247438483"
    />
  </main>
  <Footer />
  <BackToTop />
</Base>
```

Antes de dar el archivo por terminado, buscar `REEMPLAZAR` dentro de él. El resultado debe ser cero. No convertir el glob en una plantilla dinámica compartida durante el alta rutinaria.

#### Patrón exacto de `import.meta.glob()`

HAPPY WOOD usa:

```ts
const eventPhotoModules = import.meta.glob<EventImageModule>(
  "../../assets/events/happy-wood/*.{webp,jpg,jpeg,png,avif}",
  { eager: true },
);
```

Para otro evento, cambiar solo el segmento de carpeta:

```ts
const eventPhotoModules = import.meta.glob<EventImageModule>(
  "../../assets/events/<slug>/*.{webp,jpg,jpeg,png,avif}",
  { eager: true },
);
```

El glob se resuelve durante el build:

- descubre los assets compatibles en esa carpeta;
- busca solo archivos directamente dentro de la carpeta porque usa `*`, no subcarpetas recursivas;
- los importa de forma eager como `ImageMetadata`;
- `buildEventPhotos()` transforma las entradas, extrae el filename y el código;
- la misma utilidad valida los códigos, rechaza duplicados case-insensitive y aplica orden natural;
- el resultado se pasa a `EventGallery` como `photos`.

No crear un array manual de filenames. Si se cambia la carpeta o la lista de extensiones permitidas, el patrón de esa página debe actualizarse para coincidir exactamente.

#### Orden natural obligatorio

La utilidad compartida `src/utils/eventPhotos.ts` usa:

```ts
const naturalOrder = new Intl.Collator("es", {
  numeric: true,
  sensitivity: "base",
});
```

y finalmente:

```ts
.sort((a, b) => naturalOrder.compare(a.code, b.code));
```

Esto produce:

```text
DSC1
DSC2
DSC10
```

en lugar del orden lexicográfico incorrecto:

```text
DSC1
DSC10
DSC2
```

No sustituir este orden por `.sort()` sin comparador ni reimplementarlo dentro de una página de evento.

#### Metadata y SEO actual de una galería

HAPPY WOOD usa actualmente:

```text
Title: HAPPY WOOD | Black Sheep Sport
Description: Galería de fotografías de HAPPY WOOD. Encuentra y selecciona tus fotos del evento.
Canonical: https://sheepsport.com/eventos/happy-wood/
Robots: noindex, follow
```

Detalles de implementación:

- la página pasa `robots="noindex, follow"` a `Base`;
- no pasa la prop `canonical`, por lo que se conserva su default `true`;
- `Base.astro` genera el canonical con `new URL(Astro.url.pathname, Astro.site)`;
- `astro.config.mjs` define `site: "https://sheepsport.com"` y `trailingSlash: "always"`.

Al crear otro evento:

- adaptar title y description al nombre real;
- mantener `robots="noindex, follow"` para las galerías hasta que exista otra decisión SEO explícita;
- verificar que la ruta genere un canonical del dominio `https://sheepsport.com` y con slash final;
- no añadir automáticamente la ruta al sitemap: el sitemap actual no incluye galerías de eventos.

No hardcodear manualmente otro canonical si el comportamiento de `Base` ya produce la URL correcta.

### Paso 3 — Reutilizar `EventGallery.astro`

No duplicar el componente ni copiar su script dentro de cada página. La API real actual tiene siete props obligatorias:

| Prop | Tipo | Responsabilidad |
|---|---|---|
| `eventName` | `string` | Nombre visible, alt text y nombre insertado en WhatsApp. |
| `venue` | `string` | Lugar visible del evento. |
| `date` | `string` | Fecha visible. |
| `isoDate` | `string` | Valor semántico del elemento `<time>`. |
| `photos` | `EventPhoto[]` | Array de `{ src: ImageMetadata, code: string }`. |
| `storageKey` | `string` | Key exclusiva de localStorage para ese evento. |
| `whatsappNumber` | `string` | Número sin `+`, espacios ni guiones para construir `wa.me`. |

Ejemplo de uso adaptado:

```astro
<EventGallery
  eventName="NOMBRE REAL"
  venue="LUGAR REAL"
  date="FECHA VISIBLE"
  isoDate="YYYY-MM-DD"
  photos={photos}
  storageKey="black-sheep-selection-<slug>"
  whatsappNumber="584247438483"
/>
```

No dejar `HAPPY WOOD`, `Be Happy`, su fecha ni su storage key en una página nueva.

#### Limitaciones hardcodeadas actuales del componente

El nombre del evento, lugar, fecha, key y número de WhatsApp llegan por props; no están fijados a HAPPY WOOD dentro del JavaScript.

Sí están hardcodeados dentro de `EventGallery.astro` y se aplican a todos los eventos:

- `US$4` para una foto;
- `US$7` para dos fotos;
- `US$12 por atleta` para el paquete “Todas tus fotos”;
- umbral informativo de 3 fotos;
- copy de selección;
- copy del estado vacío;
- plantillas de mensaje de WhatsApp.

Antes de crear un evento, confirmar que esos precios y textos siguen vigentes. No convertirlos en props ni refactorizarlos durante una alta rutinaria sin autorización.

#### Estado vacío automático

`EventGallery.astro` calcula:

```ts
const hasPhotos = photos.length > 0;
```

Cuando `photos.length === 0`, muestra exactamente:

```text
PRÓXIMAMENTE

Las fotos estarán disponibles pronto

Estamos preparando la galería de este evento. Cuando las fotos estén listas, aparecerán aquí.
```

En ese estado no se renderizan:

- instrucciones de selección;
- grid;
- botones de fotografías;
- región de estado de selección;
- barra inferior;
- contador;
- “Limpiar selección”;
- CTA de compra.

Además, el atributo `data-event-gallery` se omite, por lo que el script de selección no inicializa ninguna galería. Esto permite publicar la página antes del evento sin fotografías ajenas ni errores JS.

No volver a introducir un fallback con fotos de `src/assets/photos/` ni de otro evento.

#### Selección y accesibilidad

Con fotos disponibles:

- cada foto es un `<button type="button">`;
- usa `aria-pressed="false|true"`;
- el `aria-label` cambia entre “Seleccionar foto…” y “Quitar foto… de la selección”;
- el estado visual seleccionado usa borde volt, fondo volt y check volt sobre ink;
- el indicador inactivo conserva una base tenue de `30×30px`;
- esa base usa blanco con opacidad `0.62`, borde gris y sombra pequeña;
- el check SVG permanece oculto hasta seleccionar;
- funciona con mouse, touch y teclado por semántica nativa de botón;
- existe `:focus-visible` global en `Base.astro`;
- las actualizaciones usan regiones `aria-live` sin añadir anuncios por fotografía innecesarios;
- `prefers-reduced-motion` desactiva los transforms relevantes.

No aumentar la prominencia del indicador inactivo: es una pista discreta que no debe competir con la fotografía.

#### localStorage: key exclusiva por evento

HAPPY WOOD usa:

```text
black-sheep-selection-happy-wood
```

Convención obligatoria para nuevas páginas:

```text
black-sheep-selection-<slug>
```

Ejemplos:

```text
black-sheep-selection-happy-wood
black-sheep-selection-copa-merida-2026
black-sheep-selection-reto-los-andes
```

Nunca reutilizar la misma key entre dos eventos. Hacerlo mezclaría selecciones de galerías distintas si comparten códigos.

Comportamiento actual:

- guarda un array JSON de códigos en el orden de la galería;
- elimina la key cuando la selección queda vacía;
- captura errores si el navegador bloquea localStorage;
- al cargar, analiza el valor guardado;
- restaura únicamente strings presentes en `availableCodes`;
- ignora códigos correspondientes a archivos eliminados o renombrados;
- reconstruye `aria-pressed`, contador, pricing y barra después de restaurar.

#### Pricing informativo dentro de la galería

| Selección | Barra inferior |
|---:|---|
| 0 | Barra oculta. |
| 1 | `1 foto seleccionada` + `US$4` + `Comprar seleccionada`. |
| 2 | `2 fotos seleccionadas` + `US$7` + `Comprar seleccionadas`. |
| 3 o más | `<N> fotos seleccionadas` + `Paquete disponible: Todas tus fotos · US$12 por atleta`. |

Para 3 o más, el texto no es un total calculado. No mostrar “Total: US$12” ni afirmar que las fotos marcadas cuestan US$12. El paquete es por atleta y una selección puede mezclar personas.

No implementar reconocimiento facial, agrupación de personas ni inferencias desde filenames.

#### WhatsApp dinámico

Número actual:

```text
584247438483
```

Para 1 o 2 fotos, la plantilla actual es:

```text
Hola, vi mis fotos de <EVENTO> y quiero comprar estas fotos: <CODIGOS>. ¿Me ayudas con el proceso de pago?
```

Para 3 o más:

```text
Hola, vi mis fotos de <EVENTO> y seleccioné estas fotos: <CODIGOS>. Vi que tienen el paquete Todas tus fotos por US$12 por atleta. ¿Me ayudas con la compra?
```

Los códigos se obtienen en ese momento desde el `Set` de selección y se ordenan según el orden de los botones de la galería. No se hardcodean combinaciones.

El nombre `<EVENTO>` sale de la prop `eventName`. Al crear una página, verificar que esa prop contiene el nombre real para no enviar accidentalmente `HAPPY WOOD`.

La URL se construye así:

```ts
https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}
```

Se abre en nueva pestaña mediante un enlace temporal con `target="_blank"` y `rel="noopener noreferrer"`. No construir URLs con texto sin codificar ni eliminar `encodeURIComponent()`.

### Paso 4 — Añadir el evento a Home

Modificar únicamente el array `events` de:

```text
src/components/Events.astro
```

La interface real tiene exactamente estos campos:

```ts
interface EventItem {
  name: string;
  date: string;
  isoDate: string;
  location: string;
  url: string;
  isActive: boolean;
}
```

Ejemplo para una galería propia:

```ts
{
  name: "NOMBRE REAL",
  date: "FECHA VISIBLE",
  isoDate: "YYYY-MM-DD",
  location: "LUGAR REAL",
  url: "/eventos/<slug>/",
  isActive: true,
}
```

Comportamiento actual de `isActive`:

- `true` muestra el badge `Activo ahora`;
- `false` oculta únicamente ese badge;
- la tarjeta, metadata y CTA siguen renderizándose en ambos casos;
- no existe un estado deshabilitado ni una lógica automática basada en la fecha.

Por tanto, “evento futuro” no significa que el CTA desaparezca. Si su página existe con carpeta vacía, el CTA puede llevar al estado “Próximamente”.

Para una galería propia, `url` debe ser `/eventos/<slug>/`, no Google Drive. `Events.astro` usa actualmente un enlace normal sin `target="_blank"`; la navegación ocurre en la misma pestaña.

No modificar tarjetas ajenas ni la Home fuera de la entrada necesaria.

### Componentes globales obligatorios en la página

Cada página de evento debe reutilizar:

- `Base.astro` para documento, fuentes, metadata, GA4, canonical y estilos globales;
- `Header.astro` para wordmark, ubicación y navegación hacia `/#tu-evento`;
- `Footer.astro` para identidad y enlaces legales;
- `BackToTop.astro` para recorridos largos.

No crear versiones duplicadas. El componente de galería ya desplaza `BackToTop` cuando la barra inferior está activa y respeta safe areas.

### Paso 5 — Publicar las fotografías

Cuando el fotógrafo entregue las previews:

1. verificar que provienen del evento correcto;
2. verificar que ya tienen marca de agua;
3. revisar dimensiones y orientación;
4. revisar filenames, unicidad y estabilidad de códigos;
5. copiar los archivos a `src/assets/events/<slug>/`;
6. no editar manualmente el array `photos`;
7. ejecutar `npm run build`;
8. comprobar la cantidad detectada;
9. probar selección, pricing y WhatsApp;
10. desplegar el contenido completo de `dist/`.

Si la página y el glob ya existen, publicar fotos no requiere modificar código.

#### Qué ocurre al reemplazar, añadir o eliminar archivos

- Reemplazar una foto manteniendo exactamente el mismo filename conserva el código comercial y permite que una selección guardada siga apuntando a ese código.
- Eliminar un archivo hace que desaparezca en el siguiente build; su código guardado se descarta al restaurar porque no existe en `availableCodes`.
- Cambiar el filename cambia el código visible y el identificador; la selección anterior con el nombre viejo se ignora.
- Añadir una foto compatible hace que aparezca automáticamente en el siguiente build y en su posición natural.
- Cambiar únicamente mayúsculas/minúsculas puede producir diferencias según filesystem y deploy; evitarlo después de publicar.

### Build y QA obligatorio por evento

Ejecutar siempre:

```bash
npm run build
```

#### Comandos de verificación operativa

Sustituir el valor de `EVENT_SLUG` antes de ejecutar estos comandos:

```bash
EVENT_SLUG="copa-merida-2026"
```

Contar únicamente imágenes compatibles con el glob actual:

```bash
rg --files "src/assets/events/$EVENT_SLUG" \
  | rg '\.(webp|jpg|jpeg|png|avif)$' \
  | wc -l
```

Detectar basenames duplicados aunque tengan extensiones diferentes. El comando no debe devolver ninguna línea:

```bash
rg --files "src/assets/events/$EVENT_SLUG" \
  | rg '\.(webp|jpg|jpeg|png|avif)$' \
  | sed -E 's#^.*/##; s/\.[^.]+$//' \
  | sort \
  | uniq -d
```

Confirmar que Astro generó la ruta esperada:

```bash
ls -l "dist/eventos/$EVENT_SLUG/index.html"
```

Contar las fotografías renderizadas en el HTML generado:

```bash
rg -o '<button class="photo-choice"' "dist/eventos/$EVENT_SLUG/index.html" \
  | wc -l
```

Comprobar metadata crítica del archivo generado:

```bash
rg -o '<link rel="canonical"[^>]+>|<meta name="robots"[^>]+>' \
  "dist/eventos/$EVENT_SLUG/index.html"
```

Buscar placeholders sin sustituir y valores de HAPPY WOOD copiados por accidente. Ambos comandos deben terminar sin coincidencias para otro evento:

```bash
rg -n 'REEMPLAZAR' "src/pages/eventos/$EVENT_SLUG.astro"
rg -n 'HAPPY WOOD|happy-wood|Be Happy|2026-09-19' \
  "src/pages/eventos/$EVENT_SLUG.astro"
```

Revisar el alcance final y la integridad del diff:

```bash
git status --short
git diff --name-only
git diff --check
```

Los archivos esperados para un alta normal son la nueva página, la nueva carpeta con su README y las fotos suministradas, y la entrada correspondiente en `Events.astro`. Investigar cualquier archivo adicional antes de continuar.

Comprobar:

- [ ] se genera `dist/eventos/<slug>/index.html`;
- [ ] no hay errores de assets;
- [ ] la cantidad renderizada coincide con la cantidad esperada;
- [ ] carpeta vacía muestra “PRÓXIMAMENTE”;
- [ ] carpeta vacía no muestra grid, selección ni barra de compra;
- [ ] carpeta con fotos elimina automáticamente el estado vacío;
- [ ] los códigos coinciden exactamente con filenames sin extensión;
- [ ] el orden es natural (`1`, `2`, `10`);
- [ ] fotos verticales usan su proporción sin deformación;
- [ ] fotos horizontales usan su proporción sin crop agresivo;
- [ ] selección y deselección funcionan;
- [ ] `aria-pressed` cambia correctamente;
- [ ] teclado, mouse y touch funcionan;
- [ ] recargar restaura la selección del evento;
- [ ] “Limpiar selección” elimina la key;
- [ ] 1 foto muestra `US$4`;
- [ ] 2 fotos muestran `US$7`;
- [ ] 3 o más muestran el paquete disponible por atleta, no un total;
- [ ] WhatsApp contiene solo los códigos seleccionados;
- [ ] WhatsApp usa el evento correcto y `584247438483`;
- [ ] WhatsApp de 3+ no presupone que las fotos son de una sola persona;
- [ ] el canonical tiene dominio correcto y slash final;
- [ ] la página conserva `noindex, follow` salvo decisión SEO expresa;
- [ ] no se añadió la ruta al sitemap sin autorización;
- [ ] móvil mantiene 2 columnas;
- [ ] no existe overflow horizontal;
- [ ] la barra inferior respeta safe area;
- [ ] la barra no tapa la última fila;
- [ ] se puede llegar y ver por completo el último grupo de fotos.

#### Prueba obligatoria en teléfono

Un build correcto no basta para publicar un evento real. Antes del deploy definitivo:

1. abrir la URL en un teléfono físico;
2. usar conexión móvil si es posible;
3. recorrer la galería de principio a fin;
4. revisar mezcla de verticales y horizontales;
5. seleccionar una foto y comprobar `US$4`;
6. seleccionar dos y comprobar `US$7`;
7. seleccionar tres o más y leer la aclaración “por atleta”;
8. recargar y confirmar restauración;
9. deseleccionar de 3 a 2 y confirmar regreso a `US$7`;
10. limpiar la selección;
11. abrir WhatsApp y revisar evento, códigos, precio y número;
12. comprobar barra sticky, safe area y última fila.

Registrar cualquier problema objetivo antes de desplegar. No rediseñar la galería durante esta prueba.

### Deploy actual

El proyecto es Astro estático:

```text
npm run build
→ genera dist/
→ subir el contenido de dist/ a SiteGround
```

No subir únicamente `src/assets/events/<slug>/` ni una subcarpeta aislada de `dist/`. Astro transforma nombres y genera assets optimizados; el deploy actual requiere el resultado completo del build.

Después del deploy, repetir al menos la prueba de ruta, selección y WhatsApp sobre la URL pública.

### Qué no debe hacer una IA al crear un evento

**NO:**

- declarar manualmente decenas o cientos de fotos;
- crear un array manual de filenames;
- copiar fotos de otro evento como fallback;
- usar una misma key de localStorage para eventos distintos;
- cambiar precios sin autorización;
- cambiar WhatsApp sin autorización;
- interpretar 3+ fotos como un total de US$12;
- inferir qué fotos pertenecen a una persona;
- añadir reconocimiento facial;
- añadir backend, base de datos, login o cuentas;
- añadir React, Vue, Svelte u otro framework;
- instalar dependencias para dar de alta un evento;
- crear carrito, checkout o cálculo de impuestos;
- tocar GA4 o Search Console;
- tocar políticas, robots, `.htaccess` o SEO global;
- añadir la galería al sitemap sin una decisión SEO;
- modificar Home fuera de la tarjeta necesaria;
- renombrar fotografías automáticamente;
- eliminar la marca de agua de las previews;
- generar una segunda marca de agua en la web;
- hacer refactors no relacionados durante el alta.

### Plantilla operativa reutilizable para una IA

Copiar y completar este bloque antes de empezar:

```text
DATOS DEL NUEVO EVENTO

Nombre exacto:
Lugar:
Fecha visible:
Fecha ISO (YYYY-MM-DD):
Slug:
Slug confirmado como definitivo antes del primer deploy (sí/no):
URL esperada: /eventos/<slug>/
Activo ahora (sí/no):
Cantidad esperada de fotos:
Convención de filenames:
WhatsApp confirmado:
Precios confirmados:
Política SEO confirmada (galerías: `noindex, follow`; 404: `noindex, nofollow`):

ARCHIVOS A CREAR

[ ] src/assets/events/<slug>/
[ ] src/assets/events/<slug>/README.md
[ ] src/pages/eventos/<slug>.astro

ARCHIVOS A MODIFICAR

[ ] src/components/Events.astro — añadir entrada al array events
[ ] HANDOFF.md — registrar el evento solo si se solicita actualizar documentación

NO MODIFICAR SIN AUTORIZACIÓN

[ ] EventGallery.astro (los precios y mensajes son compartidos)
[ ] Base.astro
[ ] Header.astro
[ ] Footer.astro
[ ] BackToTop.astro
[ ] Pricing.astro
[ ] GA4 / Search Console / sitemap / robots / políticas / .htaccess

VALIDACIÓN DE CARPETA VACÍA

[ ] build correcto
[ ] ruta generada
[ ] nombre, lugar y fecha correctos
[ ] muestra “PRÓXIMAMENTE”
[ ] no muestra fotos de otro evento
[ ] no muestra controles de selección o compra

VALIDACIÓN CON FOTOS

[ ] cantidad detectada correcta
[ ] formatos dentro del glob actual
[ ] códigos derivados de filenames
[ ] basenames/códigos únicos incluso entre extensiones diferentes
[ ] orden natural
[ ] verticales y horizontales correctas
[ ] selección/deselección
[ ] aria-pressed y teclado
[ ] key black-sheep-selection-<slug>
[ ] restauración y limpieza de localStorage
[ ] pricing 1 / 2 / 3+
[ ] WhatsApp con evento, códigos y número correctos
[ ] canonical y noindex correctos
[ ] prueba móvil física completa
[ ] npm run build final
[ ] deploy completo de dist/
[ ] prueba sobre producción
```

### EJEMPLO — NO ES UN EVENTO REAL

Este bloque es únicamente una demostración técnica. No añadirlo a `Events.astro` ni crear sus archivos salvo que el usuario confirme que el evento existe.

```text
Nombre: Reto Los Andes
Lugar: Ejemplo únicamente
Fecha visible: 27 de septiembre de 2026
Fecha ISO: 2026-09-27
Slug: reto-los-andes
Activo: false

Carpeta:
src/assets/events/reto-los-andes/

Página:
src/pages/eventos/reto-los-andes.astro

URL:
https://sheepsport.com/eventos/reto-los-andes/

LocalStorage:
black-sheep-selection-reto-los-andes

Filename de ejemplo:
RLA-001.jpg

Código visible y enviado a WhatsApp:
RLA-001

Entrada conceptual en Events.astro:
{
  name: "Reto Los Andes",
  date: "27 de septiembre de 2026",
  isoDate: "2026-09-27",
  location: "Ejemplo únicamente",
  url: "/eventos/reto-los-andes/",
  isActive: false,
}
```

Con la carpeta vacía, esa URL mostraría “Próximamente”. Al copiar `RLA-001.jpg` y ejecutar el siguiente build, mostraría una foto con código `RLA-001` sin editar el array de la página.

---

## 5. Stack y arquitectura

### Framework

- **Astro `^7.3.3`**
- Sin React, Vue ni Svelte.
- Sitio completamente estático.
- Build final en `dist/`.

### CSS

- CSS propio.
- Custom properties en `src/styles/tokens.css`.
- Sin Tailwind.
- Sin librerías de UI.

### Imágenes

Las imágenes de contenido utilizan `astro:assets` y `<Image>` para generar variantes optimizadas.

La galería de muestra de Home (`Gallery.astro`) usa:

```ts
widths={[400, 675, 800]}
```

Esto fue una optimización deliberada frente al set anterior `[400, 800, 1200]`.

La galería seleccionable de eventos (`EventGallery.astro`) usa un set distinto, adecuado a las previews pequeñas de Lightroom:

```ts
widths={[200, 400]}
```

### Fuentes

Autoalojadas en `public/fonts/`:

- Archivo Expanded
- Instrument Sans

No se cargan Google Fonts externamente.

### JavaScript cliente

El proyecto **ya no es cero-JS**.

Actualmente existe JS por tres razones deliberadas:

1. `BackToTop.astro`: JS vanilla muy pequeño para mostrar/ocultar el botón y ejecutar scroll suave.
2. `EventGallery.astro`: JS vanilla para selección, localStorage, pricing y WhatsApp dinámico.
3. Google Analytics 4: `gtag.js` + configuración inline global.

No existe framework de frontend ni bundle de aplicación.

### Breakpoint principal

El breakpoint de layout principal sigue siendo:

```css
@media (min-width: 900px)
```

El enfoque permanece mobile-first.

### Deploy

Deploy estático manual en SiteGround:

```bash
npm run build
```

Luego se sube **el contenido de `dist/`** al directorio público de `sheepsport.com`.

No hay CI/CD ni build en servidor.

---

## 6. Diseño actual y decisiones cerradas

### Paleta

| Token | Valor | Uso |
|---|---|---|
| `--color-accent` | `#cdff3a` | Volt, color de marca |
| `--color-accent-on` | `#0d0f0c` | Texto sobre volt |
| `--color-ink` | `#0d0f0c` | Negro tintado frío |
| `--color-ink-inverse` | `#f2f4f3` | Texto sobre oscuro |
| `--color-surface` | `#ffffff` | Fondo base |
| `--color-gray-100` | `#f2f4f3` | Fondo sutil |
| `--color-gray-200` | `#dfe3e1` | Bordes |
| `--color-gray-300` | `#b7bebb` | Texto secundario sobre oscuro |
| `--color-gray-400` | `#7c847f` | Números visuales 01/02/03 |
| `--color-gray-500` | `#454b47` | Texto secundario sobre claro |

### Regla del volt

El volt `#CDFF3A`:

1. puede usarse como relleno con texto oscuro;
2. puede usarse como texto sobre fondo oscuro;
3. **no** debe usarse como texto sobre blanco o fondos claros.

### Radios

Un único radio:

```css
--radius-sm: 2px;
```

El lenguaje visual debe mantenerse cuadrado; no convertir botones en píldoras.

### Tipografía

**Display**

```text
"Archivo Expanded", "Archivo", sans-serif
```

Usada en títulos, badges, precios y elementos de identidad.

**Body**

```text
"Instrument Sans", sans-serif
```

El header dejó de utilizar `ui-monospace`; la ubicación usa la fuente de cuerpo para mantener coherencia tipográfica.

### Hero

Foto actual:

```text
DSC06482-Mejorado-NR.webp
```

Encuadre actual:

- móvil: `object-position: 40% 55%`;
- escritorio: `object-position: 40% 35%`.

El ajuste móvil se hizo específicamente para que el copy no cubra el rostro.

No cambiar estos valores a ciegas si se reemplaza la foto.

### Precios

En móvil:

- grid de 2 columnas;
- 1 foto y 2 fotos ocupan la primera fila;
- **“Todas tus fotos”** ocupa toda la segunda fila;
- no debe existir scroll horizontal.

En desktop, desde 900px:

- se restaura layout horizontal;
- alto de las opciones: `230px`.

Se añadió debajo de los precios el CTA:

**“Buscar mis fotos”**

hacia `/#tu-evento`. El CTA no abre WhatsApp directamente: primero lleva al cliente a la tarjeta del evento y desde allí a la galería seleccionable.

### Galería de muestra en Home

- 6 fotos.
- Siempre visibles.
- No volver al experimento anterior de GIF transparente / carga condicional.
- Hover de zoom únicamente en dispositivos con hover real / pointer fino.

No confundir `Gallery.astro`, que es una muestra editorial de la landing, con `EventGallery.astro`, que contiene las fotos seleccionables de cada evento. Fogueo Be Fit tiene 194 fotos reales y usa lazy loading, códigos por filename y barra de compra. HAPPY WOOD está actualmente vacío y muestra “Próximamente”.

### Interacciones móviles

La pasada de accesibilidad/móvil añadió:

- `touch-action: manipulation` en enlaces y botones;
- targets táctiles ampliados donde era necesario;
- hover limitado a `(hover: hover) and (pointer: fine)`;
- estados `:active` discretos;
- `HowToBuy` convertido a `ol` / `li`;
- wordmark del Header con área táctil real de ~44px;
- enlaces legales del Footer con hit area ampliada.

### Footer

Los enlaces:

- Privacidad
- Cookies
- Términos

usan un tamaño visual reducido:

```css
--font-size-xs
```

aprox. `0.8125rem`, conservando el área táctil mediante pseudo-elemento.

---

## 7. Performance

### Resultado posterior a la optimización de galería

La auditoría posterior registró aproximadamente:

**390,912 B**

de transferencia total de página en:

- 390px DPR3;
- 430px DPR3;
- 1440px DPR2.

La versión anterior llegaba a:

**525,529 B**

en escenarios de alta densidad.

La optimización de las variantes de galería produjo un ahorro aproximado de:

**134,617 B (~25.6%)**

### Nota

Estas cifras corresponden al presupuesto de assets estáticos medido durante la auditoría de imágenes. La carga externa de Google Analytics se añadió posteriormente y no debe confundirse con ese presupuesto de imágenes/assets propios.

### Imagen Open Graph

Asset definitivo:

```text
public/og-black-sheep-sport.png
```

Dimensiones:

```text
1200 × 630 px
```

Peso final:

```text
471,316 bytes
```

El PNG original recibido pesaba 2,107,500 bytes y fue reducido aproximadamente 77.64% sin cambiar la composición.

---

## 8. SEO técnico y metadata

### Home

**Title definitivo**

```text
Black Sheep Sport | Fotografía deportiva en Mérida
```

**Meta description definitiva**

```text
Fotografía deportiva profesional en Mérida, Venezuela. Encuentra las fotos de tu evento, elige tus favoritas y coordina la compra por WhatsApp.
```

**H1**

```text
ASÍ SE VE DAR TODO
```

El H1 se mantiene como mensaje de marca. El contexto semántico lo aportan title, description, kicker y contenido visible.

### Nombre oficial del sitio

```text
Black Sheep Sport
```

`og:site_name` utiliza exactamente ese nombre.

### Open Graph / Twitter

`Base.astro` genera:

- `og:title`
- `og:description`
- `og:type`
- `og:url`
- `og:site_name`
- `og:image`
- `og:image:width`
- `og:image:height`
- metadata equivalente para Twitter

Imagen social definitiva:

```text
https://sheepsport.com/og-black-sheep-sport.png
```

### Canonicals

Política final:

```text
https://sheepsport.com/
https://sheepsport.com/terminos/
https://sheepsport.com/privacidad/
https://sheepsport.com/cookies/
```

### Trailing slash

`astro.config.mjs`:

```js
trailingSlash: "always"
```

Esto se alineó con el comportamiento real del hosting.

### Sitemap

Archivo:

```text
public/sitemap.xml
```

URLs:

```text
https://sheepsport.com/
```

No se incluyen `lastmod` inventados.

Política de indexación:

- INDEXABLE: Home.
- NOINDEX, FOLLOW: galerías de eventos, términos, privacidad y cookies.
- NOINDEX, NOFOLLOW: 404.
- El sitemap solo debe incluir URLs indexables.

### robots.txt

`public/robots.txt` permite rastreo y apunta al sitemap.

### Search Console

**Configurado, verificado y probado.**

El sitemap ya fue enviado y aceptado correctamente.

No queda una tarea pendiente de Search Console para el lanzamiento del MVP.

### HTTP / HTTPS / www

`public/.htaccess` consolida las variantes hacia:

```text
https://sheepsport.com/
```

Reglas actuales:

```apache
RewriteEngine On

RewriteCond %{HTTPS} !=on [OR]
RewriteCond %{HTTP_HOST} ^www\.sheepsport\.com$ [NC]
RewriteRule ^ https://sheepsport.com%{REQUEST_URI} [R=301,L]
```

La ruta solicitada se conserva.

---

## 9. Google Analytics

Google Analytics 4 está activo globalmente desde `src/layouts/Base.astro`.

### Measurement ID

```text
G-T78YKQN3QZ
```

Se utiliza el snippet oficial de `gtag.js`.

### Estado

- GA4 activo.
- Verificado online.
- No se utiliza Google Tag Manager.
- No se instalaron paquetes de Analytics.
- No existe banner de cookies en este MVP.
- La Política de privacidad y la Política de cookies fueron actualizadas para reflejar que GA4 está activo.

### Eventos personalizados

Todavía no se implementaron eventos personalizados.

Los dos eventos más útiles previstos son:

```text
gallery_open
whatsapp_click
```

No son bloqueantes para operar el MVP.

Cuando se implementen, conviene evaluar si deben marcarse como **key events** en GA4.

---

## 10. Páginas legales

### `/terminos/`

Título visible:

**Términos y condiciones**

Incluye:

- selección mediante códigos;
- marca de agua;
- precios;
- definición de “Todas tus fotos”;
- pago;
- entrega digital;
- tiempos;
- disponibilidad de fotografías;
- errores de códigos;
- retiro de imágenes;
- uso personal;
- terceros;
- cambios futuros.

### `/privacidad/`

Incluye:

- responsable y alcance;
- información que puede tratarse;
- finalidades;
- fotografías de eventos;
- servicios de terceros;
- Google Analytics 4;
- conservación;
- derechos y solicitudes;
- cambios.

Canales de contacto:

- WhatsApp +58 424-7438483
- `info@sheepsport.com`

### `/cookies/`

Incluye:

- explicación básica de cookies;
- estado actual;
- terceros;
- uso de Google Analytics 4;
- control desde navegador;
- contacto;
- actualizaciones.

No existe banner de cookies ni panel de preferencias en el MVP actual.

Esta ausencia es una decisión de producto actual; no introducir uno automáticamente sin una decisión explícita.

---

## 11. 404 personalizado

Página:

```text
src/pages/404.astro
```

Genera:

```text
dist/404.html
```

Configuración del servidor:

```text
public/.htaccess
```

Directiva:

```apache
ErrorDocument 404 /404.html
```

Se probó online después del deploy: SiteGround ya muestra el 404 personalizado en lugar de su error genérico.

La página:

- no tiene canonical;
- usa `noindex, nofollow`;
- reutiliza Header/Footer y el sistema visual existente.

No sustituir esto por redirecciones 301/302 hacia `/404`.

---

## 12. Favicons e identidad técnica

Assets actuales:

```text
public/favicon.webp
public/favicon.png
```

Ambos son:

```text
512 × 512 px
```

Se eliminaron los antiguos:

```text
public/favicon.svg
public/favicon.ico
```

`Base.astro` declara:

```html
<link rel="icon" type="image/webp" sizes="512x512" href="/favicon.webp" />
<link rel="icon" type="image/png" sizes="512x512" href="/favicon.png" />
<link rel="apple-touch-icon" sizes="512x512" href="/favicon.png" />
```

Para el MVP no se consideró necesario regenerar un `.ico`.

---

## 13. Back to top

Componente:

```text
src/components/BackToTop.astro
```

Comportamiento:

- oculto inicialmente;
- aparece aproximadamente desde `scrollY >= 500`;
- listener de scroll pasivo;
- scroll suave mediante `window.scrollTo`;
- si `prefers-reduced-motion` está activo, evita la animación;
- target táctil de 44 × 44 px;
- SVG inline;
- hover solo en dispositivos con hover real;
- feedback `:active`;
- sin dependencias externas.

El JS inline original se mantuvo extremadamente pequeño (~348 B en la medición realizada al implementarlo).

No se muestra en el 404.

---

## 14. Despliegue y pruebas realizadas

### Producción

```text
https://sheepsport.com/
```

### Ya probado

- deploy online;
- Home;
- páginas legales;
- 404 personalizado;
- CTA de WhatsApp;
- mensaje prellenado;
- responsive móvil;
- Hero móvil;
- CTA posterior a precios;
- OG final;
- GA4 en producción;
- Search Console;
- sitemap enviado y aceptado;
- flujo QR → landing probado.

### Pruebas de la rama de galería propia

En `feature/event-gallery-selection` se verificaron:

- 194 fotos reales de Fogueo Be Fit;
- selección, pricing y WhatsApp de Fogueo Be Fit mediante prueba manual de la galería;
- HAPPY WOOD con 0 fotos después de retirar las 162 imágenes de prueba;
- estado vacío de HAPPY WOOD sin fallback, grid ni controles de compra;
- build estático de `/eventos/fogueo-be-fit/` y `/eventos/happy-wood/`.

Sigue pendiente una decisión explícita de merge y un deploy de esta feature. Después de desplegarla, repetir en producción el flujo `QR → Home → Fogueo Be Fit → galería propia → selección → WhatsApp`, preferiblemente desde un teléfono con datos móviles. HAPPY WOOD deberá probarse de la misma forma cuando se incorpore su lote real.

---

## 15. Archivos y configuración clave

### Estructura principal

```text
src/
  components/
    Header.astro
    Hero.astro
    Events.astro
    HowToBuy.astro
    Pricing.astro
    Gallery.astro
    EventGallery.astro
    Faq.astro
    FinalCta.astro
    Footer.astro
    BackToTop.astro

  layouts/
    Base.astro

  pages/
    index.astro
    eventos/
      fogueo-be-fit.astro
      happy-wood.astro
    terminos.astro
    privacidad.astro
    cookies.astro
    404.astro

  styles/
    tokens.css

  assets/photos/
    ...

  assets/events/
    fogueo-be-fit/
      README.md
      194 fotos reales incorporadas y probadas
    happy-wood/
      README.md
      0 fotos; lote real pendiente para mañana

  utils/
    eventPhotos.ts

public/
  fonts/
  favicon.webp
  favicon.png
  og-black-sheep-sport.png
  robots.txt
  sitemap.xml
  .htaccess
```

### Otros documentos relevantes

```text
PRODUCT.md
README.md
HANDOFF.md
CRITIQUE-LANDING.md
AUDIT-LANDING.md
AUDITORIA-PROYECTO.md
```

Las auditorías históricas describen estados anteriores del proyecto. Si contradicen este documento o el código actual, usar el código actual como referencia.

---

## 16. Comandos de trabajo

```bash
npm install
npm run dev
npm run build
npm run preview
```

Si el proyecto conserva los helpers documentados originalmente para Astro en background:

```bash
astro dev --background
astro dev stop
astro dev status
```

### Deploy manual

```bash
npm run build
```

Subir **el contenido de `dist/`**, no la carpeta contenedora, al directorio público del dominio.

Después del deploy comprobar:

```text
https://sheepsport.com/
https://sheepsport.com/terminos/
https://sheepsport.com/privacidad/
https://sheepsport.com/cookies/
https://sheepsport.com/sitemap.xml
https://sheepsport.com/robots.txt
https://sheepsport.com/una-url-que-no-existe
```

---

## 17. Convención de commits

Formato habitual:

```text
tipo: descripción
```

Tipos usados:

```text
feat:
fix:
perf:
docs:
copy:
seo:
chore:
```

Ejemplos recientes:

```text
feat: connect WhatsApp purchase CTA
perf: optimize gallery image variants
feat: add legal pages and policies
feat: add Google Analytics tracking
fix: use custom 404 on SiteGround
feat: update social sharing image
seo: improve metadata and canonical URLs
seo: prioritize brand in home title
```

Los commits los realiza el usuario; Codex no debe hacer commits salvo instrucción explícita.

---

## 18. Impeccable y auditorías

El proyecto tiene configuración de **Impeccable** en:

```text
.impeccable/
```

Se utilizó durante la construcción para crítica visual y auditoría técnica.

Documentos históricos:

- `CRITIQUE-LANDING.md`
- `AUDIT-LANDING.md`

También existe una auditoría SEO posterior que detectó y llevó a corregir:

- title demasiado genérico;
- meta description demasiado corta;
- HTTP sin consolidación;
- `www` sin consolidación;
- trailing slash inconsistente.

Esos puntos ya están resueltos en el estado actual.

No reejecutar o “corregir” decisiones de diseño cerradas automáticamente sin revisar primero este documento y `PRODUCT.md`.

---

## 19. Decisiones descartadas que no deben reaparecer por defecto

### HTML plano sin build

Descartado. Astro se mantiene por componentes + optimización de imágenes.

### Tailwind / CDN Tailwind

Descartado. El proyecto usa CSS propio.

### Base64 para imágenes de producción

Descartado. El export de referencia no es una estrategia de producción.

### Testimonios o métricas inventadas

Prohibido. No hay que rellenar la landing con prueba social ficticia.

### Hero SaaS dentro de card

Descartado. La fotografía debe sentirse como el producto, no como una ilustración secundaria.

### Deshabilitar visualmente los CTA placeholder

Descartado en el MVP original. En la rama feature ya no existe el placeholder `url: "#"` para HAPPY WOOD: el CTA apunta a `/eventos/happy-wood/`. Para eventos futuros sin fotos, el CTA puede permanecer operativo y llevar al estado vacío “Próximamente”.

### Banner de cookies

No forma parte del MVP actual. No añadirlo automáticamente.

### Schema avanzado

No se implementó en esta primera fase SEO. Puede evaluarse después sin bloquear el MVP.

---

## 20. Pendientes actuales, en orden real de prioridad

### P0 — decisión de publicación de la feature

1. Revisar y aprobar `feature/event-gallery-selection`.
2. Aprobar la galería propia como el flujo de compra que sustituirá al MVP original.
3. Hacer merge únicamente con autorización.
4. Ejecutar build y desplegar el contenido completo de `dist/`.
5. Probar en producción:
   `QR → Home → Fogueo Be Fit → galería propia → selección → WhatsApp`.
6. Cuando llegue el lote real de HAPPY WOOD, copiarlo, ejecutar build/deploy y repetir el flujo completo para ese evento.

### P1 — útil, no bloqueante

1. Eventos GA4:
   - `gallery_open`
   - `whatsapp_click`
2. Evaluar esos eventos como key events.
3. Actualizar este HANDOFF después del merge/deploy para separar con claridad qué quedó en producción.

### P2 — mejoras futuras

- Evaluar schema (`Organization`, `LocalBusiness` u otro que corresponda).
- Auditoría específica de `alt` text.
- Decidir si las páginas individuales de evento deben pasar de `noindex` a indexables e incorporarse al sitemap.
- Automatizar deploy si el volumen de cambios aumenta.
- Revisar consentimiento/cookies si cambia la operación, jurisdicción o stack de tracking.

---

## 21. Estado de cierre del MVP

A fecha **18/09/2026**, el MVP está:

- diseñado;
- desarrollado;
- responsive;
- publicado;
- probado en producción;
- conectado a WhatsApp;
- con precios reales;
- con evento real;
- con páginas legales;
- con correo oficial;
- con GA4;
- con Search Console;
- con sitemap;
- con robots;
- con 404 personalizado;
- con favicon;
- con imagen Open Graph definitiva;
- con SEO básico on-page y técnico;
- con performance de imágenes optimizada.

El MVP original de producción quedó documentado con Drive como contexto histórico. En la rama feature, Google Drive ya no forma parte del flujo propuesto: HAPPY WOOD apunta a su galería propia.

### Evolución lista en la rama feature

La evolución de galerías propias está operativa con 194 fotos reales de Fogueo Be Fit; su selección, pricing y WhatsApp fueron probados manualmente. HAPPY WOOD conserva su página y galería, pero está actualmente con 0 fotos: las 162 anteriores eran pruebas, fueron retiradas y el lote real queda pendiente para mañana. Esta evolución todavía no debe describirse como desplegada en producción hasta verificar merge y deploy.

El siguiente hito es decidir si se publica la feature, hacer merge con autorización y desplegar/probar `dist/`.
