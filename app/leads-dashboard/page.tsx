'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase/client';
import { FileText, LogIn, CheckCircle, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LeadsDashboardPage() {
  const [loading, setLoading] = useState(false);
  const [checkingUser, setCheckingUser] = useState(false);
  const [userVerified, setUserVerified] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [formData, setFormData] = useState({
    referrerEmail: '',
    customerName: '',
    customerPhone: '',
    city: '',
    propertyType: 'residential',
    notes: ''
  });

  const handleCheckUser = async () => {
    if (!formData.referrerEmail || !formData.referrerEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setCheckingUser(true);
    setUserVerified(false);
    setUserName('');

    try {
      const { data: referrer, error: referrerError } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('email', formData.referrerEmail.toLowerCase())
        .single();

      if (referrerError || !referrer) {
        toast.error('Email not registered. Please login first!');
        setUserVerified(false);
        setUserName('');
        setUserId('');
      } else {
        setUserVerified(true);
        setUserName(referrer.name);
        setUserId(referrer.id);
        toast.success(`Welcome back, ${referrer.name}! 👋`);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      toast.error('Error checking email address');
    } finally {
      setCheckingUser(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userVerified) {
      toast.error('Please verify your mobile number first by clicking "Check"');
      return;
    }

    setLoading(true);

    try {

      // Check for duplicate lead
      const { data: existingLead } = await supabase
        .from('leads')
        .select('id')
        .eq('customer_phone', formData.customerPhone)
        .maybeSingle();

      if (existingLead) {
        toast.error('This customer has already been submitted as a lead!');
        setLoading(false);
        return;
      }

      // Create lead
      const { error: leadError } = await supabase
        .from('leads')
        .insert({
          referrer_id: userId,
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone,
          city: formData.city,
          property_type: formData.propertyType,
          notes: formData.notes,
          status: 'submitted'
        });

      if (leadError) throw leadError;

      toast.success(`Lead submitted successfully! Thank you ${userName}! 🎉`);
      
      // Reset form
      setFormData({
        referrerEmail: '',
        customerName: '',
        customerPhone: '',
        city: '',
        propertyType: 'residential',
        notes: ''
      });
      setUserVerified(false);
      setUserName('');
      setUserId('');

    } catch (error: any) {
      console.error('Error submitting lead:', error);
      toast.error('Failed to submit lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Submit Lead & Earn Rewards
          </h1>
          <p className="text-xl text-slate-600">
            Refer customers and earn up to ₹5,000 per successful installation
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* LEFT SIDE - Lead Submission Form */}
          <Card className="shadow-xl border-2 border-blue-100">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Quick Lead Submission</CardTitle>
                  <CardDescription className="text-base">Submit customer details and earn rewards</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Referrer Email */}
                <div>
                  <Label className="text-base font-semibold">Your Email Address *</Label>
                  <p className="text-sm text-slate-500 mb-2">Enter your registered email (for testing)</p>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.referrerEmail}
                      onChange={(e) => {
                        setFormData({ ...formData, referrerEmail: e.target.value });
                        setUserVerified(false);
                        setUserName('');
                      }}
                      required
                      className="text-lg h-12 flex-1"
                      disabled={userVerified}
                    />
                    <Button
                      type="button"
                      onClick={handleCheckUser}
                      disabled={checkingUser || userVerified || !formData.referrerEmail.includes('@')}
                      className="h-12 px-6 bg-blue-600 hover:bg-blue-700"
                    >
                      {checkingUser ? 'Checking...' : userVerified ? '✓ Verified' : 'Check'}
                    </Button>
                  </div>
                  
                  {/* User Verification Status */}
                  {userVerified && userName && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-semibold text-green-800">
                          ✓ Verified: {userName}
                        </p>
                        <p className="text-xs text-green-600">You can now submit lead</p>
                      </div>
                    </div>
                  )}
                  
                  {!userVerified && formData.referrerEmail.includes('@') && !checkingUser && (
                    <p className="mt-2 text-sm text-amber-600">
                      Click "Check" to verify your email address
                    </p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-lg mb-4 text-slate-700">
                    Customer Details
                    {!userVerified && (
                      <span className="text-sm font-normal text-amber-600 ml-2">
                        (Verify your email first)
                      </span>
                    )}
                  </h3>
                  
                  {/* Customer Name */}
                  <div className="mb-4">
                    <Label className="text-base">Customer Name *</Label>
                    <Input
                      type="text"
                      placeholder="Full name"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      required
                      className="h-11"
                      disabled={!userVerified}
                    />
                  </div>

                  {/* Customer Phone */}
                  <div className="mb-4">
                    <Label className="text-base">Customer Phone *</Label>
                    <Input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      required
                      maxLength={10}
                      className="h-11"
                      disabled={!userVerified}
                    />
                  </div>

                  {/* City */}
                  <div className="mb-4">
                    <Label className="text-base">City *</Label>
                    <Input
                      type="text"
                      placeholder="City name"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      className="h-11"
                      disabled={!userVerified}
                    />
                  </div>

                  {/* Property Type */}
                  <div className="mb-4">
                    <Label className="text-base">Property Type</Label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full h-11 px-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                      disabled={!userVerified}
                    >
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="industrial">Industrial</option>
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    <Label className="text-base">Notes (Optional)</Label>
                    <Textarea
                      placeholder="Any additional information..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="resize-none"
                      disabled={!userVerified}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || !userVerified}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    'Submitting...'
                  ) : !userVerified ? (
                    'Verify Email First'
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Submit Lead & Earn ₹5,000
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* RIGHT SIDE - Login & Info */}
          <div className="space-y-6">
            
            {/* Login Card */}
            <Card className="shadow-xl border-2 border-green-100 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <LogIn className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Already Have Account?</CardTitle>
                </div>
                <CardDescription className="text-base">Access your dashboard to view leads and earnings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/auth/login" className="block">
                  <Button className="w-full h-14 text-lg font-semibold bg-green-600 hover:bg-green-700">
                    <LogIn className="mr-2 h-5 w-5" />
                    Login to Dashboard
                  </Button>
                </Link>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-xs text-slate-600">View Leads</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <IndianRupee className="h-5 w-5 text-green-600 mx-auto mb-1" />
                    <div className="text-xs text-slate-600">Track Earnings</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Earning Info */}
            <Card className="shadow-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-amber-600" />
                  Earning Potential
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-sm font-medium">Residential (1-3 kW)</span>
                  <span className="text-lg font-bold text-green-600">₹3,000</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-sm font-medium">Residential (3-10 kW)</span>
                  <span className="text-lg font-bold text-green-600">₹5,000</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-sm font-medium">Commercial</span>
                  <span className="text-lg font-bold text-green-600">₹10,000</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold">1</span>
                    <span className="text-sm text-slate-700">Enter your email address (must have account)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold">2</span>
                    <span className="text-sm text-slate-700">Submit customer details</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold">3</span>
                    <span className="text-sm text-slate-700">Our team contacts customer</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white text-sm font-bold">4</span>
                    <span className="text-sm text-slate-700">Earn rewards after installation!</span>
                  </li>
                </ol>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">
            Don't have an account yet?{' '}
            <Link href="/auth/login" className="text-blue-600 font-semibold hover:underline">
              Create one now
            </Link>
            {' '}to start earning!
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
