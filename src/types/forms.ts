export interface Form {
  id: string;
  title: string;
  schema: Record<string, VueformElement>;
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

export interface VueformElement {
  type: string;
  label?: string;
  placeholder?: string;
  description?: string;
  info?: string;
  default?: unknown;
  rules?: string[] | string;
  items?: Record<string, string> | string[] | { value: string; label: string }[];
  columns?: number | { container: number; label: number; wrapper: number };
  conditions?: unknown[];
  disabled?: boolean;
  readonly?: boolean;
  floating?: string;
  // Text-specific
  inputType?: string;
  // Textarea-specific
  rows?: number;
  // Select-specific
  search?: boolean;
  native?: boolean;
  // Number-specific
  min?: number;
  max?: number;
  step?: number;
  // File-specific
  accept?: string;
  multiple?: boolean;
  // Date-specific
  format?: string;
  // Checkbox group / Radio group
  radioName?: string;
  text?: string;
  // Static content
  content?: string;
  tag?: string;
  // Group
  schema?: Record<string, VueformElement>;
  // Generic
  [key: string]: unknown;
}
