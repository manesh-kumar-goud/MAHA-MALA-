'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit2, Trash2, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getCurrentUser, signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';
import type { SubsidyInfo } from '@/lib/types';
import toast from 'react-hot-toast';

export default function AdminSubsidyPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subsidies, setSubsidies] = useState<SubsidyInfo[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    capacity: '',
    amount: '',
    description: '',
    eligibility_criteria: '',
    required_documents: '',
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
      toast.error('Access denied');
      router.push('/dashboard');
      return;
    }
    setUser(currentUser);
    await fetchSubsidies();
    setLoading(false);
  };

  const fetchSubsidies = async () => {
    try {
      const { data, error } = await supabase
        .from('subsidy_info')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setSubsidies(data || []);
    } catch (error) {
      console.error('Error fetching subsidies:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.capacity.trim() || !formData.amount) {
      toast.error('Title, capacity, and amount are required');
      return;
    }

    setSubmitting(true);

    try {
      const eligibility = formData.eligibility_criteria
        .split('\n')
        .map((c) => c.trim())
        .filter(Boolean);
      
      const documents = formData.required_documents
        .split('\n')
        .map((d) => d.trim())
        .filter(Boolean);

      const subsidyData = {
        title: formData.title.trim(),
        capacity: formData.capacity.trim(),
        amount: parseFloat(formData.amount),
        description: formData.description.trim() || null,
        eligibility_criteria: eligibility.length > 0 ? eligibility : null,
        required_documents: documents.length > 0 ? documents : null,
        is_active: formData.is_active,
        display_order: parseInt(formData.display_order.toString()),
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        const { error } = await supabase.from('subsidy_info').update(subsidyData).eq('id', editingId);
        if (error) throw error;
        toast.success('Subsidy info updated successfully');
      } else {
        const { error } = await supabase.from('subsidy_info').insert([subsidyData]);
        if (error) throw error;
        toast.success('Subsidy info created successfully');
      }

      await fetchSubsidies();
      resetForm();
      setShowDialog(false);
    } catch (error: any) {
      console.error('Error saving subsidy:', error);
      toast.error(error.message || 'Failed to save subsidy info');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (subsidy: SubsidyInfo) => {
    setEditingId(subsidy.id);
    setFormData({
      title: subsidy.title,
      capacity: subsidy.capacity,
      amount: subsidy.amount.toString(),
      description: subsidy.description || '',
      eligibility_criteria: subsidy.eligibility_criteria?.join('\n') || '',
      required_documents: subsidy.required_documents?.join('\n') || '',
      is_active: subsidy.is_active,
      display_order: subsidy.display_order,
    });
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subsidy info?')) return;

    try {
      const { error } = await supabase.from('subsidy_info').delete().eq('id', id);
      if (error) throw error;
      toast.success('Subsidy info deleted successfully');
      await fetchSubsidies();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete subsidy info');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      capacity: '',
      amount: '',
      description: '',
      eligibility_criteria: '',
      required_documents: '',
      is_active: true,
      display_order: 0,
    });
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
                <CardTitle className="text-2xl">Manage Subsidy Information</CardTitle>
                <CardDescription>Update government subsidy details</CardDescription>
              </div>
              <Button onClick={() => { resetForm(); setShowDialog(true); }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Subsidy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {subsidies.map((subsidy) => (
                <Card key={subsidy.id} className="hover-lift">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <IndianRupee className="h-8 w-8 text-green-600" />
                      {!subsidy.is_active && <Badge variant="secondary">Inactive</Badge>}
                    </div>
                    <CardTitle className="text-xl">{subsidy.title}</CardTitle>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(subsidy.amount)}
                    </div>
                    <CardDescription className="text-base">{subsidy.capacity}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(subsidy)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(subsidy.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent onClose={() => setShowDialog(false)}>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit' : 'Add'} Subsidy Info</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={submitting}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="e.g., 1-2 kW"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={submitting}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eligibility_criteria">Eligibility Criteria (one per line)</Label>
              <Textarea
                id="eligibility_criteria"
                value={formData.eligibility_criteria}
                onChange={(e) => setFormData({ ...formData, eligibility_criteria: e.target.value })}
                placeholder="Indian citizen&#10;Residential property owner&#10;Grid-connected system"
                disabled={submitting}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="required_documents">Required Documents (one per line)</Label>
              <Textarea
                id="required_documents"
                value={formData.required_documents}
                onChange={(e) => setFormData({ ...formData, required_documents: e.target.value })}
                placeholder="Aadhar Card&#10;Electricity Bill&#10;Property Documents"
                disabled={submitting}
                rows={4}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  disabled={submitting}
                />
              </div>

              <div className="flex items-center space-x-2 pt-7">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                  disabled={submitting}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? <LoadingSpinner size="sm" /> : editingId ? 'Update' : 'Add'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}



