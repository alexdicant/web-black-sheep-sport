# Black Sheep Sport

Landing estática de Black Sheep Sport, división de Black Sheep Studio, para que atletas encuentren las fotos de sus eventos y completen la compra por WhatsApp.

## Flujo

QR → Home → página propia del evento → galería seleccionable → orientación de precio → WhatsApp para coordinar la compra

El contrato de eventos y fotografías está en [docs/operations/events.md](./docs/operations/events.md); los procedimientos están en las skills `manage-event` y `publish-event-photos`.

## Stack

- Astro
- CSS propio
- `astro:assets`
- JavaScript cliente acotado a selección, galería y compra por WhatsApp
- Fuentes WOFF2 autoalojadas
- Deploy estático

## Requisitos

- Node.js `>=22.12.0`

## Comandos

```sh
npm install
npm run dev
npm run build
npm run preview
```

## Estructura

```text
src/
  assets/photos/  # fotografías fuente
  components/     # secciones de la landing
  layouts/        # Base.astro y metadatos globales
  pages/          # páginas estáticas y ruta dinámica de eventos
  styles/         # tokens CSS
public/           # fuentes, favicon, robots.txt y sitemap.xml
```

## Deploy

Ejecuta `npm run build` y publica el contenido generado en `dist/`. El hosting previsto es SiteGround y el dominio definitivo es `sheepsport.com`.

## Documentación

- [MEMORY.md](./MEMORY.md) — decisiones durables y restricciones.
- [docs/PRODUCT.md](./docs/PRODUCT.md) — producto y principios del MVP.
- [docs/DESIGN.md](./docs/DESIGN.md) — identidad y principios visuales.
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — arquitectura y responsabilidades técnicas.
- [docs/operations/events.md](./docs/operations/events.md) — contrato del modelo de eventos y fotografías.
- [docs/operations/deployment.md](./docs/operations/deployment.md) — modelo de publicación y hosting.
