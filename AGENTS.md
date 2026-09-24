## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

## Eventos y fotografías

Para tareas sobre eventos, leer [docs/operations/events.md](./docs/operations/events.md) como contrato. Para crear/modificar registros, usar la skill `manage-event`; para publicar/cambiar fotografías, usar `publish-event-photos`. No crear páginas individuales de evento sin una petición explícita de cambio arquitectónico. Para releases, usar `release-site` y consultar su documentación operativa.

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
