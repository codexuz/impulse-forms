import { useState, useCallback, useMemo } from 'react';
import type { FormSchema } from '../types/forms';
import FormField from './FormField';
import './FormRenderer.css';

interface FormRendererProps {
  schema: FormSchema;
  loading?: boolean;
  onSubmit: (data: Record<string, unknown>) => void;
}

export default function FormRenderer({ schema, loading, onSubmit }: FormRendererProps) {
  const fields = schema.fields;

  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const defaults: Record<string, unknown> = {};
    for (const field of fields) {
      if (field.type === 'checkbox') {
        defaults[field.id] = [];
      } else {
        defaults[field.id] = '';
      }
    }
    return defaults;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback((id: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => {
      if (prev[id]) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return prev;
    });
  }, []);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    for (const field of fields) {
      if (!field.required) continue;

      const val = values[field.id];

      if (val === '' || val === undefined || val === null || (Array.isArray(val) && val.length === 0)) {
        newErrors[field.id] = `${field.label} is required`;
      }

      if (field.type === 'email' && val && typeof val === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        newErrors[field.id] = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function buildLabeledAnswers(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const field of fields) {
      const raw = values[field.id];
      const label = field.label;

      if (field.options && field.options.length > 0) {
        if (Array.isArray(raw)) {
          // checkbox: map each selected value to its option label
          result[label] = (raw as string[]).map(
            (v) => field.options!.find((o) => o.value === v)?.label ?? v
          );
        } else {
          // select / radio: single value → option label
          result[label] = field.options.find((o) => o.value === raw)?.label ?? raw;
        }
      } else {
        result[label] = raw;
      }
    }
    return result;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      const firstErrorId = Object.keys(errors)[0];
      if (firstErrorId) {
        document.getElementById(`field-${firstErrorId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    onSubmit(buildLabeledAnswers());
  }

  const filledCount = useMemo(() => {
    return fields.filter((f) => {
      const val = values[f.id];
      if (Array.isArray(val)) return val.length > 0;
      return val !== '' && val !== undefined && val !== null;
    }).length;
  }, [values, fields]);

  const progressPct = fields.length > 0 ? Math.round((filledCount / fields.length) * 100) : 0;

  return (
    <form className="form-renderer" onSubmit={handleSubmit} noValidate>
      <div className="form-progress">
        <div className="form-progress-bar">
          <div className="form-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <span className="form-progress-text">{filledCount}/{fields.length}</span>
      </div>

      <div className="form-fields">
        {fields.map((field) => (
          <FormField
            key={field.id}
            field={field}
            value={values[field.id]}
            onChange={handleChange}
            error={errors[field.id]}
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
