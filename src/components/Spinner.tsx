import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Spinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-8 text-center sm:py-12">
      <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Loader2 className="size-7 animate-spin" aria-hidden="true" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{text}</p>
      <div className="mt-8 w-full space-y-3">
        <Skeleton className="h-4 w-2/3 bg-primary/10" />
        <Skeleton className="h-11 w-full bg-primary/10" />
        <Skeleton className="h-11 w-full bg-primary/10" />
      </div>
    </div>
  );
}
