'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { supabase } from '@/lib/supabase/client';
import { validateEmail, validatePhoneNumber } from '@/lib/utils';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        toast.error('Database connection not available');
        return;
      }
      const db = supabase as any;
      const { error } = await db.from('contact_inquiries').insert([
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone || null,
          subject: formData.subject.trim() || null,
          message: formData.message.trim(),
          status: 'new',
        },
      ]);

      if (error) throw error;

      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error: any) {
      console.error('Error submitting inquiry:', error);
      toast.error(error.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      content: 'Your Address Here',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+91-XXXXXXXXXX',
      link: 'tel:+91XXXXXXXXXX',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'info@mahalakshmisolarpower.com',
      link: 'mailto:info@mahalakshmisolarpower.com',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: 'Mon - Sat: 9:00 AM - 6:00 PM',
      color: 'from-purple-500 to-purple-600',
    },
  ];

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
              Get In{' '}
              <span className="font-medium">
                Touch
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-gray-600 sm:text-xl leading-relaxed font-light">
              Have questions? We're here to help you switch to solar energy
            </p>
          </motion.div>
        </div>
      </section>

      {/* Minimal Contact Info */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="group text-center"
              >
                <div className="h-full flex flex-col items-center">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                    <info.icon className="h-7 w-7 text-gray-700" />
                  </div>
                  <h3 className="text-lg font-medium mb-3 text-gray-900">{info.title}</h3>
                  {info.link ? (
                    <a href={info.link} className="text-gray-600 hover:text-gray-900 font-light transition-colors">
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-600 font-light">{info.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimal Contact Form */}
      <section className="py-32 bg-gray-50 relative overflow-hidden">
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 text-xs font-medium tracking-wide uppercase mb-6">
                Contact Form
              </div>
              <h2 className="text-4xl font-light text-gray-900 mb-6">Send Us a Message</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed font-light">
                Fill out the form and our team will get back to you within 24 hours.
              </p>
              
              <div className="border border-gray-200 bg-white p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
                        required
                        disabled={submitting}
                        rows={5}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-black text-white hover:bg-gray-900 font-medium shadow-sm hover:shadow-md transition-all duration-300 border border-black"
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
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <h2 className="text-4xl font-light text-gray-900 mb-8">Connect With Us</h2>
              
              <div className="space-y-6">
                <div className="border border-gray-200 bg-white p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Social Media</h3>
                  <p className="text-sm text-gray-600 mb-4 font-light">Follow us for updates and solar tips</p>
                  <div className="flex space-x-4">
                    <a
                      href="https://www.facebook.com/p/Mahalakshmi-Solar-Energies-61558430126387/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center h-12 w-12 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-300"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a
                      href="https://www.instagram.com/maha.lakshmisolarenergies/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center h-12 w-12 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-300"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  </div>
                </div>

                <div className="border border-gray-200 bg-white p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Response</h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="font-light">Average response time: 2-4 hours</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="font-light">Available Mon-Sat, 9 AM - 6 PM</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="font-light">Emergency support available</span>
                    </li>
                  </ul>
                </div>

                <div className="border border-gray-200 bg-white p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Free Consultation</h3>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed font-light">
                    Book a free on-site consultation with our solar experts. We'll assess your
                    requirements and provide a customized solution.
                  </p>
                  <Button className="w-full bg-black text-white hover:bg-gray-900 font-medium shadow-sm hover:shadow-md transition-all duration-300 border border-black" variant="outline">
                    Schedule Consultation
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}




