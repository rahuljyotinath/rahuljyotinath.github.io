import { useId, useRef } from 'react';
import './MediaUploadField.css';

const ACCEPT = 'image/*,video/*';

export default function MediaUploadField({ files, onChange, label = 'Photos or videos (optional)' }) {
  const inputRef = useRef(null);
  const inputId = useId();

  const handleChange = (event) => {
    onChange(Array.from(event.target.files || []));
  };

  const removeFile = (index) => {
    onChange(files.filter((_, i) => i !== index));
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="field media-upload-field">
      <label htmlFor={inputId}>{label}</label>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPT}
        multiple
        onChange={handleChange}
      />
      <p className="media-upload-hint mono">Up to 5 files · images or video · 25 MB each</p>
      {files.length > 0 && (
        <ul className="media-upload-list">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`}>
              <span>{file.name}</span>
              <button type="button" onClick={() => removeFile(index)} aria-label={`Remove ${file.name}`}>
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
