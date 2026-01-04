'use client';

import { useEffect, useState } from 'react';
import { IndianRupee, FileText, CheckCircle2, Download, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { supabase } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';
import type { SubsidyInfo } from '@/lib/types';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SubsidyPage() {
  const [subsidies, setSubsidies] = useState<SubsidyInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubsidies();
  }, []);

  const fetchSubsidies = async () => {
    try {
      if (!supabase) {
        setSubsidies([]);
        return;
      }

      if (!supabase) {
        setSubsidies([]);
        return;
      }
      const db = supabase as any;
      const { data, error } = await db
        .from('subsidy_info')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) {
        // Silently handle error - show empty state in UI
        setSubsidies([]);
        return;
      }
      
      setSubsidies(data || []);
    } catch (error) {
      // Silently handle error - show empty state in UI
      setSubsidies([]);
    } finally {
      setLoading(false);
    }
  };

  const processSteps = [
    { step: '1', title: 'Register', description: 'Register on the PM Surya Ghar portal' },
    { step: '2', title: 'Apply', description: 'Submit application with required documents' },
    { step: '3', title: 'Approval', description: 'Get approval from DISCOM' },
    { step: '4', title: 'Installation', description: 'Install solar system by authorized vendor' },
    { step: '5', title: 'Inspection', description: 'DISCOM inspection and net meter installation' },
    { step: '6', title: 'Subsidy', description: 'Receive subsidy in your bank account' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Minimal Hero Section */}
      <section className="relative overflow-hidden bg-white py-32 border-b border-gray-100">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-gray-700 text-xs font-medium tracking-wide uppercase mb-6">
              PM Surya Ghar - Muft Bijli Yojana
            </div>
            <h1 className="text-4xl font-light tracking-tight text-gray-900 sm:text-5xl md:text-6xl mb-6">
              Government Solar{' '}
              <span className="font-medium">
                Subsidy
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-gray-600 sm:text-xl font-light">
              Get up to ₹78,000 subsidy on rooftop solar installation
            </p>
          </motion.div>
        </div>
      </section>

      {/* Subsidy Rates - Minimal Design */}
      <section className="py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-light text-gray-900 sm:text-5xl mb-6">
              Subsidy{' '}
              <span className="font-medium">Rates</span>
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Central Financial Assistance for Rooftop Solar Systems
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="max-w-5xl mx-auto space-y-4">
              {subsidies.map((subsidy, index) => (
                <motion.div
                  key={subsidy.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-8 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                        <IndianRupee className="h-6 w-6 text-gray-700" />
                      </div>
                      <div>
                        <div className="text-base font-medium text-gray-900">{subsidy.capacity}</div>
                        {subsidy.description && (
                          <div className="text-xs text-gray-500 font-light">{subsidy.description}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-4xl font-light text-gray-900 mb-2">
                        {formatCurrency(subsidy.amount)}
                      </div>
                    </div>
                    {subsidy.eligibility_criteria && subsidy.eligibility_criteria.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <CheckCircle2 className="h-4 w-4 text-gray-400" />
                        <span className="font-light">Eligible</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 inline-block">
              <p className="text-gray-700 font-light">
                💡 Maximum subsidy of ₹78,000 (for 3 kW + 18,000 × 7 kW)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process - Minimal Design */}
      <section className="py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-light text-gray-900 sm:text-5xl mb-6">
              Application{' '}
              <span className="font-medium">Process</span>
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Simple 6-step process to get your subsidy
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="group"
              >
                <div className="h-full flex flex-col">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-900 text-lg font-light text-white group-hover:bg-gray-800 transition-colors">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 font-light">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Required Documents - Minimal Design */}
      <section className="py-32 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="border border-gray-200 bg-white p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <FileText className="h-5 w-5 text-gray-700" />
              </div>
              <div>
                <h3 className="text-2xl font-medium text-gray-900">Required Documents</h3>
                <p className="text-sm text-gray-600 font-light">Keep these documents ready for subsidy application</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Aadhar Card',
                'Electricity Bill',
                'Property Ownership Proof',
                'Bank Account Details',
                'Passport Size Photo',
                'Cancelled Cheque',
                'Property Tax Receipt',
                'NOC (if required)',
              ].map((doc, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600 font-light">{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits - Minimal Design */}
      <section className="py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-light text-gray-900 sm:text-5xl mb-6">
              Subsidy{' '}
              <span className="font-medium">Benefits</span>
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Why you should apply for solar subsidy
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Reduced Cost', description: 'Up to 40% reduction in installation cost', icon: '💰' },
              { title: 'Quick ROI', description: 'Faster return on investment', icon: '📈' },
              { title: 'Easy Process', description: 'Simple online application', icon: '✅' },
              { title: 'Direct Transfer', description: 'Subsidy directly in bank account', icon: '🏦' },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="text-center"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600 font-light">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Minimal Design */}
      <section className="py-32 bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-white sm:text-5xl mb-6">
            Ready to Apply for{' '}
            <span className="font-medium">Subsidy?</span>
          </h2>
          <p className="text-lg text-gray-400 mb-10 font-light">
            We'll help you with the entire subsidy application process
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact">
              <Button size="xl" className="bg-white text-gray-900 hover:bg-gray-100 font-medium border border-white">
                Get Expert Assistance
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a
              href="https://pmsuryaghar.gov.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="xl" variant="outline" className="border border-gray-700 bg-gray-800/50 text-white hover:bg-gray-800 hover:border-gray-600 font-medium">
                Visit PM Surya Ghar Portal
                <Download className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}




