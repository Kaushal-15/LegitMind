import { SignupForm } from '@/components/auth/signup-form';
import { Logo } from '@/components/logo';

export default function SignupPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop')" }}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute top-8 left-8 z-10">
        <Logo className="[&>span]:text-white [&>svg]:text-white" />
      </div>
      <div className="relative z-10">
        <SignupForm />
      </div>
    </div>
  );
}
