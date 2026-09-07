import LocalizedLink from './LocalizedLink';
import { formatTime, magColor } from '../lib/earthquakes';
import './Earthquakes.css';

export default function EarthquakeDetail({ event }) {
  if (!event) {
    return (
      <div className="earthquake-detail">
        <p className="earthquake-detail-empty">
          Select an event from the list or map to view magnitude, depth, coordinates, and USGS details.
        </p>
      </div>
    );
  }

  return (
    <div className="earthquake-detail">
      <div className="earthquake-detail-title">
        <span className="mag-badge mag-badge--lg" style={{ backgroundColor: magColor(event.mag) }}>
          M {event.mag != null ? event.mag.toFixed(1) : '—'} {event.magType}
        </span>
      </div>
      <p className="earthquake-detail-place">{event.place}</p>
      <div className="earthquake-detail-grid">
        <div className="earthquake-detail-item">
          <span>Origin time</span>
          {formatTime(event.time)}
        </div>
        <div className="earthquake-detail-item">
          <span>Depth</span>
          {event.depth != null ? `${event.depth.toFixed(1)} km` : '—'}
        </div>
        <div className="earthquake-detail-item">
          <span>Coordinates</span>
          {event.lat?.toFixed(3)}°, {event.lon?.toFixed(3)}°
        </div>
        <div className="earthquake-detail-item">
          <span>Tsunami</span>
          {event.tsunami ? 'Flagged' : 'No'}
        </div>
      </div>
      {event.alert && (
        <div className="earthquake-detail-item">
          <span>Alert level</span>
          {event.alert.toUpperCase()}
        </div>
      )}
      <div className="earthquake-detail-actions">
        {event.url && (
          <a href={event.url} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
            USGS event page <span className="arrow">→</span>
          </a>
        )}
        <LocalizedLink to="/assessment" className="btn btn--primary">
          Get structural assessment
        </LocalizedLink>
      </div>
    </div>
  );
}
