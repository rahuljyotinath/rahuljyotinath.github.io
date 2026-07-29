#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RELEASE="$ROOT/release"

echo "[release] merging PRD content..."
node "$ROOT/backend/src/seed/generate-extensions.mjs"
node "$ROOT/backend/src/seed/build-prd-content.mjs"

echo "[release] optimizing images..."
cd "$ROOT/frontend"
node scripts/optimize-images.mjs

echo "[release] building frontend..."
cd "$ROOT/frontend"
npm run build

echo "[release] generating SEO files..."
node "$ROOT/deploy/generate-seo.mjs"

echo "[release] generating seed.sql..."
node "$ROOT/deploy/generate-seed.mjs"

echo "[release] generating patch-content-main.sql..."
node "$ROOT/deploy/generate-patch-content.mjs"

echo "[release] packing release/ folder..."
rm -rf "$RELEASE"
mkdir -p "$RELEASE/api" "$RELEASE/uploads" "$RELEASE/api/cache"

cp -R "$ROOT/frontend/dist/"* "$RELEASE/"
cp "$ROOT/deploy/.htaccess" "$RELEASE/"

GOOGLE_VERIFY="$ROOT/google36523b1b196ee09e.html"
if [[ ! -f "$GOOGLE_VERIFY" ]]; then
  echo "[release] ERROR: google36523b1b196ee09e.html not found at project root"
  exit 1
fi
cp "$GOOGLE_VERIFY" "$RELEASE/"

cp "$ROOT/deploy/uploads/.htaccess" "$RELEASE/uploads/"
cp "$ROOT/deploy/api-cache/.htaccess" "$RELEASE/api/cache/"
cp -R "$ROOT/deploy/php/"* "$RELEASE/api/"
if [[ ! -f "$RELEASE/api/config.php" ]]; then
  echo "[release] WARNING: deploy/php/config.php missing — copy config.example.php to config.php locally before release"
fi
cp "$ROOT/backend/src/seed/content.json" "$RELEASE/api/seed-content.json"
cp "$ROOT/deploy/php/config.example.php" "$RELEASE/api/"

echo "[release] computing changed files..."
node "$ROOT/deploy/write-upload-list.mjs"

echo ""
echo "[release] Done. Upload changed files only:"
echo "  cat deploy/files-to-upload.txt"
echo "  npm run upload"
echo ""
echo "Full release folder (reference):"
echo "  $RELEASE/"
echo "  → MilesWeb public_html/"
echo ""
echo "Database (separate — do NOT upload to public_html):"
echo "  Option A: php api/import-content.php on server (recommended)"
echo "  Option B: Import deploy/seed.sql via phpMyAdmin"
echo "  Existing DB: run deploy/migrate-content-longtext.sql first if payload is JSON type"
echo ""
echo "Then on server:"
echo "  1. api/config.php is included from deploy/php/config.php (keep deploy/php/config.php on your Mac)"
echo "  2. Ensure uploads/ is writable (755 or 775)"
