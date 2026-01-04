'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase/client';
import { FileText, LogIn, CheckCircle, IndianRupee, Award, Users, TrendingUp, Zap, ArrowRight, Shield, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

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
      if (!supabase) {
        toast.error('Database connection not available');
        setCheckingUser(false);
        return;
      }
      const db = supabase as any;
      const { data: referrer, error: referrerError } = await db
        .from('users')
        .select('id, name, email')
        .eq('email', formData.referrerEmail.toLowerCase())
        .single();

      if (referrerError || !referrer) {
        toast.error('Email not registered. Please create an account first!');
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
      toast.error('Please verify your email first by clicking "Check"');
      return;
    }

    setLoading(true);

    try {
      if (!supabase) {
        toast.error('Database connection not available');
        setLoading(false);
        return;
      }
      const db = supabase as any;
      // Check for duplicate lead
      const { data: existingLead } = await db
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
      const { error: leadError } = await db
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

      toast.success(`🎉 Lead submitted successfully! Thank you ${userName}!`);
      
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

  const benefits = [
    {
      icon: IndianRupee,
      title: 'Earn Up to ₹10,000',
      description: 'Per successful lead based on system size',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Clock,
      title: 'Quick Payout',
      description: 'Rewards credited within 7 days',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: TrendingUp,
      title: 'Track in Real-Time',
      description: 'Monitor all your leads instantly',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      icon: Shield,
      title: 'Secure & Transparent',
      description: 'Safe platform, guaranteed rewards',
      color: 'from-amber-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-24 pb-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 backdrop-blur-xl px-5 py-2 text-sm font-medium text-white shadow-lg">
                <Award className="h-4 w-4" />
                Solar Referral Program
              </div>
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                Submit Leads & Earn Rewards
              </h1>
              <p className="mb-6 text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
                Refer customers for solar installation and earn ₹3,000 to ₹10,000 per successful lead
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`mx-auto mb-2 h-12 w-12 rounded-full bg-gradient-to-br ${benefit.color} flex items-center justify-center`}>
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-sm font-semibold text-slate-900">{benefit.title}</div>
                <div className="text-xs text-slate-600">{benefit.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            
            {/* LEFT - Lead Submission Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="shadow-2xl border-0 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <FileText className="h-7 w-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Quick Lead Submission</h2>
                      <p className="text-blue-100 text-sm">Fill the form below to submit your lead</p>
                    </div>
                  </div>
                </div>

                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Verification */}
                    <div>
                      <Label className="text-base font-semibold text-slate-900">Your Email Address *</Label>
                      <p className="text-sm text-slate-500 mb-3">Verify your account to submit leads</p>
                      <div className="flex gap-3">
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
                          className="text-base h-12 flex-1"
                          disabled={userVerified}
                        />
                        <Button
                          type="button"
                          onClick={handleCheckUser}
                          disabled={checkingUser || userVerified || !formData.referrerEmail.includes('@')}
                          className="h-12 px-8 bg-blue-600 hover:bg-blue-700 font-semibold"
                        >
                          {checkingUser ? 'Checking...' : userVerified ? '✓ Verified' : 'Check'}
                        </Button>
                      </div>
                      
                      {userVerified && userName && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-white" />
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-green-800">
                                ✓ Verified: {userName}
                              </p>
                              <p className="text-xs text-green-700">You can now submit customer details below</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      {!userVerified && formData.referrerEmail.includes('@') && !checkingUser && (
                        <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <span className="font-semibold">→</span> Click "Check" button to verify your email
                        </p>
                      )}
                    </div>

                    <div className="border-t border-slate-200 pt-6">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold text-slate-900">Customer Details</h3>
                        {!userVerified && (
                          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                            Verify email first
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-5">
                        {/* Customer Name */}
                        <div>
                          <Label className="text-base font-medium text-slate-700">Customer Name *</Label>
                          <Input
                            type="text"
                            placeholder="Full name"
                            value={formData.customerName}
                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                            required
                            className="mt-2 h-12 text-base"
                            disabled={!userVerified}
                          />
                        </div>

                        {/* Customer Phone */}
                        <div>
                          <Label className="text-base font-medium text-slate-700">Customer Phone *</Label>
                          <Input
                            type="tel"
                            placeholder="10-digit mobile number"
                            value={formData.customerPhone}
                            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                            required
                            maxLength={10}
                            className="mt-2 h-12 text-base"
                            disabled={!userVerified}
                          />
                        </div>

                        {/* City */}
                        <div>
                          <Label className="text-base font-medium text-slate-700">City *</Label>
                          <Input
                            type="text"
                            placeholder="City name"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            required
                            className="mt-2 h-12 text-base"
                            disabled={!userVerified}
                          />
                        </div>

                        {/* Property Type */}
                        <div>
                          <Label className="text-base font-medium text-slate-700">Property Type</Label>
                          <select
                            value={formData.propertyType}
                            onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                            className="mt-2 w-full h-12 px-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base disabled:bg-slate-100 disabled:cursor-not-allowed"
                            disabled={!userVerified}
                          >
                            <option value="residential">🏠 Residential</option>
                            <option value="commercial">🏢 Commercial</option>
                            <option value="industrial">🏭 Industrial</option>
                          </select>
                        </div>

                        {/* Notes */}
                        <div>
                          <Label className="text-base font-medium text-slate-700">Additional Notes (Optional)</Label>
                          <Textarea
                            placeholder="Any specific requirements or information..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            className="mt-2 resize-none text-base"
                            disabled={!userVerified}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={loading || !userVerified}
                        className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Submitting...
                          </span>
                        ) : !userVerified ? (
                          'Verify Email First'
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-6 w-6" />
                            Submit Lead & Earn Rewards
                          </>
                        )}
                      </Button>
                      {!userVerified && (
                        <p className="mt-3 text-xs text-center text-slate-500">
                          You must verify your email before submitting leads
                        </p>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* RIGHT - Login & Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              
              {/* Login Card */}
              <Card className="shadow-xl border-0 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                      <LogIn className="h-7 w-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Access Dashboard</h2>
                      <p className="text-slate-300 text-sm">View your leads, earnings & more</p>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <Link href="/auth/login" className="block">
                    <Button className="w-full h-14 text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg">
                      <LogIn className="mr-2 h-5 w-5" />
                      Login to Dashboard
                      <ArrowRight className="ml-auto h-5 w-5" />
                    </Button>
                  </Link>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-3 text-slate-500 font-medium">Dashboard Features</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                      <FileText className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-xs font-semibold text-slate-700">Track Leads</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <IndianRupee className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <div className="text-xs font-semibold text-slate-700">View Earnings</div>
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <p className="text-xs text-slate-500">
                      Don't have an account?{' '}
                      <Link href="/auth/login" className="text-blue-600 font-semibold hover:underline">
                        Register now
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Earning Potential */}
              <Card className="shadow-xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white pb-4">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-6 w-6" />
                    <CardTitle className="text-xl">Earning Potential</CardTitle>
                  </div>
                  <CardDescription className="text-green-100">Transparent reward structure</CardDescription>
                </CardHeader>
                
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div>
                      <div className="text-xs font-medium text-slate-600">Residential (1-3 kW)</div>
                      <div className="text-xs text-slate-500">Small homes</div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">₹3,000</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-300 relative">
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      POPULAR
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-600">Residential (3-10 kW)</div>
                      <div className="text-xs text-slate-500">Large homes</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">₹5,000</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                    <div>
                      <div className="text-xs font-medium text-slate-600">Commercial</div>
                      <div className="text-xs text-slate-500">Businesses</div>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">₹10,000</div>
                  </div>

                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start gap-2">
                      <Award className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-amber-900">Bonus Rewards!</p>
                        <p className="text-xs text-amber-700 leading-relaxed">
                          Extra ₹5,000 on your 5th lead, ₹10,000 on your 10th lead
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* How It Works */}
              <Card className="shadow-lg border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold">1</span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Verify Email</p>
                        <p className="text-xs text-slate-600">Enter your registered email and click "Check"</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold">2</span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Submit Customer Info</p>
                        <p className="text-xs text-slate-600">Provide customer details and submit</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-green-600 text-white text-sm font-bold">3</span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">We Handle the Rest</p>
                        <p className="text-xs text-slate-600">Our team contacts and converts the lead</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-green-600 text-white text-sm font-bold">4</span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Get Paid</p>
                        <p className="text-xs text-slate-600">Earn rewards after installation</p>
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>

            </motion.div>
          </div>
        </div>
      </section>

       {/* Trust Indicators */}
       <section className="py-12 bg-slate-900">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
             <div>
               <div className="text-4xl font-bold mb-2">2,400+</div>
               <div className="text-sm text-slate-300 font-medium">Installations Done</div>
             </div>
             <div>
               <div className="text-4xl font-bold mb-2">850+</div>
               <div className="text-sm text-slate-300 font-medium">Active Referrers</div>
             </div>
             <div>
               <div className="text-4xl font-bold mb-2">₹8.5 Cr+</div>
               <div className="text-sm text-slate-300 font-medium">Rewards Paid</div>
             </div>
             <div>
               <div className="text-4xl font-bold mb-2">92%</div>
               <div className="text-sm text-slate-300 font-medium">Success Rate</div>
             </div>
           </div>
         </div>
       </section>

      <Footer />
    </div>
  );
}
