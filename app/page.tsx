'use client';

import Link from 'next/link';
import { ArrowRight, Sun, Zap, Users, Award, TrendingUp, Shield, Leaf, IndianRupee, CheckCircle2, Star, MapPin, Mail, Phone, Building2, Home, Factory } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CounterAnimation from '@/components/CounterAnimation';
import { motion } from 'framer-motion';

export default function HomePage() {
  const benefits = [
    {
      icon: IndianRupee,
      title: 'Government Subsidy',
      description: 'Get up to ₹30,000 subsidy on solar installation through PM Surya Ghar Yojana',
    },
    {
      icon: Zap,
      title: 'Reduce Bills',
      description: 'Cut your electricity costs by up to 90% with solar energy',
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'Clean, renewable energy for a sustainable future',
    },
    {
      icon: Shield,
      title: '25 Year Warranty',
      description: 'Industry-leading warranty on all solar products and installations',
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
      description: 'Quick payout process with secure bank transfers',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Enterprise-grade security for all transactions',
    },
  ];

  const subsidyRates = [
    { 
      capacity: '1 kW', 
      amount: '₹30,000', 
      description: 'Perfect for small homes',
      icon: Home,
      details: 'One-time subsidy for 1 kilowatt system'
    },
    { 
      capacity: '2 kW', 
      amount: '₹60,000', 
      description: 'Ideal for medium homes',
      icon: Building2,
      details: 'Enhanced subsidy for 2 kilowatt system'
    },
    { 
      capacity: '3 kW or Higher', 
      amount: '₹78,000', 
      description: 'Maximum subsidy cap',
      icon: Factory,
      details: 'Fixed subsidy for systems 3kW and above'
    },
  ];

  const stats = [
    { value: 10000, label: 'Installations', suffix: '+' },
    { value: 50, label: 'Savings Generated', prefix: '₹', suffix: ' Cr+' },
    { value: 98, label: 'Customer Satisfaction', suffix: '%' },
    { value: 500, label: 'Active Referrers', suffix: '+' },
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      location: 'Mumbai, Maharashtra',
      role: 'Homeowner',
      image: 'RK',
      rating: 5,
      text: 'Excellent service! The installation was quick and professional. My electricity bill has reduced by 85%. Highly recommended!',
    },
    {
      name: 'Priya Sharma',
      location: 'Pune, Maharashtra',
      role: 'Business Owner',
      image: 'PS',
      rating: 5,
      text: 'Outstanding experience from start to finish. The team was knowledgeable and the quality of work exceeded expectations.',
    },
    {
      name: 'Amit Patel',
      location: 'Ahmedabad, Gujarat',
      role: 'Referral Partner',
      image: 'AP',
      rating: 5,
      text: 'Great referral program! I have earned over ₹50,000 by referring customers. The process is transparent and payouts are quick.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 pt-16">
        {/* Background Video */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/dashboard.mp4" type="video/mp4" />
          </video>
          {/* Subtle Vignette Overlay - Only darkens edges */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/60" />
          {/* Text area overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 via-slate-900/30 to-transparent lg:to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-12 z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/40 bg-slate-900/60 backdrop-blur-xl px-4 py-2 text-sm font-medium text-white shadow-lg">
                <Sun className="h-4 w-4" />
                PM Surya Ghar - Muft Bijli Yojana
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
                Power Your Home with Clean Solar Energy
              </h1>
              <p className="mb-8 text-lg text-white leading-relaxed" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                Join India's largest solar revolution. Get government subsidies up to ₹30,000 and reduce your electricity bills by up to 90%. Earn rewards through our referral program.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/auth/login">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/subsidy">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-blue hover:bg-white/10">
                    View Subsidy Details
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="aspect-square rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8 shadow-2xl">
                <div className="flex h-full items-center justify-center text-white/60">
                  <Sun className="h-32 w-32" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">
                See Solar in Action
              </h2>
              <p className="text-lg text-slate-600">
                Watch how we're transforming homes with clean, sustainable energy
              </p>
            </motion.div>

            {/* Video Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-50"
            >
              <div className="aspect-video w-full">
                <video
                  controls
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover bg-slate-900"
                  poster="/videos/video-poster.jpg"
                >
                  <source src="/videos/showcase.mp4" type="video/mp4" />
                  <div className="flex items-center justify-center h-full bg-slate-100">
                    <p className="text-slate-500">Your browser does not support the video tag.</p>
                  </div>
                </video>
              </div>
            </motion.div>

            {/* Video Description */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-slate-600">
                Real installations • Professional service • Satisfied customers
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Animated Counters with India Map Background */}
      <section className="border-y border-slate-200 bg-white py-16 relative overflow-hidden">
        {/* Dotted India Map Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <img
            src="/images/india-map-dots.png"
            alt=""
            className="max-w-2xl w-full h-auto"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 transition-colors group-hover:text-sky-600">
                  <CounterAnimation 
                    end={stat.value} 
                    duration={2500}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>
                <div className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Solar - Image Cards Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-white text-sm font-semibold mb-4">
                <Award className="h-4 w-4" />
                Why Choose Us
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-6">
                Why Choose Solar Energy?
              </h2>
              <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                Our mission is to drive progress and enhance the lives of our customers by delivering superior{' '}
                <span className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  solar solutions
                </span>{' '}
                that exceed expectations.
              </p>
            </motion.div>
          </div>

          {/* Image Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 - Happy Customers - SUPPORTS IMAGE OR VIDEO */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0 * 0.15 }}
              whileHover={{ y: -6 }}
              className="group cursor-pointer"
            >
              <div className="relative h-80 rounded-2xl overflow-hidden">
                {/* Background - Gradient fallback */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-blue-600" />
                
                {/* OPTION 1: Image - Uncomment and add your image path */}
                <img
                  src="/images/why-choose/happy-customers.jpg"
                  alt="Happy Customers"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                
                {/* OPTION 2: Video - Uncomment to use video instead of image */}
                {/* 
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src="/videos/why-choose/happy-customers.mp4" type="video/mp4" />
                </video>
                */}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-4xl font-bold text-white mb-1">10,000+</div>
                      <div className="text-sm font-medium text-white/90">Happy Customers</div>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 flex-shrink-0">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2 - Warranty Coverage - SUPPORTS IMAGE OR VIDEO */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 1 * 0.15 }}
              whileHover={{ y: -6 }}
              className="group cursor-pointer"
            >
              <div className="relative h-80 rounded-2xl overflow-hidden">
                {/* Background - Gradient fallback */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600" />
                
                {/* OPTION 1: Image - Uncomment and add your image path */}
                <img
                  src="/images/why-choose/warranty.jpg"
                  alt="25 Year Warranty"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                
                {/* OPTION 2: Video - Uncomment to use video instead of image */}
                {/* 
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src="/videos/why-choose/warranty.mp4" type="video/mp4" />
                </video>
                */}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-4xl font-bold text-white mb-1">25 Years</div>
                      <div className="text-sm font-medium text-white/90">Warranty Coverage</div>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 flex-shrink-0">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 3 - Bill Reduction - SUPPORTS IMAGE OR VIDEO */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 2 * 0.15 }}
              whileHover={{ y: -6 }}
              className="group cursor-pointer"
            >
              <div className="relative h-80 rounded-2xl overflow-hidden">
                {/* Background - Gradient fallback */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600" />
                
                {/* OPTION 1: Image - Uncomment and add your image path */}
                <img
                  src="/images/why-choose/savings.jpg"
                  alt="90% Bill Reduction"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                
                {/* OPTION 2: Video - Uncomment to use video instead of image */}
                {/* 
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src="/videos/why-choose/savings.mp4" type="video/mp4" />
                </video>
                */}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-4xl font-bold text-white mb-1">90%</div>
                      <div className="text-sm font-medium text-white/90">Bill Reduction</div>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 flex-shrink-0">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 4 - Referral Earnings - SUPPORTS IMAGE OR VIDEO */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 3 * 0.15 }}
              whileHover={{ y: -6 }}
              className="group cursor-pointer"
            >
              <div className="relative h-80 rounded-2xl overflow-hidden">
                {/* Background - Gradient fallback */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600" />
                
                {/* OPTION 1: Image - Uncomment and add your image path */}
                <img
                  src="/images/why-choose/referral-earnings.jpg"
                  alt="Referral Earnings"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                
                {/* OPTION 2: Video - Uncomment to use video instead of image */}
                {/* 
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src="/videos/why-choose/referral-earnings.mp4" type="video/mp4" />
                </video>
                */}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-4xl font-bold text-white mb-1">₹5,000</div>
                      <div className="text-sm font-medium text-white/90">Per Referral Earning</div>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 flex-shrink-0">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Subsidy Section - PM Surya Ghar Muft Bijli Yojana */}
      <section className="py-24 bg-gradient-to-b from-white to-sky-50/30 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(14, 165, 233) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 border border-sky-200 text-sky-700 text-sm font-semibold mb-4">
                <IndianRupee className="h-4 w-4" />
                Government Subsidy 2025
              </div>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl mb-4">
                Solar Subsidy Under the{' '}
                <span className="text-sky-600">PM Surya Ghar</span>{' '}
                Muft Bijli Yojana, 2025
              </h2>
              <p className="text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Get substantial government subsidies to make solar energy affordable for every Indian home
              </p>
            </motion.div>
          </div>

          {/* Subsidy Cards with Icons */}
          <div className="grid gap-8 md:grid-cols-3 mb-12">
            {subsidyRates.map((rate, index) => {
              const Icon = rate.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.15,
                    ease: [0.25, 0.4, 0.25, 1]
                  }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <Card className="h-full text-center group cursor-pointer">
                    <CardHeader className="pb-3">
                      {/* Capacity Badge */}
                      <div className="mb-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-sm font-semibold">
                          <Icon className="h-4 w-4" />
                          {rate.capacity}
                        </div>
                      </div>
                      
                      {/* Amount - Large and Prominent */}
                      <div className="text-5xl font-bold text-sky-600 mb-3">{rate.amount}</div>
                      
                      {/* Description */}
                      <CardTitle className="text-lg text-slate-900 mb-2">{rate.description}</CardTitle>
                      <CardDescription className="text-sm text-slate-600">{rate.details}</CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-4" />
                      <ul className="space-y-2.5">
                        <li className="flex items-start text-sm text-slate-700">
                          <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>Easy online application process</span>
                        </li>
                        <li className="flex items-start text-sm text-slate-700">
                          <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>Quick government approval</span>
                        </li>
                        <li className="flex items-start text-sm text-slate-700">
                          <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>Expert installation assistance</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Important Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12"
          >
            <div className="bg-white border border-sky-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="h-6 w-6 rounded-full bg-sky-100 flex items-center justify-center">
                    <span className="text-sky-600 font-bold text-sm">i</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-2">Important Information:</h3>
                  <div className="text-sm text-slate-700 leading-relaxed">
                    <span className="text-sky-500 mr-2">•</span>
                    <span>The Indian government has capped the subsidy for homeowners at a <strong>maximum of ₹78,000</strong>. Any system that is 3 kW or higher receives a fixed subsidy of ₹78,000.</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-10"
          >
            <Link href="/subsidy">
              <Button size="lg" className="shadow-lg">
                View Complete Subsidy Details & Apply Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Referral Program Section - Professional Design */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold mb-4">
                <Award className="h-4 w-4" />
                Referral Program
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-4">
                Join Our Referral Program
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Earn rewards by helping others switch to solar energy
              </p>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.15,
                  ease: [0.25, 0.4, 0.25, 1]
                }}
                whileHover={{ y: -6 }}
              >
                <Card className="h-full bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-white mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-slate-300">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <Link href="/auth/login">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                Start Earning Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section - Professional Cards with India Map */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        {/* Large Dotted India Map Background */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full flex items-center justify-end opacity-5 pointer-events-none">
          <img
            src="/images/india-map-dots.png"
            alt=""
            className="w-full max-w-xl h-auto"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold mb-4">
                <Star className="h-4 w-4 fill-amber-600" />
                Testimonials
              </div>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl mb-4">
                What Our Customers Say
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Join thousands of satisfied customers across India
              </p>
            </motion.div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.15,
                  ease: [0.25, 0.4, 0.25, 1]
                }}
                whileHover={{ y: -6 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <CardDescription className="text-base text-slate-700 leading-relaxed mb-6">
                      "{testimonial.text}"
                    </CardDescription>

                    {/* Customer Info */}
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                        {testimonial.image}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{testimonial.name}</div>
                        <div className="text-sm text-slate-500">{testimonial.role}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
              Ready to Switch to Solar Energy?
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Get a free consultation and start saving on your electricity bills today
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 w-full sm:w-auto">
                  Contact Us Today
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                  Join Referral Program
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
