import { useCallback } from 'react';
import type { VueformElement } from '../types/forms';
import './FormField.css';

interface FormFieldProps {
  name: string;
  element: VueformElement;
  value: unknown;
  onChange: (name: string, value: unknown) => void;
  error?: string;
}

export default function FormField({ name, element, value, onChange, error }: FormFieldProps) {
  const handleChange = useCallback(
    (val: unknown) => onChange(name, val),
    [name, onChange]
  );

  const isRequired = checkRequired(element.rules);
  const label = element.label || element.floating || name;
  const placeholder = element.placeholder || '';
  const description = element.description || '';

  // Resolve field type
  const type = element.type || 'text';

  // Static / HTML content
  if (type === 'static') {
    return (
      <div className="form-field">
        {element.content && (
          <div
            className="form-field-static"
            dangerouslySetInnerHTML={{ __html: element.content }}
          />
        )}
      </div>
    );
  }

  // Hidden field
  if (type === 'hidden') {
    return <input type="hidden" name={name} value={String(value ?? element.default ?? '')} />;
  }

  // Group / nested schema
  if (type === 'group' || type === 'object') {
    return (
      <fieldset className="form-field-group">
        {label && <legend className="form-field-group-legend">{label}</legend>}
        {element.schema &&
          Object.entries(element.schema).map(([childName, childEl]) => (
            <FormField
              key={childName}
              name={`${name}.${childName}`}
              element={childEl}
              value={(value as Record<string, unknown>)?.[childName] ?? ''}
              onChange={(fullName, val) => {
                const current = (value as Record<string, unknown>) || {};
                const childKey = fullName.split('.').pop()!;
                handleChange({ ...current, [childKey]: val });
              }}
              error={undefined}
            />
          ))}
      </fieldset>
    );
  }

  return (
    <div className={`form-field ${error ? 'form-field-error' : ''}`}>
      <label className="form-field-label" htmlFor={`field-${name}`}>
        {label}
        {isRequired && <span className="form-field-required">*</span>}
      </label>

      {description && <p className="form-field-description">{description}</p>}

      {renderInput(type, name, element, value, placeholder, handleChange)}

      {error && <p className="form-field-error-msg">{error}</p>}
    </div>
  );
}

function renderInput(
  type: string,
  name: string,
  element: VueformElement,
  value: unknown,
  placeholder: string,
  onChange: (val: unknown) => void
) {
  const id = `field-${name}`;
  const strVal = String(value ?? '');

  switch (type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'password':
    case 'url':
    case 'number':
    case 'date':
    case 'time':
    case 'datetime-local':
    case 'color': {
      const inputType = element.inputType || mapInputType(type);
      return (
        <input
          id={id}
          type={inputType}
          className="form-input"
          placeholder={placeholder}
          value={strVal}
          min={element.min}
          max={element.max}
          step={element.step}
          disabled={element.disabled}
          readOnly={element.readonly}
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
          rows={element.rows ?? 4}
          disabled={element.disabled}
          readOnly={element.readonly}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    }

    case 'select':
    case 'multiselect': {
      const options = normalizeOptions(element.items);
      const isMulti = type === 'multiselect';

      if (isMulti) {
        const selected = Array.isArray(value) ? (value as string[]) : [];
        return (
          <div className="form-checkbox-group">
            {options.map((opt) => (
              <label key={opt.value} className="form-checkbox-label">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={selected.includes(opt.value)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...selected, opt.value]
                      : selected.filter((v) => v !== opt.value);
                    onChange(next);
                  }}
                />
                <span className="form-checkbox-custom" />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );
      }

      return (
        <select
          id={id}
          className="form-input form-select"
          value={strVal}
          disabled={element.disabled}
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

    case 'radio':
    case 'radiogroup': {
      const options = normalizeOptions(element.items);
      return (
        <div className="form-radio-group">
          {options.map((opt) => (
            <label key={opt.value} className="form-radio-label">
              <input
                type="radio"
                className="form-radio"
                name={name}
                value={opt.value}
                checked={strVal === opt.value}
                disabled={element.disabled}
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
      // Single checkbox (toggle-like)
      return (
        <label className="form-checkbox-label form-checkbox-single">
          <input
            id={id}
            type="checkbox"
            className="form-checkbox"
            checked={Boolean(value)}
            disabled={element.disabled}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="form-checkbox-custom" />
          <span>{element.text || ''}</span>
        </label>
      );
    }

    case 'checkboxgroup': {
      const options = normalizeOptions(element.items);
      const selected = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div className="form-checkbox-group">
          {options.map((opt) => (
            <label key={opt.value} className="form-checkbox-label">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={selected.includes(opt.value)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...selected, opt.value]
                    : selected.filter((v) => v !== opt.value);
                  onChange(next);
                }}
              />
              <span className="form-checkbox-custom" />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      );
    }

    case 'toggle': {
      return (
        <label className="form-toggle-label">
          <input
            id={id}
            type="checkbox"
            className="form-toggle-input"
            checked={Boolean(value)}
            disabled={element.disabled}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="form-toggle-track">
            <span className="form-toggle-thumb" />
          </span>
          {element.text && <span className="form-toggle-text">{element.text}</span>}
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
            accept={element.accept}
            multiple={element.multiple}
            disabled={element.disabled}
            onChange={(e) => {
              const files = e.target.files;
              if (!files) return;
              onChange(element.multiple ? Array.from(files) : files[0]);
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
          {!!value && (
            <span className="form-file-name">
              {value instanceof File ? value.name : Array.isArray(value) ? `${value.length} files` : ''}
            </span>
          )}
        </div>
      );
    }

    default: {
      // Fallback to text input for unknown types
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
    password: 'password',
    url: 'url',
    number: 'number',
    date: 'date',
    time: 'time',
    'datetime-local': 'datetime-local',
    color: 'color',
  };
  return map[type] || 'text';
}

function normalizeOptions(
  items?: Record<string, string> | string[] | { value: string; label: string }[]
): { value: string; label: string }[] {
  if (!items) return [];
  if (Array.isArray(items)) {
    return items.map((item) =>
      typeof item === 'string'
        ? { value: item, label: item }
        : { value: item.value, label: item.label }
    );
  }
  return Object.entries(items).map(([value, label]) => ({ value, label }));
}

function checkRequired(rules?: string | string[]): boolean {
  if (!rules) return false;
  if (typeof rules === 'string') return rules.includes('required');
  return rules.some((r) => r.includes('required'));
}
