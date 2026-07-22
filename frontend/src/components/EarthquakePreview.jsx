import useEarthquakes from '../hooks/useEarthquakes';
import { magColor, timeAgo } from '../lib/earthquakes';
import './Earthquakes.css';

export default function EarthquakePreview({ limit = 5 }) {
  const { events, loading, error } = useEarthquakes('ne');
  const items = events.slice(0, limit);

  if (loading && items.length === 0) {
    return <div className="earthquake-status">[ LOADING REGIONAL SEISMIC FEED... ]</div>;
  }

  if (error && items.length === 0) {
    return <div className="earthquake-status is-error">Feed offline: {error}</div>;
  }

  if (items.length === 0) {
    return <div className="earthquake-status">No recent events in Northeast India.</div>;
  }

  return (
    <div className="earthquake-preview-list">
      {items.map((event) => (
        <div key={event.id} className="earthquake-preview-row">
          <span className="earthquake-preview-mag mag-badge" style={{ backgroundColor: magColor(event.mag) }}>
            {event.mag != null ? event.mag.toFixed(1) : '—'}
          </span>
          <span className="earthquake-preview-place">{event.place}</span>
          <span className="earthquake-preview-time">{timeAgo(event.time)}</span>
        </div>
      ))}
    </div>
  );
}
