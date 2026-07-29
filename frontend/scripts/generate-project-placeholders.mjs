#!/usr/bin/env node
/**
 * Generate project hero/gallery WebP placeholders from hero source until real photos are added.
 * Skips files that already exist (non-placeholder custom uploads).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, '../public/images');
const projectsDir = path.join(imagesDir, 'projects');

const PROJECT_SLUGS = [
  'beltola-residential-tower',
  'chandmari-apartment-complex',
  'hpcl-regional-facility',
  'dispur-government-office',
  'industrial-warehouse-paltan-bazar',
  'gs-road-commercial-block',
  'six-mile-school-campus',
  'zoo-road-hotel-terrace',
  'noonmati-housing-retrofit',
  'bhangagarh-hospital-basement',
];

const GALLERY_NAMES = ['hero', '01', '02', '03'];

function findHeroSource() {
  const candidates = ['hero.webp', 'hero.jpg', 'hero.png'].map((n) => path.join(imagesDir, n));
  return candidates.find((p) => fs.existsSync(p));
}

async function writeWebp(input, output, width, cropTop = 0) {
  if (fs.existsSync(output)) return false;

  const meta = await sharp(input).metadata();
  const cropHeight = Math.min(meta.height || width, Math.round((meta.width || width) * 0.65));
  const top = Math.min(cropTop, Math.max(0, (meta.height || cropHeight) - cropHeight));

  await sharp(input)
    .rotate()
    .extract({
      left: 0,
      top,
      width: meta.width || width,
      height: cropHeight,
    })
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(output);

  return true;
}

async function main() {
  const source = findHeroSource();
  if (!source) {
    console.warn('[projects] no hero source — skipping placeholders');
    return;
  }

  fs.mkdirSync(projectsDir, { recursive: true });
  let created = 0;

  for (const slug of PROJECT_SLUGS) {
    const dir = path.join(projectsDir, slug);
    fs.mkdirSync(dir, { recursive: true });

    for (let i = 0; i < GALLERY_NAMES.length; i += 1) {
      const name = GALLERY_NAMES[i];
      const out = path.join(dir, `${name}.webp`);
      const cropTop = i * 80;
      if (await writeWebp(source, out, 1200, cropTop)) {
        created += 1;
        console.log(`[projects] ${slug}/${name}.webp`);
      }
    }
  }

  console.log(`[projects] done — ${created} file(s) created`);
}

await main();
