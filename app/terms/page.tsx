'use client';

import Link from 'next/link';
import { FileText, Scale, AlertCircle, Shield, Mail, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <Scale className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-slate-600">
              Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>
                  By accessing and using the Mahalaxmi Solar Energies website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>
                <p className="mt-4">
                  We reserve the right to modify these terms at any time. Your continued use of our services after changes are posted constitutes acceptance of the modified terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Description of Services</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>Mahalaxmi Solar Energies provides:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Solar energy installation services</li>
                  <li>Government subsidy information and assistance</li>
                  <li>A referral program where users can earn rewards</li>
                  <li>Educational content about solar energy</li>
                  <li>Customer support and consultation services</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  3. User Accounts and Registration
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <h4 className="font-semibold mt-4">Account Creation</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You must provide accurate and complete information when creating an account</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You must be at least 18 years old to create an account</li>
                  <li>One person or entity may maintain only one account</li>
                </ul>

                <h4 className="font-semibold mt-6">Account Security</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You are responsible for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Referral Program Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <h4 className="font-semibold mt-4">Eligibility</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Rewards are earned only when referred leads result in successful installations</li>
                  <li>Duplicate leads (submitted within 90 days) are not eligible for rewards</li>
                  <li>We reserve the right to verify lead authenticity</li>
                </ul>

                <h4 className="font-semibold mt-6">Reward Payments</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Rewards are credited to your wallet upon successful installation</li>
                  <li>Minimum withdrawal amount is ₹1,000</li>
                  <li>Withdrawals are processed within 7-14 business days</li>
                  <li>Valid bank account details must be provided for withdrawals</li>
                  <li>Rewards are subject to verification and may be revoked if fraud is detected</li>
                </ul>

                <h4 className="font-semibold mt-6">Prohibited Activities</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Submitting false or fraudulent leads</li>
                  <li>Self-referrals or creating fake accounts</li>
                  <li>Manipulating the referral system</li>
                  <li>Spam or harassment of potential customers</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. User Conduct</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the service for any illegal purpose</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Transmit viruses, malware, or harmful code</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the service</li>
                  <li>Collect user information without consent</li>
                  <li>Impersonate any person or entity</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>
                  All content on this website, including text, graphics, logos, images, and software, is the property of Mahalaxmi Solar Energies or its licensors and is protected by copyright and trademark laws.
                </p>
                <p className="mt-4">
                  You may not reproduce, distribute, modify, or create derivative works from our content without express written permission.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Service Availability</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>
                  We strive to provide continuous service availability but do not guarantee:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Uninterrupted or error-free service</li>
                  <li>Immediate resolution of technical issues</li>
                  <li>Availability during maintenance periods</li>
                </ul>
                <p className="mt-4">
                  We reserve the right to modify, suspend, or discontinue any part of the service at any time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  8. Disclaimers and Limitations of Liability
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <h4 className="font-semibold mt-4">Service Disclaimer</h4>
                <p>
                  The information provided on this website is for general informational purposes only. We make no warranties about:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The accuracy or completeness of information</li>
                  <li>The suitability of services for your specific needs</li>
                  <li>Uninterrupted or error-free operation</li>
                </ul>

                <h4 className="font-semibold mt-6">Limitation of Liability</h4>
                <p>
                  To the maximum extent permitted by law, Mahalaxmi Solar Energies shall not be liable for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Indirect, incidental, or consequential damages</li>
                  <li>Loss of profits, data, or business opportunities</li>
                  <li>Damages exceeding the amount you paid for our services</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Indemnification</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>
                  You agree to indemnify and hold harmless Mahalaxmi Solar Energies, its officers, employees, and agents from any claims, damages, losses, or expenses arising from:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your use of our services</li>
                  <li>Your violation of these terms</li>
                  <li>Your violation of any rights of another party</li>
                  <li>Any content you submit through our platform</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Termination</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>We may terminate or suspend your account immediately if:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You violate these Terms of Service</li>
                  <li>You engage in fraudulent activity</li>
                  <li>Required by law or legal process</li>
                  <li>You request account deletion</li>
                </ul>
                <p className="mt-4">
                  Upon termination, your right to use the service will cease immediately. Pending rewards may be forfeited if fraud is detected.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Governing Law</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>
                  These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in [Your City/State], India.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>12. Dispute Resolution</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>
                  In case of any dispute, we encourage you to contact us first to resolve the matter amicably. If a resolution cannot be reached, disputes will be resolved through:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Mediation (preferred first step)</li>
                  <li>Arbitration (if mediation fails)</li>
                  <li>Court proceedings (as a last resort)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>13. Severability</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>
                  If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>14. Entire Agreement</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>
                  These Terms of Service constitute the entire agreement between you and Mahalaxmi Solar Energies regarding the use of our services and supersede all prior agreements and understandings.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  15. Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>For questions about these Terms of Service, please contact us:</p>
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



