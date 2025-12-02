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

    if (otp.length < 4) {
      toast.error('Please enter the complete OTP code');
      return;
    }

    setLoading(true);
    const result = await verifyOTP(email, otp);
    setLoading(false);

    if (result.success && result.userId) {
      // Check if user profile exists
      const userExists = await checkUserExists(result.userId);
      
      if (userExists) {
        // User exists, redirect to dashboard
        toast.success('Login successful!');
        router.push('/dashboard');
      } else {
        // New user, ask for name
        setUserId(result.userId);
        setStep('name');
      }
    } else {
      toast.error(result.error || 'Invalid OTP. Please try again.');
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setLoading(true);
    const result = await createOrUpdateUser(userId, name, email);
    setLoading(false);

    if (result.success) {
      toast.success('Profile created successfully!');
      router.push('/dashboard');
    } else {
      toast.error(result.error || 'Failed to create profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800">
            <Sun className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">Mahalaxmi Solar</div>
            <div className="text-xs text-gray-600">Energies</div>
          </div>
        </Link>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">
              {step === 'email' && 'Welcome Back'}
              {step === 'otp' && 'Verify OTP'}
              {step === 'name' && 'Complete Your Profile'}
            </CardTitle>
            <CardDescription>
              {step === 'email' && 'Enter your email to receive OTP'}
              {step === 'otp' && 'Enter the 6-digit code sent to your email'}
              {step === 'name' && 'Tell us your name to get started'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'email' && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
                  <p className="text-xs text-gray-500">
                    We'll send a 6-digit OTP to your email
                  </p>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? <LoadingSpinner size="sm" /> : 'Send OTP'}
                </Button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP Code</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter OTP code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="pl-10 text-center text-xl tracking-wider"
                      required
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    OTP sent to {email}
                  </p>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? <LoadingSpinner size="sm" /> : 'Verify OTP'}
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
                  />
                  <p className="text-xs text-gray-500">
                    This name will be used for all communications
                  </p>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? <LoadingSpinner size="sm" /> : 'Complete Registration'}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

