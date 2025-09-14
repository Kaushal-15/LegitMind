import Link from 'next/link';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/upload" className={cn("flex items-center gap-2", className)}>
      <FileText className="h-6 w-6 text-primary" />
      <span className="font-headline text-2xl font-semibold text-foreground">
        LegitMind
      </span>
    </Link>
  );
}
