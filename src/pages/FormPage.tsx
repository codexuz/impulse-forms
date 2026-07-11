import { useEffect, useState, useCallback } from 'react';
import { AlertCircle, FileText } from 'lucide-react';
import type { Form } from '../types/forms';
import { getForm, submitFormResponse } from '../api/formsApi';
import FormRenderer from '../components/FormRenderer';
import SmsGate from '../components/SmsGate';
import SuccessScreen from '../components/SuccessScreen';
import Spinner from '../components/Spinner';
import NotFound from '../components/NotFound';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type PageState = 'loading' | 'ready' | 'submitted' | 'not-found';

interface FormPageProps {
  id?: string;
}

export default function FormPage({ id }: FormPageProps) {
  const [state, setState] = useState<PageState>('loading');
  const [form, setForm] = useState<Form | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [verification, setVerification] = useState<{ phone: string; code: string } | null>(null);

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
          document.title = `${data.title} - Impulse Forms`;
        }
      } catch {
        if (!cancelled) setState('not-found');
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = useCallback(
    async (answers: Record<string, unknown>) => {
      if (!id) return;
      setSubmitting(true);
      setErrorMsg('');
      try {
        await submitFormResponse(id, answers, verification ?? undefined);
        setState('submitted');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Submission failed. Please try again.';
        setErrorMsg(msg);
      } finally {
        setSubmitting(false);
      }
    },
    [id, verification]
  );

  const handleVerified = useCallback((phone: string, code: string) => {
    setVerification({ phone, code });
  }, []);

  const handleReset = useCallback(() => {
    setState('loading');
    setErrorMsg('');
    setVerification(null);
    if (id) {
      getForm(id)
        .then((data) => {
          setForm(data);
          setState('ready');
        })
        .catch(() => setState('not-found'));
    }
  }, [id]);

  return (
    <main className="relative flex min-h-dvh items-start justify-center overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.22),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.18),_transparent_34%),linear-gradient(145deg,_#f8fbff_0%,_#edf6ff_54%,_#ffffff_100%)] px-3 py-4 sm:px-6 sm:py-8 lg:items-center">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="pointer-events-none absolute right-[-14rem] top-[-14rem] h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-12rem] left-[-12rem] h-96 w-96 rounded-full bg-sky-300/20 blur-3xl" />

      <div className="relative w-full max-w-2xl">
        <div className="mb-4 flex items-center justify-center gap-3 sm:mb-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <FileText className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none text-foreground">Impulse Forms</p>
            <p className="mt-1 text-xs text-muted-foreground">Secure response collection</p>
          </div>
        </div>

        <Card className="border-primary/10 bg-white/[0.92] shadow-2xl shadow-blue-950/10 backdrop-blur">
          {state === 'ready' && form && (
            <CardHeader className="border-b border-primary/10 px-5 py-5 sm:px-8 sm:py-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <CardTitle className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {form.title}
                  </CardTitle>
                  <CardDescription className="mt-2 leading-6">
                    Complete the fields below and submit your response.
                  </CardDescription>
                </div>
                {form.smsVerification && (
                  <Badge variant="secondary" className="w-fit border border-primary/15 bg-primary/10 text-primary">
                    SMS protected
                  </Badge>
                )}
              </div>
            </CardHeader>
          )}

          <CardContent className="px-5 py-6 sm:px-8 sm:py-8">
            {state === 'loading' && <Spinner text="Loading form..." />}

            {state === 'not-found' && <NotFound />}

            {state === 'submitted' && <SuccessScreen onReset={handleReset} />}

            {state === 'ready' && form && (
              <div className="space-y-6">
                {errorMsg && (
                  <Alert variant="destructive">
                    <AlertCircle className="size-4" aria-hidden="true" />
                    <AlertTitle>Submission failed</AlertTitle>
                    <AlertDescription>{errorMsg}</AlertDescription>
                  </Alert>
                )}

                {form.smsVerification && !verification ? (
                  <SmsGate formId={id!} onVerified={handleVerified} />
                ) : (
                  <FormRenderer
                    schema={form.schema}
                    loading={submitting}
                    onSubmit={handleSubmit}
                  />
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          Powered by <span className="font-semibold text-primary">Impulse</span>
        </p>
      </div>
    </main>
  );
}
