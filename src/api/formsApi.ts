import type { Form, FormResponse } from '../types/forms';

const API_BASE = 'https://backend.impulselc.uz/api';

export async function getForm(id: string): Promise<Form> {
  const res = await fetch(`${API_BASE}/forms/${id}`);
  if (!res.ok) {
    throw new Error(`Form not found (${res.status})`);
  }
  return res.json();
}

export async function submitFormResponse(
  formId: string,
  answers: Record<string, unknown>
): Promise<FormResponse> {
  const res = await fetch(`${API_BASE}/forms/responses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ form_id: formId, answers }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || `Submission failed (${res.status})`);
  }
  return res.json();
}
