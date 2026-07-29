/**
 * Fetches Northeast India earthquake events from USGS for SEO pre-render.
 */

const USGS_BASE = 'https://earthquake.usgs.gov';
const NE_DAYS = 30;
export const MIN_EARTHQUAKE_LIST = 5;

export function buildUsgsNeUrl() {
  const end = new Date().toISOString();
  const start = new Date(Date.now() - NE_DAYS * 24 * 3600 * 1000).toISOString();
  const params = new URLSearchParams({
    format: 'geojson',
    starttime: start,
    endtime: end,
    minlatitude: '22.0',
    maxlatitude: '29.8',
    minlongitude: '88.0',
    maxlongitude: '97.8',
    minmagnitude: '2.5',
    orderby: 'time',
  });
  return `${USGS_BASE}/fdsnws/event/1/query?${params.toString()}`;
}

function buildUsgsGlobalUrl() {
  return `${USGS_BASE}/earthquakes/feed/v1.0/summary/all_day.geojson`;
}

function normalizeFeature(feature) {
  const props = feature.properties || {};
  const coords = feature.geometry?.coordinates || [];
  const lon = coords[0];
  const lat = coords[1];
  if (lat == null || lon == null) return null;

  return {
    id: feature.id || props.code || `${props.time}-${lat}-${lon}`,
    mag: props.mag ?? null,
    magType: props.magType || '—',
    place: props.place || 'Unknown location',
    time: props.time,
    depth: coords[2] ?? null,
    lat,
    lon,
    url: props.url || null,
  };
}

export function mergeEventsToMinimum(primary, supplemental, minCount) {
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

async function fetchUsgsEvents(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': '91SkylineWorks/1.0 (seo-prerender; contact@91skylineworks.com)',
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`USGS HTTP ${res.status}`);
  }

  const data = await res.json();
  return (data.features || [])
    .map(normalizeFeature)
    .filter(Boolean)
    .sort((a, b) => (b.time || 0) - (a.time || 0));
}

export function formatEventTime(ms) {
  if (!ms) return '—';
  return new Date(ms).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
    timeZoneName: 'short',
  });
}

export async function fetchNeEarthquakes({ limit = 20, minCount = MIN_EARTHQUAKE_LIST } = {}) {
  let events = await fetchUsgsEvents(buildUsgsNeUrl());

  if (minCount > 0 && events.length < minCount) {
    try {
      const globalEvents = await fetchUsgsEvents(buildUsgsGlobalUrl());
      events = mergeEventsToMinimum(events, globalEvents, minCount);
    } catch {
      // keep regional events only
    }
  }

  return {
    events: events.slice(0, limit),
    fetchedAt: Date.now(),
    source: 'USGS',
  };
}
