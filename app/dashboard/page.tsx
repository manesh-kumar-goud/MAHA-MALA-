'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Wallet,
  Users,
  TrendingUp,
  Plus,
  Eye,
  IndianRupee,
  Gift,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getCurrentUser, signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabase/client';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import type { User, Lead, DashboardStats } from '@/lib/types';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    activeLeads: 0,
    totalRewards: 0,
    pendingWithdrawals: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);

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
    await fetchDashboardData(currentUser.id);
    setLoading(false);
  };

  const fetchDashboardData = async (userId: string) => {
    try {
      // Fetch user's leads
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('referrer_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (leadsError) throw leadsError;

      setLeads(leadsData || []);

      // Calculate stats
      const totalLeads = leadsData?.length || 0;
      const activeLeads = leadsData?.filter((l) =>
        ['submitted', 'verified', 'contacted', 'interested'].includes(l.status)
      ).length || 0;
      const installedLeads = leadsData?.filter((l) =>
        ['installed', 'rewarded'].includes(l.status)
      ).length || 0;
      const conversionRate = totalLeads > 0 ? (installedLeads / totalLeads) * 100 : 0;

      setStats({
        totalLeads,
        activeLeads,
        totalRewards: user?.total_rewards || 0,
        pendingWithdrawals: 0,
        conversionRate,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  const handleLogout = async () => {
    const result = await signOut();
    if (result.success) {
      toast.success('Logged out successfully');
      router.push('/');
    } else {
      toast.error('Failed to logout');
    }
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
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="mt-2 text-gray-600">Track your referrals and manage your rewards</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalLeads}</div>
              <p className="text-xs text-gray-600 mt-1">All time referrals</p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Leads</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.activeLeads}</div>
              <p className="text-xs text-gray-600 mt-1">In progress</p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Rewards</CardTitle>
              <Wallet className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(stats.totalRewards)}
              </div>
              <p className="text-xs text-gray-600 mt-1">Lifetime earnings</p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Conversion</CardTitle>
              <Trophy className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {stats.conversionRate.toFixed(1)}%
              </div>
              <p className="text-xs text-gray-600 mt-1">Success rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Link href="/dashboard/leads/new">
            <Card className="hover-lift cursor-pointer border-2 border-blue-200 hover:border-blue-400 transition-all">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Add New Lead</CardTitle>
                    <CardDescription>Submit a new referral</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/wallet">
            <Card className="hover-lift cursor-pointer border-2 border-green-200 hover:border-green-400 transition-all">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-green-100 p-3">
                    <Wallet className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>My Wallet</CardTitle>
                    <CardDescription>Manage rewards & withdrawals</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/leaderboard">
            <Card className="hover-lift cursor-pointer border-2 border-purple-200 hover:border-purple-400 transition-all">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-purple-100 p-3">
                    <Trophy className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Leaderboard</CardTitle>
                    <CardDescription>See top performers</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Leads</CardTitle>
                <CardDescription>Your latest referral submissions</CardDescription>
              </div>
              <Link href="/dashboard/leads">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {leads.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h3>
                <p className="text-gray-600 mb-6">Start referring customers to earn rewards</p>
                <Link href="/dashboard/leads/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Lead
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">{lead.customer_name}</h4>
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                        <span>{lead.customer_phone}</span>
                        <span>•</span>
                        <span>{lead.city}</span>
                        <span>•</span>
                        <span>{formatDate(lead.created_at)}</span>
                      </div>
                    </div>
                    <Link href={`/dashboard/leads/${lead.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Motivational Banner */}
        <Card className="mt-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-2xl mb-2">Keep Going! 🚀</CardTitle>
                <CardDescription className="text-blue-100">
                  Refer more customers and earn up to ₹5,000 per successful installation
                </CardDescription>
              </div>
              <Gift className="h-12 w-12 text-white opacity-80" />
            </div>
          </CardHeader>
        </Card>
      </div>

      <Footer />
    </div>
  );
}




