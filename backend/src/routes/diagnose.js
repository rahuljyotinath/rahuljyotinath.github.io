import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { query } from "../db/pool.js";
import { analyzeImage } from "../services/diagnose.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `scan-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image uploads accepted"));
  },
});

const router = Router();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    let imagePath = null;

    if (req.file) {
      imagePath = req.file.path;
    } else if (req.body?.image && typeof req.body.image === "string") {
      const base64 = req.body.image.replace(/^data:image\/\w+;base64,/, "");
      const buf = Buffer.from(base64, "base64");
      imagePath = path.join(uploadsDir, `scan-${Date.now()}.jpg`);
      fs.writeFileSync(imagePath, buf);
    } else {
      return res.status(400).json({ error: "No image provided" });
    }

    const evaluation = analyzeImage(imagePath);
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    try {
      await query(
        `INSERT INTO diagnostic_submissions
         (image_path, severity, issue_type, analysis, is_ambiguous, client_ip)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          imagePath,
          evaluation.severity,
          evaluation.issueType,
          evaluation.analysis,
          evaluation.isAmbiguous ? 1 : 0,
          String(clientIp || ""),
        ]
      );
    } catch (dbErr) {
      console.warn("[diagnose] DB insert skipped:", dbErr.message);
    }

    res.json({
      issueType: evaluation.issueType,
      severity: evaluation.severity,
      analysis: evaluation.analysis,
      isAmbiguous: evaluation.isAmbiguous,
    });
  } catch (err) {
    console.error("[diagnose]", err);
    res.status(500).json({ error: "Diagnostic processing failed", isAmbiguous: true });
  }
});

export default router;
