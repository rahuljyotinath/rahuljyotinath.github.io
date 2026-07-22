import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { GUWAHATI_CENTER, magColor, magRadius } from '../lib/earthquakes';
import useUserLocation from '../hooks/useUserLocation';
import './EarthquakeMap.css';

const LEAFLET_CSS_ID = 'leaflet-deferred-css';
const LEAFLET_CSS_HREF = '/leaflet/leaflet.css';

function loadLeafletCss() {
  if (document.getElementById(LEAFLET_CSS_ID)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.id = LEAFLET_CSS_ID;
    link.rel = 'stylesheet';
    link.href = LEAFLET_CSS_HREF;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error('Failed to load map styles'));
    document.head.appendChild(link);
  });
}

const LOCAL_ZOOM = 8;

function getMapCenter(userCoords) {
  return userCoords || GUWAHATI_CENTER;
}

function MapController({ events, selectedId, userCoords, recenterKey }) {
  const map = useMap();

  useEffect(() => {
    if (selectedId) {
      const event = events.find((e) => e.id === selectedId);
      if (event) {
        map.setView([event.lat, event.lon], LOCAL_ZOOM, { animate: true });
        return;
      }
    }

    map.setView(getMapCenter(userCoords), LOCAL_ZOOM, { animate: true });
  }, [events, selectedId, userCoords, recenterKey, map]);

  return null;
}

export default function EarthquakeMap({
  events,
  selectedId,
  onSelect,
  locationNote,
  compact = false,
}) {
  const { coords, loading, denied, refresh } = useUserLocation();
  const [recenterTick, setRecenterTick] = useState(0);
  const [mapReady, setMapReady] = useState(false);
  const center = getMapCenter(coords);

  useEffect(() => {
    let active = true;
    loadLeafletCss()
      .then(() => {
        if (active) setMapReady(true);
      })
      .catch(() => {
        if (active) setMapReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleLocation = () => {
    onSelect?.(null);
    refresh();
    setRecenterTick((t) => t + 1);
  };

  let statusNote = locationNote || null;
  if (loading) {
    statusNote = 'Locating you…';
  } else if (denied) {
    statusNote = 'Location denied. Map centered on Guwahati.';
  } else if (coords) {
    statusNote = locationNote || 'Centered on your location.';
  } else {
    statusNote = 'Map centered on Guwahati. Tap “Use my location” to recenter.';
  }

  const locationLabel = coords ? 'Recenter' : 'Use my location';

  if (!mapReady) {
    return <div className="earthquake-map-placeholder">Loading map…</div>;
  }

  return (
    <div className={`earthquake-map-wrap${compact ? ' earthquake-map-wrap--compact' : ''}`}>
      <button
        type="button"
        className="earthquake-map-recenter"
        onClick={handleLocation}
        disabled={loading}
      >
        {locationLabel}
      </button>
      {statusNote && <div className="earthquake-map-location-note">{statusNote}</div>}
      <MapContainer center={center} zoom={LOCAL_ZOOM} className={`earthquake-map${compact ? ' earthquake-map--compact' : ''}`} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController
          events={events}
          selectedId={selectedId}
          userCoords={coords}
          recenterKey={recenterTick}
        />
        {coords && (
          <CircleMarker
            center={coords}
            radius={7}
            pathOptions={{
              color: '#fff',
              fillColor: '#4a9eff',
              fillOpacity: 0.9,
              weight: 2,
            }}
          >
            <Popup>You are here</Popup>
          </CircleMarker>
        )}
        {events.map((event) => {
          const selected = event.id === selectedId;
          const radius = magRadius(event.mag) * (selected ? 1.25 : 1);
          return (
            <CircleMarker
              key={event.id}
              center={[event.lat, event.lon]}
              radius={radius}
              pathOptions={{
                color: selected ? '#fff' : magColor(event.mag),
                fillColor: magColor(event.mag),
                fillOpacity: selected ? 0.95 : 0.75,
                weight: selected ? 2.5 : 1.5,
              }}
              eventHandlers={{
                click: () => onSelect?.(event.id),
              }}
            >
              <Popup>
                <strong>M {event.mag ?? '—'}</strong>
                <br />
                {event.place}
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
