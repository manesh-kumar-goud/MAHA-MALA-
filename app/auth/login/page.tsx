'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sun, Phone, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { sendOTP, verifyOTP, createOrUpdateUser, checkUserExists } from '@/lib/auth';
import { supabase } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { validatePhoneNumber, validateEmail } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp' | 'name'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    const result = await sendOTP(email);
    setLoading(false);

    if (result.success) {
      toast.success('OTP sent to your email! Check your inbox.');
      setStep('otp');
    } else {
      toast.error(result.error || 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length < 1) {
      toast.error('Please enter the verification code');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Starting OTP verification for:', email);
    const result = await verifyOTP(email, otp);
      console.log('OTP verification result:', result);

    if (result.success && result.userId) {
        console.log('✓ OTP verified successfully for user:', result.userId);
        
        // Wait a bit for session to be established
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if user profile exists in database
        console.log('Checking if user exists in database...');
      const userExists = await checkUserExists(result.userId);
        console.log('User exists in database:', userExists);
      
      if (userExists) {
          // User exists - redirect to dashboard
          toast.success('Login successful!', { duration: 3000 });
          console.log('✓ User found. Checking session...');
          
          // Check if session exists
          const { data: { session } } = await supabase.auth.getSession();
          console.log('Current session:', session ? 'EXISTS' : 'NOT FOUND');
          
          if (!session) {
            console.error('❌ WARNING: No session found after OTP verification!');
            toast.error('Session error. Please try logging in again.');
            setLoading(false);
            return;
          }
          
          console.log('✓ Session confirmed. Redirecting to dashboard...');
          
          // Wait a bit more for cookies to be set
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          console.log('→ Executing redirect NOW');
          window.location.replace('/dashboard');
      } else {
          // New user - ask for name
          console.log('⚠ User profile not found, requesting name');
        setUserId(result.userId);
        setStep('name');
          toast.success('OTP verified! Please complete your profile.');
      }
    } else {
        console.error('❌ OTP verification failed:', result.error);
      toast.error(result.error || 'Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('❌ Error during OTP verification:', error);
      toast.error('An error occurred: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Creating user profile:', { userId, name, email });
    const result = await createOrUpdateUser(userId, name, email);

    if (result.success) {
        toast.success('Profile created successfully! Redirecting...');
        // Use window.location for reliable redirect
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
    } else {
        console.error('Profile creation failed:', result.error);
      toast.error(result.error || 'Failed to create profile. Please try again.');
      }
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex justify-center mb-8 group">
          <img
            src="/logo.png"
            alt="Mahalaxmi Solar Energies"
            className="h-16 w-auto transition-transform group-hover:scale-105"
          />
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {step === 'email' && 'Welcome Back'}
              {step === 'otp' && 'Verify OTP'}
              {step === 'name' && 'Complete Your Profile'}
            </CardTitle>
            <CardDescription>
              {step === 'email' && 'Enter your email to receive a verification code'}
              {step === 'otp' && 'Enter the verification code sent to your email'}
              {step === 'name' && 'Tell us your name to get started'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'email' && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    We'll send a verification code to your email
                  </p>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? <LoadingSpinner size="sm" /> : 'Send Code'}
                </Button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter verification code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="pl-10 text-center tracking-wider"
                      required
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Verification code sent to {email}
                  </p>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      Verifying...
                    </span>
                  ) : (
                    'Verify Code'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setStep('email')}
                  disabled={loading}
                >
                  Change Email Address
                </Button>
              </form>
            )}

            {step === 'name' && (
              <form onSubmit={handleCreateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                    autoFocus
                  />
                  <p className="text-xs text-slate-500">
                    This name will be used for all communications
                  </p>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? <LoadingSpinner size="sm" /> : 'Complete Registration'}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-xs text-slate-600">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-slate-900 hover:underline font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-slate-900 hover:underline font-medium">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
