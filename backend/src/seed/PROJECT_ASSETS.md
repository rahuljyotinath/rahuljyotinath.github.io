# Project photo checklist

Drop photos into `frontend/public/images/projects/{slug}/` before release.

## Per project

| File | Purpose |
|------|---------|
| `hero.webp` | Card cover + detail hero (1200px wide) |
| `01.webp` | Wide site / building context |
| `02.webp` | Defect close-up (crack, leak, spalling) |
| `03.webp` | Work in progress |
| `04.webp` | Finished result (optional) |

## Fields to confirm in `extensions/additional-services.json`

- `title`, `location`, `year`, `category`
- `scope` — one-line summary
- `challenge` — problem statement
- `solution` — methods used
- `body` — 2–4 paragraphs (problem → diagnosis → work → outcome)
- `outcome` — measurable result
- `services` — slugs: `waterproofing`, `ndt`, `retrofitting`, etc.

## Workflow

1. Add JPEG/PNG to `projects/{slug}/` (any names)
2. Run `node frontend/scripts/generate-project-placeholders.mjs` (or `npm run images` after adding sources)
3. Update JSON in `additional-services.json`
4. `node backend/src/seed/build-prd-content.mjs`
5. `npm run release` → import SQL → `npm run upload`

Replace placeholder images (generated from hero) with real site photos when available.
