'use client';

import { useEffect, useState } from 'react';
import { Home, Building2, Droplet, Wrench, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { supabase } from '@/lib/supabase/client';
import type { Service } from '@/lib/types';
import Link from 'next/link';
import { motion } from 'framer-motion';

const iconMap: Record<string, any> = {
  home: Home,
  building: Building2,
  droplet: Droplet,
  wrench: Wrench,
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      if (!supabase) {
        setServices([]);
        return;
      }

      if (!supabase) {
        setServices([]);
        return;
      }
      const db = supabase as any;
      const { data, error } = await db
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) {
        // Silently handle error - show empty state in UI
        setServices([]);
        return;
      }
      
      setServices(data || []);
    } catch (error) {
      // Silently handle error - show empty state in UI
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Minimal Hero Section */}
      <section className="relative overflow-hidden bg-white py-32 border-b border-gray-100">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <h1 className="text-5xl font-light tracking-tight text-gray-900 sm:text-6xl md:text-7xl mb-6">
              Our{' '}
              <span className="font-medium">
                Solar Solutions
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-gray-600 sm:text-xl leading-relaxed font-light">
              Comprehensive solar power solutions tailored to your needs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Minimal Services Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid gap-12 md:grid-cols-2">
              {services.map((service, index) => {
                const Icon = iconMap[service.icon_name || 'home'] || Home;
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                    whileHover={{ y: -4, transition: { duration: 0.3 } }}
                    className="group"
                  >
                    <div className="h-full p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white">
                      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                        <Icon className="h-7 w-7 text-gray-700" />
                      </div>
                      <h3 className="text-2xl font-medium mb-4 text-gray-900">{service.title}</h3>
                      <p className="text-base text-gray-600 leading-relaxed mb-6 font-light">
                        {service.description}
                      </p>
                      {service.features && service.features.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900 text-base mb-3">Key Features:</h4>
                          <ul className="space-y-2">
                            {service.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start space-x-3">
                                <CheckCircle2 className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-600 font-light">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Minimal Process Section */}
      <section className="py-32 bg-gray-50 relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 text-xs font-medium tracking-wide uppercase mb-8">
                How It Works
              </div>
              <h2 className="text-4xl font-light text-gray-900 sm:text-5xl lg:text-6xl mb-6">
                Our Installation{' '}
                <span className="font-medium">
                  Process
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                Simple, transparent, and hassle-free
              </p>
            </motion.div>
          </div>
          <div className="grid gap-12 md:grid-cols-4">
            {[
              { step: '1', title: 'Consultation', description: 'Free site survey and requirement analysis' },
              { step: '2', title: 'Design', description: 'Custom system design and proposal' },
              { step: '3', title: 'Installation', description: 'Professional installation by experts' },
              { step: '4', title: 'Support', description: 'Ongoing maintenance and support' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="text-center group"
              >
                <div className="relative mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-gray-900 text-2xl font-light text-white group-hover:bg-gray-800 transition-colors">
                  {item.step}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-light">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimal CTA Section */}
      <section className="py-32 bg-gray-900 relative overflow-hidden">
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-light text-white sm:text-5xl mb-6">
              Ready to Go{' '}
              <span className="font-medium">
                Solar?
              </span>
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto font-light">
              Get a free consultation and customized solar solution for your needs
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-medium shadow-sm hover:shadow-md transition-all duration-300 px-8 border border-white">
                  Get Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="border border-gray-700 bg-gray-800/50 backdrop-blur-sm text-white hover:bg-gray-800 hover:border-gray-600 font-medium transition-all duration-300 px-8">
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




