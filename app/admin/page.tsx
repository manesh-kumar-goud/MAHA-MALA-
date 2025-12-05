'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  FileText,
  Wallet,
  Megaphone,
  Image as ImageIcon,
  BookOpen,
  Settings,
  TrendingUp,
  UserCheck,
  DollarSign,
  Activity,
  HelpCircle,
  MessageSquare,
  IndianRupee,
  Briefcase,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getCurrentUser, signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLeads: 0,
    pendingLeads: 0,
    installedLeads: 0,
    totalRewardsPaid: 0,
    pendingWithdrawals: 0,
    activeAnnouncements: 0,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
      toast.error('Access denied. Admin privileges required.');
      router.push('/dashboard');
      return;
    }
    setUser(currentUser);
    await fetchStats();
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      // Fetch users count
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'user');

      // Fetch leads stats
      const { data: leads } = await supabase.from('leads').select('status, reward_amount');
      
      const totalLeads = leads?.length || 0;
      const pendingLeads = leads?.filter((l) =>
        ['submitted', 'verified', 'contacted', 'interested'].includes(l.status)
      ).length || 0;
      const installedLeads = leads?.filter((l) =>
        ['installed', 'rewarded'].includes(l.status)
      ).length || 0;

      // Fetch total rewards paid
      const { data: rewards } = await supabase
        .from('rewards_history')
        .select('amount, type')
        .eq('type', 'lead_reward');
      
      const totalRewardsPaid = rewards?.reduce((sum, r) => sum + r.amount, 0) || 0;

      // Fetch pending withdrawals
      const { count: withdrawalsCount } = await supabase
        .from('withdrawals')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'processing']);

      // Fetch active announcements
      const { count: announcementsCount } = await supabase
        .from('announcements')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      setStats({
        totalUsers: usersCount || 0,
        totalLeads,
        pendingLeads,
        installedLeads,
        totalRewardsPaid,
        pendingWithdrawals: withdrawalsCount || 0,
        activeAnnouncements: announcementsCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const quickActions = [
    {
      icon: Users,
      title: 'Manage Users',
      description: 'View and manage user accounts',
      href: '/admin/users',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: FileText,
      title: 'Manage Leads',
      description: 'Review and update lead status',
      href: '/admin/leads',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Activity,
      title: 'Lead Dashboard',
      description: 'Manage lead dashboard content & rewards',
      href: '/admin/lead-dashboard',
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      icon: Wallet,
      title: 'Withdrawals',
      description: 'Process withdrawal requests',
      href: '/admin/withdrawals',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Megaphone,
      title: 'Announcements',
      description: 'Create and manage announcements',
      href: '/admin/announcements',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: ImageIcon,
      title: 'Gallery',
      description: 'Manage photos and videos',
      href: '/admin/gallery',
      color: 'from-pink-500 to-pink-600',
    },
    {
      icon: BookOpen,
      title: 'Blog Posts',
      description: 'Create and edit blog content',
      href: '/admin/blog',
      color: 'from-indigo-500 to-indigo-600',
    },
  ];

  const statsCards = [
    {
      icon: Users,
      title: 'Total Users',
      value: stats.totalUsers,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      icon: FileText,
      title: 'Total Leads',
      value: stats.totalLeads,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      icon: UserCheck,
      title: 'Pending Leads',
      value: stats.pendingLeads,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
    },
    {
      icon: TrendingUp,
      title: 'Installed',
      value: stats.installedLeads,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      icon: DollarSign,
      title: 'Rewards Paid',
      value: formatCurrency(stats.totalRewardsPaid),
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
    },
    {
      icon: Wallet,
      title: 'Pending Withdrawals',
      value: stats.pendingWithdrawals,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
  ];

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your solar referral platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className="hover-lift">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Management</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link href={action.href}>
                  <Card className="h-full hover-lift cursor-pointer border-2 hover:border-blue-300 transition-all">
                    <CardHeader>
                      <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${action.color}`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Content Management */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Management</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/services">
              <Card className="h-full hover-lift cursor-pointer border-2 hover:border-cyan-300 transition-all">
                <CardHeader>
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Services</CardTitle>
                  <CardDescription>Manage service offerings</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/admin/testimonials">
              <Card className="h-full hover-lift cursor-pointer border-2 hover:border-yellow-300 transition-all">
                <CardHeader>
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Testimonials</CardTitle>
                  <CardDescription>Customer reviews</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/admin/faqs">
              <Card className="h-full hover-lift cursor-pointer border-2 hover:border-teal-300 transition-all">
                <CardHeader>
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-600">
                    <HelpCircle className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">FAQs</CardTitle>
                  <CardDescription>Manage FAQs</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/admin/subsidy">
              <Card className="h-full hover-lift cursor-pointer border-2 hover:border-emerald-300 transition-all">
                <CardHeader>
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
                    <IndianRupee className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Subsidy Info</CardTitle>
                  <CardDescription>Manage subsidy details</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>

        {/* Support & Settings */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Support & Settings</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            <Link href="/admin/contacts">
              <Card className="h-full hover-lift cursor-pointer border-2 hover:border-blue-300 transition-all">
                <CardHeader>
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Contact Inquiries</CardTitle>
                  <CardDescription>Manage customer messages</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/admin/settings">
              <Card className="h-full hover-lift cursor-pointer border-2 hover:border-gray-300 transition-all">
                <CardHeader>
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-gray-500 to-gray-600">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">System Settings</CardTitle>
                  <CardDescription>Configure platform settings</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>

        {/* Alerts */}
        {(stats.pendingLeads > 0 || stats.pendingWithdrawals > 0) && (
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-900">⚠️ Attention Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.pendingLeads > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-orange-800">
                    {stats.pendingLeads} leads pending review
                  </span>
                  <Link href="/admin/leads">
                    <button className="text-orange-600 hover:underline font-medium">
                      Review Now →
                    </button>
                  </Link>
                </div>
              )}
              {stats.pendingWithdrawals > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-orange-800">
                    {stats.pendingWithdrawals} withdrawal requests pending
                  </span>
                  <Link href="/admin/withdrawals">
                    <button className="text-orange-600 hover:underline font-medium">
                      Process Now →
                    </button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}


