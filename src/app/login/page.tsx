'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { HideIfAuth } from '@/components/auth/RequiredAuth';

const phoneSchema = z.object({
  phone: z.string().refine(val => /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(val), {
    message: "Please enter a valid phone number."
  }),
});

const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits.").max(6, "OTP must be 6 digits."),
});

type PhoneFormData = z.infer<typeof phoneSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { loginWithOtp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  const handleSendOtp = async (data: PhoneFormData) => {
    setIsLoading(true);
    // In a real app, this would call a backend action to send an OTP via Firebase Auth
    console.log("Simulating sending OTP to:", data.phone);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    toast({
      title: 'OTP Sent (Simulated)',
      description: 'Enter the code "123456" to log in.',
    });
    
    setPhoneNumber(data.phone);
    setIsOtpSent(true);
    setIsLoading(false);
  };
  
  const handleVerifyOtp = async (data: OtpFormData) => {
    setIsLoading(true);
    try {
      // loginWithOtp is now a synchronous client-side function
      const success = loginWithOtp(phoneNumber, data.otp);

      if (success) {
        toast({
          title: 'Login Successful!',
          description: 'Welcome back!',
        });
        router.push('/');
      } else {
         toast({
          title: 'Login Failed',
          description: 'The OTP you entered is incorrect. Please try again.',
          variant: 'destructive',
        });
        otpForm.setError('otp', { type: 'manual', message: 'Incorrect OTP.' });
      }
    } catch (error) {
       toast({
        title: 'An Error Occurred',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <HideIfAuth>
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <Card className="w-full max-w-sm shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center">
              <KeyRound className="mr-2 h-6 w-6" />
              {isOtpSent ? 'Enter OTP' : 'Sign In'}
            </CardTitle>
            <CardDescription>
              {isOtpSent ? `We sent a code to ${phoneNumber}.` : 'Enter your phone number to receive a login code.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isOtpSent ? (
              <form onSubmit={phoneForm.handleSubmit(handleSendOtp)} className="space-y-4">
                <div>
                  <Input 
                    {...phoneForm.register('phone')} 
                    placeholder="e.g., +1 555-123-4567"
                    type="tel"
                  />
                  {phoneForm.formState.errors.phone && <p className="text-sm text-destructive mt-1">{phoneForm.formState.errors.phone.message}</p>}
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Send Code'}
                </Button>
              </form>
            ) : (
              <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-4">
                <div>
                  <Input 
                    {...otpForm.register('otp')}
                    placeholder="123456"
                    type="text"
                    maxLength={6}
                  />
                  {otpForm.formState.errors.otp && <p className="text-sm text-destructive mt-1">{otpForm.formState.errors.otp.message}</p>}
                </div>
                 <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Verify & Sign In'}
                </Button>
                <Button variant="link" size="sm" onClick={() => setIsOtpSent(false)} className="w-full">
                  Back to phone number entry
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </HideIfAuth>
  );
}
