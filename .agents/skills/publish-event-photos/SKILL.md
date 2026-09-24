---
name: publish-event-photos
description: Add, upload, replace, or publish event photographs and update a Black Sheep Sport event gallery. Use for photo batches; follow docs/operations/events.md and the existing asset-discovery code.
---

# Publish event photos

Read [docs/operations/events.md](../../../docs/operations/events.md) first. Consult [docs/ARCHITECTURE.md](../../../docs/ARCHITECTURE.md) and the referenced implementation before changing assets.

## Before changing files

1. Identify the exact event slug from the user or ask if ambiguous. Confirm it exists in `src/data/events.ts`.
2. Inspect `src/assets/events/<slug>/` and the matching literal glob in `src/pages/eventos/[slug].astro`.
3. Record the current photo count and the expected final count if supplied. If the event or glob is missing, stop and report the prerequisite; do not register an event implicitly.
4. Read `src/utils/eventPhotos.ts` for filename validation and `src/components/EventGallery.astro` for the empty-gallery behavior.
5. Confirm the supplied files are watermarked previews suitable for the web gallery, following `docs/operations/events.md`. If the user supplied unwatermarked final files for a gallery that requires protected previews, stop and report the discrepancy; do not alter the images or add a watermark automatically.

## Apply the batch

- Place supported lowercase `.webp`, `.jpg`, `.jpeg`, `.png`, or `.avif` files directly in `src/assets/events/<slug>/`; no subdirectories. Filenames must produce unique, case-insensitive codes of 1–40 letters, digits, `_` or `-` (excluding the extension).
- Copy/add only what the request specifies. “Upload” or “add” does not authorize removing existing photos. For replacement or deletion, proceed only when the user clearly requested that destructive operation; preserve files outside the specified batch.
- Do not change the event slug, pricing, WhatsApp data, or register photos individually. A normal photo batch does not require edits to `EventGallery.astro`.

## Validate and report

1. Run `npm run build`; fix or report filename/glob errors.
2. Confirm the detected photo count matches the expected final count when one was provided. For a non-empty gallery, verify the event no longer renders `PRÓXIMAMENTE` (inspect the build output/page when possible).
3. Run `git diff --check`; inspect `git status --short` and report added, modified, and deleted files.
4. Do not commit.

Do not guess the event, expected count, or replacement scope. Never perform a bulk deletion based on an ambiguous request.
