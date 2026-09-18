# Auditoría de seguridad — Black Sheep Sport

**Rama auditada:** `feature/event-gallery-selection`

**Destino propuesto:** `main`

**Fecha:** 18 de septiembre de 2026

**Alcance:** revisión estática completa del proyecto, diferencias de la rama, dependencias, build de producción, 162 imágenes del evento y comprobaciones no destructivas del hosting público.

**Restricción respetada:** no se modificó código ni configuración, no se instalaron dependencias, no se hizo commit ni merge. Este reporte es el único archivo fuente creado.

## Resumen ejecutivo

No se encontró una vulnerabilidad crítica o alta que deba bloquear el merge. La aplicación es un sitio Astro completamente estático, sin backend, sesiones, autenticación, base de datos, formularios ni operaciones de servidor. Esto elimina clases enteras de riesgo (SQL injection, CSRF, SSRF, escalación de privilegios y fallos de sesión).

El flujo nuevo trata filenames externos como identificadores. Aunque los nombres hostiles no llegan a ejecutar HTML o JavaScript —Astro escapa las interpolaciones y el cliente usa `textContent`, atributos DOM y `encodeURIComponent()`— sí falta una política explícita de validación, longitud y unicidad. El impacto real sería fallo de build, identificadores ambiguos, confusión visual o URLs de WhatsApp demasiado largas, no XSS.

La principal consideración de privacidad es arquitectónica: las fotos están publicadas en una galería estática sin control de acceso. `noindex` reduce indexación, pero no impide descubrimiento, descarga o scraping. Esto puede ser aceptado como parte del producto, pero debe ser una decisión consciente, especialmente si aparecen menores o participantes que no esperan una galería pública.

### Conteo

| Severidad | Cantidad |
|---|---:|
| P0 — crítico antes de publicar | 0 |
| P1 — alto / antes del merge | 0 |
| P2 — recomendable | 4 |
| P3 — hardening opcional / futuro | 6 |

### Decisión

**A. Seguro para mergear tal como está.** No hay P0 ni P1. Se recomienda planificar los P2 antes de escalar a más eventos o publicar galerías con expectativas de privacidad mayores.

## Evidencia y comandos

| Comprobación | Resultado |
|---|---|
| `git branch --show-current` | `feature/event-gallery-selection` |
| `git status --short` antes de la auditoría | limpio |
| `npm audit --json` | 0 vulnerabilidades: 0 critical, 0 high, 0 moderate, 0 low, 0 info |
| `npm outdated --json` | `{}`; ninguna dependencia directa reportada como desactualizada |
| `npm run build` | correcto; 6 páginas y 343 variantes de imagen generadas |
| Archivos en `dist/` | 360; 344 WebP, 6 HTML, 3 CSS, 2 WOFF2, 2 PNG, XML, TXT y `.htaccess` |
| Sourcemaps en `dist/` | 0 |
| JPEG originales en `dist/` | 0 |
| Markdown/documentos internos en `dist/` | 0 |
| Tamaño de `dist/` | 4,8 MiB |
| HTML de la galería | 187.993 bytes con 162 fotos |
| IDs HTML duplicados | ninguno en las 6 páginas generadas |
| Decodificación de imágenes | 162/162 válidas; 0 errores |
| Listado público de `/_astro/` | HTTP 403 en SiteGround al momento de la auditoría |

`npm audit` contabilizó 287 paquetes transitivos: 178 `prod`, 110 opcionales y 2 peer (categorías de npm no necesariamente disjuntas). Aunque npm los etiqueta como producción, en este despliegue Astro, Vite, Sharp y esbuild solo participan en build: SiteGround recibe archivos estáticos y no ejecuta Node/Astro.

## Hallazgos priorizados

### P2-01 — Los filenames externos no tienen contrato de validación

- **Severidad:** P2 — recomendable.
- **Archivo / líneas:** `src/pages/eventos/happy-wood.astro:13-28`; `src/components/EventGallery.astro:60-89, 145-173, 219-268`; `src/assets/events/happy-wood/README.md:3-14`.
- **Riesgo:** el nombre se convierte directamente en código visible, atributo `data-photo-code`, valor persistido y texto de compra. No hay límites de longitud, formato permitido, caracteres de control, normalización Unicode ni comprobación de códigos duplicados. `decodeURIComponent()` también puede lanzar `URIError` ante un `%` mal formado en la clave entregada por Vite.
- **Escenario realista:** un lote del fotógrafo contiene un nombre con `%`, salto de línea, caracteres bidireccionales, emoji/confusables o dos archivos con el mismo stem (`ABC.jpg` y `ABC.png`). El build puede fallar, dos fotos pueden compartir código, o el mensaje puede ser ambiguo. Es un riesgo de integridad y disponibilidad del proceso de publicación; no requiere ni produce ejecución remota en producción.
- **Impacto:** publicación bloqueada, pedido equivocado, códigos engañosos o UX/accesibilidad degradadas.
- **Recomendación concreta:** tratar los filenames como input no confiable y validar antes del build con una regla simple y auditable, por ejemplo código ASCII limitado (`[A-Z0-9_-]`), longitud razonable, unicidad case-insensitive/Unicode-normalizada y rechazo explícito de controles, `%`, separadores y stems duplicados. El build debe fallar con un mensaje claro antes de renderizar.
- **Dificultad:** baja.

### P2-02 — Galería y selección sin límites de volumen

- **Severidad:** P2 — recomendable (robustez/funcional, no vulnerabilidad de servidor).
- **Archivo / líneas:** `src/pages/eventos/happy-wood.astro:13-28`; `src/components/EventGallery.astro:61-92, 145-173, 260-274`.
- **Riesgo:** todas las imágenes se materializan en un único HTML y todos los códigos seleccionados se agregan a una URL GET de WhatsApp. No hay máximo de fotos por evento ni límite/canal alternativo para la selección.
- **Escenario realista:** con las 162 fotos actuales, seleccionar todo produce un mensaje de 1.767 caracteres y una URL de 2.517 caracteres. Navegadores modernos suelen tolerarla, pero algunos webviews, deep links o integraciones móviles pueden truncarla o no abrirla. Con cientos o miles de códigos el fallo es probable. Un lote accidental de 5.000 imágenes también generaría miles de nodos, aproximadamente 10.000 variantes y varios MiB de HTML.
- **Impacto:** compra que no abre o llega incompleta, render lento, consumo alto de memoria y builds costosos. No hay DoS de backend porque no existe backend.
- **Recomendación concreta:** fijar límites de ingestión y selección; para el paquete “todas tus fotos”, evitar enumerar cientos de códigos o dividir/serializar la selección por un canal diseñado para ello. Añadir feedback cuando `link.click()` o el deep link no puedan completar la navegación.
- **Dificultad:** media.

### P2-03 — No existe CSP

- **Severidad:** P2 — recomendable como defensa en profundidad.
- **Archivo / líneas:** `public/.htaccess:1-9`; scripts en `src/layouts/Base.astro:45-51`, `src/components/BackToTop.astro:7-30` y `src/components/EventGallery.astro:125-276`.
- **Riesgo:** si en el futuro aparece un sink XSS o se compromete contenido incorporado, el navegador no tiene una política que limite ejecución y exfiltración. Hoy no se encontró un sink explotable, por lo que la ausencia de CSP no se clasifica P1.
- **Escenario realista:** una futura edición introduce `set:html` con contenido externo o un script no previsto. Sin CSP, el payload tiene menos barreras. La CSP no neutralizaría un script de Google explícitamente autorizado ni sustituye el escape de salida.
- **Impacto:** amplificación de una vulnerabilidad futura; actualmente defensa ausente, no explotación demostrada.
- **Recomendación concreta:** desplegar primero `Content-Security-Policy-Report-Only`, validar GA4 y luego aplicar una política con hashes de scripts estáticos o scripts propios externalizados. No usar `unsafe-eval`; evitar `unsafe-inline` para scripts si se busca protección XSS real.
- **Dificultad:** media.

### P2-04 — Las fotografías del evento son públicas y scrapeables por diseño

- **Severidad:** P2 — privacidad/control de acceso, no fallo de autenticación.
- **Archivo / líneas:** `src/pages/eventos/happy-wood.astro:31-46`; `src/components/EventGallery.astro:57-92`; `src/layouts/Base.astro:27`; `public/robots.txt:1-4`.
- **Riesgo:** la página usa `noindex`, pero no requiere credencial, token ni autorización. Las variantes WebP quedan en rutas públicas y pueden descargarse o enumerarse desde el HTML. `robots.txt` tampoco es un control de acceso.
- **Escenario realista:** una persona obtiene o adivina el slug, comparte la URL o descarga las 162 previews. Un crawler que ignore `noindex` también puede conservarlas. El watermark reduce reutilización comercial, no exposición de la imagen.
- **Impacto:** privacidad de participantes, solicitudes de retiro y posible exposición de menores; depende del consentimiento y expectativas del evento.
- **Recomendación concreta:** confirmar formalmente que “galería pública con link” es el modelo aceptado. Si se requiere confidencialidad, un sitio puramente estático no puede imponer autorización robusta por sí solo: usar protección en CDN/hosting, enlaces firmados o un servicio con control de acceso. Mantener el proceso de retiro descrito en términos/privacidad.
- **Dificultad:** alta si se requiere control de acceso real; trivial si solo se documenta la decisión.

### P3-01 — GA4 carga antes de una elección de consentimiento

- **Severidad:** P3 — privacidad/compliance condicional, no seguridad técnica.
- **Archivo / líneas:** `src/layouts/Base.astro:45-51`; `src/pages/privacidad.astro:45-52`; `src/pages/cookies.astro:20-42`.
- **Riesgo:** GA4 se carga en todas las páginas inmediatamente. No existe banner, modo de consentimiento ni bloqueo previo. Las políticas informan correctamente del uso de Analytics, pero informar no siempre equivale a obtener consentimiento cuando la jurisdicción o el público lo exige.
- **Escenario realista:** un visitante de una jurisdicción con consentimiento previo obligatorio recibe el tag antes de aceptar. Esto es compliance y privacidad; no expone secretos de la aplicación.
- **Impacto:** reclamación o incumplimiento regulatorio condicionado a jurisdicción/configuración de GA.
- **Recomendación concreta:** validar el requisito legal aplicable; si corresponde, implementar Consent Mode o cargar GA solo tras elección. Google documenta el modelo en su [guía oficial de Consent Mode](https://developers.google.com/tag-platform/security/concepts/consent-mode).
- **Dificultad:** media.

### P3-02 — No hay protección explícita contra clickjacking

- **Severidad:** P3 — hardening.
- **Archivo / líneas:** `public/.htaccess:1-9`.
- **Riesgo:** otra web puede intentar embeber la galería y superponer señuelos sobre selección/compra.
- **Escenario realista:** un tercero induce clics sobre fotos y el botón de compra. El impacto es limitado: no existe sesión ni cargo automático y WhatsApp abre fuera del frame para que el usuario revise/envíe el mensaje.
- **Impacto:** confusión o apertura no deseada de WhatsApp; no transferencia de dinero ni cambio de estado servidor.
- **Recomendación concreta:** `Content-Security-Policy: frame-ancestors 'none'`; opcionalmente `X-Frame-Options: DENY` para clientes heredados. Compatible con Astro, GA4 y WhatsApp porque el sitio no necesita ser embebido.
- **Dificultad:** trivial.

### P3-03 — HTTPS redirige, pero HSTS no está activo

- **Severidad:** P3 — hardening de transporte.
- **Archivo / líneas:** `public/.htaccess:3-6`.
- **Riesgo:** la primera visita por HTTP depende de la redirección y todavía puede ser interceptada en una red hostil.
- **Escenario realista:** ataque de downgrade/SSL stripping antes de que el navegador conozca la política HSTS. No se observó contenido sensible transmitido por la app, por lo que el impacto es menor que en un sitio autenticado.
- **Impacto:** manipulación de la primera respuesta HTTP.
- **Recomendación concreta:** **recomendable después**, mediante una fase con `Strict-Transport-Security: max-age=...` sin `includeSubDomains`; subir progresivamente el plazo tras verificar HTTPS estable. No añadir `includeSubDomains` hasta inventariar todos los subdominios y no solicitar `preload` automáticamente.
- **Dificultad:** trivial técnicamente; media operativamente por su persistencia.

### P3-04 — Faltan headers secundarios de hardening

- **Severidad:** P3 — hardening.
- **Archivo / líneas:** `public/.htaccess:1-9`.
- **Riesgo:** no se configuran `X-Content-Type-Options`, `Referrer-Policy` ni `Permissions-Policy`.
- **Escenario realista:** MIME sniffing en una respuesta mal tipada futura, política de referrer dependiente del default del navegador o APIs de dispositivo habilitadas por defecto sin necesidad.
- **Impacto:** bajo en el estado actual; todos los assets son controlados y no hay uploads ni APIs sensibles.
- **Recomendación concreta:** añadir en una fase de hardening `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` y una `Permissions-Policy` mínima deshabilitando cámara, micrófono, geolocalización y pago. GA4 no debería romperse; WhatsApp es una navegación externa y no necesita esas APIs en el origen.
- **Dificultad:** trivial.

### P3-05 — `.gitignore` no cubre todas las variantes `.env`

- **Severidad:** P3 — higiene preventiva.
- **Archivo / líneas:** `.gitignore:14-17`.
- **Riesgo:** se ignoran `.env` y `.env.production`, pero no `.env.local`, `.env.development`, `.env.test` ni patrones como `.env.*.local`.
- **Escenario realista:** una integración futura crea una variante no ignorada y un desarrollador la añade al repositorio. Hoy no existe ningún `.env*` ni secreto detectado.
- **Impacto:** potencial exposición futura de credenciales; impacto actual nulo.
- **Recomendación concreta:** ampliar el patrón cuando se permita cambiar configuración y mantener un `.env.example` explícitamente versionable si llega a ser necesario.
- **Dificultad:** trivial.

### P3-06 — `.htaccess` no fuerza `Options -Indexes`

- **Severidad:** P3 — defensa portable.
- **Archivo / líneas:** `public/.htaccess:1-9`.
- **Riesgo:** si el servidor Apache habilitara índices, directorios sin `index.html` como `/_astro/` o `/fonts/` podrían listar sus archivos.
- **Escenario realista:** cambio de hosting/configuración elimina la protección actual. En SiteGround, `https://sheepsport.com/_astro/` respondió 403 durante la auditoría, por lo que el riesgo actual está mitigado por la plataforma.
- **Impacto:** enumeración de assets ya públicos; no exposición de fuentes, `.env` o documentos internos en el build verificado.
- **Recomendación concreta:** añadir `Options -Indexes` como defensa explícita si SiteGround lo admite; probar que no cause error 500 por restricciones `AllowOverride`.
- **Dificultad:** trivial.

## XSS e inyección HTML

No se encontraron `set:html`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval`, `Function()`, `javascript:` ni handlers HTML construidos desde strings en `src/` o `public/`.

Flujo real del código:

1. Vite devuelve rutas mediante `import.meta.glob()` (`happy-wood.astro:13-16`).
2. Se obtiene el basename, se aplica `decodeURIComponent()` y se elimina la extensión (`:21-27`).
3. Astro inserta el código en texto y atributos (`EventGallery.astro:60-89`). Las expresiones normales de Astro se escapan; solo `set:html` omite el escape, y no se usa. Véase la [referencia oficial de directivas de Astro](https://docs.astro.build/en/reference/directives-reference/#sethtml).
4. El JS lee `dataset`, pero las actualizaciones visibles usan `textContent` o `setAttribute` (`:183-216`), nunca parsing HTML.
5. El mensaje completo se codifica con `encodeURIComponent()` antes de formar la query (`:264-270`).

El nombre literal `"><script>alert(1)</script>.jpg` no puede existir como un único filename POSIX porque `/` es separador. Un equivalente válido como `"><img src=x onerror=alert(1)>.jpg` quedaría escapado en HTML/atributos. El navegador devolvería los caracteres como texto al leer `dataset`, y luego seguirían hacia `textContent` y la query codificada. **No se ejecuta.**

Astro no se asumió seguro de forma genérica: se verificaron los sinks concretos y el HTML de producción. El output contiene atributos entrecomillados normales y ningún mecanismo que vuelva a interpretar el código como markup.

## Filenames como input no confiable

**Sí: deben considerarse input no confiable**, aunque sean input de build y no input HTTP de un visitante. El límite de confianza es el paquete que entrega el fotógrafo.

| Caso | Comportamiento actual | Clasificación |
|---|---|---|
| Espacios | Se preservan en texto, `data-*`, storage y mensaje; WhatsApp los codifica | UX/operación |
| Comillas/apóstrofes | Astro escapa el atributo; al leer `dataset` vuelven como texto; no se interpretan como HTML | Sin XSS |
| `<`, `>`, `&` | Escapados por Astro y tratados después como texto | Sin XSS |
| `?`, `#` | No alteran la query porque todo el mensaje usa `encodeURIComponent()` | Sin inyección; posible rareza de importación a validar |
| `/` | No puede formar parte de un filename; crea subdirectorios, y el glob actual solo busca un nivel | No entra en la galería |
| Backslash | Es literal en Unix/macOS; se mostraría/codificaría, pero es visualmente confuso | UX |
| Unicode/emoji | Renderiza y se ordena con `Intl.Collator`; puede haber normalizaciones, confusables o bidi | Integridad/UX |
| Saltos de línea | Permitidos por el filesystem; contaminarían labels y mensaje, pero no crean HTML | UX/accesibilidad |
| Nombre extremo | Limitado por filesystem, pero puede inflar DOM, storage, texto accesible y URL | Robustez |
| `%` mal formado | `decodeURIComponent()` puede lanzar durante build | Disponibilidad de build |
| Mismo stem, extensiones distintas | Ambos archivos entran con el mismo código | Ambigüedad de compra |

Los 162 archivos actuales son homogéneos: códigos de 8 caracteres, filenames de 12 caracteres, sin duplicados y con caracteres limitados a `DSC` + dígitos + extensión.

## WhatsApp dinámico

- El esquema y host `https://wa.me/` están hardcodeados.
- El número `584247438483` se pasa como prop estática desde `happy-wood.astro:45` y no depende del usuario o filename.
- Los códigos solo entran al mensaje y el mensaje completo usa `encodeURIComponent()`.
- `&`, `?`, `#`, comillas o cadenas similares a `javascript:` dentro de un código no pueden crear otro parámetro, cambiar el número, cambiar el esquema ni crear un open redirect.
- El enlace creado dinámicamente usa `target="_blank"` y `rel="noopener noreferrer"` (`EventGallery.astro:269-273`). Es el único `_blank` de la aplicación.
- Manipular el DOM desde DevTools podría cambiar los datos de la propia selección, pero solo afecta la sesión del mismo usuario y no se considera vulnerabilidad remota.
- El riesgo restante es la longitud/compatibilidad del deep link, cubierto en P2-02.

## `localStorage`

**Key:** `black-sheep-selection-happy-wood` (`happy-wood.astro:44`).

**Contenido:** JSON con un array de códigos de fotos; no guarda nombre, teléfono, pago, mensaje ni dato sensible.

Controles verificados:

- Lectura, parseo, escritura y borrado están dentro de `try/catch`.
- JSON inválido, storage deshabilitado o una excepción de cuota/privacidad no rompen la galería.
- Solo se restaura un array; solo strings; solo códigos presentes en `availableCodes`.
- Objetos, números y códigos arbitrarios persistidos manualmente se ignoran.
- La aplicación solo escribe códigos existentes y elimina la key cuando la selección queda vacía.
- El crecimiento normal está acotado por el número de botones/fotos del evento.
- La key incluye el slug del evento, evitando colisión con futuros eventos siempre que se mantenga esa convención.

Una persona puede escribir un JSON enorme desde DevTools y provocar trabajo de parseo en su propia sesión; no es una vulnerabilidad multiusuario. Un XSS capaz de modificar `localStorage` ya tendría capacidades superiores, y no se encontró ese XSS.

## DOM y eventos

- La delegación comprueba `event.target instanceof Element`, usa `closest()` y confirma `gallery.contains(button)`.
- No se asume que el target sea siempre el botón.
- `querySelector` y los listeners se instalan una vez porque el componente aparece una vez en la página actual.
- No hay funciones propias añadidas a `window`, exports globales ni mensajes cross-window.
- No hay race conditions relevantes: el estado vive en un `Set` sin operaciones asíncronas.
- No hay IDs duplicados en el HTML de producción.
- La modificación del DOM desde consola puede alterar la propia compra, pero no afecta servidor, otros usuarios ni el número controlado por código.

## Enlaces externos

En el código de aplicación solo existen:

- Google tag: `https://www.googletagmanager.com/gtag/js?id=G-T78YKQN3QZ`.
- WhatsApp público en privacidad y el enlace de compra a `https://wa.me/...`.
- `mailto:info@sheepsport.com`.

No existe enlace directo a Binance; solo se menciona como canal externo coordinado en WhatsApp. No hay jsDelivr, unpkg, Tailwind CDN ni dependencias importadas desde URLs arbitrarias.

## Google Analytics 4

- ID único: `G-T78YKQN3QZ`, usado una vez para cargar `gtag.js` y una vez para configurar la instancia.
- Script oficial: `www.googletagmanager.com`.
- No hay eventos personalizados ni código que envíe selección, códigos, filenames, contenido de WhatsApp o información personal a GA4.
- La medición predeterminada sí puede enviar URL/título y datos técnicos propios de Analytics; la ruta revela el slug del evento, no las fotos seleccionadas.
- `window.dataLayer`/`gtag` siguen el snippet estándar y no consumen input del usuario.
- El script remoto ejecuta con privilegios de página y, como cualquier script tercero permitido, técnicamente podría leer DOM y storage. Es un riesgo de supply chain aceptado al elegir GA; SRI no es práctico para `gtag.js` dinámico y cambiante. Una CSP limita orígenes adicionales, pero no lo que un script ya autorizado puede leer.
- La cuestión de carga previa a consentimiento es privacidad/compliance (P3-01), no una vulnerabilidad XSS.

## Headers de seguridad

El `.htaccess` actual solo controla redirección canónica y documento 404. El hosting público tampoco devolvió estos headers en la prueba de la home.

| Header | Utilidad real | Compatibilidad / riesgo | Momento recomendado |
|---|---|---|---|
| `Content-Security-Policy` | Reduce impacto de XSS futuro y restringe terceros/framing | Puede romper GA4 y los 3 scripts inline únicos si faltan allowlists/hashes; WhatsApp no necesita permiso de `connect-src` porque es navegación | Ahora en Report-Only; aplicar después de validar |
| `X-Content-Type-Options: nosniff` | Evita sniffing de tipos | Bajo riesgo con assets correctos | Ahora |
| `Referrer-Policy: strict-origin-when-cross-origin` | Hace explícito que una salida HTTPS no reciba la ruta completa | Compatible con GA/WhatsApp; coincide con defaults modernos | Ahora, beneficio pequeño |
| `Permissions-Policy` | Deshabilita APIs no usadas | Compatible si se limita cámara, micrófono, geolocalización y payment | Ahora/futuro, hardening |
| `Strict-Transport-Security` | Protege la primera navegación tras aprendizaje | Persistente; revisar subdominios antes de ampliar | Después, de forma gradual |
| `frame-ancestors 'none'` | Evita clickjacking | Compatible; el sitio no necesita iframe | Ahora junto a CSP |
| `X-Frame-Options: DENY` | Fallback anti-frame heredado | Compatible; redundante en clientes modernos con CSP | Opcional ahora |

Astro no requiere headers especiales. WhatsApp es una navegación de usuario, no un `fetch`. GA4 es el único punto que obliga a allowlists externos.

## CSP compatible propuesta — no implementada

Política mínima conceptual para la funcionalidad actual:

```text
default-src 'self';
script-src 'self' https://www.googletagmanager.com <hashes-de-scripts-inline>;
connect-src https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com;
img-src 'self' https://*.google-analytics.com https://www.googletagmanager.com;
style-src 'self' 'unsafe-inline';
font-src 'self';
object-src 'none';
base-uri 'none';
form-action 'none';
frame-ancestors 'none';
```

Los dominios de Analytics se basan en la [guía CSP oficial de Google](https://developers.google.com/tag-platform/security/guides/csp). No se incluyeron endpoints publicitarios de DoubleClick/Google Ads porque el código auditado no usa esas funciones. Deben añadirse solo si la configuración real de GA las activa y se acepta esa ampliación.

El build actual contiene tres cuerpos de script inline únicos. Sus hashes SHA-256 son:

```text
'sha256-TbWXgwtcoJHp5EVBb9M7nGT9kvzBYjkWQZDCTSl0Mhk='  # inicialización GA4
'sha256-cmGF550zf2lON1HkPANowlPs5m5jxjWBv3zJChUgQWk='  # BackToTop
'sha256-AbAYDqo8LrOe8vS70zyt7X5WIDjiMlG3G1BW1sMChLU='  # EventGallery
```

Estos hashes son evidencia del build auditado, no configuración durable: cualquier cambio al contenido compilado exige recalcularlos. En un sitio estático, hashes o externalizar scripts propios son más apropiados que nonces; un nonce seguro debe ser aleatorio por respuesta, algo que un `.htaccess` estático no proporciona. Un nonce fijo reutilizado pierde su propiedad de seguridad.

Usar `script-src 'unsafe-inline'` sería la ruta más fácil y compatible, pero reduce mucho el valor anti-XSS de CSP. No hace falta `unsafe-eval`. `style-src 'unsafe-inline'` sí es necesario con el `<style is:global>` actual, salvo que también se externalice o hashee el CSS inline. Se recomienda comenzar con `Content-Security-Policy-Report-Only` y revisar reportes antes de enforcement.

## Clickjacking

Existe superficie visual clicable (selección y “Comprar”), pero no hay sesión ni compra automática. El máximo efecto razonable es manipular selección o abrir WhatsApp; el usuario todavía ve y debe enviar el mensaje y coordinar el pago externamente. Por eso es P3, no P1/P2.

`frame-ancestors 'none'` es apropiado. `X-Frame-Options: DENY` puede acompañarlo para compatibilidad heredada.

## HTTPS, redirecciones y Host header

Regla auditada:

```apache
RewriteCond %{HTTPS} !=on [OR]
RewriteCond %{HTTP_HOST} ^www\.sheepsport\.com$ [NC]
RewriteRule ^ https://sheepsport.com%{REQUEST_URI} [R=301,L]
```

- El destino usa `https://sheepsport.com` fijo; `%{HTTP_HOST}` no se refleja. No hay open redirect en la regla.
- HTTP en cualquier host que llegue a Apache y `https://www.sheepsport.com` redirigen al canónico.
- `https://sheepsport.com` no redirige: correcto.
- HTTPS con un Host inesperado no coincide con ninguna condición y la regla por sí sola no lo rechaza ni canonicaliza. En la prueba pública, el proxy Nginx de SiteGround envió hosts desconocidos a su vhost por defecto: HTTP reflejó ese mismo host en un redirect del proxy y HTTPS devolvió 404; no sirvió Black Sheep Sport.
- La reflexión del vhost por defecto no convierte `sheepsport.com` en open redirect: el atacante ya debe realizar una petición dirigida al Host que controla. No se encontró una cadena realista de explotación contra visitantes del dominio canónico.
- `%{REQUEST_URI}` conserva path/query bajo el host fijo. Un path que empiece con `//` continúa después de `sheepsport.com`; no cambia la autoridad de la URL.
- CR/LF crudo no es aceptado normalmente por la capa HTTP y no se observó inyección de headers. El riesgo aquí es teórico.

Como hardening de hosting, puede rechazarse/canonicalizarse explícitamente cualquier Host distinto de los dos permitidos, pero no es requisito de merge en el despliegue observado.

## HSTS

**Clasificación:** recomendable después. HTTPS funciona y HTTP/www redirigen correctamente. Empezar con un `max-age` corto, observar, y progresar hacia un año. No usar `includeSubDomains` hasta comprobar que cada subdominio soporta HTTPS permanentemente. No solicitar `preload` salvo decisión operativa informada: es difícil de revertir y exige cubrir subdominios.

## CORS

No existe configuración CORS y no hay una API propia que deba ser consumida cross-origin. Añadir `Access-Control-Allow-Origin` no aporta protección a documentos/assets públicos y puede crear expectativas incorrectas. **No se recomienda añadir CORS.**

## CSRF

No aplica: no hay sesión, cookies de autenticación, endpoints mutadores, POST ni estado de servidor. `localStorage` es estado local del mismo navegador y el envío a WhatsApp requiere una acción del usuario fuera del sitio.

## Auth, sesiones y secretos

- No hay autenticación, cuentas, roles, sesiones, tokens ni cookies propias.
- No se encontraron claves privadas, API keys, passwords, bearer tokens ni secretos cliente en el código de aplicación/configuración/documentación relevante.
- No existe `.env*` en el árbol actual.
- El ID de medición GA4 es público por diseño.
- El teléfono comercial `584247438483` y `info@sheepsport.com` son datos públicos y no se clasifican como vulnerabilidad.
- No se hallaron rutas `/Users/...`, usernames personales ni stack traces en `dist/`.

## Exposición de archivos y build

El build publica solo HTML, CSS, fuentes, imágenes optimizadas, favicon/OG, `robots.txt`, sitemap y `.htaccess`.

No se publican:

- `README.md`, `HANDOFF.md`, `PRODUCT.md` ni auditorías internas;
- `src/`, fuentes `.astro`, `.git`, `.env`, `package*.json`, config de Astro o TypeScript;
- originales JPEG/Lightroom;
- `src/assets/events/happy-wood/README.md` (confirmado ausente de `dist/`).

Los nombres base de las fotos sí aparecen en HTML y nombres de assets, porque son deliberadamente los códigos comerciales. Esto no expone rutas locales.

## Imágenes y metadatos

Se inspeccionaron las 162 imágenes fuente:

- 162/162 contienen EXIF, ICC, IPTC y XMP.
- EXIF visible en las 162: marca/modelo de cámara (`SONY`, `ILCE-6700`), fecha/hora y software de exportación (`Adobe Photoshop Lightroom Classic 15.5.1`).
- XMP contiene además lente, fecha de captura, nombre del RAW original, IDs de documento e historial/ajustes de Lightroom.
- No se detectaron coordenadas GPS/IFD GPS, serial de cámara/lente, artista/autor ni copyright personal en las 162.

Se inspeccionaron las 324 variantes WebP del evento en `dist/_astro/`:

- 0 contienen EXIF;
- 0 contienen ICC;
- 0 contienen IPTC;
- 0 contienen XMP.

**Conclusión:** los originales del repositorio contienen metadata de cámara/edición, pero el build actual no la expone en producción. No se requiere limpieza adicional para la salida desplegada mientras las fotos sigan pasando por `<Image>`/Sharp y no se copien crudas a `public/`.

## Directory listing

Astro genera `index.html` para las rutas de páginas, pero `/_astro/` y `/fonts/` no tienen índice. El hosting actual respondió 403 para `/_astro/`, por lo que no hay listado activo. `Options -Indexes` sería defensa portable de bajo costo, no corrección urgente. Incluso si hubiera listado, solo enumeraría assets ya públicos del build, no el repositorio.

## Sourcemaps y código cliente

No se generó ningún `.map`. El JavaScript de selección y BackToTop queda minificado inline; revela lógica, precios y número comercial, que necesariamente son públicos en una aplicación cliente. No contiene secretos. `<meta name="generator" content="Astro v7.3.3">` expone la versión del generador, pero Astro no corre en producción, así que el fingerprint no abre una superficie runtime.

## Error handling

- `404.html` es estático, tiene `noindex` y no muestra stack trace ni ruta local.
- `localStorage` corrupto/bloqueado está controlado por `try/catch` y no rompe la galería.
- Un archivo de imagen corrupto o filename problemático puede fallar el build y mostrar una ruta en logs de build; esos logs no se publican.
- La apertura de WhatsApp no tiene feedback de fallo si el navegador/webview bloquea el deep link; es robustez UX.
- No hay respuestas servidor generadas por la aplicación que puedan imprimir excepciones.

## DoS, volumen y archivos de imagen hostiles

No hay backend que pueda agotarse mediante requests de aplicación. El hosting/CDN absorbe el riesgo de tráfico volumétrico.

Riesgos cliente/build:

- 5.000 imágenes harían crecer linealmente el HTML, número de optimizaciones, build, DOM y memoria.
- Filenames grandes aumentan atributos, accesibilidad, storage y URL.
- Cientos/miles de códigos pueden superar límites prácticos de deep links.

Un archivo con extensión permitida pero contenido corrupto es entregado a la pipeline de imagen de Astro/Sharp. El comportamiento normal es error de decodificación y build fallido. Los 162 actuales se decodificaron correctamente. Astro vuelve a codificar a WebP, por lo que el contenido binario fuente no se ejecuta en el navegador. La ejecución de código solo sería plausible mediante una vulnerabilidad del decodificador nativo; `npm audit` no reportó vulnerabilidades conocidas en la versión bloqueada (`sharp 0.35.4`). Es riesgo de supply chain/build, no una vía demostrada.

## Supply chain

- Dependencia directa única: `astro 7.3.3`.
- Transitivas relevantes: Vite 8.3.0, esbuild 0.28.2 y Sharp 0.35.4.
- `package-lock.json` v3 fija 287 paquetes; todos los paquetes resueltos vienen de `registry.npmjs.org` y tienen integridad. No hay git URLs, tarballs arbitrarios ni dependencias HTTP.
- Paquetes con install script declarados: esbuild y fsevents (este último opcional); esbuild está explícitamente permitido en `package.json`.
- El riesgo de las dependencias se materializa en la máquina/CI de build, no en SiteGround.
- Único script remoto en navegador: Google `gtag.js`; no hay CDN adicionales.
- No se recomienda SRI para `gtag.js` porque Google sirve un recurso mutable; un hash fijo rompería cuando cambie. CSP y minimización de terceros son controles más honestos.

## Información sensible en cliente

No se detectaron teléfonos privados distintos al comercial, emails internos distintos a `info@sheepsport.com`, rutas locales, usernames, credenciales, tokens, datos administrativos ni comentarios sensibles en el build. Los documentos internos versionados no entran en `dist/`.

## Legal y privacidad

Las páginas son técnicamente consistentes con la implementación:

- Privacidad describe nombres/códigos/mensajes gestionados por WhatsApp, fotos de participantes, ausencia de cuentas/formularios/base de datos, `localStorage`, GA4, WhatsApp y Binance.
- Cookies aclara que la selección usa `localStorage`, no cookie, y que GA4 puede usar cookies/tecnologías similares.
- Términos describe selección, generación de mensaje, precios, pago móvil/Binance y entrega por WhatsApp.
- No existe código de Binance en el sitio; esto es consistente porque el pago se coordina externamente.

La única reserva es P3-01: GA carga inmediatamente y no hay control de consentimiento. La suficiencia legal depende de audiencia y jurisdicción; debe tratarse como compliance, no como vulnerabilidad de aplicación.

## Git y repositorio

`.gitignore` cubre `dist/`, `.astro/`, `node_modules/`, logs, `.env`, `.env.production`, archivos de macOS/editor y estado local de herramientas. No hay `.env*` presente ni versionado. La carencia de patrones más amplios se documenta en P3-05.

La rama modifica 175 archivos frente a `main`: principalmente 162 JPEG, la galería/evento, documentación y ajustes de copy/flujo. El build no arrastra documentación ni herramientas versionadas al output.

## No aplica / ya está correctamente mitigado

| Clase | Estado y motivo |
|---|---|
| SQL injection | No hay SQL, base de datos ni backend |
| Command injection servidor | No hay input de usuario ejecutado por servidor |
| CSRF | No hay sesión, cookies auth ni endpoint mutador |
| Session fixation/hijacking | No existen sesiones |
| Password security | No hay login ni passwords |
| Privilege escalation/IDOR | No hay usuarios, roles, objetos privados ni autorización |
| SSRF | No hay servidor que realice requests desde URLs del usuario |
| Upload remoto | Los archivos solo entran mediante proceso de desarrollo/build |
| Open redirect en WhatsApp | Host/esquema hardcodeados y mensaje codificado |
| XSS por filename | Interpolación escapada + `textContent`/atributos + URL encoding; sin sink HTML |
| Tabnabbing | El único `_blank` dinámico usa `noopener noreferrer` |
| CORS | No hay API; no se necesita habilitarlo |
| Secretos en cliente | No se encontraron; GA ID y contactos son públicos |
| Sourcemaps | No se generan |
| EXIF en producción | Variantes publicadas no conservan metadata |
| Directory listing actual | SiteGround devuelve 403 |
| Stack traces en producción | Sitio estático; no aparecen en páginas generadas |

## Top riesgos reales

1. **Galería pública y scrapeable:** riesgo de privacidad de participantes, especialmente si las expectativas del evento no son explícitas.
2. **Filenames externos sin validación formal:** posible fallo de build, spoofing/confusión Unicode y códigos duplicados; no XSS.
3. **Volumen/URL de WhatsApp sin límite:** 2.517 caracteres al seleccionar las 162 fotos actuales; posible truncado o fallo móvil.
4. **Ausencia de CSP:** no hay explotación actual, pero falta una barrera importante ante futuras regresiones XSS y scripts no previstos.

No se inventa un quinto riesgo material. GA/consentimiento, clickjacking, HSTS, headers secundarios, `.env` y `Options -Indexes` son hardening o compliance de menor prioridad.

## Orden recomendado

1. Acordar si las galerías son deliberadamente públicas y documentar el criterio de consentimiento/retiro.
2. Añadir validación pre-build de filenames/códigos y límites de volumen.
3. Rediseñar el mensaje de paquete para no depender de una URL con cientos de códigos.
4. Probar CSP en Report-Only y luego aplicar hashes/externalización + `frame-ancestors`.
5. Añadir headers de bajo riesgo; introducir HSTS gradualmente.

## Referencias técnicas

- [Astro: componentes](https://docs.astro.build/en/basics/astro-components/)
- [Astro: expresiones y atributos dinámicos](https://docs.astro.build/en/reference/astro-syntax/)
- [Astro: `set:html` y escape](https://docs.astro.build/en/reference/directives-reference/#sethtml)
- [Vite: `import.meta.glob`](https://vite.dev/guide/features.html#glob-import)
- [Google: CSP para Google tag/Analytics](https://developers.google.com/tag-platform/security/guides/csp)
- [Google: Consent Mode](https://developers.google.com/tag-platform/security/concepts/consent-mode)
- [Apache: mod_rewrite](https://httpd.apache.org/docs/2.4/mod/mod_rewrite.html)
- [Apache: `Options` e índices](https://httpd.apache.org/docs/2.4/mod/core.html#options)

## Recomendación final de merge

**A. Seguro para mergear tal como está.**

Motivo: 0 P0, 0 P1, build correcto, auditoría de dependencias limpia, sin XSS/inyección demostrable, URL externa confinada y persistencia local robusta. Los P2 deben entrar al backlog de seguridad/robustez, pero no justifican bloquear este merge de un sitio estático con los 162 archivos actuales.
