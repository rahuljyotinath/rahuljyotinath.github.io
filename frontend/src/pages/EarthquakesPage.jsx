import { useOutletContext } from 'react-router-dom';
import SectionHead from '../components/SectionHead';
import TelemetryWidget from '../components/TelemetryWidget';
import EarthquakeFeed from '../components/EarthquakeFeed';
import '../components/Earthquakes.css';
import usePageTitle from '../hooks/usePageTitle';

export default function EarthquakesPage() {
  const { content } = useOutletContext();
  const copy = content.earthquakes || {};
  const telemetry = content.telemetry || {};
  usePageTitle('Live Seismic Activity — Guwahati');

  const bridgeNote =
    copy.bridgeNote ||
    [copy.subhead, telemetry.engineNote].filter(Boolean).join(' ');

  return (
    <>
      <section style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <SectionHead
            eyebrow={copy.eyebrow || 'Live seismic activity'}
            headline={copy.headline || 'Earthquakes in Northeast India.'}
          />
          {bridgeNote && (
            <p className="earthquakes-bridge-note">{bridgeNote}</p>
          )}
        </div>
      </section>
      <TelemetryWidget telemetry={telemetry} embedded />
      <EarthquakeFeed copy={copy} />
    </>
  );
}
