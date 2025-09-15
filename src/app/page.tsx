import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop')" }}
        data-ai-hint="books on shelf"
      />
      <div className="absolute inset-0 bg-black/70" />
      
      <div className="absolute top-8 left-8 z-10">
        <Logo className="[&>span]:text-white [&>svg]:text-white" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <h1 className="font-headline text-6xl md:text-8xl font-bold">
          LegitMind
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-white/90">
          Next-generation AI-powered legal assistant designed to help you understand, analyze, and manage legal documents with unprecedented precision and insight.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-transparent border-accent/50 text-white hover:bg-accent/10 hover:text-white font-semibold">
            <Link href="#">Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
