'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Wallet,
  Users,
  TrendingUp,
  Plus,
  IndianRupee,
  Trophy,
  ArrowRight,
  Calendar,
  RefreshCw,
  HelpCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase/client';
import { formatCurrency, getStatusColor } from '@/lib/utils';
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
    loadData();
  }, []);

  const loadData = async () => {
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
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('referrer_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (leadsError) throw leadsError;

      setLeads(leadsData || []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-600 mt-1">Monthly performance overview</p>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <Button variant="outline" size="sm">
          <Calendar className="h-4 w-4 mr-2" />
          {currentMonth}
        </Button>
        <Button variant="outline" size="sm" disabled>
          Next
        </Button>
        <Button variant="outline" size="sm">
          Current Month
        </Button>
        <Button variant="outline" size="sm" onClick={() => user && fetchDashboardData(user.id)}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <Card className="border-l-4 border-l-sky-500 bg-sky-50/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">Total Leads</CardTitle>
              <TrendingUp className="h-4 w-4 text-sky-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.totalLeads}</div>
            <p className="text-xs text-slate-600 mt-1">All time referrals</p>
          </CardContent>
        </Card>

        {/* Active Pipeline */}
        <Card className="border-l-4 border-l-emerald-500 bg-emerald-50/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">Active Pipeline</CardTitle>
              <Clock className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.activeLeads}</div>
            <p className="text-xs text-slate-600 mt-1">Leads in progress</p>
          </CardContent>
        </Card>

        {/* Total Rewards */}
        <Card className="border-l-4 border-l-amber-500 bg-amber-50/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">Total Rewards</CardTitle>
              <IndianRupee className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{formatCurrency(stats.totalRewards)}</div>
            <p className="text-xs text-slate-600 mt-1">Lifetime earnings</p>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card className="border-l-4 border-l-purple-500 bg-purple-50/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-slate-600 mt-1">Conversion rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-slate-600" />
                <CardTitle>Recent Leads - {currentMonth}</CardTitle>
              </div>
              <Link href="/dashboard/leads/new">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lead
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {leads.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-base font-medium text-slate-900 mb-2">No leads yet</h3>
                <p className="text-sm text-slate-600 mb-6">Start referring customers to earn rewards</p>
                <Link href="/dashboard/leads/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Lead
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {leads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{lead.customer_name}</div>
                      <div className="text-sm text-slate-600">{lead.customer_phone}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                      <ArrowUpRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-slate-600" />
              <CardTitle>Quick Actions - {currentMonth}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/wallet">
              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <Wallet className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">My Wallet</div>
                    <div className="text-sm text-slate-600">Manage rewards & withdrawals</div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-sky-600 transition-colors" />
              </div>
            </Link>

            <Link href="/dashboard/leaderboard">
              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                    <Trophy className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Leaderboard</div>
                    <div className="text-sm text-slate-600">See top performers</div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-sky-600 transition-colors" />
              </div>
            </Link>

            <Link href="/contact">
              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-sky-100 flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                    <HelpCircle className="h-5 w-5 text-sky-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Get Support</div>
                    <div className="text-sm text-slate-600">Contact our team</div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-sky-600 transition-colors" />
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
