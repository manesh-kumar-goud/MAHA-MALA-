'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getCurrentUser, signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabase/client';
import { validatePhoneNumber, validateEmail } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function NewLeadPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    city: '',
    property_type: '',
    notes: '',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    setUser(currentUser);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.customer_name.trim()) {
      toast.error('Customer name is required');
      return;
    }

    if (!validatePhoneNumber(formData.customer_phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    if (!formData.city.trim()) {
      toast.error('City is required');
      return;
    }

    if (formData.customer_email && !validateEmail(formData.customer_email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSubmitting(true);

    try {
      // Check for duplicate phone number in last 90 days
      const { data: existingLeads } = await supabase
        .from('leads')
        .select('id, customer_name')
        .eq('customer_phone', formData.customer_phone)
        .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

      if (existingLeads && existingLeads.length > 0) {
        toast.error(`This phone number was already submitted by ${existingLeads[0].customer_name} within the last 90 days`);
        setSubmitting(false);
        return;
      }

      // Insert lead
      const { data, error } = await supabase
        .from('leads')
        .insert([
          {
            referrer_id: user.id,
            customer_name: formData.customer_name.trim(),
            customer_phone: formData.customer_phone,
            customer_email: formData.customer_email.trim() || null,
            city: formData.city.trim(),
            property_type: formData.property_type || null,
            notes: formData.notes.trim() || null,
            status: 'submitted',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Lead submitted successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error submitting lead:', error);
      toast.error(error.message || 'Failed to submit lead. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-blue-100 p-3">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Submit New Lead</CardTitle>
                <CardDescription>
                  Refer a customer interested in solar installation and earn rewards
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Name */}
              <div className="space-y-2">
                <Label htmlFor="customer_name">
                  Customer Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customer_name"
                  name="customer_name"
                  type="text"
                  placeholder="Enter customer's full name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>

              {/* Customer Phone */}
              <div className="space-y-2">
                <Label htmlFor="customer_phone">
                  Customer Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customer_phone"
                  name="customer_phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.customer_phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData((prev) => ({ ...prev, customer_phone: value }));
                  }}
                  required
                  disabled={submitting}
                />
                <p className="text-xs text-gray-500">
                  We'll check for duplicate entries to ensure fair rewards
                </p>
              </div>

              {/* Customer Email */}
              <div className="space-y-2">
                <Label htmlFor="customer_email">Customer Email (Optional)</Label>
                <Input
                  id="customer_email"
                  name="customer_email"
                  type="email"
                  placeholder="customer@example.com"
                  value={formData.customer_email}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Enter city name"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <Label htmlFor="property_type">Property Type (Optional)</Label>
                <Select
                  id="property_type"
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleChange}
                  disabled={submitting}
                >
                  <option value="">Select property type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any additional information about the customer or requirement..."
                  value={formData.notes}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              {/* Info Box */}
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                <h4 className="font-medium text-blue-900 mb-2">📌 What happens next?</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Your lead will be verified by our team within 24-48 hours</li>
                  <li>• We'll contact the customer to discuss solar installation</li>
                  <li>• You'll earn rewards once the installation is completed</li>
                  <li>• Track your lead status in the dashboard anytime</li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  className="flex-1"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? <LoadingSpinner size="sm" /> : 'Submit Lead'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => router.back()}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}




