'use client';

import Link from 'next/link';
import { Shield, Lock, Eye, FileText, Mail, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-slate-600">
              Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Introduction</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>
                  Mahalaxmi Solar Energies ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
                </p>
                <p>
                  By using our website, you consent to the data practices described in this policy. If you do not agree with the practices described, please do not use our services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  2. Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <h4 className="font-semibold mt-4">Personal Information</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Address and location details</li>
                  <li>Bank account details (for reward withdrawals)</li>
                  <li>Property information for solar installations</li>
                </ul>

                <h4 className="font-semibold mt-6">Usage Information</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Website usage data and analytics</li>
                  <li>Device information and IP address</li>
                  <li>Cookies and tracking technologies</li>
                </ul>

                <h4 className="font-semibold mt-6">Lead Information</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Customer referral information submitted through our platform</li>
                  <li>Lead status and tracking data</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  3. How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>We use the collected information for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Providing and improving our solar energy services</li>
                  <li>Processing referrals and managing reward programs</li>
                  <li>Communicating with you about your account and services</li>
                  <li>Processing withdrawals and financial transactions</li>
                  <li>Complying with legal obligations</li>
                  <li>Preventing fraud and ensuring security</li>
                  <li>Analyzing usage patterns to improve user experience</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Data Storage and Security</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>
                  We use industry-standard security measures to protect your personal information:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encrypted data transmission (SSL/TLS)</li>
                  <li>Secure database storage with access controls</li>
                  <li>Encrypted storage of sensitive financial information</li>
                  <li>Regular security audits and updates</li>
                  <li>Access restricted to authorized personnel only</li>
                </ul>
                <p className="mt-4">
                  However, no method of transmission over the Internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Data Sharing and Disclosure</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>We do not sell your personal information. We may share your information only in the following circumstances:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our platform</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>With Your Consent:</strong> When you explicitly authorize us to share information</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Cookies and Tracking Technologies</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>
                  We use cookies and similar tracking technologies to enhance your experience:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Session cookies for authentication</li>
                  <li>Analytics cookies to understand usage patterns</li>
                  <li>Preference cookies to remember your settings</li>
                </ul>
                <p className="mt-4">
                  You can control cookies through your browser settings, but this may affect website functionality.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate or incomplete data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing of your data</li>
                  <li>Request data portability</li>
                  <li>Withdraw consent at any time</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, please contact us using the information provided below.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Data Retention</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>
                  We retain your personal information for as long as necessary to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide our services</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes</li>
                  <li>Enforce our agreements</li>
                </ul>
                <p className="mt-4">
                  Financial records may be retained for up to 7 years as required by law.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Changes to This Policy</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
                <p className="mt-4">
                  Your continued use of our services after changes become effective constitutes acceptance of the updated policy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  11. Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:</p>
                <div className="mt-4 space-y-2">
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <strong>Email:</strong> info@mahalakshmisolarpower.com
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <strong>Phone:</strong> +91-XXXXXXXXXX
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}



