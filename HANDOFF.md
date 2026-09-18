# Handoff — Black Sheep Sport (landing)

Este documento es la fuente de verdad del proyecto para quien continúe el trabajo sin contexto previo de cómo se construyó. Todo lo que dice acá fue verificado contra el código en el momento de escribirlo, no reconstruido de memoria. Si algo cambia en el código después de esta fecha, el código manda, no este documento.

---

## 1. Qué es este proyecto

**Black Sheep Sport** es una división de Black Sheep Studio. Fotografían participantes de eventos deportivos (running, ciclismo, CrossFit) en Mérida, Venezuela, y les venden sus fotos directamente. Esta web es de una sola página: el puente entre un código QR impreso y la compra.

**A quién se le vende:** al atleta que participó, no al organizador del evento ni a un cliente corporativo. No hay ciclo de ventas, no hay "contactar a un representante" — es venta directa, atleta a atleta.

**Quién visita y en qué contexto:** alguien que acaba de competir. Escanea un QR impreso (tarjeta o franela que reparte el fotógrafo) durante o justo después del evento. Está de pie, cansado, con el celular en la mano, probablemente con datos móviles lentos. No conoce la marca. No está "explorando" ni comparando servicios — busca específicamente sus fotos de ese día.

**Qué tiene que entender en 30 segundos**, en este orden:
1. Dónde están las fotos de su evento.
2. Cómo funciona el proceso de compra.
3. Cuánto cuesta.

Si la página no responde estas tres preguntas rápido, falla su único propósito. Éxito = el visitante llega a la galería de Google Drive de su evento y cierra la compra por WhatsApp, sin fricción.

**Posicionamiento:** la fotografía es la prueba, no el copy. La página existe para entregar las fotos rápido, no para venderle una marca al atleta. Todo el texto es corto, directo, sin tono publicitario — la emoción la aporta la foto del atleta en plena competencia, no el copy.

Fuente completa: `PRODUCT.md` en la raíz del repo.

---

## 2. Estado actual

Se añadieron las páginas `/privacidad` y `/cookies`, se ampliaron los términos en `/terminos` y el footer enlaza las tres páginas legales. Google Analytics y Search Console siguen pendientes; este MVP no incluye banner de cookies.

El sitio tiene **4 rutas públicas indexables**: `/` (landing completa), `/terminos` (política de compra/entrega), `/privacidad` y `/cookies`. También incluye `src/pages/404.astro`, que genera `404.html` para errores y se marca como `noindex, nofollow`. Todas las secciones descritas abajo están construidas, con datos de ejemplo/placeholder donde falta información real (ver sección 8).

| Sección | Archivo | Estado |
|---|---|---|
| Header (wordmark, ubicación, CTA "Buscar mis fotos") | `src/components/Header.astro` | Funcional. CTA visible solo desde 900px; lleva a `/#tu-evento`. En móvil solo wordmark + "Mérida". |
| Hero (foto + titular + kicker) | `src/components/Hero.astro` | Funcional. Foto real (`DSC06482-Mejorado-NR.webp`), no placeholder. |
| Eventos | `src/components/Events.astro` | Funcional, con **1 evento** de ejemplo en el array (ver sección 8). |
| Cómo comprar (3 pasos) | `src/components/HowToBuy.astro` | Funcional, copy revisado y semántica `ol` / `li`. |
| Precios (3 tiers) | `src/components/Pricing.astro` | Funcional: US$4 una foto, US$7 dos fotos, US$12 todas tus fotos. En móvil, las dos primeras opciones ocupan la primera fila y el tier destacado ocupa toda la segunda. |
| Muestra (galería de 6 fotos) | `src/components/Gallery.astro` | Funcional, 6 fotos reales, siempre visibles (móvil y escritorio), con `widths={[400, 675, 800]}`. |
| Preguntas frecuentes | `src/components/Faq.astro` | Funcional, 4 preguntas con copy revisado. Sin acordeón — todo el texto siempre visible. |
| CTA final (WhatsApp) | `src/components/FinalCta.astro` | CTA "Comprar por WhatsApp"; el link (`href`) sigue siendo un placeholder `#` hasta recibir el número real (ver sección 7). |
| Footer | `src/components/Footer.astro` | Funcional, enlaza a `/terminos`. |
| Página de Términos | `src/pages/terminos.astro` | Funcional, copy revisado. |
| Página 404 | `src/pages/404.astro` | Funcional, reutiliza Header/Footer y tokens existentes; no tiene canonical y no se indexa. |

**Performance posterior:** la auditoría de imágenes posterior registró **390,912 B** de transferencia de página completa en 390px DPR3, 430px DPR3 y 1440px DPR2. Las tres mediciones quedan bajo el presupuesto de 500 KB de `PRODUCT.md`. La galería mantiene lazy loading; probar el flujo completo en teléfono físico y red real sigue siendo recomendable antes del despliegue.

**Qué se verificó y a qué anchos:** hay mediciones de transferencia posteriores a 390px DPR3, 430px DPR3 y 1440px DPR2. El único breakpoint de layout es `900px`; aun así, falta una prueba manual del funnel en teléfono físico y QR real antes de publicar.

Dos pasadas de calidad ya corridas y documentadas, ambas en la raíz del repo:
- `CRITIQUE-LANDING.md` — revisión de diseño (dual-agent), heurísticas de Nielsen, personas, AI-slop check.
- `AUDIT-LANDING.md` — auditoría técnica (accesibilidad, performance, theming, responsive, anti-patrones). Score final: 18/20.

Ambos documentos tienen fecha de esta sesión de trabajo — si el código cambia después, quedan desactualizados y hay que volver a correr `/impeccable critique landing` y `/impeccable audit landing`.

---

## 3. Stack y decisiones técnicas cerradas

- **Astro puro (`astro@^7.3.3`), sin framework de UI (React/Vue/Svelte).** Por qué: la página es estática, sin interactividad compleja — no hay estado que justifique un framework de componentes. Astro compila a HTML puro, minimiza el JS que llega al navegador. El único JS que corre en el cliente hoy es cero — no hay `<script>` de cliente en ningún componente.
- **CSS propio con custom properties (`src/styles/tokens.css`), sin Tailwind, sin librería de UI.** Por qué: `PRODUCT.md` lo pide explícito ("sin librerías de UI"). El sistema de diseño es pequeño y a medida (una paleta de 2 colores + escala de grises, una escala tipográfica, una escala de espaciado) — un framework de utilidades no aporta nada que los custom properties no den ya, y agregar Tailwind sumaría peso de build sin necesidad real.
- **`astro:assets` con `<Image>` para todas las fotos**, nunca `<img>` plano ni rutas a `public/`. Por qué: genera automáticamente las variantes de ancho (`widths`) y sirve la que corresponde según `sizes`, además de optimizar formato/compresión en build. La galería usa explícitamente `widths={[400, 675, 800]}` y las mediciones posteriores se mantienen bajo el presupuesto de 500 KB.
- **Fuentes autoalojadas en woff2** (`public/fonts/archivo-expanded-latin.woff2`, `public/fonts/instrument-sans-latin.woff2`), declaradas en `src/layouts/Base.astro` con `@font-face` + `<link rel="preload">`. Por qué: `PRODUCT.md` prohíbe explícitamente depender de Google Fonts por `@import`/`<link>` externo — una fuente autoalojada no depende de una request externa que puede fallar o ser lenta en la conexión móvil del usuario objetivo, y con `font-display: swap` el texto nunca queda invisible esperando la fuente.
- **Un solo breakpoint, en `900px`.** Por qué: `PRODUCT.md` pide "mobile-first estricto (casi 100% del tráfico)". No hay tablet real en el público objetivo (alguien mirando su celular en un evento deportivo), así que no se diseñó un estado intermedio — es móvil o escritorio, sin punto medio.
- **Deploy estático: se sube el contenido de `dist/` a SiteGround por hosting compartido.** Dominio: **sheepsport.com**, configurado en `astro.config.mjs` mediante `site`. `npm run build` genera `dist/` listo para subir tal cual — no hace falta build en el servidor.

### SEO técnico básico

- `Base.astro` genera canonical absoluto para las rutas indexables mediante `Astro.url.pathname` y `Astro.site`: `https://sheepsport.com/` y `https://sheepsport.com/terminos`.
- El layout genera `og:title`, `og:description`, `og:type`, `og:url`, `og:site_name` y metadatos Twitter equivalentes a partir del `title` y `description` de cada página. **No hay `og:image`** hasta contar con un asset definitivo de 1200×630.
- `public/robots.txt` permite rastreo y apunta a `https://sheepsport.com/sitemap.xml`.
- `public/sitemap.xml` es estático y deliberadamente solo lista `/` y `/terminos`.

---

## 4. Sistema de diseño

Los tokens de color viven en `src/styles/tokens.css`. Hay una excepción deliberada: el gradiente de legibilidad del Hero usa `rgba(13, 15, 12, 0.92)` en `Hero.astro`.

### Paleta

| Token | Hex | Uso |
|---|---|---|
| `--color-accent` | `#cdff3a` | Volt. Único color de marca. |
| `--color-accent-on` | `#0d0f0c` | Texto sobre el acento — siempre este valor, siempre oscuro. |
| `--color-ink` | `#0d0f0c` | Negro tintado frío (no `#000` puro). Texto principal, fondos oscuros. |
| `--color-ink-inverse` | `#f2f4f3` | Texto sobre secciones de fondo oscuro. (Mismo valor hex que `--color-gray-100`, con nombre semántico distinto.) |
| `--color-surface` | `#ffffff` | Fondo base. |
| `--color-gray-100` | `#f2f4f3` | Fondo sutil (sección Precios en escritorio). |
| `--color-gray-200` | `#dfe3e1` | Solo bordes, nunca texto. |
| `--color-gray-300` | `#b7bebb` | Texto secundario **sobre fondo oscuro únicamente** (subtítulo del CTA final). |
| `--color-gray-400` | `#7c847f` | Un solo uso: los números 01/02/03 de Cómo Comprar. Ver nota de contraste abajo. |
| `--color-gray-500` | `#454b47` | Texto secundario sobre fondo claro — el más usado del sistema, 13 apariciones. |

### Contraste real medido (fórmula WCAG, verificado con script, no estimado)

| Combinación | Ratio | Dónde |
|---|---|---|
| `--color-ink` sobre `--color-surface` | 19.25:1 | Texto principal en toda la página |
| `--color-ink` sobre `--color-gray-100` | 17.43:1 | Texto en la sección Precios (escritorio) |
| `--color-ink` sobre `--color-accent` | 16.47:1 | Badges, precio destacado |
| `--color-accent` sobre `--color-ink` | 16.47:1 | Botones y CTAs |
| `--color-ink-inverse` sobre `--color-ink` | 17.43:1 | Overlay del hero en móvil, titular del CTA final |
| `--color-gray-300` sobre `--color-ink` | 10.17:1 | Subtítulo del CTA final |
| `--color-gray-500` sobre `--color-surface` | 8.93:1 | Texto secundario — la combinación más común del sitio |
| `--color-gray-500` sobre `--color-gray-100` | 8.09:1 | Texto secundario en la sección Precios (escritorio) |
| `--color-gray-400` sobre `--color-surface` | **3.84:1** | Números 01/02/03 de Cómo Comprar — pasan AA para texto grande (3:1); se muestran en tamaño `2xl` y peso 800. |

Todo lo demás del sistema pasa AA con margen amplio.

### La regla del volt — inviolable

**Volt (`#CDFF3A`) nunca es texto directamente sobre blanco o sobre cualquier fondo claro.** Sus únicos dos usos permitidos son:
1. Como **relleno sólido**, con texto oscuro (`--color-accent-on` / `--color-ink`) encima.
2. Como **texto sobre un fondo oscuro** (`--color-ink` o más oscuro).

Esta regla viene de `PRODUCT.md` y `DESIGN.md` y está verificada en el código actual: cero instancias de volt como texto sobre superficie clara.

### Tipografía

- **Display:** `"Archivo Expanded", "Archivo", sans-serif`. Variable font, `@font-face` carga el rango `font-weight: 400 900`, `font-stretch: 125%` (eje wdth fijo en 125, no interactivo). Usado en titulares, kickers, badges, precios, números — siempre `font-weight: 800` en el código actual excepto los `<h1>/<h2>/<h3>` base que heredan `700` de `Base.astro`.
- **Cuerpo:** `"Instrument Sans", sans-serif`. `@font-face` carga `font-weight: 400 500` únicamente (no hay pesos más pesados de esta familia en el archivo woff2 autoalojado).
- Escala de tamaño (`--font-size-*`): `xs` 13px, `sm` 15px, `base` 16px (estos 3 son fijos, no fluidos) · `lg` clamp 18–22px, `xl` clamp 22–30px, `2xl` clamp 28–40px, `3xl` clamp 36–56px, `4xl` clamp 42–72px (estos 5 son fluidos con `clamp()`, escalan con el viewport sin salto en el breakpoint de 900px).

### Espaciado

Escala de 8px, tokens `--space-1` a `--space-9`: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px.

Además, dos tokens fluidos que no pertenecen a la escala de 8px porque escalan con el viewport en vez de saltar en el breakpoint:
- `--container-padding`: `clamp(1rem, -0.46rem + 4.7vw, 3.75rem)` → 16px en móvil, 60px en escritorio, transición continua.
- `--space-section-block`: `clamp(2rem, 0.7rem + 4.2vw, 4rem)` → 32px a 64px, mismo criterio. Es el padding vertical de cada sección.
- `--measure-prose`: `65ch`, fijo. Tope de ancho para texto de prosa (respuestas de FAQ, descripciones de pasos, subtítulo del CTA final) — independiente del contenedor, que es ancho para fotos/rejilla pero no para texto corrido.

### Radios

Un solo token: `--radius-sm: 2px`. Se usa en todos los botones y badges del sitio. No hay ningún otro valor de `border-radius` en el código.

### Tokens declarados y sin usar (a propósito)

- `--font-size-lg` — 0 usos. Extremo de la escala tipográfica, se conserva para que la escala esté completa si una sección futura lo necesita.
- `--space-9` (96px) — 0 usos. Extremo de la escala de espaciado, misma razón.

Ninguno de los dos pesa nada en el CSS final (son variables declaradas, no reglas aplicadas) — no hay costo real en conservarlos.

---

## 5. Decisiones de diseño cerradas

Lo siguiente **no se cambia sin permiso explícito**, aunque una revisión de diseño o accesibilidad lo señale:

- **La regla del volt** (sección 4): relleno con texto oscuro, o texto sobre oscuro. Nunca texto volt sobre blanco.
- **`--color-ink: #0d0f0c`**, negro tintado a propósito. No es un descuido ni hay que "corregirlo" a `#000` puro.
- **`--radius-sm: 2px`** en todo el sitio. Lenguaje visual cuadrado, deliberado. Los botones nunca son píldora (`border-radius: 999px` o similar).
- **Instrument Sans como fuente de cuerpo.** Ya tiene un ignore registrado en `.impeccable/config.json` (regla `overused-font`) con la razón explícita: "display face carries brand identity; body face is intentionally neutral."
- **6 fotos en la sección Muestra, siempre visibles en escritorio, en una sola fila de 6 columnas.** No volver a la versión de 3 fotos grandes ni a ningún otro conteo.
- **Un solo evento activo en la sección Eventos**, ocupando la mitad izquierda de una rejilla de 2 columnas, con la columna derecha vacía. Es el estado esperado con un solo evento activo, no un bug — la rejilla (`grid-template-columns: repeat(2, 1fr)` en `Events.astro`) ya está preparada para llenarse sola cuando el array `events` tenga 2 o más elementos, sin tocar CSS.
- **Sin testimonios, sin cifras de trayectoria, sin logos de clientes.** No hay material real todavía — no agregar contenido inventado para llenar ese vacío.
- **Animación mínima**, solo hover states (inversión de color en botones, `translateY(-2px)` corto, `scale(1.045)` en fotos de Muestra) y `:focus-visible`. Nada de scroll-driven, nada de librerías de animación, nada de GSAP.
- **Dos altos fijos en píxeles, ambos deliberados** (detalle completo en sección 6):
  - `Hero.astro`: `410px` en escritorio (`.hero__frame` y `.hero__image`).
  - `Pricing.astro`: `160px` en móvil / `230px` en escritorio (`.pricing__row`).

---

## 6. Trampas y deuda conocida

**Los dos altos fijos en píxeles no son tokens y no deberían serlo.** `Hero.astro` (`.hero__frame`, `.hero__image`, ambos a `410px` en el media query de `900px`) y `Pricing.astro` (`.pricing__row`, `160px`/`230px`). La razón técnica, documentada en un comentario dentro de `Hero.astro`: **`height: 100%` en un hijo de CSS Grid no resuelve contra el alto de la fila** si la fila no tiene un alto explícito en unidades absolutas — es el mismo problema que antes daba `flex-basis` mal calculado con `flex: 1 1 0` en vez de un valor explícito. La solución que funcionó fue fijar el alto en px en ambos lados (contenedor e imagen) en vez de depender de porcentaje. **Consecuencia real:** el valor `410px` del Hero depende del recorte actual de la foto (`object-position: 40% 35%` en escritorio) — si se cambia la foto del hero por una con otra proporción o composición, hay que volver a ajustar tanto el alto como el `object-position` a mano, mirando el resultado en el navegador. No es un valor que se pueda tocar a ciegas.

**Los GIF de 49 bytes en Gallery ya no existen — se puede ignorar esa preocupación.** En una iteración anterior, `Gallery.astro` mostraba 3 fotos grandes en escritorio y ocultaba 3 más con un truco de `<picture><source media>` apuntando a un GIF transparente de 1×1 para evitar la descarga de la foto real en pantallas grandes. Ese enfoque se **reemplazó por completo** cuando la decisión de diseño cambió a "6 fotos siempre visibles" (sección 5) — hoy `Gallery.astro` no tiene ningún `<picture>`, ningún GIF, ningún truco de carga condicional. Se menciona acá solo para que quede registrado que si alguien encuentra referencias viejas a esto en `CRITIQUE-LANDING.md` o en commits anteriores, ya no aplica al código actual.

**El proceso de compra, FAQ y Términos ya fueron revisados.** Una revisión editorial adicional de marca puede hacerse si se desea, pero no se debe revertir ni alterar ese copy sin una decisión de producto.

Además del color del overlay del Hero, hay valores de layout hardcodeados fuera del sistema de tokens, todos deliberados y comentados donde corresponde: los dos altos fijos ya mencionados y el `object-position` de cada foto (valores de porcentaje ajustados a mano mirando el recorte real, no calculables).

---

## 7. Qué falta, ordenado por prioridad

### Bloquea la publicación

1. **Número de WhatsApp real.** `FinalCta.astro` tiene `const whatsappUrl = "#"` con un comentario `// Placeholder: todavía no tenemos el número de WhatsApp definitivo.` — hay que reemplazarlo por `https://wa.me/<número>`.
2. **URL real de la galería de Google Drive del evento activo.** `Events.astro`, el campo `url: "#"` del único evento en el array.
3. **Nombre y fecha reales del evento piloto.** `Events.astro` tiene `"CrossFit Open Mérida"` / `"14 de septiembre, 2026"` como datos de ejemplo — confirmar si es el evento real con el que se lanza o si hay que reemplazarlo.
4. **Foto final del hero.** La foto actual (`DSC06482-Mejorado-NR.webp`) es real, no un placeholder — pero confirmar si es la elegida para el lanzamiento o si se va a reemplazar por otra.
5. **Deploy a SiteGround**, dominio `sheepsport.com`. No hay ningún script ni configuración de despliegue en el repo — es un paso manual: `npm run build` y subir el contenido de `dist/`.
6. **Prueba en un teléfono real con datos móviles**, no solo en el navegador de escritorio. Ninguna de las pruebas hechas hasta ahora fue en un dispositivo físico ni con throttling de red real (ver sección 2, límite del entorno de pruebas).

### No bloquea (se puede publicar sin esto y arreglarlo después)

- Una revisión editorial adicional de marca, si se desea.
- Google Analytics 4 con los tres eventos de medición del funnel — **no está definido cuáles son los tres eventos.** Esto no estaba decidido en ningún documento del proyecto; hay que definirlo antes de implementarlo, no asumir cuáles son.
- Prueba manual en teléfono físico, QR real y conexión móvil antes de publicar.

---

## 8. Datos que faltan

| Dato | Archivo | Ubicación exacta |
|---|---|---|
| Número de WhatsApp | `src/components/FinalCta.astro` | `const whatsappUrl = "#";` (línea 4) |
| URL de galería de Drive del evento activo | `src/components/Events.astro` | campo `url: "#"` dentro del array `events` (línea 15) |
| Confirmar nombre/fecha del evento piloto | `src/components/Events.astro` | `name: "CrossFit Open Mérida"` (línea 12), `date`/`isoDate` (líneas 13–14) |
| Confirmar foto del hero | `src/components/Hero.astro` | `import heroPhoto from "../assets/photos/DSC06482-Mejorado-NR.webp"` (línea 3) |
| Confirmar las 6 fotos de Muestra | `src/components/Gallery.astro` | array `photos` (líneas 10–17) |
| Definir los 3 eventos de medición de GA4 | — (no implementado, no decidido en ningún documento) | — |

---

## 9. Cómo trabajar en este repo

### Comandos

```sh
npm install          # una vez
npm run dev           # servidor de desarrollo en localhost:4321
astro dev --background  # variante recomendada por AGENTS.md: corre en background
astro dev stop         # detiene el servidor en background
astro dev status       # chequea si sigue corriendo
npm run build          # genera dist/
npm run preview        # sirve dist/ localmente para probar el build de producción
```

### Estructura de carpetas

```
src/
  components/    # las 9 secciones de la landing, un componente .astro por sección
  layouts/       # Base.astro — el único layout, con el <head>, fuentes y reset global
  pages/         # index.astro, terminos.astro y 404.astro
  styles/        # tokens.css — todo el sistema de diseño, un solo archivo
  assets/photos/ # 18 fotos fuente (.webp), solo 7 están importadas por algún componente
public/
  fonts/         # los dos woff2 autoalojados
  favicon.ico, favicon.svg, robots.txt, sitemap.xml
design/
  reference/     # black-sheep-sport-landing.html — SOLO REFERENCIA VISUAL, no se toca ni se
                 # importa desde ningún lado. Es un export de una herramienta de diseño con
                 # imágenes en base64 embebidas; ignorado por git (.gitignore) y excluido del
                 # build. Sirve para comparar contra el diseño aprobado, nada más.
  export/        # export previo, mismo trato: solo referencia, ignorado por git
.impeccable/      # config de la skill Impeccable (ver abajo)
```

### Convención de commits

Mensajes cortos, en inglés, formato `tipo: descripción` (`feat:`, `fix:`, `chore:`, `docs:`). Ejemplos reales del historial: `feat: implement landing sections, tokens and fonts`, `fix: align hero with container padding and correct image framing`, `chore: remove duplicate assets and exploration artifacts`.

### Impeccable

El proyecto tiene la skill **Impeccable** instalada (herramienta de diseño/calidad usada durante la construcción). Comandos relevantes si se sigue usando: `/impeccable critique <target>` (revisión de diseño), `/impeccable audit <target>` (auditoría técnica), `/impeccable detect <path>` (linter de anti-patrones de diseño). `.impeccable/config.json` tiene un ignore registrado para la regla `overused-font` sobre Instrument Sans (ver sección 5) — no borrarlo, es una decisión ya tomada, no un descuido de configuración.

---

## 10. Historial de decisiones descartadas

Para que nadie las reintente pensando que no se consideraron:

- **HTML plano sin proceso de build.** Se descartó a favor de Astro por la necesidad de `astro:assets` (variantes de ancho automáticas por foto) y de un sistema de componentes reusable — mantener 9 secciones repetidas en HTML plano sin compartir nada habría sido inviable de mantener.
- **Imágenes en base64 incrustadas en un solo archivo HTML.** Es el formato del export de referencia en `design/reference/` — explícitamente rechazado como técnica de producción. El proyecto usa `astro:assets` + `<Image>` para todo.
- **Tailwind por CDN (`<script src="cdn.tailwindcss.com">`).** Descartado junto con Tailwind en general (sección 3) — además, la variante CDN específicamente compila en el navegador del visitante, lo peor posible para el presupuesto de performance de este proyecto.
- **Testimonios de relleno / cifras de trayectoria inventadas.** Explícitamente prohibido en `PRODUCT.md` — no hay material real todavía, y agregar contenido inventado para parecer más establecido contradice la honestidad de marca que pide el proyecto.
- **Hero tipo SaaS: foto en una card, debajo o al lado del bloque de texto, con sombra o borde.** Descartado a favor de la foto a sangre completa (a pantalla completa en móvil, ocupando la mitad del ancho sin marco en escritorio) — la foto es el producto, no una ilustración de apoyo dentro de una tarjeta.
- **Tratamiento visual "apagado" (gris, sin hover) con `aria-disabled="true"` para los CTA mientras `href="#"` sigue como placeholder.** Se consideró y se descartó explícitamente: es código que existe solo para un estado temporal, fácil de olvidar quitar, y el riesgo de publicar con los dos botones principales del funnel visiblemente "rotos" en gris es peor que el problema que resuelve. La solución acordada es cargar las URLs reales (sección 7), no disfrazar el estado placeholder.
