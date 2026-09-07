# Assamese locale (disabled)

Assamese is off (`ASSAMESE_ENABLED = false` in `frontend/src/lib/i18n.js`) until translations are human-reviewed.

Do not resume bulk MyMemory auto-translation in `build-assamese-content.mjs`.

**Recommended workflow when re-enabling:**

1. Translate UI chrome only via `ui.json` (~50 strings: nav, CTAs, forms).
2. Hand-write 3–5 money pages (home hero, Guwahati hubs, contact).
3. Keep technical article/service bodies in English, or use a professional translator with a glossary (waterproofing, retrofitting, NDT, inspection).
4. QA with a native Assamese reader in Guwahati before setting `ASSAMESE_ENABLED = true` and `ASSAMESE_ENABLED=1 npm run release`.
