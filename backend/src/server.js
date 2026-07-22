import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contentRouter from "./routes/content.js";
import diagnoseRouter from "./routes/diagnose.js";
import leadsRouter from "./routes/leads.js";
import earthquakesRouter from "./routes/earthquakes.js";
import { seedContentIfEmpty } from "./services/content.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json({ limit: "15mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/content", contentRouter);
app.use("/api/diagnose", diagnoseRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/earthquakes", earthquakesRouter);

async function boot() {
  try {
    await seedContentIfEmpty();
  } catch (err) {
    console.warn("[boot] DB seed skipped — MariaDB may be offline:", err.message);
  }

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

boot();
