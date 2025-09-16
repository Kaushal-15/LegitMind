'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M21.35 11.1h-9.35v2.8h5.6c-.25 1.55-1.3 2.8-2.8 3.65v2.2h2.8c1.6-1.5 2.5-3.75 2.5-6.45c0-.6-.05-1.2-.15-1.8z"
    />
    <path
      fill="currentColor"
      d="M12 22c3.15 0 5.8-1.3 7.75-3.55l-2.8-2.2c-1.05.7-2.4 1.1-3.95 1.1c-3 0-5.6-2.05-6.5-4.85H2.65v2.3c1.3 2.6 4.15 4.5 7.35 4.5z"
    />
    <path
      fill="currentColor"
      d="M5.5 14.25c-.2-.6-.3-1.25-.3-1.9s.1-1.3.3-1.9V8.2H2.65c-.6 1.25-.95 2.7-.95 4.15s.35 2.9.95 4.15z"
    />
    <path
      fill="currentColor"
      d="M12 5.35c1.65 0 3.05.6 4.15 1.65l2.45-2.45C16.8 2.65 14.6 2 12 2C8.8 2 5.95 3.9 4.65 6.55l2.85 2.2c.9-2.8 3.5-4.8 6.5-4.8z"
    />
  </svg>
);


export function SignupForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast({
      title: 'Account Created',
      description: 'Welcome! Redirecting you to the dashboard.',
    });
    console.log(data);
    router.push('/dashboard');
  }

  return (
    <Card className="w-full max-w-sm shadow-2xl bg-card/80 backdrop-blur-sm border-accent/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
        <CardDescription>
          Enter your information to create an account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
            <Button variant="outline" className="w-full">
                <GoogleIcon />
                Sign up with Google
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Create Account
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-center text-sm">
        <p className="w-full">
          Already have an account?{' '}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
