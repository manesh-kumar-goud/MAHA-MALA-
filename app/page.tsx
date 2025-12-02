'use client';

import Link from 'next/link';
import { ArrowRight, Sun, Zap, Users, Award, TrendingUp, Shield, Leaf, IndianRupee, CheckCircle2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function HomePage() {
  const benefits = [
    {
      icon: IndianRupee,
      title: 'Government Subsidy',
      description: 'Get up to ₹30,000 subsidy on solar installation',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: Zap,
      title: 'Save on Bills',
      description: 'Reduce electricity bills by up to 90%',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'Clean, renewable energy for a better tomorrow',
      color: 'from-green-600 to-green-700',
    },
    {
      icon: Shield,
      title: '25 Year Warranty',
      description: 'Industry-leading warranty on all products',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const features = [
    {
      icon: Users,
      title: 'Refer & Earn',
      description: 'Earn up to ₹5,000 per successful referral',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your referrals and rewards in real-time',
    },
    {
      icon: Award,
      title: 'Instant Rewards',
      description: 'Quick payout process with bank transfer',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Bank-grade security for all transactions',
    },
  ];

  const subsidyRates = [
    { capacity: '1-2 kW', amount: '₹30,000', description: 'For small homes' },
    { capacity: '2-3 kW', amount: '₹18,000/kW', description: 'For medium homes' },
    { capacity: 'Above 3 kW', amount: '₹18,000/kW', description: 'Up to 10 kW' },
  ];

  const stats = [
    { value: '10,000+', label: 'Installations' },
    { value: '₹50 Cr+', label: 'Savings Generated' },
    { value: '98%', label: 'Customer Satisfaction' },
    { value: '500+', label: 'Active Referrers' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
              <Sun className="h-5 w-5 text-yellow-400" />
              <span className="text-sm font-medium text-white">PM Surya Ghar - Muft Bijli Yojana</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Power Your Home with
              <span className="block text-yellow-400">Clean Solar Energy</span>
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-lg text-blue-100 sm:text-xl">
              Join India's largest solar revolution. Get government subsidies up to ₹30,000 and
              reduce your electricity bills by up to 90%. Join our referral program and earn rewards!
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/login">
                <Button size="xl" className="bg-white text-blue-600 hover:bg-blue-50">
                  Get Started - Refer & Earn
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/subsidy">
                <Button size="xl" variant="outline" className="border-white text-white hover:bg-white/10">
                  Check Subsidy Details
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-blue-600 md:text-4xl">{stat.value}</div>
                <div className="mt-2 text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Why Choose Solar?</h2>
            <p className="mt-4 text-lg text-gray-600">
              Experience the benefits of clean, renewable energy
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 hover:border-blue-300 transition-all hover-lift">
                  <CardHeader>
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${benefit.color}`}>
                      <benefit.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subsidy Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Government Subsidy Rates</h2>
            <p className="mt-4 text-lg text-gray-600">
              Save big with government subsidies under PM Surya Ghar Yojana
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {subsidyRates.map((rate, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-blue-200 hover:border-blue-400 transition-all hover-lift">
                  <CardHeader className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{rate.amount}</div>
                    <CardTitle className="text-2xl">{rate.capacity}</CardTitle>
                    <CardDescription className="text-base">{rate.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-gray-600">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        Easy application process
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        Quick approval
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        Expert assistance
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/subsidy">
              <Button size="lg" variant="outline">
                View Complete Subsidy Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Referral Program Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Join Our Referral Program</h2>
            <p className="mt-4 text-lg text-blue-100">
              Earn rewards by helping others switch to solar energy
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                    <CardDescription className="text-blue-100">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/auth/login">
              <Button size="xl" className="bg-white text-blue-600 hover:bg-blue-50">
                Start Earning Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">What Our Customers Say</h2>
            <p className="mt-4 text-lg text-gray-600">
              Join thousands of satisfied customers
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover-lift">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base">
                    "Excellent service! The installation was quick and professional. Highly recommended!"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">A</span>
                    </div>
                    <div>
                      <div className="font-semibold">Customer {i}</div>
                      <div className="text-sm text-gray-500">Mumbai, Maharashtra</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Switch to Solar Energy?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Get a free consultation and start saving on your electricity bills today
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact">
              <Button size="xl" className="bg-white text-blue-600 hover:bg-blue-50">
                Contact Us Today
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="xl" variant="outline" className="border-white text-white hover:bg-white/10">
                Join Referral Program
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
