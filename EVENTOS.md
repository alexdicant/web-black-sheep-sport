# Gestión de eventos y fotografías

Para crear eventos, publicar galerías o cargar fotografías, este documento prevalece sobre ejemplos históricos o documentación antigua.

## 1. Resumen del flujo

ANTES DEL EVENTO: registrar evento → crear carpeta → dejarla vacía → build → página muestra PRÓXIMAMENTE.

DESPUÉS DEL EVENTO: exportar/copiar fotos → colocarlas en la carpeta → build → galería aparece automáticamente.

CUANDO LLEGA EL SIGUIENTE EVENTO: anterior conserva su URL → anterior pasa a past → nuevo recibe featured → Home y Hero cambian automáticamente.

## 2. Reglas importantes

- El slug debe ser único y estable. No cambiarlo después de publicar salvo migración consciente de URL y selección.
- Debe existir exactamente un featured: true.
- status solo admite upcoming o past.
- status no cambia automáticamente según la fecha.
- status describe la etapa del evento; featured decide cuál es principal en Home/Hero. Son conceptos distintos.
- Pricing y WhatsApp son globales: no se configuran por evento.
- storageKey, URL, fecha visible y metadata se derivan del registro del evento.
- Events.astro y Hero.astro no se editan para cada evento.
- No crear src/pages/eventos/<slug>.astro. La ruta dinámica src/pages/eventos/[slug].astro genera las páginas.

### Límite de Home

HOME_EVENT_LIMIT = 5: máximo actual de 5 registros totales en events.ts. Home presenta un destacado y hasta cuatro eventos past no destacados. No son cinco anteriores más el destacado.

Si ya existen cinco registros y se solicita un sexto, Codex debe detenerse y avisar que primero debe implementarse la ruta/archivo de eventos prevista por la arquitectura. No eliminar eventos ni ocultarlos para saltarse el límite.

## 3. Crear y anunciar un evento

- [ ] Confirmar nombre público, slug único, fecha ISO YYYY-MM-DD y lugar.
- [ ] Revisar el número total de eventos y el featured actual. Si ya hay cinco, detenerse por el límite descrito arriba.
- [ ] Editar src/data/events.ts y añadir:

    {
      slug: "copa-merida-2026",
      name: "Copa Mérida",
      isoDate: "2026-11-14",
      location: "Lugar del evento",
      status: "upcoming",
      featured: true,
    }

- [ ] Usar status: "upcoming" si el evento todavía no ocurrió.
- [ ] Usar featured: true si debe ser el evento principal en Home/Hero. Al activarlo, el anterior debe quedar featured: false; debe existir exactamente uno.
- [ ] Si el evento anterior ya terminó, marcarlo status: "past". El cambio es manual.
- [ ] Editar src/pages/eventos/[slug].astro y añadir el slug a photoModulesBySlug:

    "copa-merida-2026": import.meta.glob<EventImageModule>(
      "../../assets/events/copa-merida-2026/*.{webp,jpg,jpeg,png,avif}",
      { eager: true },
    ),

El patrón debe ser literal: Astro/Vite analiza los patrones de import.meta.glob durante el build. No construirlo dinámicamente desde una variable.

- [ ] Crear src/assets/events/<slug>/. Puede estar vacía. No crear página Astro individual.
- [ ] Ejecutar npm run build.
- [ ] Confirmar que se genera /eventos/<slug>/ y revisar Home.
- [ ] Si todavía no hay fotos, confirmar que la página presenta PRÓXIMAMENTE.

## 4. Evento sin fotografías

Contrato intencional:

evento válido + glob correctamente registrado + 0 fotos compatibles = build válido + página válida + PRÓXIMAMENTE

La página conserva nombre, fecha, lugar, metadata, Header y Footer. No muestra grid, lightbox, selección ni botón de compra. Una carpeta vacía no es un error.

## 5. Después del evento: cargar fotografías

1. Exportar/preparar las fotos finales.
2. Copiarlas directamente a src/assets/events/<slug>/.
3. No crear subcarpetas.
4. No registrar cada foto manualmente.
5. No editar EventGallery.astro.
6. No editar events.ts solo por añadir fotografías.
7. Ejecutar npm run build.
8. Verificar la galería y la cantidad esperada.
9. Desplegar el contenido completo de dist/.

Si el evento estaba en PRÓXIMAMENTE, el mismo URL muestra la galería al encontrar fotos compatibles en el siguiente build. Selección, pricing, WhatsApp y localStorage se heredan automáticamente.

## 6. Convenciones de fotografías

Extensiones admitidas, en minúsculas: .webp, .jpg, .jpeg, .png, .avif. Los archivos deben estar directamente en src/assets/events/<slug>/, no en subdirectorios. README.md no afecta el glob.

El código sale del filename sin extensión. Debe cumplir la regla ^[A-Za-z0-9_-]+$, con longitud máxima de 40 caracteres. Duplicados se rechazan sin distinguir mayúsculas/minúsculas. El orden es natural por código/filename (DSC2 antes de DSC10).

| Filename | Resultado |
|---|---|
| DSC00123.webp | Válido |
| BF-001.jpg | Válido |
| ATLETA_014.png | Válido |
| foto final.jpg | Inválido: espacio |
| BF#001.jpg | Inválido: símbolo # |
| foto(2).jpg | Inválido: paréntesis |
| foto-á.jpg | Inválido: tilde |

DSC00123.JPG no entra en el glob actual y puede ignorarse silenciosamente. No usar extensiones en mayúsculas.

## 7. Después de terminar el evento

Cuando el evento termina, cambiar manualmente:

    status: "past"

Puede continuar con featured: true si sigue siendo el evento principal actual. Esto es válido.

Al anunciar el siguiente:

    EVENTO ANTERIOR: status = "past", featured = false
    NUEVO EVENTO:    status = "upcoming", featured = true

El nuevo queda en Hero; el anterior pasa al listado histórico. La URL anterior y su galería se conservan. Su selección localStorage continúa válida mientras no cambie el slug.

## 8. Tabla de estados

| status | featured | Fotos | Home / Hero | Página |
|---|---:|---:|---|---|
| upcoming | sí | 0 | Aparece en Home y Hero. | PRÓXIMAMENTE. |
| upcoming | sí | fotos | Aparece en Home y Hero. | Galería. |
| upcoming | no | cualquiera | No aparece en Home. | URL sí existe. |
| past | sí | cualquiera | Sigue como principal hasta transferir featured. | Galería o PRÓXIMAMENTE según fotos. |
| past | no | 0 | Histórico si cabe en los cuatro lugares disponibles. | PRÓXIMAMENTE. |
| past | no | fotos | Histórico por fecha descendente si cabe. | Galería. |

## 9. No configurar manualmente por evento

- Dependen de slug: URL /eventos/<slug>/ y storage key black-sheep-selection-<slug>. Cambiar slug cambia ambas; no se migran automáticamente.
- Dependen de events.ts: fecha visible (formateada desde isoDate), metadata title/description, nombre/lugar/fecha de la página, status y featured.
- Globales/compartidos: pricing, teléfono y construcción del mensaje de WhatsApp, componente de galería, Hero y listado Home.

No añadir props manuales para storage key, pricing o WhatsApp en un evento nuevo.

## 10. Errores frecuentes

| Error o situación | Resultado | Cómo evitarlo |
|---|---|---|
| Evento en events.ts sin glob | ERROR REAL: build falla porque no hay patrón de assets. | Registrar ambos lados con el mismo slug. |
| Glob/carpeta sin evento en events.ts | No se genera URL ni tarjeta. | Añadir el registro también. |
| Slug distinto entre registro, glob y carpeta | Puede fallar por falta de glob o dejar galería vacía. | Copiar exactamente el mismo slug. |
| Cambiar slug publicado | Cambian URL y storage key; selección previa no se migra. | Mantener slug o planificar migración. |
| 0 featured | ERROR REAL: build falla al resolver evento principal. | Mantener exactamente uno. |
| 2 featured | ERROR REAL: build falla indicando el conteo. | Transferir el valor; no duplicarlo. |
| upcoming sin featured | VÁLIDO: URL existe, pero no aparece en Home. | Marcarlo destacado si debe anunciarse en Home. |
| past todavía featured | VÁLIDO: continúa como principal, no histórico. | Transferir featured al anunciar el siguiente. |
| Filename inválido o duplicado | ERROR REAL: build falla con los nombres/regla. | Validar regex, longitud y unicidad. |
| Extensión .JPG | Puede ignorarse silenciosamente. | Usar extensión minúscula admitida. |
| Foto en subcarpeta | No se procesa. | Copiar al primer nivel. |
| Sexto evento | ERROR REAL: build falla por HOME_EVENT_LIMIT. | Detener alta hasta implementar archivo/ruta de eventos. |
| Carpeta vacía | VÁLIDO si aún no hay fotos: página PRÓXIMAMENTE. | No tratarla como error. |

## 11. Checklist obligatorio para Codex

### Si el usuario pide “crear un nuevo evento”

- [ ] Leer EVENTOS.md.
- [ ] Revisar número actual de eventos.
- [ ] Detenerse si añadirlo produciría más de 5.
- [ ] Revisar cuál es el featured actual.
- [ ] Confirmar el slug.
- [ ] Añadir events.ts.
- [ ] Añadir glob literal.
- [ ] Crear carpeta.
- [ ] NO crear página Astro individual.
- [ ] NO editar Events.astro.
- [ ] NO editar Hero.astro.
- [ ] Ejecutar npm run build.
- [ ] Confirmar exactamente un featured.
- [ ] Confirmar URL generada.
- [ ] Si no hay fotos, confirmar PRÓXIMAMENTE.
- [ ] Mostrar git diff/status y NO hacer commit salvo petición.

### Si el usuario pide “subir/agregar las fotos del evento”

- [ ] Leer EVENTOS.md.
- [ ] Confirmar slug y carpeta correcta.
- [ ] Comprobar extensiones.
- [ ] Comprobar filenames.
- [ ] Comprobar duplicados.
- [ ] Copiar fotos al primer nivel.
- [ ] NO registrar fotos individualmente.
- [ ] NO cambiar pricing.
- [ ] NO cambiar WhatsApp.
- [ ] NO cambiar storageKey.
- [ ] NO cambiar slug.
- [ ] Ejecutar npm run build.
- [ ] Confirmar número de fotos.
- [ ] Confirmar que ya no aparece PRÓXIMAMENTE.
- [ ] Confirmar selección/pricing/WhatsApp si el cambio lo amerita.
- [ ] Mostrar git diff/status y NO hacer commit salvo petición.

## 12. Comandos de validación

    npm run build
    git diff --check
    git status

Al cargar fotografías, comparar además el total detectado/renderizado en el build con la cantidad esperada. No se requiere tooling adicional para este flujo.
