import { useState, useCallback } from 'react';
import type { VueformElement } from '../types/forms';
import FormField from './FormField';
import './FormRenderer.css';

interface FormRendererProps {
  schema: Record<string, VueformElement>;
  loading?: boolean;
  onSubmit: (data: Record<string, unknown>) => void;
}

export default function FormRenderer({ schema, loading, onSubmit }: FormRendererProps) {
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const defaults: Record<string, unknown> = {};
    for (const [key, el] of Object.entries(schema)) {
      if (el.default !== undefined) {
        defaults[key] = el.default;
      } else if (el.type === 'checkbox' || el.type === 'toggle') {
        defaults[key] = false;
      } else if (el.type === 'checkboxgroup' || el.type === 'multiselect') {
        defaults[key] = [];
      } else {
        defaults[key] = '';
      }
    }
    return defaults;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback((name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (prev[name]) {
        const next = { ...prev };
        delete next[name];
        return next;
      }
      return prev;
    });
  }, []);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    for (const [key, el] of Object.entries(schema)) {
      const rules = el.rules;
      if (!rules) continue;

      const ruleList = typeof rules === 'string' ? rules.split('|') : rules;
      const val = values[key];

      for (const rule of ruleList) {
        const trimmed = rule.trim();

        if (trimmed === 'required') {
          if (val === '' || val === undefined || val === null || (Array.isArray(val) && val.length === 0)) {
            newErrors[key] = `${el.label || key} is required`;
            break;
          }
        }

        if (trimmed === 'email') {
          if (val && typeof val === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            newErrors[key] = 'Please enter a valid email address';
            break;
          }
        }

        if (trimmed.startsWith('min:')) {
          const min = parseInt(trimmed.split(':')[1], 10);
          if (typeof val === 'string' && val.length < min) {
            newErrors[key] = `Must be at least ${min} characters`;
            break;
          }
        }

        if (trimmed.startsWith('max:')) {
          const max = parseInt(trimmed.split(':')[1], 10);
          if (typeof val === 'string' && val.length > max) {
            newErrors[key] = `Must be no more than ${max} characters`;
            break;
          }
        }

        if (trimmed === 'numeric') {
          if (val && isNaN(Number(val))) {
            newErrors[key] = 'Must be a number';
            break;
          }
        }

        if (trimmed === 'url') {
          if (val && typeof val === 'string') {
            try {
              new URL(val);
            } catch {
              newErrors[key] = 'Please enter a valid URL';
              break;
            }
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        document.getElementById(`field-${firstErrorKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    onSubmit(values);
  }

  const entries = Object.entries(schema).filter(
    ([, el]) => el.type !== 'hidden' || el.type === 'hidden'
  );

  return (
    <form className="form-renderer" onSubmit={handleSubmit} noValidate>
      <div className="form-fields">
        {entries.map(([name, element]) => (
          <FormField
            key={name}
            name={name}
            element={element}
            value={values[name]}
            onChange={handleChange}
            error={errors[name]}
          />
        ))}
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="form-submit-btn"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="form-submit-spinner" />
              Submitting…
            </>
          ) : (
            <>
              Submit
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
