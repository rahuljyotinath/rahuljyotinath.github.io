import { useEffect, useId, useRef, useState } from 'react';
import './FieldSelect.css';

export default function FieldSelect({
  id,
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select…',
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const rootRef = useRef(null);
  const listId = useId();

  const selected = options.find((o) => o.value === value);
  const display = selected?.label || placeholder;

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (!open) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlight((i) => Math.min(i + 1, options.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlight((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && highlight >= 0) {
        e.preventDefault();
        onChange(options[highlight].value);
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, highlight, options, onChange]);

  useEffect(() => {
    if (open) {
      const idx = options.findIndex((o) => o.value === value);
      setHighlight(idx >= 0 ? idx : 0);
    }
  }, [open, options, value]);

  const choose = (optValue) => {
    onChange(optValue);
    setOpen(false);
  };

  return (
    <div className="field field-select" ref={rootRef}>
      <label htmlFor={id}>{label}</label>
      <button
        type="button"
        id={id}
        className={`field-select-trigger${open ? ' is-open' : ''}${!selected ? ' is-placeholder' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{display}</span>
        <span className="field-select-chevron" aria-hidden="true" />
      </button>
      {open && options.length > 0 && (
        <ul id={listId} className="field-select-menu" role="listbox" aria-labelledby={id}>
          {options.map((opt, i) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              className={`field-select-option${value === opt.value ? ' is-selected' : ''}${highlight === i ? ' is-highlighted' : ''}`}
              onMouseEnter={() => setHighlight(i)}
              onClick={() => choose(opt.value)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
