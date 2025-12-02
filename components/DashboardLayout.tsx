'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sun,
  LayoutDashboard,
  Plus,
  Wallet,
  Trophy,
  FileText,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCurrentUser, signOut } from '@/lib/auth';
import type { User } from '@/lib/types';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    setLoading(false);
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

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Add Lead', href: '/dashboard/leads/new', icon: Plus },
    { name: 'My Wallet', href: '/dashboard/wallet', icon: Wallet },
    { name: 'Leaderboard', href: '/dashboard/leaderboard', icon: Trophy },
  ];

  const adminNavigation = [
    { name: 'Admin Panel', href: '/admin', icon: Shield },
  ];

  const isActive = (href: string) => {
    return pathname === href;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900 text-white fixed h-full z-50">
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="block">
            <img
              src="/logo.png"
              alt="Mahalaxmi Solar Energies"
              className="h-10 w-auto"
            />
            <div className="text-xs text-slate-400 mt-2 uppercase tracking-wider">REFERRAL PORTAL</div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors',
                  active
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Admin Navigation - Only for admin/super_admin */}
          {user && (user.role === 'admin' || user.role === 'super_admin') && (
            <>
              <div className="my-4 border-t border-slate-800" />
              {adminNavigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors',
                      active
                        ? 'bg-purple-600 text-white'
                        : 'text-slate-300 hover:bg-purple-800 hover:text-white'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-white z-50 lg:hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <Link href="/" className="block">
                <img
                  src="/logo.png"
                  alt="Mahalaxmi Solar Energies"
                  className="h-10 w-auto"
                />
                <div className="text-xs text-slate-400 mt-2 uppercase tracking-wider">REFERRAL PORTAL</div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-slate-400 hover:text-white ml-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors',
                      active
                        ? 'bg-sky-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Admin Navigation - Mobile - Only for admin/super_admin */}
              {user && (user.role === 'admin' || user.role === 'super_admin') && (
                <>
                  <div className="my-4 border-t border-slate-800" />
                  {adminNavigation.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          'flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors',
                          active
                            ? 'bg-purple-600 text-white'
                            : 'text-slate-300 hover:bg-purple-800 hover:text-white'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </>
              )}
            </nav>

            <div className="p-4 border-t border-slate-800">
              <button
                onClick={() => {
                  handleLogout();
                  setSidebarOpen(false);
                }}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors w-full"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex-1 max-w-2xl hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search leads, referrals..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="h-9 w-9 rounded-full bg-sky-600 flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

