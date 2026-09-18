# Handoff — Black Sheep Sport (landing)

> **Estado actualizado:** 18 de septiembre de 2026  
> **Producción:** https://sheepsport.com/  
> **Rama principal:** `main`
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

### Funnel operativo

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

### Único pendiente funcional importante

La **URL real de Google Drive del evento HAPPY WOOD** todavía no se ha recibido. En `Events.astro`, el CTA **“Ver mi galería”** conserva temporalmente `url: "#"`.

Todo lo demás necesario para operar el MVP está implementado.

### Rutas públicas

| Ruta | Estado |
|---|---|
| `/` | Home / landing principal |
| `/terminos/` | Términos y condiciones |
| `/privacidad/` | Política de privacidad |
| `/cookies/` | Política de cookies |
| `404.html` | Página de error personalizada, `noindex, nofollow` |

Astro genera **5 páginas estáticas** en el build.

### Estado por componente

| Sección | Archivo | Estado actual |
|---|---|---|
| Header | `src/components/Header.astro` | Funcional. Wordmark + ubicación. CTA desktop **“Buscar mis fotos”** hacia `/#tu-evento`. |
| Hero | `src/components/Hero.astro` | Funcional. Foto real. H1: **“ASÍ SE VE DAR TODO”**. Encuadre móvil corregido para evitar que el copy cubra el rostro. |
| Eventos | `src/components/Events.astro` | Evento real **HAPPY WOOD**, lugar **Be Happy**, fecha **19 de septiembre de 2026**. CTA de Drive aún pendiente de URL real. |
| Cómo comprar | `src/components/HowToBuy.astro` | Funcional. Semántica `ol` / `li`; proceso real explicado en 3 pasos. |
| Precios | `src/components/Pricing.astro` | US$4 / US$7 / US$12. Layout móvil corregido y CTA **“Comprar mis fotos”** conectado a WhatsApp. |
| Muestra | `src/components/Gallery.astro` | 6 fotos reales. Variantes optimizadas `widths={[400, 675, 800]}`. |
| FAQ | `src/components/Faq.astro` | 4 preguntas, visibles sin acordeón. Copy alineado con el proceso real. |
| CTA final | `src/components/FinalCta.astro` | **“Comprar por WhatsApp”**, conectado al WhatsApp real. |
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

### Mensaje prellenado de WhatsApp

```text
Hola, vi mis fotos de HAPPY WOOD y me encantaron. Quiero comprar estas fotos: [escribe aquí los códigos]. ¿Me ayudas con el proceso de pago?
```

URL actualmente implementada en los CTA de compra:

```text
https://wa.me/584247438483?text=Hola%2C%20vi%20mis%20fotos%20de%20HAPPY%20WOOD%20y%20me%20encantaron.%20Quiero%20comprar%20estas%20fotos%3A%20%5Bescribe%20aqu%C3%AD%20los%20c%C3%B3digos%5D.%20%C2%BFMe%20ayudas%20con%20el%20proceso%20de%20pago%3F
```

Los enlaces abren en nueva pestaña con:

```html
target="_blank"
rel="noopener noreferrer"
```

### Precios vigentes

| Producto | Precio |
|---|---:|
| 1 foto | US$4 |
| 2 fotos | US$7 |
| Todas tus fotos | US$12 |

**“Todas tus fotos”** significa todas las fotografías disponibles y utilizables del atleta en la galería. Cada atleta se compra por separado.

### Métodos de pago

- Pago móvil.
- Binance.

La compra se considera confirmada una vez verificado el pago.

### Entrega

- La galería general se publica dentro de las 24 horas posteriores al evento.
- La galería inicial contiene imágenes con marca de agua para selección.
- Cada archivo tiene un código.
- El cliente envía su nombre y los códigos por WhatsApp.
- Las fotos compradas se entregan editadas, en alta resolución y sin marca de agua.
- La entrega final se realiza por WhatsApp como archivos.
- Después de confirmar el pago, la entrega se realiza normalmente al día siguiente.

### Política operativa relevante

- Si una persona solicita retirar una fotografía en la que aparece, Black Sheep Sport puede atender la solicitud por WhatsApp o correo.
- Si el cliente envía un código equivocado, se revisa la selección y se intenta localizar la foto correcta.
- No existe reembolso automático únicamente por error de código enviado por el cliente.
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

### Pendiente del evento

Falta únicamente la URL definitiva de Google Drive:

```ts
url: "#"
```

en `src/components/Events.astro`.

Cuando llegue la URL real:

1. reemplazar el `#`;
2. abrir la galería en nueva pestaña;
3. mantener `rel="noopener noreferrer"`;
4. probar el flujo completo desde teléfono;
5. actualizar este documento.

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

La galería usa:

```ts
widths={[400, 675, 800]}
```

Esto fue una optimización deliberada frente al set anterior `[400, 800, 1200]`.

### Fuentes

Autoalojadas en `public/fonts/`:

- Archivo Expanded
- Instrument Sans

No se cargan Google Fonts externamente.

### JavaScript cliente

El proyecto **ya no es cero-JS**.

Actualmente existe JS por dos razones deliberadas:

1. `BackToTop.astro`: JS vanilla muy pequeño para mostrar/ocultar el botón y ejecutar scroll suave.
2. Google Analytics 4: `gtag.js` + configuración inline global.

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

**“Comprar mis fotos”**

con el mismo WhatsApp real del CTA final.

### Galería

- 6 fotos.
- Siempre visibles.
- No volver al experimento anterior de GIF transparente / carga condicional.
- Hover de zoom únicamente en dispositivos con hover real / pointer fino.

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
https://sheepsport.com/terminos/
https://sheepsport.com/privacidad/
https://sheepsport.com/cookies/
```

No se incluyen `lastmod` inventados.

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

### Pendiente para prueba completamente end-to-end

El último tramo:

```text
Landing → Google Drive
```

no puede cerrarse hasta disponer de la URL real del Drive de HAPPY WOOD.

En cuanto se agregue:

```text
QR → Home → HAPPY WOOD → Drive → códigos → WhatsApp
```

debe probarse una vez más desde un teléfono con datos móviles.

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
    Faq.astro
    FinalCta.astro
    Footer.astro
    BackToTop.astro

  layouts/
    Base.astro

  pages/
    index.astro
    terminos.astro
    privacidad.astro
    cookies.astro
    404.astro

  styles/
    tokens.css

  assets/photos/
    ...

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

Descartado. El único placeholder restante es la URL de Drive y debe sustituirse por la URL real, no esconderse con estados grises artificiales.

### Banner de cookies

No forma parte del MVP actual. No añadirlo automáticamente.

### Schema avanzado

No se implementó en esta primera fase SEO. Puede evaluarse después sin bloquear el MVP.

---

## 20. Pendientes actuales, en orden real de prioridad

### P0 — pendiente funcional

1. **Recibir URL real de Google Drive de HAPPY WOOD.**
2. Reemplazar `url: "#"` en `src/components/Events.astro`.
3. Probar el CTA “Ver mi galería” en producción.
4. Hacer una pasada end-to-end:
   `QR → Home → HAPPY WOOD → Drive → códigos → WhatsApp`.

### P1 — útil, no bloqueante

1. Eventos GA4:
   - `gallery_open`
   - `whatsapp_click`
2. Evaluar esos eventos como key events.
3. Actualizar este HANDOFF cuando el Drive quede conectado.

### P2 — mejoras futuras

- Evaluar schema (`Organization`, `LocalBusiness` u otro que corresponda).
- Auditoría específica de `alt` text.
- Páginas individuales por evento si el negocio empieza a captar búsquedas orgánicas de cada competencia.
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

**Único pendiente para cerrar completamente el funnel comercial:** conectar la galería real de Google Drive de **HAPPY WOOD**.
