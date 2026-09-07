import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getSiteContent } from "../services/content.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.join(__dirname, "../seed/content.json");
const seedAsPath = path.join(__dirname, "../seed/content.as.json");

const router = Router();

function loadSeedFallback(lang) {
  const file = lang === "as" ? seedAsPath : seedPath;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

router.get("/", async (req, res) => {
  const lang = req.query.lang === "as" ? "as" : "en";
  const slug = lang === "as" ? "main-as" : "main";

  try {
    const content = await getSiteContent(slug);
    if (content) return res.json(content);
    res.json(loadSeedFallback(lang));
  } catch (err) {
    console.warn("[content] DB unavailable, serving seed file:", err.message);
    try {
      res.json(loadSeedFallback(lang));
    } catch (readErr) {
      console.error("[content]", readErr);
      res.status(500).json({ error: "Failed to load content" });
    }
  }
});

export default router;
