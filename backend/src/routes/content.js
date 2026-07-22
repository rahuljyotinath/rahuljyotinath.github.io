import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getSiteContent } from "../services/content.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.join(__dirname, "../seed/content.json");

const router = Router();

function loadSeedFallback() {
  return JSON.parse(fs.readFileSync(seedPath, "utf8"));
}

router.get("/", async (_req, res) => {
  try {
    const content = await getSiteContent();
    if (content) return res.json(content);
    res.json(loadSeedFallback());
  } catch (err) {
    console.warn("[content] DB unavailable, serving seed file:", err.message);
    try {
      res.json(loadSeedFallback());
    } catch (readErr) {
      console.error("[content]", readErr);
      res.status(500).json({ error: "Failed to load content" });
    }
  }
});

export default router;
