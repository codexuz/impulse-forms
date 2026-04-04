import { useEffect, useState, useCallback } from 'react';
import type { Form } from '../types/forms';
import { getForm, submitFormResponse } from '../api/formsApi';
import FormRenderer from '../components/FormRenderer';
import SuccessScreen from '../components/SuccessScreen';
import Spinner from '../components/Spinner';
import NotFound from '../components/NotFound';
import './FormPage.css';

type PageState = 'loading' | 'ready' | 'submitted' | 'not-found';

interface FormPageProps {
  id?: string;
}

export default function FormPage({ id }: FormPageProps) {
  const [state, setState] = useState<PageState>('loading');
  const [form, setForm] = useState<Form | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!id) {
      setState('not-found');
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const data = await getForm(id!);
        if (!cancelled) {
          setForm(data);
          setState('ready');
          // Update page title
          document.title = `${data.title} — Impulse Forms`;
        }
      } catch {
        if (!cancelled) setState('not-found');
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  const handleSubmit = useCallback(
    async (answers: Record<string, unknown>) => {
      if (!id) return;
      setSubmitting(true);
      setErrorMsg('');
      try {
        await submitFormResponse(id, answers);
        setState('submitted');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Submission failed. Please try again.';
        setErrorMsg(msg);
      } finally {
        setSubmitting(false);
      }
    },
    [id]
  );

  const handleReset = useCallback(() => {
    setState('loading');
    setErrorMsg('');
    // Reload the form
    if (id) {
      getForm(id).then((data) => {
        setForm(data);
        setState('ready');
      }).catch(() => setState('not-found'));
    }
  }, [id]);

  return (
    <div className="form-page">
      {/* Decorative background elements */}
      <div className="form-page-bg">
        <div className="form-page-bg-orb form-page-bg-orb-1" />
        <div className="form-page-bg-orb form-page-bg-orb-2" />
        <div className="form-page-bg-orb form-page-bg-orb-3" />
      </div>

      <div className="form-page-content">
        {/* Brand */}
        <div className="form-page-brand">
          <div className="form-page-brand-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <span className="form-page-brand-text">Impulse Forms</span>
        </div>

        {state === 'loading' && (
          <div className="form-page-card animate-fade-in">
            <Spinner text="Loading form…" />
          </div>
        )}

        {state === 'not-found' && (
          <div className="form-page-card animate-fade-in">
            <NotFound />
          </div>
        )}

        {state === 'submitted' && (
          <div className="form-page-card animate-fade-in">
            <SuccessScreen onReset={handleReset} />
          </div>
        )}

        {state === 'ready' && form && (
          <div className="form-page-card animate-fade-in">
            <div className="form-page-header">
              <h1 className="form-page-title">{form.title}</h1>
              <div className="form-page-title-line" />
            </div>

            {errorMsg && (
              <div className="form-page-error animate-shake">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            <FormRenderer
              schema={form.schema}
              loading={submitting}
              onSubmit={handleSubmit}
            />
          </div>
        )}

        {/* Footer */}
        <p className="form-page-footer">
          Powered by <strong>Impulse</strong>
        </p>
      </div>
    </div>
  );
}
