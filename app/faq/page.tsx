'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { supabase } from '@/lib/supabase/client';
import type { FAQ } from '@/lib/types';
import { motion } from 'framer-motion';

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      if (!supabase) {
        setFaqs([]);
        return;
      }
      const db = supabase as any;
      const { data, error } = await db
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const categories = Array.from(new Set(faqs.map((faq) => faq.category).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-teal-900 py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl mb-6">
              Frequently Asked Questions
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-teal-100 sm:text-xl">
              Find answers to common questions about solar energy and our referral program
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No FAQs available</h3>
              <p className="text-gray-600">Check back later for helpful information</p>
            </div>
          ) : (
            <>
              {/* Categories */}
              {categories.length > 0 && (
                <div className="mb-8 flex flex-wrap gap-3 justify-center">
                  {categories.map((category) => (
                    <Badge key={category} variant="outline" className="text-base px-4 py-2">
                      {category}
                    </Badge>
                  ))}
                </div>
              )}

              {/* FAQ List */}
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Card
                      className="cursor-pointer hover:shadow-md transition-all"
                      onClick={() => toggleExpand(faq.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-bold mt-1">
                              Q
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg text-gray-900 pr-8">
                                {faq.question}
                              </CardTitle>
                              {faq.category && (
                                <Badge variant="secondary" className="mt-2 text-xs">
                                  {faq.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <button className="flex-shrink-0">
                            {expandedId === faq.id ? (
                              <ChevronUp className="h-6 w-6 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-6 w-6 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </CardHeader>
                      {expandedId === faq.id && (
                        <CardContent>
                          <div className="flex items-start space-x-3 pt-3 border-t border-gray-100">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 text-sm font-bold flex-shrink-0">
                              A
                            </div>
                            <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* CTA */}
          <Card className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white border-0">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Still have questions?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-100 mb-4">
                Can't find what you're looking for? Our team is here to help!
              </p>
              <Link href="/contact">
                <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  Contact Us
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}



