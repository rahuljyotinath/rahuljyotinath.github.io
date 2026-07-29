import { magColor, timeAgo } from '../lib/earthquakes';
import './Earthquakes.css';

export default function EarthquakeList({ events, selectedId, onSelect, backfilled = false }) {
  return (
    <div className="earthquake-list">
      <div className="earthquake-list-header">Recent events</div>
      {backfilled && (
        <p className="earthquake-list-note">Few regional tremors this month — including recent global events.</p>
      )}
      <div className="earthquake-list-body">
        {events.length === 0 ? (
          <div className="earthquake-status">No events in this window.</div>
        ) : (
          events.map((event) => (
            <button
              key={event.id}
              type="button"
              className={`earthquake-row${selectedId === event.id ? ' is-selected' : ''}`}
              onClick={() => onSelect(event.id)}
            >
              <span className="earthquake-mag mag-badge" style={{ backgroundColor: magColor(event.mag) }}>
                {event.mag != null ? event.mag.toFixed(1) : '—'}
              </span>
              <span className="earthquake-place">{event.place}</span>
              <span className="earthquake-time">{timeAgo(event.time)}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
