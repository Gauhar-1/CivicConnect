
'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, LogIn, Phone, MessageSquare, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { firebaseAuth } from '@/lib/firebase/config';
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { createUserProfileAndRoleAction } from './actions';
import type { Role } from '@/types';

const phoneSchema = z.object({
  phoneNumber: z.string().min(10, { message: 'Please enter a valid phone number (e.g., +12223334444).' })
    .regex(/^\+[1-9]\d{1,14}$/, { message: 'Phone number must be in E.164 format (e.g., +12223334444).' }),
});
type PhoneFormInputs = z.infer<typeof phoneSchema>;

const otpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits.' }),
  role: z.enum(['VOTER', 'VOLUNTEER', 'CANDIDATE', 'ADMIN'], { required_error: "Please select a role."}),
  name: z.string().min(2, "Name must be at least 2 characters.").optional(),
});
type OtpFormInputs = z.infer<typeof otpSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [phoneNumber, setPhoneNumberState] = useState('');
  const { user, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);

  const phoneForm = useForm<PhoneFormInputs>({
    resolver: zodResolver(phoneSchema),
  });

  const otpForm = useForm<OtpFormInputs>({
    resolver: zodResolver(otpSchema),
    defaultValues: { role: 'VOTER' }
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && recaptchaContainerRef.current && !recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(firebaseAuth, recaptchaContainerRef.current, {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
      recaptchaVerifierRef.current.render().catch(err => console.error("Recaptcha render error:", err));
    }
  }, [step]);


  const handleSendOtp: SubmitHandler<PhoneFormInputs> = async (data) => {
    setIsLoading(true);
    setError(null);
    if (!recaptchaVerifierRef.current) {
      setError("Recaptcha not initialized. Please refresh.");
      setIsLoading(false);
      return;
    }
    try {
      const result = await signInWithPhoneNumber(firebaseAuth, data.phoneNumber, recaptchaVerifierRef.current);
      setConfirmationResult(result);
      setPhoneNumberState(data.phoneNumber);
      setStep('otp');
    } catch (err: any) {
      console.error("OTP send error:", err);
      setError(err.message || 'Failed to send OTP. Please check the phone number and try again.');
    }
    setIsLoading(false);
  };

  const handleVerifyOtp: SubmitHandler<OtpFormInputs> = async (data) => {
    setIsLoading(true);
    setError(null);
    if (!confirmationResult) {
      setError('No OTP confirmation context found. Please restart the login process.');
      setIsLoading(false);
      return;
    }
    try {
      const userCredential = await confirmationResult.confirm(data.otp);
      if (userCredential.user) {
        const profileResult = await createUserProfileAndRoleAction({
          uid: userCredential.user.uid,
          phone: userCredential.user.phoneNumber,
          email: userCredential.user.email,
          name: data.name,
          role: data.role,
          photoURL: userCredential.user.photoURL,
        });

        if (profileResult.success) {
          // AuthContext will pick up the user via onAuthStateChanged
          // and fetch their role. Redirection will be handled by AuthContext or page logic.
           if (data.role === 'ADMIN') {
             router.push('/admin');
           } else {
             router.push('/');
           }
        } else {
          setError(profileResult.error || 'Failed to create user profile.');
        }
      } else {
        setError('OTP verification failed. Please try again.');
      }
    } catch (err: any) {
      console.error("OTP verify error:", err);
      setError(err.message || 'Failed to verify OTP. Please try again.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!authIsLoading && user) {
      // Redirect if already logged in
      setTimeout(() => router.push(user.role === 'ADMIN' ? '/admin' : '/'), 0);
    }
  }, [user, authIsLoading, router]);


  if (authIsLoading || (!authIsLoading && user)) {
     return <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold flex items-center justify-center">
          <LogIn className="mr-2 h-6 w-6 text-primary" /> CivicConnect Login
        </CardTitle>
        <CardDescription>
          {step === 'phone' ? 'Enter your phone number to receive an OTP.' : 'Enter the OTP sent to your phone and select your role.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Login Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 'phone' && (
          <form onSubmit={phoneForm.handleSubmit(handleSendOtp)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number (e.g. +12223334444)</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+12345678900"
                {...phoneForm.register('phoneNumber')}
                aria-invalid={phoneForm.formState.errors.phoneNumber ? "true" : "false"}
              />
              {phoneForm.formState.errors.phoneNumber && <p className="text-sm text-destructive mt-1">{phoneForm.formState.errors.phoneNumber.message}</p>}
            </div>
            <div ref={recaptchaContainerRef}></div> {/* Invisible reCAPTCHA container */}
            <Button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Phone className="mr-2 h-4 w-4" />}
              Send OTP
            </Button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-6">
            <p className="text-sm text-muted-foreground">Enter OTP sent to: <strong>{phoneNumber}</strong> <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => { setStep('phone'); setError(null); }}>Change</Button></p>
            <div className="space-y-2">
              <Label htmlFor="otp">One-Time Password (OTP)</Label>
              <Input
                id="otp"
                type="text"
                maxLength={6}
                placeholder="••••••"
                {...otpForm.register('otp')}
                aria-invalid={otpForm.formState.errors.otp ? "true" : "false"}
              />
              {otpForm.formState.errors.otp && <p className="text-sm text-destructive mt-1">{otpForm.formState.errors.otp.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">Full Name (Optional)</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="e.g., Jane Doe"
                    {...otpForm.register('name')}
                />
                {otpForm.formState.errors.name && <p className="text-sm text-destructive mt-1">{otpForm.formState.errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Select Your Role</Label>
               <Controller
                name="role"
                control={otpForm.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VOTER">Voter</SelectItem>
                      <SelectItem value="VOLUNTEER">Volunteer</SelectItem>
                      <SelectItem value="CANDIDATE">Candidate / MP</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {otpForm.formState.errors.role && <p className="text-sm text-destructive mt-1">{otpForm.formState.errors.role.message}</p>}
              {otpForm.getValues("role") === "ADMIN" && (
                <Alert variant="destructive" className="mt-2">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle>Security Warning</AlertTitle>
                  <AlertDescription>
                    Selecting 'Admin' grants full platform control. In a production app, this role should only be assigned by authorized personnel.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
              Verify OTP & Login
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
