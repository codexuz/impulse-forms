import { useCallback } from 'react';
import { AlertCircle, Upload } from 'lucide-react';
import type { FormField as FormFieldType } from '../types/forms';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatUzPhoneInput, UZ_PHONE_PLACEHOLDER } from '@/lib/phoneMask';
import { cn } from '@/lib/utils';

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

  const id = `field-${field.id}`;
  const strVal = String(value ?? '');

  return (
    <div
      id={id}
      className={cn(
        'rounded-xl border bg-card/60 p-4 transition-colors sm:p-5',
        error ? 'border-destructive/40 bg-destructive/5' : 'border-primary/10 hover:border-primary/25'
      )}
    >
      <div className="space-y-3">
        <Label htmlFor={`${id}-control`} className="text-sm font-semibold leading-5 text-foreground">
          <span>{field.label}</span>
          {field.required && <span className="ml-1 text-primary">*</span>}
        </Label>

        {renderInput(field, `${id}-control`, strVal, value, handleChange, !!error)}

        {error && (
          <p className="flex items-start gap-2 text-sm leading-5 text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
      </div>
    </div>
  );
}

function renderInput(
  field: FormFieldType,
  id: string,
  strVal: string,
  value: unknown,
  onChange: (val: unknown) => void,
  invalid: boolean
) {
  const placeholder = field.placeholder || '';

  switch (field.type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'date':
    case 'time':
    case 'number': {
      const inputType = mapInputType(field.type);
      return (
        <Input
          id={id}
          type={inputType}
          inputMode={field.type === 'phone' ? 'tel' : field.type === 'number' ? 'numeric' : undefined}
          className="h-11 bg-white text-base sm:text-sm"
          placeholder={field.type === 'phone' ? UZ_PHONE_PLACEHOLDER : placeholder}
          value={strVal}
          aria-invalid={invalid}
          onChange={(e) => {
            if (field.type === 'phone') {
              onChange(formatUzPhoneInput(e.target.value));
              return;
            }

            onChange(inputType === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value);
          }}
        />
      );
    }

    case 'textarea':
      return (
        <Textarea
          id={id}
          className="min-h-28 resize-y bg-white text-base sm:text-sm"
          placeholder={placeholder}
          value={strVal}
          aria-invalid={invalid}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case 'select': {
      const options = field.options ?? [];
      return (
        <Select value={strVal || undefined} onValueChange={onChange}>
          <SelectTrigger id={id} className="h-11 w-full bg-white text-base sm:text-sm" aria-invalid={invalid}>
            <SelectValue placeholder={placeholder || 'Select an option'} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    case 'radio': {
      const options = field.options ?? [];
      return (
        <RadioGroup value={strVal} onValueChange={onChange} aria-invalid={invalid} className="gap-2">
          {options.map((opt) => {
            const optionId = `${id}-${opt.value}`;
            return (
              <Label
                key={opt.value}
                htmlFor={optionId}
                className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-input bg-white px-3 py-2 text-sm font-normal leading-5 transition-colors hover:border-primary/40 hover:bg-primary/5 has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/10"
              >
                <RadioGroupItem id={optionId} value={opt.value} />
                <span className="min-w-0 break-words">{opt.label}</span>
              </Label>
            );
          })}
        </RadioGroup>
      );
    }

    case 'checkbox': {
      const options = field.options ?? [];
      const selected = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div className="grid gap-2">
          {options.map((opt) => {
            const optionId = `${id}-${opt.value}`;
            const isChecked = selected.includes(opt.value);
            return (
              <Label
                key={opt.value}
                htmlFor={optionId}
                className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-input bg-white px-3 py-2 text-sm font-normal leading-5 transition-colors hover:border-primary/40 hover:bg-primary/5 has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/10"
              >
                <Checkbox
                  id={optionId}
                  checked={isChecked}
                  aria-invalid={invalid}
                  onCheckedChange={(checked) => {
                    const next = checked
                      ? [...selected, opt.value]
                      : selected.filter((v) => v !== opt.value);
                    onChange(next);
                  }}
                />
                <span className="min-w-0 break-words">{opt.label}</span>
              </Label>
            );
          })}
        </div>
      );
    }

    case 'file':
      return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            id={id}
            type="file"
            className="sr-only"
            aria-invalid={invalid}
            onChange={(e) => {
              const files = e.target.files;
              if (!files) return;
              onChange(files[0]);
            }}
          />
          <Button asChild variant="outline" className="h-11 w-full justify-center gap-2 sm:w-auto">
            <label htmlFor={id}>
              <Upload className="size-4" aria-hidden="true" />
              Choose file
            </label>
          </Button>
          {!!value && value instanceof File && (
            <span className="min-w-0 truncate text-sm text-muted-foreground">{value.name}</span>
          )}
        </div>
      );

    default:
      return (
        <Input
          id={id}
          type="text"
          className="h-11 bg-white text-base sm:text-sm"
          placeholder={placeholder}
          value={strVal}
          aria-invalid={invalid}
          onChange={(e) => onChange(e.target.value)}
        />
      );
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
