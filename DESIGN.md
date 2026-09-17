# Design

## Theme

Base clara, neutros fríos (sin grises cálidos, cremas ni beige). El negro es acento estructural, nunca fondo dominante. Volt (#CDFF3A) es el único color de marca: relleno con texto negro encima, o texto sobre fondo oscuro. Volt nunca es texto sobre blanco.

## Color

Estrategia: restrained. Fondo claro casi todo el tiempo, negro como estructura (headers, footer, bloques de contraste), volt como acento puntual de acción (CTAs, precios, estados activos).

- `--bg`: blanco/casi blanco, neutro frío (sin tinte cálido)
- `--ink`: negro no puro, tintado frío (nunca #000 plano)
- `--volt`: #CDFF3A — CTA, precios, acentos sobre negro
- `--surface`: gris frío muy claro para separación sutil, sin cards anidadas

Contraste: volt sobre negro y negro sobre volt cumplen AA; nunca volt sobre blanco.

## Typography

- Titulares: Archivo Expanded — autoalojada, woff2
- Cuerpo: Instrument Sans — autoalojada, woff2
- Máximo 3 pesos combinados entre ambas familias (peso del presupuesto de página)
- Sin Inter, sin fuentes de sistema

## Layout

Página única orientada a funnel, no a exploración: QR → fotos del evento → cómo comprar → precio → WhatsApp. Mobile-first estricto (casi 100% del tráfico). Sin cards anidadas. Secciones separadas por espacio y contraste de color (negro/claro), no por bordes o cajas.

## Components

- CTA primario: botón sólido volt con texto negro, lleva a WhatsApp
- CTA secundario: enlace a galería de Google Drive
- Precio: bloque simple, número grande, sin ícono
- Sin iconografía redondeada sobre titulares, sin emojis como iconos

## Motion

Sutil: opacidad + translate corto únicamente. Sin scroll-driven, sin GSAP, sin librerías de animación. Respeta `prefers-reduced-motion`.

## Assets

Fotografía real de eventos de CrossFit (en selección) — es la prueba de producto, tratarla como protagonista visual, no decorativa. Sin testimonios ni cifras de trayectoria (no hay material real todavía).

## Technical constraints

Astro puro, CSS propio con custom properties, sin Tailwind, sin librerías de UI. Deploy estático (subiendo `dist/` a SiteGround). Presupuesto: menos de 500 KB por página completa. Fuentes autoalojadas woff2.
