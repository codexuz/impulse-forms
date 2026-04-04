import { useCallback } from 'react';
import type { FormField as FormFieldType } from '../types/forms';
import './FormField.css';

interface FormFieldProps {
  field: FormFieldType;
  value: unknown;
  onChange: (id: string, value: unknown) => void;
  error?: string;
}

export default function FormField({ field, value, onChange, error }: FormFieldProps) {
  const handleChange = useCallback(
    (val: unknown) => onChange(field.id, val),
    [field.id, onChange]
  );

  const placeholder = field.placeholder || '';
  const id = `field-${field.id}`;
  const strVal = String(value ?? '');

  return (
    <div className={`form-field ${error ? 'form-field-error' : ''}`}>
      <label className="form-field-label" htmlFor={id}>
        {field.label}
        {field.required && <span className="form-field-required">*</span>}
      </label>

      {renderInput(field, id, strVal, value, placeholder, handleChange)}

      {error && <p className="form-field-error-msg">{error}</p>}
    </div>
  );
}

function renderInput(
  field: FormFieldType,
  id: string,
  strVal: string,
  value: unknown,
  placeholder: string,
  onChange: (val: unknown) => void
) {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'date':
    case 'time':
    case 'number': {
      const inputType = mapInputType(field.type);
      return (
        <input
          id={id}
          type={inputType}
          className="form-input"
          placeholder={placeholder}
          value={strVal}
          onChange={(e) =>
            onChange(inputType === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)
          }
        />
      );
    }

    case 'textarea': {
      return (
        <textarea
          id={id}
          className="form-input form-textarea"
          placeholder={placeholder}
          value={strVal}
          rows={4}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    }

    case 'select': {
      const options = field.options ?? [];
      return (
        <select
          id={id}
          className="form-input form-select"
          value={strVal}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{placeholder || 'Select…'}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    case 'radio': {
      const options = field.options ?? [];
      return (
        <div className="form-radio-group">
          {options.map((opt) => (
            <label key={opt.value} className="form-radio-label">
              <input
                type="radio"
                className="form-radio"
                name={field.id}
                value={opt.value}
                checked={strVal === opt.value}
                onChange={() => onChange(opt.value)}
              />
              <span className="form-radio-custom" />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      );
    }

    case 'checkbox': {
      return (
        <label className="form-checkbox-label form-checkbox-single">
          <input
            id={id}
            type="checkbox"
            className="form-checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="form-checkbox-custom" />
        </label>
      );
    }

    case 'file': {
      return (
        <div className="form-file-wrapper">
          <input
            id={id}
            type="file"
            className="form-file-input"
            onChange={(e) => {
              const files = e.target.files;
              if (!files) return;
              onChange(files[0]);
            }}
          />
          <label htmlFor={id} className="form-file-button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Choose file
          </label>
          {!!value && value instanceof File && (
            <span className="form-file-name">{value.name}</span>
          )}
        </div>
      );
    }

    default: {
      return (
        <input
          id={id}
          type="text"
          className="form-input"
          placeholder={placeholder}
          value={strVal}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    }
  }
}

function mapInputType(type: string): string {
  const map: Record<string, string> = {
    text: 'text',
    email: 'email',
    phone: 'tel',
    number: 'number',
    date: 'date',
    time: 'time',
  };
  return map[type] || 'text';
}
