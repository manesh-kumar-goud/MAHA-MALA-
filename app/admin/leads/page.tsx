'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, Filter, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getCurrentUser, signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabase/client';
import { formatDate, formatPhoneNumber, getStatusColor } from '@/lib/utils';
import type { Lead } from '@/lib/types';
import toast from 'react-hot-toast';

export default function AdminLeadsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [searchTerm, statusFilter, leads]);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
      toast.error('Access denied');
      router.push('/dashboard');
      return;
    }
    setUser(currentUser);
    await fetchLeads();
    setLoading(false);
  };

  const fetchLeads = async () => {
    try {
      if (!supabase) {
        toast.error('Database connection not available');
        return;
      }
      const db = supabase as any;
      const { data, error } = await db
        .from('leads')
        .select(`
          *,
          referrer:users!referrer_id(name, phone_number)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads');
    }
  };

  const filterLeads = () => {
    let filtered = leads;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (lead) =>
          lead.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.customer_phone.includes(searchTerm) ||
          lead.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLeads(filtered);
  };

  const handleStatusUpdate = async (leadId: string, newStatus: string) => {
    setUpdating(true);
    try {
      if (!supabase) {
        toast.error('Database connection not available');
        setUpdating(false);
        return;
      }
      const db = supabase as any;
      const updates: any = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      // Set timestamps based on status
      if (newStatus === 'contacted' && !selectedLead.contacted_date) {
        updates.contacted_date = new Date().toISOString();
      }
      if (newStatus === 'installed' && !selectedLead.installed_date) {
        updates.installed_date = new Date().toISOString();
        updates.reward_amount = 5000; // Default reward amount
      }
      if (newStatus === 'rewarded' && !selectedLead.rewarded_date) {
        updates.rewarded_date = new Date().toISOString();
        
        // Add reward to rewards_history
        await db.from('rewards_history').insert([
          {
            user_id: selectedLead.referrer_id,
            lead_id: leadId,
            amount: selectedLead.reward_amount || 5000,
            type: 'lead_reward',
            description: `Reward for lead: ${selectedLead.customer_name}`,
          },
        ]);
      }

      const { error } = await db.from('leads').update(updates).eq('id', leadId);

      if (error) throw error;

      toast.success('Lead status updated successfully');
      await fetchLeads();
      setShowDetailsDialog(false);
    } catch (error: any) {
      console.error('Error updating lead:', error);
      toast.error(error.message || 'Failed to update lead');
    } finally {
      setUpdating(false);
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
                <CardTitle className="text-2xl">Manage Leads</CardTitle>
                <CardDescription>Review and update lead status</CardDescription>
              </div>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name, phone, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="verified">Verified</option>
                <option value="contacted">Contacted</option>
                <option value="interested">Interested</option>
                <option value="installed">Installed</option>
                <option value="rewarded">Rewarded</option>
                <option value="rejected">Rejected</option>
              </Select>
            </div>

            {/* Leads Table */}
            <div className="space-y-3">
              {filteredLeads.length === 0 ? (
                <div className="text-center py-12 text-gray-600">No leads found</div>
              ) : (
                filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{lead.customer_name}</h4>
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </Badge>
                        {lead.is_duplicate && (
                          <Badge variant="destructive">Duplicate</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                        <span>{formatPhoneNumber(lead.customer_phone)}</span>
                        <span>•</span>
                        <span>{lead.city}</span>
                        <span>•</span>
                        <span>Referred by: {lead.referrer?.name || 'N/A'}</span>
                        <span>•</span>
                        <span>{formatDate(lead.created_at)}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedLead(lead);
                        setShowDetailsDialog(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent onClose={() => setShowDetailsDialog(false)}>
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-sm text-gray-600">Customer Name</div>
                  <div className="font-medium">{selectedLead.customer_name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Phone</div>
                  <div className="font-medium">{formatPhoneNumber(selectedLead.customer_phone)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="font-medium">{selectedLead.customer_email || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">City</div>
                  <div className="font-medium">{selectedLead.city}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Property Type</div>
                  <div className="font-medium">{selectedLead.property_type || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Submitted</div>
                  <div className="font-medium">{formatDate(selectedLead.created_at)}</div>
                </div>
              </div>

              {selectedLead.notes && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Notes</div>
                  <div className="rounded-lg bg-gray-50 p-3 text-sm">{selectedLead.notes}</div>
                </div>
              )}

              <div>
                <div className="text-sm text-gray-600 mb-2">Update Status</div>
                <Select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusUpdate(selectedLead.id, e.target.value)}
                  disabled={updating}
                >
                  <option value="submitted">Submitted</option>
                  <option value="verified">Verified</option>
                  <option value="contacted">Contacted</option>
                  <option value="interested">Interested</option>
                  <option value="installed">Installed</option>
                  <option value="rewarded">Rewarded</option>
                  <option value="rejected">Rejected</option>
                </Select>
              </div>

              {updating && (
                <div className="flex justify-center">
                  <LoadingSpinner size="sm" />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}




