import { useEffect } from 'react';
import './FormSuccessModal.css';

export default function FormSuccessModal({ open, message, onClose }) {
  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKey);
    const timer = window.setTimeout(onClose, 8000);

    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(timer);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="form-success-backdrop" onClick={onClose} role="presentation">
      <div
        className="form-success-modal panel"
        role="dialog"
        aria-modal="true"
        aria-live="polite"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="form-success-icon" aria-hidden="true">✓</div>
        <p className="form-success-message">{message}</p>
        <button type="button" className="btn btn--ghost form-success-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
