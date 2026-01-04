'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getCurrentUser, signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabase/client';
import { formatDateTime, getStatusColor } from '@/lib/utils';
import type { ContactInquiry } from '@/lib/types';
import toast from 'react-hot-toast';

export default function AdminContactsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<ContactInquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    filterInquiries();
  }, [statusFilter, inquiries]);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
      toast.error('Access denied');
      router.push('/dashboard');
      return;
    }
    setUser(currentUser);
    await fetchInquiries();
    setLoading(false);
  };

  const fetchInquiries = async () => {
    try {
      if (!supabase) {
        toast.error('Database connection not available');
        return;
      }
      const db = supabase as any;
      const { data, error } = await db
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    }
  };

  const filterInquiries = () => {
    if (statusFilter === 'all') {
      setFilteredInquiries(inquiries);
    } else {
      setFilteredInquiries(inquiries.filter((i) => i.status === statusFilter));
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      if (!supabase) {
        toast.error('Database connection not available');
        return;
      }
      const db = supabase as any;
      const updates: any = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      if (newStatus === 'resolved' || newStatus === 'closed') {
        updates.responded_at = new Date().toISOString();
      }

      const { error } = await db
        .from('contact_inquiries')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast.success('Status updated successfully');
      await fetchInquiries();
      setShowDialog(false);
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Failed to update status');
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
                <CardTitle className="text-2xl">Contact Inquiries</CardTitle>
                <CardDescription>Manage customer inquiries and messages</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filter */}
            <div className="mb-6">
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </Select>
            </div>

            {/* Inquiries List */}
            <div className="space-y-4">
              {filteredInquiries.length === 0 ? (
                <div className="text-center py-12 text-gray-600">No inquiries found</div>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedInquiry(inquiry);
                      setShowDialog(true);
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{inquiry.name}</h4>
                          <Badge className={getStatusColor(inquiry.status)}>
                            {inquiry.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        {inquiry.subject && (
                          <div className="font-medium text-gray-700 mb-2">{inquiry.subject}</div>
                        )}
                        <p className="text-gray-600 text-sm line-clamp-2">{inquiry.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Mail className="mr-1 h-3 w-3" />
                        {inquiry.email}
                      </span>
                      {inquiry.phone && (
                        <>
                          <span>•</span>
                          <span className="flex items-center">
                            <Phone className="mr-1 h-3 w-3" />
                            {inquiry.phone}
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span>{formatDateTime(inquiry.created_at)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent onClose={() => setShowDialog(false)}>
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">From</div>
                <div className="font-medium text-lg">{selectedInquiry.name}</div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="font-medium">{selectedInquiry.email}</div>
                </div>
                {selectedInquiry.phone && (
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-medium">{selectedInquiry.phone}</div>
                  </div>
                )}
              </div>

              {selectedInquiry.subject && (
                <div>
                  <div className="text-sm text-gray-600">Subject</div>
                  <div className="font-medium">{selectedInquiry.subject}</div>
                </div>
              )}

              <div>
                <div className="text-sm text-gray-600 mb-1">Message</div>
                <div className="rounded-lg bg-gray-50 p-3 text-sm">{selectedInquiry.message}</div>
              </div>

              <div>
                <div className="text-sm text-gray-600">Received</div>
                <div className="font-medium">{formatDateTime(selectedInquiry.created_at)}</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-600">Update Status</div>
                <div className="grid gap-2 grid-cols-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedInquiry.id, 'in_progress')}
                    className="w-full"
                  >
                    In Progress
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-50 hover:bg-green-100 w-full"
                    onClick={() => handleUpdateStatus(selectedInquiry.id, 'resolved')}
                  >
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Resolved
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedInquiry.id, 'closed')}
                    className="w-full"
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}



