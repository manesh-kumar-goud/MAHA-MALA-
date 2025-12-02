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
      const { data, error } = await supabase
        .from('subsidy_info')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setSubsidies(data || []);
    } catch (error) {
      console.error('Error fetching subsidies:', error);
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-green-900 py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30 text-base px-4 py-2">
              PM Surya Ghar - Muft Bijli Yojana
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl mb-6">
              Government Solar Subsidy
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-green-100 sm:text-xl">
              Get up to ₹78,000 subsidy on rooftop solar installation
            </p>
          </motion.div>
        </div>
      </section>

      {/* Subsidy Rates */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Subsidy Rates</h2>
            <p className="mt-4 text-lg text-gray-600">
              Central Financial Assistance for Rooftop Solar Systems
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              {subsidies.map((subsidy, index) => (
                <motion.div
                  key={subsidy.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-2 border-green-200 hover:border-green-400 hover-lift">
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600">
                        <IndianRupee className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl">{subsidy.capacity}</CardTitle>
                      <div className="text-4xl font-bold text-green-600 my-3">
                        {formatCurrency(subsidy.amount)}
                      </div>
                      <CardDescription className="text-base">
                        {subsidy.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {subsidy.eligibility_criteria && subsidy.eligibility_criteria.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900 text-sm">Eligibility:</h4>
                          <ul className="space-y-1">
                            {subsidy.eligibility_criteria.map((criteria, idx) => (
                              <li key={idx} className="flex items-start text-xs text-gray-600">
                                <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 mr-1 flex-shrink-0" />
                                {criteria}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-6 inline-block">
              <p className="text-yellow-800 font-medium">
                💡 Maximum subsidy of ₹78,000 (for 3 kW + 18,000 × 7 kW)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Application Process</h2>
            <p className="mt-4 text-lg text-gray-600">
              Simple 6-step process to get your subsidy
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover-lift">
                  <CardHeader>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-xl font-bold text-white">
                      {item.step}
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Required Documents */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl">Required Documents</CardTitle>
                  <CardDescription>Keep these documents ready for subsidy application</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{doc}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Subsidy Benefits</h2>
            <p className="mt-4 text-lg text-gray-600">
              Why you should apply for solar subsidy
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Reduced Cost', description: 'Up to 40% reduction in installation cost', icon: '💰' },
              { title: 'Quick ROI', description: 'Faster return on investment', icon: '📈' },
              { title: 'Easy Process', description: 'Simple online application', icon: '✅' },
              { title: 'Direct Transfer', description: 'Subsidy directly in bank account', icon: '🏦' },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full text-center hover-lift">
                  <CardHeader>
                    <div className="text-4xl mb-3">{benefit.icon}</div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-800">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
            Ready to Apply for Subsidy?
          </h2>
          <p className="text-lg text-green-100 mb-8">
            We'll help you with the entire subsidy application process
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact">
              <Button size="xl" className="bg-white text-green-600 hover:bg-green-50">
                Get Expert Assistance
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a
              href="https://pmsuryaghar.gov.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="xl" variant="outline" className="border-white text-white hover:bg-white/10">
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




