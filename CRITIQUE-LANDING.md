# Critique — Landing (Black Sheep Sport)

**Paso 2 de 3 del quality pass** (`detect` → **`critique`** → `audit` pendiente).
Method: dual-agent (Assessment A: revisión de diseño · Assessment B: detector + overlay de navegador), ambos aislados entre sí, sin ver el resultado del otro.

Target: `src/pages/index.astro` y componentes en `src/components/`. Servidor: `localhost:4321`.

---

## Resultado paso 1 (`npx impeccable detect src/`)

0 findings. `[]`. Ver conversación anterior para el detalle.

---

## Design Health Score (Assessment A — heurísticas de Nielsen)

| # | Heurística | Score | Hallazgo clave |
|---|---|---|---|
| 1 | Visibilidad del estado del sistema | 3 | Badge "Activo ahora" funciona bien; sin estado de carga en fotos lazy-loaded de Muestra en conexión lenta |
| 2 | Coincidencia sistema/mundo real | 4 | n/a |
| 3 | Control y libertad del usuario | 3 | n/a — funnel de una sola página, wordmark vuelve al inicio |
| 4 | Consistencia y estándares | 4 | n/a — patrón eyebrow+h2 repetido y aprendible en cada sección |
| 5 | Prevención de errores | 1 | Los 2 CTA críticos de conversión son placeholders `href="#"` |
| 6 | Reconocimiento antes que recuerdo | 4 | n/a |
| 7 | Flexibilidad y eficiencia | 3 | Grid de Eventos ya preparado para escalar, sin forma de ver eventos pasados |
| 8 | Diseño estético y minimalista | 4 | n/a |
| 9 | Reconocer/diagnosticar/recuperarse de errores | 1 | Sin estados de error en ningún lado; un link roto es visualmente idéntico a uno funcional |
| 10 | Ayuda y documentación | 4 | n/a — FAQ responde directo las 4 preguntas que importan |
| **Total** | | **31/40** | **Bueno** |

**Veredicto AI slop: NO.** Cotejado contra la lista reflex-reject de marca y los anti-references de PRODUCT.md — nada de gradientes morado/azul, cards anidadas, iconos redondeados, Inter, negro puro, grises cálidos, emojis, testimonios inventados o scroll-driven animation. Lee como sistema de marca deliberado, no default de plantilla.

---

## 1. Problemas reales (con propuesta de fix)

### [P0] Los 2 CTA de conversión son placeholders muertos
`Events.astro` → `events[0].url = "#"` ("Ver mi galería"). `FinalCta.astro` → `whatsappUrl = "#"` ("Escribir por WhatsApp"). Ambos ya tienen comentario TODO en el código, así que no es una sorpresa — pero las dos evaluaciones lo marcaron independientemente como el hallazgo #1: la página no puede completar su único trabajo (PRODUCT.md: "el visitante llega a las galerías en Drive y cierra la compra por WhatsApp") mientras estos sigan en `#`.
**Fix:** cargar la URL real de Drive en `events[].url` y el `wa.me/<número>` real en `whatsappUrl` en cuanto los tengas. Ya lo sabíamos; queda documentado acá para que no se pierda.

### [P1] Contraste real: el gris secundario de todo el sistema falla AA
Medido independientemente por las dos evaluaciones (coinciden):
- `--color-gray-400` (`#7c847f`) sobre `--color-surface` (`#ffffff`) → **3.84:1**
- `--color-gray-400` sobre `--color-gray-100` (`#f2f4f3`) → **3.48:1**

AA para texto de cuerpo pide 4.5:1. Ninguna de las dos combinaciones lo cumple. Esto no es un uso aislado — es el color de TODO el texto secundario del sitio. Usos confirmados por grep directo en el código (11 en total):

`Hero.astro` (subtítulo desktop) · `Header.astro` (`Mérida, Venezuela`) · `Events.astro` (label "Eventos" + fecha) · `HowToBuy.astro` (label "Cómo comprar" + descripción de cada paso) · `Pricing.astro` (label "Precios") · `Gallery.astro` (label "Muestra") · `Faq.astro` (label "Preguntas frecuentes" + cada respuesta) · `Footer.astro` (línea final)

**Fix propuesto:** el proyecto ya tiene `--color-gray-500` (`#454b47`) declarado en `tokens.css` y **sin ningún uso** — es justo el token que confirmaste no borrar la pasada de limpieza ("extremo de escala completa, no pesa"). Calculé su contraste: **~8:1** sobre blanco y sobre gray-100, sobra holgado. Reemplazar `--color-gray-400` por `--color-gray-500` en los 11 usos de arriba resuelve esto sin tocar la paleta ni inventar un color nuevo. Si 8:1 se siente demasiado oscuro para el efecto "muted" que buscabas, la alternativa es definir un tono intermedio entre los dos — pero eso sí sería un color nuevo, no reciclar uno existente.

### [P1] Sin estado visual distinto para los CTA rotos
Un link muerto (fill sólido, hover funcional, sin `aria-disabled`) es indistinguible de uno funcional. Para el usuario real (cansado, recién compitió, paciencia baja) esto lee como "sitio roto", no "todavía no está listo".
**Fix:** mientras `href="#"` siga ahí, dale un tratamiento visual distinto — relleno apagado, sin `translateY` en hover, `aria-disabled="true"`.

### [P2] Alt text de las 6 fotos de Muestra: genérico, poco diferenciado
Las 7 fotos del sitio, literal, tal como están en el código ahora mismo:

| Componente | Alt text exacto |
|---|---|
| Hero.astro | "Atleta en plena competencia, capturada por Black Sheep Sport" |
| Gallery.astro (1) | "Atleta en plena carrera, foto de Black Sheep Sport" |
| Gallery.astro (2) | "Ciclista en competencia, foto de Black Sheep Sport" |
| Gallery.astro (3) | "Atleta de CrossFit en movimiento, foto de Black Sheep Sport" |
| Gallery.astro (4) | "Corredor cruzando la meta, foto de Black Sheep Sport" |
| Gallery.astro (5) | "Atleta de CrossFit levantando peso, foto de Black Sheep Sport" |
| Gallery.astro (6) | "Ciclista en plena ruta, foto de Black Sheep Sport" |

Las 6 de Muestra comparten la misma cláusula final ("..., foto de Black Sheep Sport"), que no aporta nada — un lector de pantalla ya anuncia que es una imagen dentro de la página. Para un usuario no-vidente, el alt text es el único canal por el que viaja "la foto es la prueba" (PRODUCT.md); ahora mismo entrega el nombre de marca 6 veces en vez de la escena real.
**Fix:** sacar la cláusula repetida, describir el momento/composición real de cada foto con las palabras liberadas.

### [P3] "Términos" del footer da 404
`curl localhost:4321/terminos` → 404. No existe `src/pages/terminos.astro`. Menor, pero un link roto a un clic del home resta confianza.
**Fix:** página mínima de términos, o sacar el link hasta que exista.

---

## 2. Falsos positivos (decisión ya cerrada o exención legítima)

- **`numbered-section-markers` (detector, advisory)** — encontró 01/02/03 en `HowToBuy.astro`. El propio criterio de la skill (`reference/brand.md`) exime este patrón cuando es una secuencia real y ordenada ("Numbers earn their place when the section actually IS a sequence... the order carries information") — que es exactamente el caso: Encuentra→Elige→Compra es un proceso de 3 pasos real, no un adorno tipo eyebrow. No es el "01/02/03 decorativo" que la regla busca cazar.
- **`overused-font` (Instrument Sans, 38-40% del texto)** — ya tiene ignore registrado en `.impeccable/config.json` con razón explícita ("display face carries brand identity; body face is intentionally neutral"). El overlay del navegador no lo vio porque ese modo no aplica `config.json`; el detector CLI sí lo respeta.
- **Volt como texto sobre blanco** — ninguna de las dos evaluaciones encontró una instancia. La regla del acento se respeta en todo el build actual.
- **Alturas fijas de 410px (Hero) y 160/230px (Pricing)** — ambas evaluaciones las revisaron puntualmente y no las marcaron, tal como decisión cerrada.
- **Un solo evento, columna derecha vacía** — confirmado en vivo por Assessment A, no marcado como problema.
- **Falta de animación** — ninguna evaluación reportó "falta de feedback" por ausencia de motion; lo único relacionado con interacción que sí se marcó es el destino roto de los CTA (problema de URL, no de animación).
- **6 fotos en Muestra en una fila** — no se tocó ni se cuestionó en ninguna evaluación.

---

## 3. Dudoso (para que decidas)

- **Viewport móvil real no verificado.** El entorno de browser automation de ambos subagentes tiene un mínimo de ventana de ~500px — ninguno pudo forzar 390px exacto. El único breakpoint del proyecto es `900px`, así que el CSS aplicado a 500px es idéntico al de 390px real; pero cualquier `clamp()` o `aspect-ratio` fluido pudo rendear con valores ligeramente distintos a los de un móvil real de 390px. Riesgo bajo, no 100% confirmado.
- **¿El CTA final debería linkear también a la galería, no solo a WhatsApp?** Pregunta de Assessment A: alguien que scrollea directo al fondo sin pasar por Eventos no tiene forma de llegar a sus fotos desde ahí, solo a WhatsApp. Es decisión de producto/funnel, no bug.
- **¿Qué pasa si alguien escanea un QR viejo y su evento ya no es el que está listado?** Hoy no hay mensaje de "tu evento no está aquí". Aceptable con 1 solo evento activo; vale decidir si hace falta ese estado antes de que se acumulen más eventos.
- **Header sin CTA visible en mobile hasta pasar el Hero.** `.header__cta` es `display:none` bajo 900px — aceptable porque Eventos es la sección siguiente, pero alguien que llega a mitad de página por un link compartido no tiene un WhatsApp visible hasta el fondo.

---

## Jerarquía de encabezados

Confirmado por lectura directa del DOM en vivo: un solo `<h1>` (headline del Hero), seguido de 6 `<h2>` en orden de documento (Eventos, Cómo comprar, Precios, Muestra, Preguntas frecuentes, CTA final), con `<h3>` anidados correctamente solo dentro de Eventos (nombre del evento) y FAQ (cada pregunta). Sin saltos de nivel, sin h3 huérfano. Limpio.

## Targets táctiles en móvil

**No medido en esta pasada.** Quedó pendiente para el paso 3 (`/impeccable audit landing`) — ninguna de las dos evaluaciones de critique lo midió en píxeles reales.

---

## Fortalezas

1. **Hero como validación emocional inmediata** — foto real de CrossFit a sangre + "ASÍ SE VE DAR TODO" entrega la promesa de marca en el primer viewport, sin relleno de copy.
2. **Precios como gráfico de barras** — la altura + el tier destacado comunican "mejor valor" de un vistazo, sin iconos ni copy extra.
3. **Ritmo de sección aprendible** — el patrón eyebrow gris + h2 se repite idéntico en cada sección, cero fricción de re-aprendizaje al scrollear.

## Red flags por persona

- **Jordan (primera vez):** entiende la oferta al instante, llega a Eventos, toca "Ver mi galería" esperando sus fotos — no pasa nada. La primera impresión cambia de "esto se ve rápido y serio" a "¿esto está roto?" en ~10 segundos.
- **Riley (stress-tester):** navegación por teclado funciona bien (focus-visible volt confirmado), jerarquía de encabezados limpia — pero forzar los 2 CTA principales confirma que ambos van a ningún lado antes de cualquier otra observación visual.
- **Casey (mobile distraído):** en mobile, el header no tiene CTA visible hasta pasar el Hero — aceptable porque Eventos es la sección siguiente, pero sin fallback si llega a mitad de página.
- **Atleta recién compitiendo, cansado, con el QR escaneado:** el usuario de menor paciencia que va a ver esta página. Un link de evento muerto y un WhatsApp muerto es el peor caso posible para esta persona exacta: sin instinto de reintento, sin fallback visible (sin teléfono, sin Instagram, sin contacto alterno) en ningún lado sobre el pliegue.

---

## Siguiente paso

Falta el paso 3: `/impeccable audit landing` — ahí sí entran contraste completo de cada combinación texto/fondo, tamaño de targets táctiles en móvil, y el resto de lo que pediste. Avisame para correrlo.
