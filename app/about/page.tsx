'use client';

import { Award, Users, Target, Heart, Zap, Shield, Leaf, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'We deliver the highest quality solar solutions',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your satisfaction is our top priority',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'Committed to a greener tomorrow',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Shield,
      title: 'Reliability',
      description: '25+ years of warranty and support',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const stats = [
    { icon: Users, value: '2,400+', label: 'Happy Customers' },
    { icon: Zap, value: '12 MW+', label: 'Installed Capacity' },
    { icon: TrendingUp, value: '92%', label: 'Satisfaction Rate' },
    { icon: Target, value: '8+', label: 'Years Experience' },
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
              About{' '}
              <span className="font-medium">
                Mahalaxmi Solar Energies
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-gray-600 sm:text-xl leading-relaxed font-light">
              Leading the solar revolution in India with innovative solutions and exceptional service
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story - Minimal Design */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-gray-700 text-xs font-medium tracking-wide uppercase mb-6">
                Our Journey
              </div>
              <h2 className="text-4xl font-light text-gray-900 sm:text-5xl mb-8">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-light">
                <p>
                  Founded with a vision to make clean energy accessible to everyone, Mahalaxmi Solar
                  Energies has been at the forefront of India's solar revolution for over 15 years.
                </p>
                <p>
                  We started as a small team of passionate individuals who believed in the power of
                  renewable energy. Today, we're proud to have helped thousands of families and
                  businesses transition to solar power, contributing to a sustainable future.
                </p>
                <p>
                  Our commitment to quality, innovation, and customer satisfaction has made us one of
                  the most trusted names in the solar industry. We continue to grow, driven by our
                  mission to power India with clean, affordable energy.
                </p>
              </div>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                  whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
                  className="group"
                >
                  <div className="h-full text-center p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                      <stat.icon className="h-6 w-6 text-gray-700" />
                    </div>
                    <div className="text-4xl font-light text-gray-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values - Minimal Design */}
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
                Our Foundation
              </div>
              <h2 className="text-4xl font-light text-gray-900 sm:text-5xl lg:text-6xl mb-6">
                Our Core{' '}
                <span className="font-medium">
                  Values
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                The principles that guide everything we do
              </p>
            </motion.div>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="group"
              >
                <div className="h-full flex flex-col">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                    <value.icon className="h-7 w-7 text-gray-700" />
                  </div>
                  <h3 className="text-xl font-medium mb-3 text-gray-900">{value.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-light">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision - Minimal Design */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
            >
              <div className="h-full p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100">
                  <Target className="h-7 w-7 text-gray-700" />
                </div>
                <h3 className="text-3xl font-medium mb-6 text-gray-900">Our Mission</h3>
                <p className="text-lg text-gray-600 leading-relaxed font-light">
                  To provide affordable, reliable, and sustainable solar energy solutions to every
                  home and business in India, contributing to a cleaner environment and energy
                  independence for all.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
            >
              <div className="h-full p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100">
                  <Leaf className="h-7 w-7 text-gray-700" />
                </div>
                <h3 className="text-3xl font-medium mb-6 text-gray-900">Our Vision</h3>
                <p className="text-lg text-gray-600 leading-relaxed font-light">
                  To be India's most trusted solar energy company, leading the transition to
                  renewable energy and creating a sustainable future for generations to come.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Minimal Design */}
      <section className="py-32 bg-gray-900 relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-light text-white sm:text-5xl lg:text-6xl mb-6">
                Why Choose{' '}
                <span className="font-medium">
                  Us?
                </span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light">
                We're committed to your success
              </p>
            </motion.div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              'Government Approved Partner',
              'Expert Installation Team',
              '25 Years Warranty',
              'Comprehensive Support',
              'Competitive Pricing',
              'Quick Installation',
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: [0.25, 0.4, 0.25, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="group flex items-center space-x-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-gray-600 p-5 transition-all duration-300"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 group-hover:bg-gray-600 transition-colors flex-shrink-0">
                  <span className="text-white font-medium text-base">✓</span>
                </div>
                <span className="text-white font-medium text-base">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}




