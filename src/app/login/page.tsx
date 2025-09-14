import { LoginForm } from '@/components/auth/login-form';
import { Logo } from '@/components/logo';

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="absolute top-8 left-8">
            <Logo className="[&>span]:text-primary [&>svg]:text-primary"/>
        </div>
      <LoginForm />
    </div>
  );
}
