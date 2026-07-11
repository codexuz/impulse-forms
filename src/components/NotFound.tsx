import { FileQuestion } from 'lucide-react';

interface NotFoundProps {
  title?: string;
  message?: string;
}

export default function NotFound({
  title = 'Form not found',
  message = 'This form may have been removed or the link is invalid.',
}: NotFoundProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-8 text-center sm:py-12">
      <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground ring-1 ring-border">
        <FileQuestion className="size-8" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">{message}</p>
    </div>
  );
}
