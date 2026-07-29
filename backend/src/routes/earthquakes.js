import { Router } from "express";

const router = Router();

const NE_BBOX = {
  minLat: 22.0,
  maxLat: 29.8,
  minLon: 88.0,
  maxLon: 97.8,
};

const NE_DAYS = 30;
const MAX_MIN = 20;

const cache = new Map();
const TTL_MS = 5 * 60 * 1000;

function buildUsgsUrl(scope) {
  const base = "https://earthquake.usgs.gov";
  if (scope === "global") {
    return `${base}/earthquakes/feed/v1.0/summary/all_day.geojson`;
  }
  if (scope === "significant") {
    return `${base}/earthquakes/feed/v1.0/summary/significant_month.geojson`;
  }

  const end = new Date().toISOString();
  const start = new Date(Date.now() - NE_DAYS * 24 * 3600 * 1000).toISOString();
  const params = new URLSearchParams({
    format: "geojson",
    starttime: start,
    endtime: end,
    minlatitude: String(NE_BBOX.minLat),
    maxlatitude: String(NE_BBOX.maxLat),
    minlongitude: String(NE_BBOX.minLon),
    maxlongitude: String(NE_BBOX.maxLon),
    minmagnitude: "2.5",
    orderby: "time",
  });
  return `${base}/fdsnws/event/1/query?${params.toString()}`;
}

function normalizeFeature(feature) {
  const props = feature.properties || {};
  const coords = feature.geometry?.coordinates || [];
  if (coords.length < 2) return null;

  const [lon, lat, depth] = coords;
  return {
    id: feature.id || props.code || `${props.time}-${lat}-${lon}`,
    mag: props.mag ?? null,
    magType: props.magType || "—",
    place: props.place || "Unknown location",
    time: props.time,
    updated: props.updated,
    depth: depth ?? null,
    lat,
    lon,
    url: props.url || null,
    tsunami: props.tsunami === 1,
    alert: props.alert || null,
    sig: props.sig ?? null,
    status: props.status || null,
    type: props.type || "earthquake",
  };
}

function mergeEventsToMinimum(primary, supplemental, minCount) {
  const seen = new Set(primary.map((e) => e.id));
  const merged = [...primary];
  for (const event of supplemental) {
    if (merged.length >= minCount) break;
    if (!seen.has(event.id)) {
      merged.push(event);
      seen.add(event.id);
    }
  }
  return merged.sort((a, b) => (b.time || 0) - (a.time || 0));
}

async function fetchScopeEvents(scope) {
  const cached = cache.get(scope);
  if (cached && Date.now() - cached.fetchedAt < TTL_MS) {
    return cached;
  }

  const url = buildUsgsUrl(scope);
  const response = await fetch(url, {
    headers: {
      "User-Agent": "91SkylineWorks/1.0 (seismic-feed; contact@91skylineworks.com)",
    },
  });

  if (!response.ok) {
    if (cached) return { ...cached, stale: true };
    throw new Error("USGS feed unavailable");
  }

  const data = await response.json();
  const events = (data.features || [])
    .map(normalizeFeature)
    .filter(Boolean)
    .sort((a, b) => (b.time || 0) - (a.time || 0));

  const payload = {
    events,
    fetchedAt: Date.now(),
    source: "USGS",
    scope,
  };

  cache.set(scope, payload);
  return payload;
}

async function applyMinBackfill(payload, min) {
  if (min <= 0 || payload.scope !== "ne" || payload.events.length >= min) {
    return { ...payload, backfilled: false };
  }

  const before = payload.events.length;
  let globalPayload;
  try {
    globalPayload = await fetchScopeEvents("global");
  } catch {
    return { ...payload, backfilled: false };
  }

  const events = mergeEventsToMinimum(payload.events, globalPayload.events, min);
  return {
    ...payload,
    events,
    backfilled: events.length > before,
  };
}

router.get("/", async (req, res) => {
  const scope = req.query.scope || "ne";
  const allowed = ["ne", "global", "significant"];
  if (!allowed.includes(scope)) {
    return res.status(400).json({ error: "Invalid scope" });
  }

  const min = Math.min(Math.max(parseInt(req.query.min, 10) || 0, 0), MAX_MIN);

  try {
    const payload = await fetchScopeEvents(scope);
    const result = await applyMinBackfill(payload, min);
    res.json(result);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

export default router;
