# Audit — Landing (Black Sheep Sport)

**Paso 3 de 3 del quality pass** (`detect` → `critique` → **`audit`**). Corrido después de aplicar los 3 fixes de `CRITIQUE-LANDING.md` (contraste, alt text, /terminos). Nada se arregla en esta pasada, solo se reporta.

Target: `src/pages/index.astro`, `src/pages/terminos.astro`, componentes en `src/components/`. Medido contra build real (`dist/`) y servidor en vivo (`localhost:4321`) a 1440px y ~500px (ver nota de entorno abajo).

---

## Audit Health Score

| # | Dimensión | Score | Hallazgo clave |
|---|---|---|---|
| 1 | Accesibilidad | 3/4 | Contraste ya resuelto en texto secundario (8-9:1); quedan 2 touch targets bajo 44px y 1 combinación de color en zona gris (números 01/02/03) |
| 2 | Performance | 4/4 | Lazy loading correcto, hero con `fetchpriority=high`, presupuesto real por visita bien debajo de 500KB |
| 3 | Theming | 4/4 | Cero color hardcodeado fuera de `tokens.css`, sistema de tokens 100% consistente |
| 4 | Diseño responsive | 3/4 | Sin scroll horizontal, un solo breakpoint (900px) deliberado y limpio; mismos 2 touch targets pequeños que en accesibilidad |
| 5 | Anti-patrones | 4/4 | Sin AI slop, sin bans violados, 01/02/03 exento por ser secuencia real (ver detalle) |
| **Total** | | **18/20** | **Excelente** |

---

## Veredicto anti-patrones

**Pass.** Cero de los tells de la lista (gradientes, glassmorphism, hero-metric, cards idénticas, gradient text, side-stripe borders, eyebrow decorativo). El único hit del detector (`numbered-section-markers` en `dist/index.html`, advisory) es el 01/02/03 de "Cómo comprar" — la propia guía de marca lo exime explícitamente cuando es una secuencia real de 3 pasos ordenados, que es el caso acá. No cuenta como tell.

---

## Resumen ejecutivo

- Score: **18/20 (Excelente)**
- Issues encontrados: 0 P0 · 0 P1 · 2 P2 · 1 dudoso (no es P-algo, es una decisión de diseño a confirmar)
- Todo lo que era P0/P1 en el critique anterior (CTA muertos, contraste del cuerpo) ya está resuelto o es trabajo pendiente conocido (URLs reales)

---

## Hallazgos por severidad

### [P2] Touch targets bajo 44×44px en móvil
**Ubicación:** `Header.astro` (`.header__wordmark`) y `Footer.astro` (`.footer__link`)
**Categoría:** Accesibilidad / Responsive
**Medido en vivo** (~500px de ancho, ver nota de entorno):
- `.header__wordmark` ("Black Sheep Sport"): **209×23px** — alto por debajo del mínimo
- `.footer__link` ("Términos"): **56×16px** — ambas dimensiones por debajo del mínimo

**Impacto:** en un usuario con el pulgar, cansado, en la calle — exactamente el perfil descrito en PRODUCT.md — un target de 16-23px de alto es fácil de fallar al tocar, sobre todo el link de Términos, mucho más chico que su propio texto visible sugiere.
**WCAG:** 2.5.5 Target Size (AAA, no bloqueante para AA, pero es la guía estándar de 44×44px que cualquier checklist de móvil pide).
**Recomendación:** agregar `padding` vertical a ambos enlaces para que el área clicable llegue a 44px, sin cambiar el tamaño visual del texto (el `padding` extiende el hit-area, no hace falta agrandar la tipografía).
**Comando sugerido:** `/impeccable adapt`

### [Dudoso, no P-clasificado] Contraste de los números 01/02/03 en "Cómo comprar"
**Ubicación:** `HowToBuy.astro`, `.how-to-buy__number` (color `--color-gray-300` `#b7bebb`)
**Medido:** `#b7bebb` sobre blanco = **1.89:1**. Falla incluso el mínimo de "texto grande" (3:1), muy por debajo del 4.5:1 de texto normal.

Lo marco aparte de los P2 porque no estoy seguro de que sea un bug: es un patrón de diseño común (números grandes y pálidos de fondo, decorativos) donde la información real — "Encuentra", "Elige", "Compra" — ya está en negro sólido al lado, y el orden ya lo da el propio DOM/lectura. WCAG tiene una excepción explícita para texto puramente incidental/decorativo que no es el único canal de la información. Si para vos el número SÍ es información (por ejemplo, alguien hojeando rápido lo usa para orientarse), entonces sí es un fix real — oscurecerlo. Si es puramente decorativo como lo veo yo, se queda así. Te lo dejo para que decidas, no lo doy por resuelto en ningún sentido.

### [P3] Un solo breakpoint (900px)
**Ubicación:** todo el sistema de layout
**Categoría:** Responsive
No es un problema — está confirmado como decisión de diseño ya en `CRITIQUE-LANDING.md` (falsos positivos) — pero lo anoto acá porque el criterio técnico de "Missing breakpoints" del audit lo pediría marcar si no se supiera que es deliberado. Dos breakpoints (móvil / ≥900px) cubren el 100% del tráfico esperado según PRODUCT.md (mobile-first estricto); no hay tablet real en el target de usuario. No accionable.

---

## Patrones y hallazgos sistémicos

- **Ninguno.** A diferencia del critique anterior (donde el gris de contraste era sistémico en 11 lugares), esta pasada no encontró un patrón repetido — los 2 touch targets son puntuales, no un hábito del sistema (el resto de los CTA — `events__cta`, `final-cta__button` — ya miden 55px de alto, bien arriba del mínimo).

## Hallazgos positivos

- **Cero color hardcodeado.** Grep completo por hex en `src/components/`, `src/layouts/`, `src/pages/` — cero resultados fuera de `tokens.css`. Sistema de tokens realmente cerrado.
- **CTAs principales ya cumplen el target táctil.** "Ver mi galería" (403×55) y "Escribir por WhatsApp" (309×55) — los dos botones que más importan en el funnel ya están bien dimensionados.
- **Presupuesto de performance real, no solo declarado.** Confirmé el peso real que baja un visitante móvil (imágenes en su variante de 400w + fuentes + HTML/CSS) — ronda 240KB, bien debajo del límite de 500KB de PRODUCT.md. El `dist/` completo pesa 768KB, pero eso es la suma de TODAS las variantes de ancho para los dos breakpoints, no lo que descarga una sola visita.
- **Sin scroll horizontal en ningún ancho probado.**

---

## Nota de entorno

El navegador automatizado en esta sesión tiene un mínimo de ventana de ~500px — no se pudo forzar exactamente 390px real (mismo límite que encontraron los dos sub-agentes del critique). El único breakpoint del proyecto es 900px, así que el CSS aplicado a 500px es idéntico al de 390px; las medidas de touch target de arriba deberían sostenerse igual a 390px real, pero no están verificadas pixel-exacto.

---

## Acciones recomendadas

1. **[P2] `/impeccable adapt`**: agrandar el área clicable de `.header__wordmark` y `.footer__link` a 44px mínimo de alto vía padding, sin tocar el tamaño de texto visible.
2. **Decisión pendiente, no un comando**: confirmar si el contraste de `.how-to-buy__number` (01/02/03) es un problema real o un tratamiento decorativo aceptado tal como está.

Fuera de eso, no hay más P0/P1/P2 abiertos. El sistema quedó limpio después de los 3 fixes de `CRITIQUE-LANDING.md`.

> Podés pedirme que aplique esto ahora, más adelante, o dejarlo así. Volvé a correr `/impeccable audit` después de cualquier cambio para ver el score.

---

## Estado posterior / actualización

Este documento conserva el score y las mediciones de su auditoría original. Después se resolvieron los targets táctiles señalados, se limitaron los hover a dispositivos con puntero fino, se añadieron estados `:active` y `touch-action: manipulation`, y `Cómo comprar` se actualizó a `ol` / `li`.

La galería usa ahora `widths={[400, 675, 800]}`. Una auditoría posterior de transferencia registró 390,912 B de página completa en 390px DPR3, 430px DPR3 y 1440px DPR2, todos bajo el presupuesto de 500 KB. Los precios, el copy del proceso, FAQ y Términos también fueron revisados posteriormente; este documento no se recalculó ni se alteró para reflejar esos cambios.
