'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wallet, Download, CreditCard, History, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getCurrentUser, signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabase/client';
import { formatCurrency, formatDateTime, getStatusColor } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';
import type { RewardHistory, BankDetails, Withdrawal } from '@/lib/types';

export default function WalletPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rewardHistory, setRewardHistory] = useState<RewardHistory[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [availableBalance, setAvailableBalance] = useState(0);

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
    await fetchWalletData(currentUser.id);
    setLoading(false);
  };

  const fetchWalletData = async (userId: string) => {
    try {
      // Fetch reward history
      const { data: rewards, error: rewardsError } = await supabase
        .from('rewards_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (rewardsError) throw rewardsError;
      setRewardHistory(rewards || []);

      // Fetch withdrawals
      const { data: withdrawalsData, error: withdrawalsError } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (withdrawalsError) throw withdrawalsError;
      setWithdrawals(withdrawalsData || []);

      // Fetch bank details
      const { data: bank, error: bankError } = await supabase
        .from('bank_details')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!bankError && bank) {
        setBankDetails(bank);
      }

      // Calculate available balance
      const totalEarned = rewards?.reduce((sum, r) => sum + (r.type === 'lead_reward' || r.type === 'bonus' ? r.amount : 0), 0) || 0;
      const totalWithdrawn = rewards?.reduce((sum, r) => sum + (r.type === 'withdrawal' ? r.amount : 0), 0) || 0;
      setAvailableBalance(totalEarned - totalWithdrawn);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error('Failed to load wallet data');
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
    <div className="mx-auto max-w-7xl">
      <Link href="/dashboard">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>

      {/* Balance Card */}
        <Card className="mb-8 bg-gradient-to-r from-green-600 to-green-800 text-white border-0">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Available Balance</span>
              <Wallet className="h-6 w-6" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-4">{formatCurrency(availableBalance)}</div>
            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard/wallet/withdraw">
                <Button
                  className="bg-white text-green-600 hover:bg-green-50"
                  disabled={!bankDetails || availableBalance < 1000}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Withdraw Funds
                </Button>
              </Link>
              <Link href="/dashboard/wallet/bank-details">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  <CreditCard className="mr-2 h-4 w-4" />
                  {bankDetails ? 'Update' : 'Add'} Bank Details
                </Button>
              </Link>
            </div>
            {!bankDetails && (
              <p className="mt-4 text-sm text-green-100">
                ⚠️ Please add your bank details to withdraw funds
              </p>
            )}
            {bankDetails && availableBalance < 1000 && (
              <p className="mt-4 text-sm text-green-100">
                ℹ️ Minimum withdrawal amount is ₹1,000
              </p>
            )}
          </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
          {/* Reward History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Reward History</CardTitle>
                  <CardDescription>Your earnings and transactions</CardDescription>
                </div>
                <History className="h-5 w-5 text-gray-600" />
              </div>
            </CardHeader>
            <CardContent>
              {rewardHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Wallet className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-600">No reward history yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Start referring to earn rewards!
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {rewardHistory.map((reward) => (
                    <div
                      key={reward.id}
                      className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {reward.type === 'lead_reward' && '🎉 Lead Reward'}
                          {reward.type === 'bonus' && '🎁 Bonus'}
                          {reward.type === 'withdrawal' && '💸 Withdrawal'}
                          {reward.type === 'adjustment' && '⚙️ Adjustment'}
                        </div>
                        {reward.description && (
                          <div className="text-sm text-gray-600 mt-1">{reward.description}</div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDateTime(reward.created_at)}
                        </div>
                      </div>
                      <div
                        className={`text-lg font-semibold ${
                          reward.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {reward.type === 'withdrawal' ? '-' : '+'}
                        {formatCurrency(reward.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Withdrawal History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Withdrawal History</CardTitle>
                  <CardDescription>Your withdrawal requests</CardDescription>
                </div>
                <Download className="h-5 w-5 text-gray-600" />
              </div>
            </CardHeader>
            <CardContent>
              {withdrawals.length === 0 ? (
                <div className="text-center py-8">
                  <Download className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-600">No withdrawals yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Request a withdrawal when you're ready
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {withdrawals.map((withdrawal) => (
                    <div
                      key={withdrawal.id}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-lg font-semibold text-gray-900">
                          {formatCurrency(withdrawal.amount)}
                        </div>
                        <Badge className={getStatusColor(withdrawal.status)}>
                          {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Requested: {formatDateTime(withdrawal.created_at)}
                      </div>
                      {withdrawal.transaction_id && (
                        <div className="text-sm text-gray-600 mt-1">
                          Transaction ID: {withdrawal.transaction_id}
                        </div>
                      )}
                      {withdrawal.processed_at && (
                        <div className="text-sm text-gray-600 mt-1">
                          Processed: {formatDateTime(withdrawal.processed_at)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
        </Card>
      </div>

      {/* Bank Details Card */}
      {bankDetails && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Bank Details</CardTitle>
              <CardDescription>Your registered bank account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-sm text-gray-600">Account Holder</div>
                  <div className="font-medium text-gray-900">{bankDetails.account_holder_name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Account Number</div>
                  <div className="font-medium text-gray-900">
                    ****{bankDetails.account_number.slice(-4)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">IFSC Code</div>
                  <div className="font-medium text-gray-900">{bankDetails.ifsc_code}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Bank Name</div>
                  <div className="font-medium text-gray-900">{bankDetails.bank_name}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}




