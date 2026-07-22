import { useEffect, useState } from 'react';
import './TelemetryWidget.css';

export default function TelemetryWidget({ telemetry, embedded = false }) {
  const [tick, setTick] = useState(0);
  const base = telemetry?.baseAcceleration ?? 0.039;

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  const accel = (base + Math.sin(tick) * 0.003).toFixed(3);

  const lines = [
    `MONITOR STATION: ${telemetry?.station || 'GHY-01 (SILPUKHURI)'} // SENSOR ARRAYS: STATUS ACTIVE`,
    `CURRENT ACCELERATION VECTOR: ${accel}g // STEADY-STATE FAULT INTERFACE COMPRESSION`,
    `ALERT STATUS: ${telemetry?.alertStatus || 'PROFILE 5 EXHAUSTION THREAT INDEX REGISTERED'}`,
    `FORENSIC ENGINE NOTE: ${telemetry?.engineNote || ''}`,
  ];

  const terminal = (
    <div className="telemetry-terminal panel">
      <div className="telemetry-header mono">REGIONAL TECTONIC TELEMETRY // LIVE FEED</div>
      <pre className="telemetry-output mono" aria-live="polite">
        {lines.join('\n')}
      </pre>
    </div>
  );

  if (embedded) {
    return (
      <div className="telemetry-widget telemetry-widget--embedded" id="telemetry">
        <div className="wrap">{terminal}</div>
      </div>
    );
  }

  return (
    <section className="telemetry-widget telemetry-widget--standalone" id="telemetry">
      <div className="wrap">{terminal}</div>
    </section>
  );
}
