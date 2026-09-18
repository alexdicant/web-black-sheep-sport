# Black Sheep Sport

Landing estática de Black Sheep Sport, división de Black Sheep Studio, para que atletas encuentren las fotos de sus eventos y completen la compra por WhatsApp.

## Flujo

QR → landing → evento → galería en Google Drive → selección por códigos → WhatsApp → pago → entrega

## Stack

- Astro
- CSS propio
- `astro:assets`
- Cero JavaScript cliente
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
  pages/          # /, /terminos y 404
  styles/         # tokens CSS
public/           # fuentes, favicon, robots.txt y sitemap.xml
```

## Deploy

Ejecuta `npm run build` y publica el contenido generado en `dist/`. El hosting previsto es SiteGround y el dominio definitivo es `sheepsport.com`.

## Pendiente para lanzamiento

- URL real de Drive del evento.
- Número real de WhatsApp.
- Nombre y fecha definitivos del evento piloto.
- Confirmación final de fotografías, si sigue pendiente.
- Imagen OG definitiva (por ahora no se publica `og:image`).
