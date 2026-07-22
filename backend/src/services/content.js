import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { query } from "../db/pool.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function seedContentIfEmpty() {
  const rows = await query("SELECT id FROM site_content WHERE slug = ? LIMIT 1", ["main"]);
  if (rows.length > 0) return;

  const seedPath = path.join(__dirname, "../seed/content.json");
  const payload = JSON.parse(fs.readFileSync(seedPath, "utf8"));
  await query("INSERT INTO site_content (slug, payload) VALUES (?, ?)", [
    "main",
    JSON.stringify(payload),
  ]);
  console.log("[seed] site_content populated from content.json");
}

export async function getSiteContent() {
  const rows = await query("SELECT payload FROM site_content WHERE slug = ? LIMIT 1", ["main"]);
  if (!rows.length) return null;
  const payload = rows[0].payload;
  return typeof payload === "string" ? JSON.parse(payload) : payload;
}
