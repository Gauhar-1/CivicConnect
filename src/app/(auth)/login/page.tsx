
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { LoginCredentials } from './actions';

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password cannot be empty.' }),
});

type LoginFormInputs = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors: formErrors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    setError(null);
    const result = await login(data as LoginCredentials);
    if (result.success && result.user) {
      if (result.user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
    setIsLoading(false);
  };

  if (user) {
     // Redirect if already logged in, timeout to prevent hydration issues on initial load
     setTimeout(() => router.push('/'), 0);
     return <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold flex items-center justify-center">
          <LogIn className="mr-2 h-6 w-6 text-primary" /> CivicConnect Login
        </CardTitle>
        <CardDescription>Access your account to engage with your community.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Login Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              aria-invalid={formErrors.email ? "true" : "false"}
            />
            {formErrors.email && <p className="text-sm text-destructive mt-1">{formErrors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              aria-invalid={formErrors.password ? "true" : "false"}
            />
            {formErrors.password && <p className="text-sm text-destructive mt-1">{formErrors.password.message}</p>}
          </div>
          <Button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" /> Login
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
