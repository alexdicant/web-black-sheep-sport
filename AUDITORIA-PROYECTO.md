# Auditoría y toma de estafeta — Black Sheep Sport

**Fecha:** 18 de septiembre de 2026  
**Estado del repositorio al auditar:** `main` en `fef54f1`, sincronizado con `origin/main` y con el worktree limpio.

## Veredicto

El proyecto está bien encaminado, tiene una identidad coherente y una arquitectura apropiadamente simple, pero todavía no está listo para producción: los dos únicos caminos de conversión siguen inactivos y faltan decisiones comerciales reales.

El build pasa correctamente y `npm audit` reporta cero vulnerabilidades conocidas.

## Qué es el producto

Black Sheep Sport no es un portafolio ni un e-commerce tradicional. Es un embudo móvil ultracorto:

```text
QR del evento → identificar el evento → abrir Drive → elegir fotos
→ contactar por WhatsApp → pagar → recibir fotos finales
```

El usuario es un atleta recién salido de una competencia en Mérida, cansado, con poco tiempo y posiblemente una conexión deficiente. La página debe contestar rápidamente:

1. ¿Dónde están mis fotos?
2. ¿Cómo las compro?
3. ¿Cuánto cuestan?

La fotografía demuestra la calidad; el copy solo debe orientar. No hay carrito, backend, cuentas, formularios ni CMS.

## Estado técnico real

- Astro 7.3.3, completamente estático.
- Dos rutas: `/` y `/terminos`.
- Nueve componentes de presentación.
- Cero JavaScript enviado al navegador.
- CSS propio y tokens, sin Tailwind ni framework UI.
- Imágenes procesadas mediante `astro:assets`.
- Dos fuentes locales WOFF2.
- Deploy previsto manualmente en SiteGround.
- `sheepsport.com` responde, pero actualmente muestra una página “Under construction”; el build de este repositorio no está publicado.
- La estructura de rutas y estilos sigue correctamente el modelo oficial de Astro: rutas basadas en `src/pages` y estilos encapsulados por componente.

El build actual genera dos páginas, 14 variantes optimizadas de imágenes y un `dist/` de 768 KB.

## Valoración actual

| Dimensión | Score | Lectura |
|---|---:|---|
| Accesibilidad | 3/4 | Buena semántica general, alt text, foco y contraste; quedan targets táctiles y semántica de la secuencia |
| Performance | 3/4 | Excelente carga inicial y cero JS; el peso total en pantallas DPR 3 no está tan holgado como dice el handoff |
| Responsive | 3/4 | Mobile-first sólido, pero sin prueba física y con hover no condicionado |
| Theming/sistema | 3/4 | Sistema coherente; hay una excepción de color hardcodeado y una fuente del sistema |
| Integridad | 2/4 | Diseño específico y bien ejecutado, pero el funnel principal no funciona |
| **Total** | **14/20** | **Bueno técnicamente, bloqueado para lanzamiento** |

El anterior `18/20` puede describir la capa visual aislada, pero no debe utilizarse como indicador de preparación para publicar porque no refleja el bloqueo funcional central.

## Bloqueo P0

Los dos únicos CTA de conversión son enlaces `#`:

- Galería: `src/components/Events.astro`, campo `url` del evento.
- WhatsApp: `src/components/FinalCta.astro`, constante `whatsappUrl`.

Esto impide cumplir el propósito declarado del producto. Antes de cualquier polish se necesita:

- URL real de Drive.
- Número real de WhatsApp.
- Nombre y fecha definitivos del evento.
- Confirmación de precios.
- Confirmación de medios de pago y tiempos de entrega.
- Confirmación de la foto principal y las seis fotos de muestra.

Además, el CTA de escritorio dice “Escríbenos”, pero conduce a la sección de eventos, no a un contacto. Debería llamarse algo como “Buscar mis fotos” o realmente abrir WhatsApp.

## Correcciones al handoff y auditorías anteriores

`HANDOFF.md` es una base muy buena y conserva correctamente la intención del proyecto. Sin embargo, requiere estas precisiones:

- `AUDIT-LANDING.md` declara cero P0 aunque los dos CTA siguen muertos. Esto contradice el código y `CRITIQUE-LANDING.md`.
- La preocupación por el contraste de `01/02/03` está desactualizada. Ahora usan `#7c847f`, con ratio aproximado de 3.84:1, y son texto grande en negrita; cumplen el umbral AA de 3:1 para texto grande.
- No es estrictamente cierto que no existan colores hardcodeados fuera de tokens: el overlay del hero usa `rgba(13, 15, 12, 0.92)` en `Hero.astro`.
- El estimado de 240 KB supone variantes pequeñas. En un móvil de 390 px con DPR 3, el navegador puede elegir las seis variantes de 800 px de la galería. La suma bruta resultante ronda **524,921 bytes** antes de comprimir HTML/CSS: cerca o ligeramente por encima del presupuesto de 500 KB.
- La carga inicial sigue siendo ligera gracias al lazy loading, pero el presupuesto completo debe probarse en una red real.
- `README.md` sigue siendo el texto genérico del starter de Astro y no documenta este proyecto.
- `HANDOFF.md` llama “final” al copy de FAQ/Términos y después lo describe correctamente como provisional. Todo ese contenido debe considerarse pendiente de validación.
- La afirmación tipográfica tiene una excepción: el header usa `ui-monospace, monospace`, pese a que el sistema declara Archivo + Instrument Sans.
- Instrument Sans solo incorpora pesos 400–500, pero hay elementos que solicitan 600 o 700; el navegador sintetiza esos pesos.
- Las capturas de `design/export` no son una fuente vigente: muestran dos eventos y contienen duplicaciones de FAQ, CTA y footer. Sirven como memoria visual, no como especificación.

## Riesgos y deuda después del P0

### Accesibilidad y mobile

- `Cómo comprar` debería ser un `<ol>` con `<li>`, no una colección de `div`, para transmitir semánticamente que es una secuencia.
- El wordmark y el enlace “Términos” tienen áreas táctiles inferiores a 44 px.
- Los estilos `:hover` no están limitados a dispositivos con puntero fino. En móviles y tablets pueden quedarse pegados.
- No existen estados `:active`, `touch-action: manipulation` ni una política móvil explícita de tap feedback.
- La regla global de reduced motion elimina todas las transiciones. Hoy no rompe nada importante, pero puede ocultar feedback futuro.
- Falta probar en teléfono físico, DPR 3, conexión lenta y landscape.

### Calidad y operación

- No hay scripts de `check`, lint, tests, auditoría de enlaces ni CI.
- No hay configuración de deploy, rollback, caché o headers. SiteGround está fuera del control del repositorio.
- No hay página 404, canonical, Open Graph, sitemap ni robots. Son secundarios porque la adquisición principal es QR, pero conviene cerrarlos antes de una campaña pública.
- No hay analítica. Para este funnel se podrían medir al menos `gallery_open`, `whatsapp_click` y `terms_open`, pero requiere una decisión de producto y política de privacidad.
- Hay 18 fotos fuente y solo siete en uso. Las once restantes no afectan el build, pero sí añaden ruido al repositorio.
- Se versionan seis instalaciones de `impeccable`, todas v0.1.5 pero no idénticas, para distintos agentes. Ocupan aproximadamente 84 MB del working tree y pueden divergir. No deben eliminarse sin confirmar que se desea perder compatibilidad multiagente.

## Fortalezas que deben conservarse

- La arquitectura es exactamente tan pequeña como el problema requiere.
- Cero JavaScript cliente y una superficie de ataque mínima.
- Fotografías reales, sin material inventado.
- Buen sistema de color y contraste.
- Jerarquía de encabezados correcta.
- Alt text descriptivo y específico.
- Imagen principal priorizada y galería con lazy loading.
- Copy generalmente corto y orientado a acción.
- Identidad visual reconocible: Archivo Expanded, volt, negro frío y geometría casi cuadrada.
- Código limpio, legible y dividido por secciones.
- Historial Git ordenado y repositorio sincronizado.
- `npm run build` pasa correctamente.
- `npm audit` devuelve cero vulnerabilidades.

## Orden recomendado para continuar

1. Conseguir y cargar los datos reales: evento, Drive, WhatsApp, precios, pagos y tiempos.
2. Resolver inconsistencias de copy y definir qué prometen exactamente FAQ y Términos.
3. Corregir la capa móvil: targets, hover/active, semántica de pasos y prueba en hardware.
4. Medir transferencia real en DPR 2/3 y 3G; ajustar variantes de galería si supera el presupuesto.
5. Sustituir el README genérico y actualizar el handoff y la auditoría para que vuelvan a ser confiables.
6. Añadir checks automáticos mínimos y preparar el procedimiento de deploy y rollback.
7. Publicar en SiteGround y hacer una prueba completa desde un QR real.

## Fuentes de verdad y autoridad

Orden recomendado al tomar decisiones:

1. Código actual en `src/`.
2. `PRODUCT.md` y `DESIGN.md` para propósito y restricciones.
3. `HANDOFF.md` para contexto histórico y decisiones cerradas, aplicando las correcciones de este informe.
4. `CRITIQUE-LANDING.md` y `AUDIT-LANDING.md` como evidencia de revisiones anteriores, no como estado necesariamente vigente.
5. `design/export` y `design/reference` únicamente como memoria visual.

## Nota de tooling

`PRODUCT.md` conserva una sección `## Register` que la versión actual de `impeccable` ya no utiliza. Puede eliminarse en la próxima actualización documental; no afecta al sitio ni al build.

