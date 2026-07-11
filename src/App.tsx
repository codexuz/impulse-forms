import { BrowserRouter, Routes, Route, useSearchParams, useParams } from 'react-router-dom';
import { Camera, CirclePlay, FileQuestion, Send } from 'lucide-react';
import FormPage from './pages/FormPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const DEFAULT_FORM_ID = 'dad2340c-18cb-438b-b19b-b6d3b88b5fcf';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QueryParamPage />} />
        <Route path="/:id" element={<PathParamPage />} />
        <Route path="*" element={<NoIdPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function QueryParamPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') || DEFAULT_FORM_ID;

  return <FormPage id={id} />;
}

function PathParamPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <NoIdPage />;
  }

  return <FormPage id={id} />;
}

function NoIdPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.20),_transparent_34%),linear-gradient(145deg,_#f8fbff_0%,_#eef6ff_52%,_#ffffff_100%)] px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="pointer-events-none absolute right-[-12rem] top-[-12rem] h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-10rem] left-[-10rem] h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />

      <Card className="relative w-full max-w-md border-primary/10 bg-white/90 shadow-2xl shadow-blue-950/10 backdrop-blur">
        <CardContent className="flex flex-col items-center px-6 py-10 text-center sm:px-10">
          <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <FileQuestion className="size-8" aria-hidden="true" />
          </div>

          <img
            src="/no_data.svg"
            alt=""
            className="mb-6 h-36 w-36 object-contain opacity-90 sm:h-40 sm:w-40"
          />

          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            No forms found
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground sm:text-base">
            There is no form to display. Please check the link and try again.
          </p>

          <div className="mt-7 flex items-center gap-2">
            <Button asChild variant="outline" size="icon-lg" aria-label="YouTube">
              <a
                href="https://youtube.com/@impulse_lc"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CirclePlay className="size-4 text-red-600" />
              </a>
            </Button>
            <Button asChild variant="outline" size="icon-lg" aria-label="Instagram">
              <a
                href="https://instagram.com/impulsestudy_lc"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Camera className="size-4 text-pink-600" />
              </a>
            </Button>
            <Button asChild variant="outline" size="icon-lg" aria-label="Telegram">
              <a
                href="https://t.me/impulse_lc"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Send className="size-4 text-sky-600" />
              </a>
            </Button>
          </div>

          <p className="mt-8 text-xs text-muted-foreground">
            Powered by <span className="font-semibold text-primary">Impulse</span>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
