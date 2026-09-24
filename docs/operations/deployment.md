# Modelo de publicación y hosting

## Artefacto estático

El proyecto es un sitio Astro estático: `astro.config.mjs` configura el dominio y las barras finales, sin un adaptador de servidor. `npm run build` ejecuta `astro build` y genera `dist/`. Según la documentación actual del proyecto, `dist/` es el artefacto de publicación. Astro copia el contenido de `public/` a la salida conservando sus rutas y nombres; por ello `public/.htaccess` forma parte del artefacto.

## Configuración versionada en `.htaccess`

`public/.htaccess` contiene estas reglas para servidores compatibles con Apache:

- Redirect 301 de la URL histórica `/eventos/happy-wood/` a `/eventos/happy-wod/`.
- Canonicalización de HTTP y `www.sheepsport.com` hacia HTTPS sin `www`.
- Uso de `/404.html` para recursos no encontrados.
- Headers de seguridad: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, CSP `frame-ancestors 'none'`, `Permissions-Policy` que deshabilita cámara, micrófono y geolocalización, y HSTS con `max-age=86400`.
- Caché de un año con `immutable` para assets de `/_astro/` y de 30 días para solicitudes bajo `/fonts/`.

Estas son reglas versionadas en Git. Que el archivo esté dentro de `dist/` no verifica que producción lo sirva o lo interprete; su efecto depende del proveedor, servidor, módulos y configuración real del hosting. No se puede verificar ese comportamiento desde este repositorio.

## Límites de lo verificable

El README documenta SiteGround como hosting previsto y `sheepsport.com` como dominio definitivo. El repositorio permite verificar la configuración de salida y las reglas escritas, pero no confirma el proveedor actualmente conectado, el despliegue activo, la aplicación de `.htaccess`, los headers/redirects reales, ni el método o proceso externo de publicación. Esos detalles son externos/no comprobables desde Git y deben validarse contra el entorno real.

## Procedimiento

Para preparar/integrar/desplegar/validar un release: usar la skill [release-site](../../.agents/skills/release-site/SKILL.md).
