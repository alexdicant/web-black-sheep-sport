# Product

## Register

brand

## Platform

web

## Users

Un deportista que acaba de participar en un evento (running, ciclismo, CrossFit) en Mérida, Venezuela. Llega escaneando un QR impreso (tarjeta o franela del fotógrafo) durante o justo después de competir: cansado, de pie, móvil en mano, datos móviles posiblemente lentos. No conoce la marca y no busca un servicio — busca sus fotos.

## Product Purpose

Black Sheep Sport (división de Black Sheep Studio) fotografía a participantes de eventos deportivos y les vende sus fotos directamente. La web es el puente entre el QR y la compra: en 30 segundos el visitante debe entender dónde están las fotos de su evento, cómo funciona el proceso de compra, cuánto cuesta, y qué hacer cuando ya eligió. Éxito = el visitante llega a las galerías en Google Drive y cierra la compra por WhatsApp sin fricción ni confusión.

## Positioning

La fotografía es la prueba, no el copy: la página existe para entregar al atleta sus fotos lo más rápido posible, no para venderle una marca.

## Brand Personality

Directa, breve, segura, joven, clara. No técnica, no épica, no publicitaria. La emoción la aporta la fotografía y el logro del atleta, no el texto.

## Anti-references

Gradientes morado/azul; cards dentro de cards; tiles con icono redondeado sobre cada titular; Inter o fuentes de sistema; negro puro #000 o grises sin tintar; emojis como iconos; grises cálidos, cremas, beige; testimonios o cifras de trayectoria inventadas (no hay material real); animaciones scroll-driven o con GSAP.

## Design Principles

- Rendimiento primero: menos de 500 KB de página completa, tráfico móvil con datos lentos, sin librerías de UI.
- Tres preguntas en 30 segundos: dónde están mis fotos, cómo compro, cuánto cuesta — cada sección responde una.
- La foto es el producto: la fotografía de CrossFit real es la única prueba de calidad; nunca decorativa, siempre protagonista.
- El negro es acento estructural, no fondo dominante; volt (#CDFF3A) es relleno o texto sobre oscuro, nunca texto sobre blanco.
- El cierre ocurre fuera de la web: cada pantalla empuja hacia WhatsApp o la galería de Drive, no hacia un carrito propio.

## Accessibility & Inclusion

Contenido solo en español, sin necesidad de i18n. Optimizar para conexión móvil lenta (peso, lazy loading de fotos). Contraste AA mínimo, especialmente volt sobre negro/blanco. Animaciones sutiles y respetuosas de `prefers-reduced-motion` (solo opacidad y translate corto, nunca scroll-driven).
