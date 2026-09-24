---
name: manage-event
description: Create or announce an event, change event data or status, transfer the featured event, or prepare the next event in Black Sheep Sport. Use for event registration and lifecycle changes; follow docs/operations/events.md as the operational source of truth.
---

# Manage an event

Use this procedure for event records and lifecycle changes. Read [docs/operations/events.md](../../../docs/operations/events.md) first; consult [docs/ARCHITECTURE.md](../../../docs/ARCHITECTURE.md) for technical ownership. Do not restate or override those sources.

## Before editing

1. Read `docs/operations/events.md`, `src/data/events.ts`, `src/pages/eventos/[slug].astro`, and `docs/ARCHITECTURE.md`.
2. Count current records, identify the sole `featured: true`, and check the current `HOME_EVENT_LIMIT` in `src/components/Events.astro`.
3. If a new event would exceed that limit, stop before editing and explain that the event archive/listing strategy must be implemented first. Never hide or remove old events to fit.
4. Ask only for missing required facts: public name, stable unique slug, ISO date (`YYYY-MM-DD`), location, intended status, and whether it should become featured. Do not infer event facts or lifecycle decisions.

## Apply the requested change

- For a new event, add one valid record to `src/data/events.ts` and a matching **literal** `import.meta.glob` entry in `src/pages/eventos/[slug].astro`; create `src/assets/events/<slug>/`. Zero photos is valid, but Git does not version empty directories. If the event will be committed before photos arrive, create the folder and keep a `README.md` marker there to version the empty directory. Never add a fake image to keep the directory.
- Never create `src/pages/eventos/<slug>.astro`; do not edit `Events.astro` or `Hero.astro` to register an event.
- Keep published slugs stable. If a requested change would alter one, stop and explain the URL and selection-key impact before proceeding.
- Keep exactly one event featured. Transfer the flag in the same edit when requested. `status` and `featured` are independent; status is manual and must not be inferred from today's date.
- Do not change shared pricing or WhatsApp settings as part of event registration.

## Validate and report

1. Run `npm run build` and confirm `/eventos/<slug>/` is generated for a new event.
2. Confirm exactly one featured event remains. If its photo folder is empty, confirm the generated page shows `PRÓXIMAMENTE`.
3. Run `git diff --check`, inspect `git diff`, and show `git status --short`; identify every changed file.
4. Report the outcome and any validation that could not be completed. Do not commit.

Never invent missing event data, delete historical events to evade the home limit, or commit unless explicitly asked.
