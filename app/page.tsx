'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Sun, Zap, Users, Award, TrendingUp, Shield, Leaf, IndianRupee, CheckCircle2, Star, MapPin, Mail, Phone, Building2, Home, Factory, Clock, FileCheck, Wrench, Plug, Calculator, HelpCircle, MessageCircle, TrendingDown, Verified, Send, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CounterAnimation from '@/components/CounterAnimation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { supabase } from '@/lib/supabase/client';
import { validateEmail, validatePhoneNumber } from '@/lib/utils';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [submitting, setSubmitting] = useState(false);
  const [showSubsidyModal, setShowSubsidyModal] = useState(false);
  const [subsidyModalShown, setSubsidyModalShown] = useState(false);
  const [activeTab, setActiveTab] = useState<'direct' | 'lead'>('direct');
  const [directInquiryData, setDirectInquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    propertyType: '',
    notes: '',
  });
  const [leadFormData, setLeadFormData] = useState({
    leadName: '',
    leadPhone: '',
    leadEmail: '',
    leadCity: '',
    leadPropertyType: '',
    leadNotes: '',
    referrerName: '',
    referrerPhone: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  // Handle scroll to sections if hash is present
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#services' || hash === '#subsidy' || hash === '#contact') {
      setTimeout(() => {
        const section = document.getElementById(hash.substring(1));
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  // Intersection Observer for Subsidy Section
  useEffect(() => {
    const subsidySection = document.getElementById('subsidy');
    if (!subsidySection || subsidyModalShown) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !subsidyModalShown) {
            setTimeout(() => {
              setShowSubsidyModal(true);
              setSubsidyModalShown(true);
            }, 500); // Small delay for better UX
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of section is visible
        rootMargin: '-100px 0px',
      }
    );

    observer.observe(subsidySection);

    return () => {
      observer.disconnect();
    };
  }, [subsidyModalShown]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (formData.phone && !validatePhoneNumber(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    if (!formData.message.trim()) {
      toast.error('Message is required');
      return;
    }

    setSubmitting(true);

    try {
      if (!supabase) {
        toast.error('Database connection not configured. Please check your Supabase settings.');
        setSubmitting(false);
        return;
      }

      // Check if Supabase URL is valid
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl === 'your-project-url.supabase.co') {
        toast.error('Supabase is not properly configured. Please set NEXT_PUBLIC_SUPABASE_URL in .env.local');
        setSubmitting(false);
        return;
      }

      // Save to database
      if (!supabase) {
        toast.error('Database connection not available');
        return;
      }
      const db = supabase as any;
      const { error: dbError } = await db.from('contact_inquiries').insert([
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone || null,
          subject: formData.subject.trim() || null,
          message: formData.message.trim(),
          status: 'new',
        },
      ] as any);

      if (dbError) throw dbError;

      // Send email notification
      try {
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'contact',
            formData: formData,
          }),
        });

        if (!emailResponse.ok) {
          const errorData = await emailResponse.json();
          console.error('Email sending failed:', errorData);
          // Don't fail the form submission if email fails
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Don't fail the form submission if email fails
      }

      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDirectInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!directInquiryData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!validatePhoneNumber(directInquiryData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    if (directInquiryData.email && !validateEmail(directInquiryData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!directInquiryData.city.trim()) {
      toast.error('City is required');
      return;
    }

    setSubmitting(true);

    try {
      if (!supabase) {
        toast.error('Database connection not configured. Please check your Supabase settings.');
        setSubmitting(false);
        return;
      }

      // Check if Supabase URL is valid
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl === 'your-project-url.supabase.co') {
        toast.error('Supabase is not properly configured. Please set NEXT_PUBLIC_SUPABASE_URL in .env.local');
        setSubmitting(false);
        return;
      }

      // Save to database
      if (!supabase) {
        toast.error('Database connection not available');
        return;
      }
      const db = supabase as any;
      const { error: dbError } = await db.from('contact_inquiries').insert([
        {
          name: directInquiryData.name.trim(),
          email: directInquiryData.email.trim() || null,
          phone: directInquiryData.phone,
          subject: `Direct Subsidy Inquiry - ${directInquiryData.propertyType || 'Not specified'}`,
          message: `City: ${directInquiryData.city}\nProperty Type: ${directInquiryData.propertyType || 'Not specified'}\nNotes: ${directInquiryData.notes || 'None'}\nType: Direct Customer Inquiry`,
          status: 'new',
        },
      ] as any);

      if (dbError) throw dbError;

      // Send email notification
      try {
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'subsidy',
            formData: directInquiryData,
          }),
        });

        if (!emailResponse.ok) {
          const errorData = await emailResponse.json();
          console.error('Email sending failed:', errorData);
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError);
      }

      toast.success('Thank you! We\'ll contact you soon about your solar subsidy inquiry.');
      setDirectInquiryData({
        name: '',
        email: '',
        phone: '',
        city: '',
        propertyType: '',
        notes: '',
      });
      setShowSubsidyModal(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeadFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!leadFormData.leadName.trim()) {
      toast.error('Lead name is required');
      return;
    }

    if (!validatePhoneNumber(leadFormData.leadPhone)) {
      toast.error('Please enter a valid 10-digit phone number for the lead');
      return;
    }

    if (leadFormData.leadEmail && !validateEmail(leadFormData.leadEmail)) {
      toast.error('Please enter a valid email address for the lead');
      return;
    }

    if (!leadFormData.leadCity.trim()) {
      toast.error('Lead city is required');
      return;
    }

    if (!leadFormData.referrerName.trim()) {
      toast.error('Referrer name is required');
      return;
    }

    if (!validatePhoneNumber(leadFormData.referrerPhone)) {
      toast.error('Please enter a valid 10-digit phone number for the referrer');
      return;
    }

    setSubmitting(true);

    try {
      if (!supabase) {
        toast.error('Database connection not configured. Please check your Supabase settings.');
        setSubmitting(false);
        return;
      }

      // Check if Supabase URL is valid
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl === 'your-project-url.supabase.co') {
        toast.error('Supabase is not properly configured. Please set NEXT_PUBLIC_SUPABASE_URL in .env.local');
        setSubmitting(false);
        return;
      }

      // Save to database
      if (!supabase) {
        toast.error('Database connection not available');
        return;
      }
      const db = supabase as any;
      const { error: dbError } = await db.from('contact_inquiries').insert([
        {
          name: leadFormData.leadName.trim(),
          email: leadFormData.leadEmail.trim() || null,
          phone: leadFormData.leadPhone,
          subject: `Lead Submission - ${leadFormData.leadPropertyType || 'Not specified'}`,
          message: `City: ${leadFormData.leadCity}\nProperty Type: ${leadFormData.leadPropertyType || 'Not specified'}\nNotes: ${leadFormData.leadNotes || 'None'}\nType: Lead Submission\nReferrer Name: ${leadFormData.referrerName}\nReferrer Phone: ${leadFormData.referrerPhone}`,
          status: 'new',
        },
      ] as any);

      if (dbError) throw dbError;

      // Send email notification
      try {
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'subsidy',
            formData: {
              name: leadFormData.leadName,
              email: leadFormData.leadEmail,
              phone: leadFormData.leadPhone,
              city: leadFormData.leadCity,
              propertyType: leadFormData.leadPropertyType,
              notes: leadFormData.leadNotes,
              referrerName: leadFormData.referrerName,
              referrerPhone: leadFormData.referrerPhone,
            },
          }),
        });

        if (!emailResponse.ok) {
          const errorData = await emailResponse.json();
          console.error('Email sending failed:', errorData);
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError);
      }

      toast.success('Lead submitted successfully! We\'ll contact the lead soon.');
      setLeadFormData({
        leadName: '',
        leadPhone: '',
        leadEmail: '',
        leadCity: '',
        leadPropertyType: '',
        leadNotes: '',
        referrerName: '',
        referrerPhone: '',
      });
      setShowSubsidyModal(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: IndianRupee,
      title: 'Government Subsidy',
      description: 'Direct financial benefit sent to your account under PM Surya Ghar Muft Bijli Yojana. We handle all the complex paperwork for you.',
      large: true,
    },
    {
      icon: TrendingDown,
      title: 'Reduce Bills',
      description: 'Save up to 90% on electricity bills immediately after installation.',
      large: false,
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'Reduce your carbon footprint and contribute to a greener planet.',
      large: false,
    },
    {
      icon: Verified,
      title: '25 Year Warranty',
      description: 'Long-term performance guarantee on panels ensuring peace of mind. We stand by our installation quality.',
      large: true,
    },
  ];

  const features = [
    {
      icon: '📢',
      title: 'Refer & Earn',
      description: 'Share your unique code via WhatsApp or Email.',
    },
    {
      icon: '💳',
      title: 'Instant Rewards',
      description: 'Get ₹2,000 directly to your bank account.',
    },
    {
      icon: '📊',
      title: 'Track Progress',
      description: 'Real-time status updates on your dashboard.',
    },
    {
      icon: '🔒',
      title: 'Transparent',
      description: 'No hidden terms. Clear payout structure.',
    },
  ];

  const subsidyRates = [
    { 
      capacity: '3 kW+ System', 
      amount: '₹78,000', 
      description: 'Maximum subsidy cap. Perfect for large families or high consumption. Get the highest government subsidy available.',
      icon: Factory,
      featured: true,
    },
    { 
      capacity: '1 kW System', 
      amount: '₹30,000', 
      description: 'Fixed subsidy amount. Ideal for small homes with basic electrical needs.',
      icon: Home,
      featured: false,
    },
    { 
      capacity: '2 kW System', 
      amount: '₹60,000', 
      description: 'Maximum efficiency subsidy. Covers most medium-sized households with ACs and geysers.',
      icon: Building2,
      featured: false,
    },
  ];

  const stats = [
    { value: 10, label: 'Years Of Experience', prefix: '', suffix: '+' },
    { value: 20, label: 'Areas Served', prefix: '', suffix: '+' },
    { value: 565, label: 'Successful Installations', prefix: '', suffix: '+' },
    { value: 100, label: 'Professional Workers', prefix: '', suffix: '' },
  ];

  const testimonials = [
    {
      name: 'Harshdeep Patel',
      location: 'Hyderabad',
      role: 'Customer',
      image: '/images/testimonials/harshdeep-patel.jpg',
      rating: 5,
      text: 'Switching to solar was one of the best decisions we\'ve made. Our energy bills have dropped dramatically, and the installation process was smooth from start to finish.',
    },
    {
      name: 'Suvarna Bhanushali',
      location: 'Hyderabad',
      role: 'Business Owner',
      image: '/images/testimonials/suvarna-bhanushali.jpg',
      rating: 5,
      text: 'Mahalakshmi Solar Power provided excellent customer service and support. Our business is now running on clean, renewable energy, and we\'re seeing significant savings every month.',
    },
    {
      name: 'Veeranna Ayyar',
      location: 'Hyderabad',
      role: 'Customer',
      image: '/images/testimonials/veeranna-ayyar.jpg',
      rating: 5,
      text: 'We couldn\'t be happier with our solar system. It feels great knowing we\'re doing our part to reduce our carbon footprint.',
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section - Video Background with Centered Content */}
      <section className="relative overflow-hidden bg-black pt-20 pb-16 sm:pt-32 sm:pb-32 min-h-[500px] sm:min-h-[600px] flex items-center" style={{ marginTop: '64px', paddingTop: '80px', marginLeft: '-50vw', marginRight: '-50vw', paddingLeft: 0, paddingRight: 0, width: '100vw', position: 'relative', left: '50%' }}>
        {/* Background Video */}
        <div className="absolute inset-0 overflow-hidden" style={{ top: 0, left: 0, right: 0, bottom: 0, margin: 0, padding: 0, width: '100%' }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ margin: 0, padding: 0, width: '100%', height: '100%', objectFit: 'cover', minWidth: '100vw' }}
          >
            <source src="/videos/dashboard.mp4" type="video/mp4" />
          </video>
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" style={{ margin: 0, padding: 0 }} />
        </div>

        {/* Centered Content */}
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 backdrop-blur-md"
            >
              <Verified className="h-3.5 w-3.5 text-orange-500" />
              <span className="text-xs font-bold uppercase tracking-wide text-orange-400">PM Surya Ghar Initiative</span>
            </motion.div>
            
            <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white">
              Power Your Home with <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-emerald-400">Clean Solar Energy</span>
            </h1>
            
            <p className="mb-6 sm:mb-10 text-base sm:text-lg md:text-xl leading-relaxed text-gray-200 mx-auto max-w-2xl px-2">
              Providing energy for a better, greener future by utilizing sustainable and renewable alternatives. With over 10 years of experience, we provide cutting-edge solar panel solutions for homes and businesses in Hyderabad.
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center w-full sm:w-auto">
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto flex h-12 sm:h-14 min-w-[160px] items-center justify-center rounded-xl bg-emerald-600 px-6 sm:px-8 text-sm sm:text-base font-bold text-white shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:scale-105">
                  Get Started
                </Button>
              </Link>
              <Link href="/leads-dashboard" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto flex h-12 sm:h-14 min-w-[160px] items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 sm:px-8 text-sm sm:text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10">
                  <Award className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Lead Dashboard
                </Button>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-12 gap-y-3 sm:gap-y-4 border-t border-white/10 pt-6 sm:pt-8 text-xs sm:text-sm font-medium text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>2,400+ Installations</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span>25 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-emerald-500 fill-emerald-500" />
                <span>92% Satisfaction</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-emerald-50 py-12 sm:py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-12 md:mb-16 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-emerald-900">Let's See How It Works</h2>
            <p className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-600 px-4">Simple 4-step process to get your solar system installed</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-4 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>
            {[
              { step: '01', icon: MessageCircle, title: 'Free Consultation & Site Assessment', description: 'Our experts analyze your location and energy usage to design a custom solar solution.' },
              { step: '02', icon: Wrench, title: 'Professional Installation', description: 'We ensure your panels are installed safely and efficiently by certified technicians.' },
              { step: '03', icon: TrendingUp, title: 'Monitoring & Maintenance', description: 'Get peace of mind with ongoing system monitoring, maintenance, and performance optimization.' },
              { step: '04', icon: Shield, title: 'Warranties', description: 'Enjoy long-term warranties on our solar panels and installation services.' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative flex flex-col items-center text-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:bg-transparent md:border-none md:shadow-none md:p-0"
                >
                  <div className={`mb-6 flex size-14 items-center justify-center rounded-full ${index === 3 ? 'bg-emerald-600 border-2 border-emerald-600' : 'bg-white border-2 border-emerald-600'} text-xl font-bold ${index === 3 ? 'text-white shadow-lg shadow-emerald-600/30' : 'text-emerald-600 shadow-sm'} z-10 group-hover:scale-110 transition-transform`}>
                    {item.step}
                  </div>
                  <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-gray-100 bg-white py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:gap-12 text-center md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col gap-2"
              >
                <span className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-emerald-600">
                  <CounterAnimation 
                    end={stat.value} 
                    duration={2500}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section with Images - Two Column Layout */}
      <section id="services" className="bg-white py-12 sm:py-16 md:py-24 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-12 md:mb-16 text-center px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-emerald-900 mb-3 sm:mb-4">Our Products and Services</h2>
            <p className="text-base sm:text-lg text-gray-600">Comprehensive solar solutions for homes, businesses, and industries in Hyderabad</p>
          </div>
          <div className="space-y-16">
            {[
              {
                title: 'Residential Solar Systems',
                description: 'Optimize your home\'s energy use and enjoy long-term savings with high-efficiency solar panels for homes in Hyderabad.',
                image: '/images/services/residential-solar.png',
                icon: Home,
                reverse: false,
              },
              {
                title: 'Commercial Solar Systems',
                description: 'Help your business reduce operational costs and boost sustainability. Discover affordable solar panel prices in Hyderabad for commercial needs.',
                image: '/images/services/commercial-solar.png',
                icon: Building2,
                reverse: true,
              },
              {
                title: 'Industrial Solar Systems',
                description: 'Store excess energy for use during peak demand or power outages. Perfect for large-scale operations requiring reliable and sustainable energy solutions.',
                image: '/images/services/industrial-solar.png',
                icon: Factory,
                reverse: false,
              },
              {
                title: 'On Grid & Off Grid Systems',
                description: 'Customizable solutions to fit your space and energy needs, with support from trusted solar power companies in Hyderabad. Choose the system that works best for your requirements.',
                image: '/images/services/grid-systems.png',
                icon: Plug,
                reverse: true,
              },
            ].map((service, index) => {
              const Icon = service.icon;
              return (
            <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`grid grid-cols-1 gap-8 lg:grid-cols-2 items-center ${service.reverse ? 'lg:grid-flow-dense' : ''}`}
                >
                  <div className={`${service.reverse ? 'lg:col-start-2' : ''}`}>
                    <div className="relative h-64 sm:h-80 lg:h-96 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl group">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23e5e7eb" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="Arial" font-size="24"%3EImage Placeholder%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 via-transparent to-transparent"></div>
                    </div>
                  </div>
                  <div className={`${service.reverse ? 'lg:col-start-1 lg:row-start-1' : ''} flex flex-col justify-center`}>
                    <div className="inline-flex items-center gap-3 mb-4">
                      <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Service {index + 1}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">{service.title}</h3>
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-6">{service.description}</p>
                    <Link href="/services">
                      <Button className="w-full sm:w-fit bg-emerald-600 text-white hover:bg-emerald-700">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
            </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Grid with Large Cards */}
      <section className="bg-emerald-50 py-12 sm:py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-12 md:mb-16 text-center px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-emerald-900 mb-3 sm:mb-4">Why Choose Us?</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">Certified and experienced professionals providing high-efficiency, durable solar panels with end-to-end services and unmatched customer support.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Verified,
                title: 'Certified Professionals',
                description: 'Experienced and certified technicians ensuring quality installations with industry-leading expertise.',
                image: '/images/why-choose-us/certified.png',
              },
              {
                icon: Zap,
                title: 'High-Efficiency Panels',
                description: 'Durable solar panels designed for maximum efficiency and longevity, backed by 25-year warranties.',
                image: '/images/why-choose-us/efficient-panels.png',
              },
              {
                icon: CheckCircle2,
                title: 'End-to-End Services',
                description: 'Complete services from consultation to installation and maintenance, all under one roof.',
                image: '/images/why-choose-us/end-to-end.png',
              },
              {
                icon: Shield,
                title: 'Unmatched Support',
                description: 'Dedicated customer support and maintenance services available 24/7 for your peace of mind.',
                image: '/images/why-choose-us/support.png',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm transition-all hover:shadow-xl hover:border-emerald-600/30"
                >
                  <div className="relative h-56 bg-gray-200 overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="Arial" font-size="18"%3EImage Placeholder%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 via-emerald-900/20 to-transparent"></div>
                      </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Benefits Section - Enhanced Grid */}
      <section className="bg-white py-12 sm:py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-12 md:mb-16 text-center px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-emerald-900 mb-3 sm:mb-4">Benefits of Solar Power</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">Solar energy is the future of power generation—clean, sustainable, and cost-effective. Whether you're looking to reduce your electricity bills or make an eco-friendly choice, solar energy offers a multitude of benefits.</p>
        </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: TrendingDown,
                title: 'Reduce Energy Bills',
                description: 'Save up to 70% on electricity costs by generating your power with solar power in Hyderabad.',
                image: '/images/benefits/reduce-bills.png',
                color: 'from-orange-500/20 to-orange-600/10',
              },
              {
                icon: Wrench,
                title: 'Low Maintenance',
                description: 'Solar systems require minimal upkeep and offer long-lasting performance with minimal intervention.',
                image: '/images/benefits/low-maintenance.png',
                color: 'from-blue-500/20 to-blue-600/10',
              },
              {
                icon: Leaf,
                title: 'Environmentally Friendly',
                description: 'Solar power reduces carbon emissions and helps combat climate change for a greener future.',
                image: '/images/benefits/eco-friendly.png',
                color: 'from-green-500/20 to-green-600/10',
              },
              {
                icon: Zap,
                title: 'Energy Independence',
                description: 'Generate your own electricity and reduce dependence on the grid for true energy freedom.',
                image: '/images/benefits/energy-independence.png',
                color: 'from-yellow-500/20 to-yellow-600/10',
              },
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
            <motion.div
                  key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-md transition-all hover:shadow-2xl hover:border-emerald-600/50 hover:-translate-y-2"
                >
                  <div className="relative h-52 bg-gray-200 overflow-hidden">
                    <img
                      src={benefit.image}
                      alt={benefit.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="Arial" font-size="18"%3EImage Placeholder%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color}`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>
                  <div className="p-6 relative">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                  </div>
            </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Subsidy Modal */}
      <Dialog open={showSubsidyModal} onOpenChange={setShowSubsidyModal}>
        <DialogContent onClose={() => setShowSubsidyModal(false)} className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full mx-2 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-emerald-900">Solar Subsidy Inquiry</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Choose your inquiry type below
            </DialogDescription>
          </DialogHeader>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200 mt-4">
            <button
              onClick={() => setActiveTab('direct')}
              className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
                activeTab === 'direct'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Direct Inquiry
            </button>
            <button
              onClick={() => setActiveTab('lead')}
              className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
                activeTab === 'lead'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Submit Lead
            </button>
                        </div>

          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === 'direct' ? (
              <form onSubmit={handleDirectInquirySubmit} className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Customer Direct Inquiry</h3>
                  <p className="text-sm text-gray-600">Fill in your details if you're interested in getting a solar subsidy for yourself.</p>
                        </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="direct-name">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="direct-name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={directInquiryData.name}
                      onChange={(e) => setDirectInquiryData({ ...directInquiryData, name: e.target.value })}
                      required
                    />
                      </div>

                  <div className="space-y-2">
                    <Label htmlFor="direct-phone">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="direct-phone"
                      name="phone"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={directInquiryData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setDirectInquiryData({ ...directInquiryData, phone: value });
                      }}
                      required
                    />
                      </div>
                    </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="direct-email">Email (Optional)</Label>
                    <Input
                      id="direct-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={directInquiryData.email}
                      onChange={(e) => setDirectInquiryData({ ...directInquiryData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="direct-city">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="direct-city"
                      name="city"
                      type="text"
                      placeholder="Enter your city"
                      value={directInquiryData.city}
                      onChange={(e) => setDirectInquiryData({ ...directInquiryData, city: e.target.value })}
                      required
                    />
            </div>
          </div>

                <div className="space-y-2">
                  <Label htmlFor="direct-property">Property Type</Label>
                  <select
                    id="direct-property"
                    name="propertyType"
                    value={directInquiryData.propertyType}
                    onChange={(e) => setDirectInquiryData({ ...directInquiryData, propertyType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select property type</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direct-notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="direct-notes"
                    name="notes"
                    placeholder="Tell us about your requirements..."
                    value={directInquiryData.notes}
                    onChange={(e) => setDirectInquiryData({ ...directInquiryData, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-600 text-white hover:bg-emerald-700 font-medium"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Inquiry'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              </form>
            ) : (
              <form onSubmit={handleLeadFormSubmit} className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Submit a Lead</h3>
                  <p className="text-sm text-gray-600">Fill in the lead's information and your referrer details to submit a lead.</p>
        </div>

                <div className="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-2">
                  {/* Lead Information Column */}
                  <div className="space-y-4">
                    <div className="pb-4 border-b border-gray-200">
                      <h4 className="text-base font-bold text-emerald-900 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Lead Information
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">Details of the potential customer</p>
        </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="lead-name">
                          Lead Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="lead-name"
                          name="leadName"
                          type="text"
                          placeholder="Enter lead's full name"
                          value={leadFormData.leadName}
                          onChange={(e) => setLeadFormData({ ...leadFormData, leadName: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lead-phone">
                          Lead Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="lead-phone"
                          name="leadPhone"
                          type="tel"
                          placeholder="10-digit mobile number"
                          value={leadFormData.leadPhone}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setLeadFormData({ ...leadFormData, leadPhone: value });
                          }}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lead-email">Lead Email (Optional)</Label>
                        <Input
                          id="lead-email"
                          name="leadEmail"
                          type="email"
                          placeholder="lead@email.com"
                          value={leadFormData.leadEmail}
                          onChange={(e) => setLeadFormData({ ...leadFormData, leadEmail: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lead-city">
                          Lead City <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="lead-city"
                          name="leadCity"
                          type="text"
                          placeholder="Enter lead's city"
                          value={leadFormData.leadCity}
                          onChange={(e) => setLeadFormData({ ...leadFormData, leadCity: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lead-property">Property Type</Label>
                        <select
                          id="lead-property"
                          name="leadPropertyType"
                          value={leadFormData.leadPropertyType}
                          onChange={(e) => setLeadFormData({ ...leadFormData, leadPropertyType: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="">Select property type</option>
                          <option value="residential">Residential</option>
                          <option value="commercial">Commercial</option>
                          <option value="industrial">Industrial</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lead-notes">Additional Notes (Optional)</Label>
                        <Textarea
                          id="lead-notes"
                          name="leadNotes"
                          placeholder="Any additional information about the lead..."
                          value={leadFormData.leadNotes}
                          onChange={(e) => setLeadFormData({ ...leadFormData, leadNotes: e.target.value })}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Referrer Information Column */}
                  <div className="space-y-4">
                    <div className="pb-4 border-b border-gray-200">
                      <h4 className="text-base font-bold text-emerald-900 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Your Information (Referrer)
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">Your details as the referrer</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="referrer-name">
                          Your Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="referrer-name"
                          name="referrerName"
                          type="text"
                          placeholder="Enter your name"
                          value={leadFormData.referrerName}
                          onChange={(e) => setLeadFormData({ ...leadFormData, referrerName: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="referrer-phone">
                          Your Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="referrer-phone"
                          name="referrerPhone"
                          type="tel"
                          placeholder="10-digit mobile number"
                          value={leadFormData.referrerPhone}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setLeadFormData({ ...leadFormData, referrerPhone: value });
                          }}
                          required
                        />
                      </div>

                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-6">
                        <p className="text-sm text-gray-700">
                          <strong className="text-emerald-900">Note:</strong> You are submitting a lead on behalf of someone else. Make sure you have their permission to share their contact information.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-600 text-white hover:bg-emerald-700 font-medium"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Lead'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Subsidy Section */}
      <section id="subsidy" className="bg-white py-12 sm:py-16 md:py-24 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-8 sm:mb-12 md:mb-16 px-4">
            <span className="mb-3 sm:mb-4 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-600">Central Scheme</span>
            <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-emerald-900">Solar Subsidy Under PM Surya Ghar</h2>
            <p className="text-base sm:text-lg text-gray-600">Eligible households can receive substantial subsidies based on system capacity.</p>
          </div>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {subsidyRates.map((rate, index) => (
            <motion.div
                key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative rounded-2xl ${rate.featured ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white' : 'bg-gray-50 border border-gray-200'} p-8 transition-all hover:shadow-lg flex flex-col`}
              >
                {rate.featured && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-block rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1">Maximum</span>
              </div>
                )}
                <h3 className={`${rate.featured ? 'text-xl font-bold text-white mb-3' : 'text-lg font-bold text-gray-900 mb-2'}`}>
                  {rate.capacity}
                </h3>
                <div className={`${rate.featured ? 'text-4xl font-extrabold text-white mb-4' : 'text-3xl font-bold text-emerald-600 mb-3'}`}>
                  {rate.amount}
                </div>
                <p className={`${rate.featured ? 'text-emerald-50 text-sm leading-relaxed mb-6' : 'text-gray-600 text-sm leading-relaxed'} flex-grow`}>
                  {rate.description}
                </p>
                {rate.featured && (
                  <Link href="/subsidy" className="mt-auto">
                    <Button className="w-full bg-white text-emerald-700 hover:bg-gray-50 font-semibold">
                      Check Eligibility
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
            </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Program Section */}
      <section className="bg-emerald-900 py-12 sm:py-16 md:py-24 text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5 lg:col-span-4 relative">
              <span className="inline-block rounded-full bg-emerald-600/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-100 mb-4">Referral Program</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 sm:mb-6">Earn Rewards Together</h2>
              <p className="text-base sm:text-lg text-emerald-100 mb-6 sm:mb-8 leading-relaxed">
                Help your friends switch to clean energy and earn rewards for every successful installation. It's a win-win for everyone and the planet.
              </p>
              <div className="flex flex-col gap-5">
                <Button 
                  onClick={() => {
                    setActiveTab('lead');
                    setShowSubsidyModal(true);
                  }}
                  className="w-full sm:w-fit flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-colors"
                >
                  Join Program <ArrowRight className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-3 pt-4">
                  <div className="flex -space-x-2">
                    <div className="size-8 rounded-full border-2 border-emerald-900 bg-gray-300"></div>
                    <div className="size-8 rounded-full border-2 border-emerald-900 bg-gray-400"></div>
                    <div className="size-8 rounded-full border-2 border-emerald-900 bg-gray-500"></div>
                      </div>
                  <p className="text-sm text-emerald-300">Trusted by 2,000+ partners</p>
                    </div>
            </div>
          </div>
            <div className="md:col-span-7 lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {features.slice(0, 2).map((feature, index) => (
          <motion.div
                      key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="rounded-3xl bg-emerald-950 p-8 border border-emerald-800 hover:border-emerald-600 transition-colors"
                    >
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                      <p className="text-sm text-emerald-200">{feature.description}</p>
          </motion.div>
                  ))}
        </div>
                <div className="space-y-6 md:mt-12">
                  {features.slice(2, 4).map((feature, index) => (
            <motion.div
                      key={index + 2}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: (index + 2) * 0.1 }}
                      className="rounded-3xl bg-emerald-950 p-8 border border-emerald-800 hover:border-emerald-600 transition-colors"
                    >
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                      <p className="text-sm text-emerald-200">{feature.description}</p>
            </motion.div>
                  ))}
          </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-12 sm:py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 sm:mb-12 md:mb-16 text-center text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-emerald-900 px-4">What Our Customers Say</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col justify-between rounded-2xl bg-gray-50 p-8"
              >
                <div>
                  <div className="mb-4 flex text-orange-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mb-6 text-gray-600 italic">"{testimonial.text}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-10 overflow-hidden rounded-full bg-gray-200">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect fill="%23d1d5db" width="40" height="40"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-family="Arial" font-size="14"%3E' + testimonial.name.charAt(0) + '%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    </div>
                    <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-xs text-gray-500">{testimonial.role}, {testimonial.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-emerald-50 py-12 sm:py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 sm:mb-12 text-center text-2xl sm:text-3xl font-bold tracking-tight text-emerald-900 px-4">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-4">
            {[
              {
                question: 'How much roof space do I need?',
                answer: 'For a standard 1kW system, you typically need about 100 square feet of shadow-free roof area. A standard 3kW system would require approximately 300 square feet.'
              },
              {
                question: 'How long does installation take?',
                answer: 'The physical installation of panels usually takes 1-2 days. However, the entire process including site survey, design, net metering approvals, and grid connection typically takes 2-4 weeks.'
              },
              {
                question: 'What is the maintenance cost?',
                answer: 'Solar systems require very little maintenance. Occasional cleaning of panels to remove dust is recommended. There are no moving parts, so wear and tear is minimal.'
              },
              {
                question: 'How does the subsidy process work?',
                answer: 'Under the PM Surya Ghar scheme, you register on the national portal. Once we install the system and the net meter is installed, the subsidy amount is credited directly to your bank account within 30 days.'
              },
            ].map((faq, index) => (
              <details key={index} className="group rounded-xl bg-white p-6 shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-bold">{faq.question}</h3>
                  </div>
                  <ArrowRight className="h-5 w-5 transition duration-300 group-open:rotate-90" />
                </summary>
                <p className="mt-4 pl-9 text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white py-12 sm:py-16 md:py-24 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-emerald-900 mb-3 sm:mb-4">Get In Touch</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">Have questions? We're here to help you switch to solar energy</p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-20">
            {[
              { icon: MapPin, title: 'Address', content: '11-13-1139, Kothapet, Victoria Memorial Metro Station, Pillar No A1622, HYD-60' },
              { icon: Phone, title: 'Phone', content: ['9989944422', '9948045611'], links: ['tel:+919989944422', 'tel:+919948045611'] },
              { icon: Mail, title: 'Email', content: ['sales@mahalakshmisolarpower.com'], links: ['mailto:sales@mahalakshmisolarpower.com'] },
              { icon: Clock, title: 'Working Hours', content: 'Mon - Sat: 9:00 AM - 6:00 PM' },
            ].map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-6 rounded-2xl border border-gray-200 bg-white hover:shadow-lg transition-all"
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mx-auto">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{info.title}</h3>
                  {Array.isArray(info.content) ? (
                    info.content.map((item, i) => (
                      info.links && info.links[i] ? (
                        <a key={i} href={info.links[i]} className={`block text-gray-600 hover:text-emerald-600 transition-colors ${i === 0 ? 'mb-1' : ''}`}>
                          {item}
                    </a>
                  ) : (
                        <p key={i} className={`text-gray-600 ${i === 0 ? 'mb-1' : ''}`}>{item}</p>
                      )
                    ))
                  ) : (
                    <p className="text-sm text-gray-600 leading-relaxed">{info.content}</p>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Contact Form Section */}
          <div className="grid gap-8 sm:gap-12 md:gap-16 grid-cols-1 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-gray-700 text-xs font-medium tracking-wide uppercase mb-6">
                Contact Form
        </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Send Us a Message</h3>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                Fill out the form and our team will get back to you within 24 hours.
              </p>
              
              <div className="border border-gray-200 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Your Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      disabled={submitting}
                    />
        </div>
        
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData((prev) => ({ ...prev, phone: value }));
                      }}
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject (Optional)</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={handleFormChange}
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      Message <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your requirements..."
                      value={formData.message}
                      onChange={handleFormChange}
                      required
                      disabled={submitting}
                      rows={5}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 text-white hover:bg-emerald-700 font-medium shadow-sm hover:shadow-md transition-all duration-300"
                    size="lg"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>

          <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Connect With Us</h3>
              
              <div className="space-y-6">
                <div className="border border-gray-200 bg-white rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Social Media</h4>
                  <p className="text-sm text-gray-600 mb-4">Follow us for updates and solar tips</p>
                  <div className="flex space-x-4">
                    <a
                      href="https://www.facebook.com/p/Mahalakshmi-Solar-Energies-61558430126387/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center h-12 w-12 rounded-xl bg-gray-100 hover:bg-emerald-600 text-gray-700 hover:text-white transition-all duration-300"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a
                      href="https://www.instagram.com/maha.lakshmisolarenergies/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center h-12 w-12 rounded-xl bg-gray-100 hover:bg-emerald-600 text-gray-700 hover:text-white transition-all duration-300"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  </div>
                </div>

                <div className="border border-gray-200 bg-white rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Quick Response</h4>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      <span>Average response time: 2-4 hours</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      <span>Available Mon-Sat, 9 AM - 6 PM</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      <span>Emergency support available</span>
                    </li>
                  </ul>
                </div>

                <div className="border border-gray-200 bg-white rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Free Consultation</h4>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    Book a free on-site consultation with our solar experts. We'll assess your requirements and provide a customized solution.
                  </p>
                  <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700 font-medium">
                    Schedule Consultation
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-emerald-900 py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white px-4">Ready to Make the Switch to Solar?</h2>
            <p className="mb-6 sm:mb-10 text-base sm:text-lg text-emerald-100 px-4">Now is the perfect time to invest in solar power in Hyderabad. Let Mahalakshmi Solar Energies help you lower your energy costs and make a positive impact on the environment.</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row w-full px-4">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto rounded-xl bg-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-emerald-900 shadow-lg transition-transform hover:scale-105 hover:bg-gray-100">
                  Contact Us Today
                </Button>
              </Link>
            <Button 
              onClick={() => {
                setActiveTab('lead');
                setShowSubsidyModal(true);
              }}
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto rounded-xl border border-emerald-600 bg-transparent px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-white transition-colors hover:bg-emerald-800"
            >
                  Join Referral Program
                </Button>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
