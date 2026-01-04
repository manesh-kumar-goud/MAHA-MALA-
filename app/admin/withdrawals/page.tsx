'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getCurrentUser, signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabase/client';
import { formatCurrency, formatDateTime, getStatusColor } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminWithdrawalsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    filterWithdrawals();
  }, [statusFilter, withdrawals]);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
      toast.error('Access denied');
      router.push('/dashboard');
      return;
    }
    setUser(currentUser);
    await fetchWithdrawals();
    setLoading(false);
  };

  const fetchWithdrawals = async () => {
    try {
      if (!supabase) {
        toast.error('Database connection not available');
        return;
      }
      const db = supabase as any;
      const { data, error } = await db
        .from('withdrawals')
        .select(`
          *,
          user:users!user_id(name, email, phone_number),
          bank:bank_details!bank_details_id(account_holder_name, account_number, ifsc_code, bank_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWithdrawals(data || []);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      toast.error('Failed to fetch withdrawals');
    }
  };

  const filterWithdrawals = () => {
    if (statusFilter === 'all') {
      setFilteredWithdrawals(withdrawals);
    } else {
      setFilteredWithdrawals(withdrawals.filter((w) => w.status === statusFilter));
    }
  };

  const handleProcess = async (withdrawalId: string, newStatus: 'completed' | 'rejected') => {
    if (newStatus === 'completed' && !transactionId.trim()) {
      toast.error('Please enter transaction ID');
      return;
    }

    setProcessing(true);
    try {
      if (!supabase) {
        toast.error('Database connection not available');
        setProcessing(false);
        return;
      }
      const db = supabase as any;
      const updates: any = {
        status: newStatus,
        processed_by: user.id,
        processed_at: new Date().toISOString(),
        notes: notes.trim() || null,
      };

      if (newStatus === 'completed') {
        updates.transaction_id = transactionId.trim();
      }

      const { error } = await db
        .from('withdrawals')
        .update(updates)
        .eq('id', withdrawalId);

      if (error) throw error;

      // Add reward history entry for withdrawal
      if (newStatus === 'completed' && selectedWithdrawal) {
        await db.from('rewards_history').insert([
          {
            user_id: selectedWithdrawal.user_id,
            amount: selectedWithdrawal.amount,
            type: 'withdrawal',
            description: `Withdrawal processed: ${transactionId}`,
          },
        ]);
      }

      toast.success(`Withdrawal ${newStatus === 'completed' ? 'approved' : 'rejected'} successfully`);
      await fetchWithdrawals();
      setShowDialog(false);
      setTransactionId('');
      setNotes('');
    } catch (error: any) {
      console.error('Error processing withdrawal:', error);
      toast.error(error.message || 'Failed to process withdrawal');
    } finally {
      setProcessing(false);
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

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/admin">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Manage Withdrawals</CardTitle>
                <CardDescription>Process user withdrawal requests</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filter */}
            <div className="mb-6">
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </Select>
            </div>

            {/* Withdrawals List */}
            <div className="space-y-4">
              {filteredWithdrawals.length === 0 ? (
                <div className="text-center py-12 text-gray-600">No withdrawals found</div>
              ) : (
                filteredWithdrawals.map((withdrawal) => (
                  <div
                    key={withdrawal.id}
                    className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{withdrawal.user?.name}</h4>
                          <Badge className={getStatusColor(withdrawal.status)}>
                            {withdrawal.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(withdrawal.amount)}
                        </div>
                      </div>
                      {withdrawal.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedWithdrawal(withdrawal);
                              setShowDialog(true);
                            }}
                          >
                            Process
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 text-sm">
                      <div>
                        <div className="text-gray-600">Requested</div>
                        <div className="font-medium">{formatDateTime(withdrawal.created_at)}</div>
                      </div>
                      {withdrawal.bank && (
                        <>
                          <div>
                            <div className="text-gray-600">Account Holder</div>
                            <div className="font-medium">{withdrawal.bank.account_holder_name}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Account Number</div>
                            <div className="font-medium">****{withdrawal.bank.account_number.slice(-4)}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Bank</div>
                            <div className="font-medium">{withdrawal.bank.bank_name} - {withdrawal.bank.ifsc_code}</div>
                          </div>
                        </>
                      )}
                      {withdrawal.transaction_id && (
                        <div>
                          <div className="text-gray-600">Transaction ID</div>
                          <div className="font-medium">{withdrawal.transaction_id}</div>
                        </div>
                      )}
                      {withdrawal.processed_at && (
                        <div>
                          <div className="text-gray-600">Processed</div>
                          <div className="font-medium">{formatDateTime(withdrawal.processed_at)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Process Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent onClose={() => setShowDialog(false)}>
          <DialogHeader>
            <DialogTitle>Process Withdrawal</DialogTitle>
          </DialogHeader>
          {selectedWithdrawal && (
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="text-sm text-gray-600">Amount</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(selectedWithdrawal.amount)}
                </div>
                <div className="text-sm text-gray-600 mt-2">User: {selectedWithdrawal.user?.name}</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transaction_id">Transaction ID</Label>
                <Input
                  id="transaction_id"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction ID"
                  disabled={processing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes..."
                  disabled={processing}
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleProcess(selectedWithdrawal.id, 'completed')}
                  disabled={processing}
                >
                  {processing ? <LoadingSpinner size="sm" /> : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleProcess(selectedWithdrawal.id, 'rejected')}
                  disabled={processing}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}



