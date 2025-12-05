'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff, ArrowUp, ArrowDown, DollarSign, HelpCircle, CheckSquare, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase/client';
import { LeadRewardStructure, LeadDashboardFAQ, LeadRequirement, LeadDashboardSetting } from '@/lib/types';
import toast from 'react-hot-toast';

export default function AdminLeadDashboardPage() {
  const [activeTab, setActiveTab] = useState<'rewards' | 'faqs' | 'requirements' | 'settings'>('rewards');
  const [rewards, setRewards] = useState<LeadRewardStructure[]>([]);
  const [faqs, setFaqs] = useState<LeadDashboardFAQ[]>([]);
  const [requirements, setRequirements] = useState<LeadRequirement[]>([]);
  const [settings, setSettings] = useState<LeadDashboardSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);

    try {
      // Fetch rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('lead_reward_structure')
        .select('*')
        .order('display_order');
      
      if (rewardsError) throw rewardsError;
      if (rewardsData) setRewards(rewardsData);

      // Fetch FAQs
      const { data: faqsData, error: faqsError } = await supabase
        .from('lead_dashboard_faqs')
        .select('*')
        .order('display_order');
      
      if (faqsError) throw faqsError;
      if (faqsData) setFaqs(faqsData);

      // Fetch requirements
      const { data: reqData, error: reqError } = await supabase
        .from('lead_requirements')
        .select('*')
        .order('display_order');
      
      if (reqError) throw reqError;
      if (reqData) setRequirements(reqData);

      // Fetch settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('lead_dashboard_settings')
        .select('*')
        .order('setting_key');
      
      if (settingsError) throw settingsError;
      if (settingsData) setSettings(settingsData);

    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReward = async () => {
    try {
      if (editingId) {
        // Update existing
        const { error } = await supabase
          .from('lead_reward_structure')
          .update({
            lead_type: formData.lead_type,
            reward_amount: parseFloat(formData.reward_amount),
            description: formData.description,
            icon_name: formData.icon_name,
            display_order: parseInt(formData.display_order || '0'),
            is_active: formData.is_active !== false
          })
          .eq('id', editingId);
        
        if (error) throw error;
        toast.success('Reward updated successfully');
      } else {
        // Create new
        const { error } = await supabase
          .from('lead_reward_structure')
          .insert({
            lead_type: formData.lead_type,
            reward_amount: parseFloat(formData.reward_amount),
            description: formData.description,
            icon_name: formData.icon_name,
            display_order: parseInt(formData.display_order || '0'),
            is_active: true
          });
        
        if (error) throw error;
        toast.success('Reward added successfully');
      }
      
      setEditingId(null);
      setShowAddForm(false);
      setFormData({});
      fetchAllData();
    } catch (error: any) {
      console.error('Error saving reward:', error);
      toast.error('Failed to save: ' + error.message);
    }
  };

  const handleSaveFAQ = async () => {
    try {
      if (editingId) {
        // Update existing
        const { error } = await supabase
          .from('lead_dashboard_faqs')
          .update({
            question: formData.question,
            answer: formData.answer,
            category: formData.category,
            display_order: parseInt(formData.display_order || '0'),
            is_active: formData.is_active !== false
          })
          .eq('id', editingId);
        
        if (error) throw error;
        toast.success('FAQ updated successfully');
      } else {
        // Create new
        const { error } = await supabase
          .from('lead_dashboard_faqs')
          .insert({
            question: formData.question,
            answer: formData.answer,
            category: formData.category,
            display_order: parseInt(formData.display_order || '0'),
            is_active: true
          });
        
        if (error) throw error;
        toast.success('FAQ added successfully');
      }
      
      setEditingId(null);
      setShowAddForm(false);
      setFormData({});
      fetchAllData();
    } catch (error: any) {
      console.error('Error saving FAQ:', error);
      toast.error('Failed to save: ' + error.message);
    }
  };

  const handleSaveRequirement = async () => {
    try {
      if (editingId) {
        // Update existing
        const { error } = await supabase
          .from('lead_requirements')
          .update({
            title: formData.title,
            description: formData.description,
            icon_name: formData.icon_name,
            display_order: parseInt(formData.display_order || '0'),
            is_active: formData.is_active !== false
          })
          .eq('id', editingId);
        
        if (error) throw error;
        toast.success('Requirement updated successfully');
      } else {
        // Create new
        const { error } = await supabase
          .from('lead_requirements')
          .insert({
            title: formData.title,
            description: formData.description,
            icon_name: formData.icon_name,
            display_order: parseInt(formData.display_order || '0'),
            is_active: true
          });
        
        if (error) throw error;
        toast.success('Requirement added successfully');
      }
      
      setEditingId(null);
      setShowAddForm(false);
      setFormData({});
      fetchAllData();
    } catch (error: any) {
      console.error('Error saving requirement:', error);
      toast.error('Failed to save: ' + error.message);
    }
  };

  const handleSaveSetting = async (setting: LeadDashboardSetting) => {
    try {
      const { error } = await supabase
        .from('lead_dashboard_settings')
        .update({
          setting_value: setting.setting_value
        })
        .eq('id', setting.id);
      
      if (error) throw error;
      toast.success('Setting updated successfully');
      fetchAllData();
    } catch (error: any) {
      console.error('Error saving setting:', error);
      toast.error('Failed to save: ' + error.message);
    }
  };

  const handleDelete = async (table: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Deleted successfully');
      fetchAllData();
    } catch (error: any) {
      console.error('Error deleting:', error);
      toast.error('Failed to delete: ' + error.message);
    }
  };

  const handleToggleActive = async (table: string, id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from(table)
        .update({ is_active: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Status updated');
      fetchAllData();
    } catch (error: any) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update: ' + error.message);
    }
  };

  const handleMoveItem = async (table: string, id: string, direction: 'up' | 'down', currentOrder: number) => {
    try {
      const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
      
      const { error } = await supabase
        .from(table)
        .update({ display_order: newOrder })
        .eq('id', id);
      
      if (error) throw error;
      fetchAllData();
    } catch (error: any) {
      console.error('Error moving item:', error);
      toast.error('Failed to move: ' + error.message);
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setFormData(item);
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Lead Dashboard Management</h1>
          <p className="text-slate-600">Manage all content displayed on the Lead Dashboard page</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-slate-200">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setActiveTab('rewards');
                cancelEdit();
              }}
              className={`pb-3 px-4 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'rewards'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <DollarSign className="inline h-4 w-4 mr-2" />
              Reward Structure
            </button>
            <button
              onClick={() => {
                setActiveTab('faqs');
                cancelEdit();
              }}
              className={`pb-3 px-4 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'faqs'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="inline h-4 w-4 mr-2" />
              FAQs
            </button>
            <button
              onClick={() => {
                setActiveTab('requirements');
                cancelEdit();
              }}
              className={`pb-3 px-4 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'requirements'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckSquare className="inline h-4 w-4 mr-2" />
              Requirements
            </button>
            <button
              onClick={() => {
                setActiveTab('settings');
                cancelEdit();
              }}
              className={`pb-3 px-4 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'settings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <SettingsIcon className="inline h-4 w-4 mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'rewards' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Reward Structure</h2>
              {!showAddForm && (
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reward
                </Button>
              )}
            </div>

            {showAddForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{editingId ? 'Edit Reward' : 'Add New Reward'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <Label>Lead Type *</Label>
                      <Input
                        value={formData.lead_type || ''}
                        onChange={(e) => setFormData({ ...formData, lead_type: e.target.value })}
                        placeholder="e.g., Residential (1-3 kW)"
                      />
                    </div>
                    <div>
                      <Label>Reward Amount (₹) *</Label>
                      <Input
                        type="number"
                        value={formData.reward_amount || ''}
                        onChange={(e) => setFormData({ ...formData, reward_amount: e.target.value })}
                        placeholder="e.g., 3000"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief description of this reward type"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Icon Name (Lucide React)</Label>
                      <Input
                        value={formData.icon_name || ''}
                        onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                        placeholder="e.g., Home, Building2, Factory"
                      />
                    </div>
                    <div>
                      <Label>Display Order</Label>
                      <Input
                        type="number"
                        value={formData.display_order || '0'}
                        onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleSaveReward}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={cancelEdit}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {rewards.map((reward) => (
                <Card key={reward.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900">{reward.lead_type}</h3>
                          <Badge variant={reward.is_active ? 'default' : 'secondary'}>
                            {reward.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold text-green-600 mb-2">₹{reward.reward_amount.toLocaleString()}</p>
                        <p className="text-slate-600 mb-2">{reward.description}</p>
                        <div className="text-sm text-slate-500">
                          Icon: {reward.icon_name || 'None'} | Order: {reward.display_order}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveItem('lead_reward_structure', reward.id, 'up', reward.display_order)}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveItem('lead_reward_structure', reward.id, 'down', reward.display_order)}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive('lead_reward_structure', reward.id, reward.is_active)}
                        >
                          {reward.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(reward)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete('lead_reward_structure', reward.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'faqs' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-900">FAQs</h2>
              {!showAddForm && (
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQ
                </Button>
              )}
            </div>

            {showAddForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{editingId ? 'Edit FAQ' : 'Add New FAQ'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <Label>Question *</Label>
                      <Textarea
                        value={formData.question || ''}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        placeholder="Enter the question"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Answer *</Label>
                      <Textarea
                        value={formData.answer || ''}
                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                        placeholder="Enter the answer"
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g., earnings, payments, tracking"
                      />
                    </div>
                    <div>
                      <Label>Display Order</Label>
                      <Input
                        type="number"
                        value={formData.display_order || '0'}
                        onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleSaveFAQ}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={cancelEdit}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {faqs.map((faq) => (
                <Card key={faq.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant={faq.is_active ? 'default' : 'secondary'}>
                            {faq.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          {faq.category && (
                            <Badge variant="outline">{faq.category}</Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{faq.question}</h3>
                        <p className="text-slate-600 mb-2">{faq.answer}</p>
                        <div className="text-sm text-slate-500">Order: {faq.display_order}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveItem('lead_dashboard_faqs', faq.id, 'up', faq.display_order)}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveItem('lead_dashboard_faqs', faq.id, 'down', faq.display_order)}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive('lead_dashboard_faqs', faq.id, faq.is_active)}
                        >
                          {faq.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(faq)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete('lead_dashboard_faqs', faq.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'requirements' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Lead Requirements</h2>
              {!showAddForm && (
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Requirement
                </Button>
              )}
            </div>

            {showAddForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{editingId ? 'Edit Requirement' : 'Add New Requirement'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <Label>Title *</Label>
                      <Input
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Property Ownership"
                      />
                    </div>
                    <div>
                      <Label>Description *</Label>
                      <Textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief description"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Icon Name (Lucide React)</Label>
                      <Input
                        value={formData.icon_name || ''}
                        onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                        placeholder="e.g., CheckCircle2"
                      />
                    </div>
                    <div>
                      <Label>Display Order</Label>
                      <Input
                        type="number"
                        value={formData.display_order || '0'}
                        onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleSaveRequirement}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={cancelEdit}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {requirements.map((req) => (
                <Card key={req.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant={req.is_active ? 'default' : 'secondary'}>
                        {req.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveItem('lead_requirements', req.id, 'up', req.display_order)}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveItem('lead_requirements', req.id, 'down', req.display_order)}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive('lead_requirements', req.id, req.is_active)}
                        >
                          {req.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(req)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete('lead_requirements', req.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{req.title}</h3>
                    <p className="text-slate-600 mb-2">{req.description}</p>
                    <div className="text-sm text-slate-500">
                      Icon: {req.icon_name || 'None'} | Order: {req.display_order}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Dashboard Settings</h2>
            
            <div className="grid gap-4">
              {settings.map((setting) => (
                <Card key={setting.id}>
                  <CardContent className="pt-6">
                    <div className="grid gap-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <Label className="text-base font-semibold">{setting.setting_key.replace(/_/g, ' ').toUpperCase()}</Label>
                          <p className="text-sm text-slate-500 mt-1">{setting.description}</p>
                        </div>
                        <Badge variant="outline">{setting.setting_type}</Badge>
                      </div>
                      
                      <div className="flex gap-3">
                        <Input
                          type={setting.setting_type === 'number' ? 'number' : 'text'}
                          value={setting.setting_value}
                          onChange={(e) => {
                            const updated = settings.map(s => 
                              s.id === setting.id ? { ...s, setting_value: e.target.value } : s
                            );
                            setSettings(updated);
                          }}
                          className="flex-1"
                        />
                        <Button onClick={() => handleSaveSetting(setting)}>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

