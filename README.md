# Black Sheep Sport

Landing estática de Black Sheep Sport, división de Black Sheep Studio, para que atletas encuentren las fotos de sus eventos y completen la compra por WhatsApp.

## Flujo

QR → Home → página del evento → galería seleccionable → WhatsApp → pago → entrega

Para crear eventos, anunciar una galería vacía o cargar fotografías, seguir [EVENTOS.md](./EVENTOS.md), la fuente operativa de verdad.

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

- EVENTOS.md — procedimiento operativo para eventos y fotografías.
- HANDOFF.md — contexto amplio del proyecto.
