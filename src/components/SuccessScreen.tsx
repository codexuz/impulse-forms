import { CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuccessScreenProps {
  title?: string;
  message?: string;
  onReset?: () => void;
}

export default function SuccessScreen({
  title = 'Thank you!',
  message = 'Your response has been recorded successfully.',
  onReset,
}: SuccessScreenProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-8 text-center sm:py-12">
      <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
        <CheckCircle2 className="size-9" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">{message}</p>
      {onReset && (
        <Button
          className="mt-8 h-11 w-full gap-2 rounded-xl bg-primary text-base shadow-lg shadow-primary/20 hover:bg-primary/90 sm:w-auto"
          onClick={onReset}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Submit another response
        </Button>
      )}
    </div>
  );
}
