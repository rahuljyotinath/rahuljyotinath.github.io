import './StickyTelemetryFooter.css';

export default function StickyTelemetryFooter({ content }) {
  const status = content?.footer?.status || 'SYSTEM STATUS: REGIONAL ENGINEERING MATRICES DISPATCHABLE';
  const label = content?.footer?.emergencyLabel || 'EXECUTE EMERGENCY SITE ASSESSMENT DIRECT DIAL';
  const phone = content?.contact?.phone || '+91 60038 79490';
  const tel = phone.replace(/[^0-9+]/g, '');

  return (
    <footer className="sticky-telemetry-footer" aria-live="polite">
      <div className="wrap sticky-footer-inner">
        <div className="sticky-footer-status">
          <span className="pulse-node" aria-hidden="true" />
          <span className="mono">[ {status} ]</span>
        </div>
        <a className="sticky-footer-cta mono" href={`tel:${tel}`}>
          ⚠️ {label} ({phone})
        </a>
      </div>
    </footer>
  );
}
