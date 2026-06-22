export type FieldType =
  | 'text'
  | 'phone'
  | 'email'
  | 'number'
  | 'textarea'
  | 'date'
  | 'time'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'file';

export interface FieldOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: FieldOption[];
}

export interface FormSchema {
  fields: FormField[];
}

export interface Form {
  id: string;
  title: string;
  schema: FormSchema;
  /** When true, submitting a response requires a verified SMS code. */
  smsVerification: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FormResponse {
  id: string;
  form_id: string;
  answers: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
