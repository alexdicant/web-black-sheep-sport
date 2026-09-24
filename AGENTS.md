# AGENTS.md

## Project

Black Sheep Sport is an MVP for sports photography. It uses a static Astro site with its own gallery; photo selection and purchases are coordinated through WhatsApp.

## Core rules

- Current code and configuration are authoritative for implementation facts.
- Do not invent commercial data, events, content, or statuses.
- Preserve the existing architecture unless an explicit change is requested.
- Keep changes small and focused.
- Do not make `Muestra/` or `design/` runtime dependencies.
- Do not treat generated or local files as source files.
- Do not create individual Astro event pages unless an explicit architectural change is requested.
- Do not commit, push, merge, deploy, or perform destructive deletion without the corresponding explicit request.

## Sources of truth

- Durable context and decisions: [MEMORY.md](./MEMORY.md)
- Product: [docs/PRODUCT.md](./docs/PRODUCT.md)
- Design: [docs/DESIGN.md](./docs/DESIGN.md)
- Architecture: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- Event model and invariants: [docs/operations/events.md](./docs/operations/events.md)
- Deployment and hosting model: [docs/operations/deployment.md](./docs/operations/deployment.md)
- Mutable data: code under `src/data/`
- Implementation: current code and configuration

Review `MEMORY.md` when starting substantial work, changing architecture, touching an established decision, or unsure whether a restriction is deliberate. Small mechanical tasks should use the relevant task routing without loading every document.

## Task routing

- Create, modify, announce, or change an event's status or featured state: use `manage-event` and consult the event operations source.
- Add, upload, replace, or publish event photos: use `publish-event-photos` and consult the event operations source.
- Prepare a release, merge, deploy, perform post-deploy QA, or clean up a branch: use `release-site` and consult the deployment source.
- Visual changes: read `docs/DESIGN.md` and the relevant architecture guidance.
- Product, copy, or scope changes: read `docs/PRODUCT.md`.
- Structural or technical changes: read `docs/ARCHITECTURE.md`; also read `MEMORY.md` if durable constraints may be affected.

## Validation

- Review `git status` and `git diff` for the work.
- Run `git diff --check` for versionable changes.
- Run `npm run build` when changing code or configuration, or when the relevant skill requires it.
- Do not claim visual, browser, or production QA unless it was actually performed.
- When starting the Astro dev server, use `astro dev --background`; manage it with `astro dev status`, `astro dev logs`, and `astro dev stop`.

## Git safety

- Do not commit without an explicit request; do not push without an explicit request or intent.
- Never force-push or run `git reset --hard`.
- Before deleting a branch with unique commits, show and verify those commits.
- Do not accidentally include temporary files or audit artifacts.
