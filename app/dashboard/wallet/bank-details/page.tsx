'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getCurrentUser, signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabase/client';
import { validateIFSC } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function BankDetailsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingDetails, setExistingDetails] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    account_holder_name: '',
    account_number: '',
    confirm_account_number: '',
    ifsc_code: '',
    bank_name: '',
    branch_name: '',
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
    await fetchBankDetails(currentUser.id);
    setLoading(false);
  };

  const fetchBankDetails = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('bank_details')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!error && data) {
        setExistingDetails(data);
        setFormData({
          account_holder_name: data.account_holder_name,
          account_number: data.account_number,
          confirm_account_number: data.account_number,
          ifsc_code: data.ifsc_code,
          bank_name: data.bank_name,
          branch_name: data.branch_name || '',
        });
      }
    } catch (error) {
      console.error('Error fetching bank details:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!formData.account_holder_name.trim()) {
      toast.error('Account holder name is required');
      return;
    }

    if (formData.account_number !== formData.confirm_account_number) {
      toast.error('Account numbers do not match');
      return;
    }

    if (!validateIFSC(formData.ifsc_code)) {
      toast.error('Please enter a valid IFSC code');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('bank_details')
        .upsert({
          user_id: user.id,
          account_holder_name: formData.account_holder_name.trim(),
          account_number: formData.account_number,
          ifsc_code: formData.ifsc_code.toUpperCase(),
          bank_name: formData.bank_name.trim(),
          branch_name: formData.branch_name.trim() || null,
          is_verified: false,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success(existingDetails ? 'Bank details updated successfully!' : 'Bank details added successfully!');
      router.push('/dashboard/wallet');
    } catch (error: any) {
      console.error('Error saving bank details:', error);
      toast.error(error.message || 'Failed to save bank details');
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
    <div className="mx-auto max-w-3xl">
        <Link href="/dashboard/wallet">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Wallet
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-blue-100 p-3">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {existingDetails ? 'Update' : 'Add'} Bank Details
                </CardTitle>
                <CardDescription>
                  Provide your bank account details for reward withdrawals
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Holder Name */}
              <div className="space-y-2">
                <Label htmlFor="account_holder_name">
                  Account Holder Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="account_holder_name"
                  name="account_holder_name"
                  type="text"
                  placeholder="As per bank records"
                  value={formData.account_holder_name}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>

              {/* Account Number */}
              <div className="space-y-2">
                <Label htmlFor="account_number">
                  Account Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="account_number"
                  name="account_number"
                  type="text"
                  placeholder="Enter account number"
                  value={formData.account_number}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>

              {/* Confirm Account Number */}
              <div className="space-y-2">
                <Label htmlFor="confirm_account_number">
                  Confirm Account Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirm_account_number"
                  name="confirm_account_number"
                  type="text"
                  placeholder="Re-enter account number"
                  value={formData.confirm_account_number}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>

              {/* IFSC Code */}
              <div className="space-y-2">
                <Label htmlFor="ifsc_code">
                  IFSC Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ifsc_code"
                  name="ifsc_code"
                  type="text"
                  placeholder="e.g., SBIN0001234"
                  value={formData.ifsc_code}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    setFormData((prev) => ({ ...prev, ifsc_code: value }));
                  }}
                  maxLength={11}
                  required
                  disabled={submitting}
                />
              </div>

              {/* Bank Name */}
              <div className="space-y-2">
                <Label htmlFor="bank_name">
                  Bank Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bank_name"
                  name="bank_name"
                  type="text"
                  placeholder="e.g., State Bank of India"
                  value={formData.bank_name}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>

              {/* Branch Name */}
              <div className="space-y-2">
                <Label htmlFor="branch_name">Branch Name (Optional)</Label>
                <Input
                  id="branch_name"
                  name="branch_name"
                  type="text"
                  placeholder="e.g., Mumbai Main Branch"
                  value={formData.branch_name}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              {/* Security Info */}
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Your data is secure</p>
                    <p>
                      Bank details are encrypted and stored securely. Withdrawals are manually
                      processed by our team to ensure safety.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  className="flex-1"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? <LoadingSpinner size="sm" /> : existingDetails ? 'Update Details' : 'Save Details'}
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
  );
}




