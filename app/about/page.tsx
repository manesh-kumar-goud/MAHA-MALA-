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
    { icon: Users, value: '10,000+', label: 'Happy Customers' },
    { icon: Zap, value: '50 MW+', label: 'Installed Capacity' },
    { icon: TrendingUp, value: '98%', label: 'Satisfaction Rate' },
    { icon: Target, value: '15+', label: 'Years Experience' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl mb-6">
              About Mahalaxmi Solar Energies
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-blue-100 sm:text-xl">
              Leading the solar revolution in India with innovative solutions and exceptional service
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
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
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="text-center hover-lift">
                    <CardHeader>
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                        <stat.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-3xl text-blue-600">{stat.value}</CardTitle>
                      <CardDescription className="text-base">{stat.label}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Core Values</h2>
            <p className="mt-4 text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover-lift">
                  <CardHeader>
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${value.color}`}>
                      <value.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                    <CardDescription>{value.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <Target className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  To provide affordable, reliable, and sustainable solar energy solutions to every
                  home and business in India, contributing to a cleaner environment and energy
                  independence for all.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-green-200">
              <CardHeader>
                <Leaf className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  To be India's most trusted solar energy company, leading the transition to
                  renewable energy and creating a sustainable future for generations to come.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Why Choose Us?</h2>
            <p className="mt-4 text-lg text-blue-100">
              We're committed to your success
            </p>
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
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="flex items-center space-x-3 rounded-lg bg-white/10 backdrop-blur-sm p-4"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <span className="text-white font-bold">✓</span>
                </div>
                <span className="text-white font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}




