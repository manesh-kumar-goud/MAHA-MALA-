'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sun, Phone, Lock, Mail } from 'lucide-react';
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
  const [step, setStep] = useState<'input' | 'otp' | 'name'>('input');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  // reCAPTCHA container for Firebase
  useEffect(() => {
    // Create reCAPTCHA container if it doesn't exist
    if (typeof window !== 'undefined' && !document.getElementById('recaptcha-container')) {
      const recaptchaDiv = document.createElement('div');
      recaptchaDiv.id = 'recaptcha-container';
      recaptchaDiv.style.display = 'none';
      document.body.appendChild(recaptchaDiv);
    }
  }, []);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input based on auth method
    if (authMethod === 'email') {
      if (!validateEmail(emailOrPhone)) {
      toast.error('Please enter a valid email address');
      return;
      }
    } else {
      if (!validatePhoneNumber(emailOrPhone)) {
        toast.error('Please enter a valid 10-digit phone number');
        return;
      }
    }

    setLoading(true);
    const result = await sendOTP(emailOrPhone);
    setLoading(false);

    if (result.success) {
      if (authMethod === 'email') {
      toast.success('OTP sent to your email! Check your inbox.');
      } else {
        toast.success('OTP sent to your phone! Check your SMS.');
      }
      setStep('otp');
    } else {
      // Show more helpful error messages
      let errorMessage = result.error || 'Failed to send OTP. Please try again.';
      
      // Check for billing error
      if (errorMessage.includes('billing')) {
        errorMessage = 'Firebase billing issue. Please ensure: 1) Project is on Blaze plan, 2) Billing account is linked and active, 3) Identity Toolkit API is enabled. See FIREBASE_BILLING_FIX.md for details.';
      }
      
      toast.error(errorMessage, {
        duration: 8000, // Show longer for billing errors
      });
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
      console.log('Starting OTP verification for:', emailOrPhone);
    const result = await verifyOTP(emailOrPhone, otp);
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
          // User exists - check role and redirect accordingly
          toast.success('Login successful!', { duration: 3000 });
          console.log('✓ User found. Checking role...');
          
          // Get user role from database
          if (!supabase) {
            toast.error('Database connection not available');
            return;
          }
          const db = supabase as any;
          const { data: userData } = await db
            .from('users')
            .select('role')
            .eq('id', result.userId)
            .single();
          
          const userRole = userData?.role || 'user';
          console.log('User role:', userRole);
          
          // Redirect based on role
          const redirectPath = (userRole === 'admin' || userRole === 'super_admin') 
            ? '/admin' 
            : '/dashboard';
          
          console.log('✓ Redirecting to:', redirectPath);
          
          // Small delay for better UX
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          console.log('→ Executing redirect NOW to', redirectPath);
          window.location.replace(redirectPath);
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
      console.log('Creating user profile:', { userId, name, emailOrPhone });
    const result = await createOrUpdateUser(userId, name, emailOrPhone);

      if (result.success) {
        toast.success('Profile created successfully! Redirecting...');
        
        // Get user role (new users are always 'user' by default)
        if (!supabase) {
          toast.error('Database connection not available');
          return;
        }
        const db = supabase as any;
        const { data: userData } = await db
          .from('users')
          .select('role')
          .eq('id', userId)
          .single();
        
        const redirectPath = (userData?.role === 'admin' || userData?.role === 'super_admin') 
          ? '/admin' 
          : '/dashboard';
        
        console.log('New user created, redirecting to:', redirectPath);
        
        // Use window.location for reliable redirect
        setTimeout(() => {
          window.location.replace(redirectPath);
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
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex justify-center mb-8 group">
          <img
            src="/logo.png"
            alt="Mahalaxmi Solar Energies"
            className="h-16 w-auto transition-transform group-hover:scale-105"
          />
        </Link>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">
              {step === 'input' && 'Welcome Back'}
              {step === 'otp' && 'Verify OTP'}
              {step === 'name' && 'Complete Your Profile'}
            </CardTitle>
            <CardDescription>
              {step === 'input' && (authMethod === 'email' 
                ? 'Enter your email to receive a verification code'
                : 'Enter your phone number to receive an OTP')}
              {step === 'otp' && (authMethod === 'email'
                ? 'Enter the verification code sent to your email'
                : 'Enter the verification code sent to your phone')}
              {step === 'name' && 'Tell us your name to get started'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'input' && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                {/* Auth Method Toggle */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('email');
                      setEmailOrPhone('');
                    }}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      authMethod === 'email'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('phone');
                      setEmailOrPhone('');
                    }}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      authMethod === 'phone'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone
                  </button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="input">
                    {authMethod === 'email' ? 'Email Address' : 'Phone Number'}
                  </Label>
                  <div className="relative">
                    {authMethod === 'email' ? (
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    ) : (
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    )}
                    <Input
                      id="input"
                      type={authMethod === 'email' ? 'email' : 'tel'}
                      placeholder={
                        authMethod === 'email'
                          ? 'your.email@example.com'
                          : '9876543210'
                      }
                      value={emailOrPhone}
                      onChange={(e) => {
                        const value = authMethod === 'phone'
                          ? e.target.value.replace(/\D/g, '').slice(0, 10)
                          : e.target.value;
                        setEmailOrPhone(value);
                      }}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-gray-500 font-light">
                    {authMethod === 'email'
                      ? "We'll send a verification code to your email"
                      : "We'll send an OTP to your phone number"}
                  </p>
                </div>
                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-900 font-medium border border-black" size="lg" disabled={loading}>
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
                  <p className="text-xs text-gray-500 font-light">
                    Verification code sent to {authMethod === 'email' ? emailOrPhone : `+91 ${emailOrPhone}`}
                  </p>
                </div>
                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-900 font-medium border border-black" size="lg" disabled={loading}>
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
                  className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => {
                    setStep('input');
                    setOtp('');
                  }}
                  disabled={loading}
                >
                  Change {authMethod === 'email' ? 'Email' : 'Phone Number'}
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
                  <p className="text-xs text-gray-500 font-light">
                    This name will be used for all communications
                  </p>
                </div>
                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-900 font-medium border border-black" size="lg" disabled={loading}>
                  {loading ? <LoadingSpinner size="sm" /> : 'Complete Registration'}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-600 font-light">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-gray-900 hover:underline font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-gray-900 hover:underline font-medium">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 font-light">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
