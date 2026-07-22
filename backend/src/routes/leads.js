import { Router } from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { query } from "../db/pool.js";
import { sendLeadEmail } from "../lib/mail.js";

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024, files: 5 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video uploads are allowed"));
    }
  },
});

function parseMetadata(raw) {
  if (!raw) return null;
  if (typeof raw === "object") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

router.post("/", upload.array("attachments", 5), async (req, res) => {
  try {
    const body = req.body || {};
    const { name, phone, email, locality, source = "contact", message } = body;
    const metadata = parseMetadata(body.metadata);

    const trimmedName = name?.trim();
    const trimmedPhone = phone?.trim() || "";
    const trimmedEmail = email?.trim() || "";

    if (!trimmedName) {
      return res.status(400).json({ error: "Name required" });
    }

    if (!trimmedPhone && !trimmedEmail) {
      return res.status(400).json({ error: "Phone or email required" });
    }

    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const attachments = (req.files || []).map((file) => `/uploads/${file.filename}`);

    const msg =
      (typeof metadata === "object" && metadata?.message) ||
      message ||
      "";
    const metadataPayload = {
      ...(typeof metadata === "object" && metadata ? metadata : {}),
      email: trimmedEmail || null,
      message: msg?.trim() || null,
    };
    if (attachments.length) {
      metadataPayload.attachments = attachments;
    }

    const dbPhone = trimmedPhone || trimmedEmail || "not-provided";

    try {
      await query(
        `INSERT INTO leads (name, phone, locality, source, metadata) VALUES (?, ?, ?, ?, ?)`,
        [
          trimmedName,
          dbPhone,
          locality?.trim() || null,
          source,
          JSON.stringify(metadataPayload),
        ]
      );
    } catch (dbErr) {
      console.warn("[leads] DB insert skipped:", dbErr.message);
    }

    let emailSent = false;
    try {
      emailSent = await sendLeadEmail({
        name: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail,
        locality: locality?.trim() || "",
        source,
        message: msg?.trim() || "",
        attachments,
      });
    } catch (mailErr) {
      console.warn("[leads] email failed:", mailErr.message);
    }

    res.json({
      ok: true,
      message: "Thank you — we received your inquiry.",
      emailSent,
    });
  } catch (err) {
    console.error("[leads]", err);
    res.status(500).json({ error: err.message || "Lead submission failed" });
  }
});

export default router;
