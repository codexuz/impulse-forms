import { useState, useCallback, useMemo } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import type { FormSchema } from '../types/forms';
import FormField from './FormField';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { isCompleteUzPhone } from '@/lib/phoneMask';

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
      defaults[field.id] = field.type === 'checkbox' ? [] : '';
    }
    return defaults;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback((id: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  function validate(): Record<string, string> {
    const newErrors: Record<string, string> = {};

    for (const field of fields) {
      const val = values[field.id];

      if (
        field.required &&
        (val === '' || val === undefined || val === null || (Array.isArray(val) && val.length === 0))
      ) {
        newErrors[field.id] = `${field.label} is required`;
        continue;
      }

      if (field.type === 'phone' && val && typeof val === 'string' && !isCompleteUzPhone(val)) {
        newErrors[field.id] = 'Please enter a complete phone number';
      }

      if (field.type === 'email' && val && typeof val === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        newErrors[field.id] = 'Please enter a valid email address';
      }
    }

    return newErrors;
  }

  function buildLabeledAnswers(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const field of fields) {
      const raw = values[field.id];
      const label = field.label;

      if (field.options && field.options.length > 0) {
        if (Array.isArray(raw)) {
          result[label] = (raw as string[]).map(
            (v) => field.options!.find((o) => o.value === v)?.label ?? v
          );
        } else {
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
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstErrorId = Object.keys(nextErrors)[0];
      document.getElementById(`field-${firstErrorId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    onSubmit(buildLabeledAnswers());
  }

  const filledCount = useMemo(() => {
    return fields.filter((field) => {
      const val = values[field.id];
      if (Array.isArray(val)) return val.length > 0;
      return val !== '' && val !== undefined && val !== null;
    }).length;
  }, [values, fields]);

  const progressPct = fields.length > 0 ? Math.round((filledCount / fields.length) * 100) : 0;

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="font-medium text-foreground">Progress</span>
          <span className="text-muted-foreground">
            {filledCount}/{fields.length} complete
          </span>
        </div>
        <Progress value={progressPct} className="h-2 bg-primary/10" />
      </div>

      <Separator />

      <div className="space-y-4">
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

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          size="lg"
          className="h-11 w-full gap-2 rounded-xl bg-primary px-6 text-base shadow-lg shadow-primary/20 hover:bg-primary/90 sm:w-auto"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Submitting...
            </>
          ) : (
            <>
              Submit
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
