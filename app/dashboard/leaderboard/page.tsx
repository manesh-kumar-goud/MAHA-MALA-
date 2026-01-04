'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getCurrentUser, signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabase/client';
import { formatCurrency, getInitials } from '@/lib/utils';
import type { LeaderboardEntry } from '@/lib/types';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function LeaderboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);

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
    await fetchLeaderboard(currentUser.id);
    setLoading(false);
  };

  const fetchLeaderboard = async (userId: string) => {
    try {
      if (!supabase) {
        toast.error('Database connection not available');
        return;
      }
      const db = supabase as any;
      const { data, error } = await db
        .from('users')
        .select('id, name, total_leads, total_rewards')
        .eq('role', 'user')
        .eq('is_active', true)
        .order('total_rewards', { ascending: false })
        .limit(50);

      if (error) throw error;

      const leaderboardWithRanks: LeaderboardEntry[] = (data || []).map((user: any, index: number) => ({
        user_id: user.id,
        name: user.name,
        total_leads: user.total_leads,
        total_rewards: user.total_rewards,
        rank: index + 1,
      }));

      setLeaderboard(leaderboardWithRanks);

      // Find current user's rank
      const currentUserRank = leaderboardWithRanks.find((u) => u.user_id === userId);
      setUserRank(currentUserRank || null);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return { icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-50' };
    if (rank === 2) return { icon: Medal, color: 'text-gray-400', bg: 'bg-gray-50' };
    if (rank === 3) return { icon: Award, color: 'text-orange-500', bg: 'bg-orange-50' };
    return { icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' };
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

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Top Referrers Leaderboard</h1>
          <p className="text-gray-600">See where you rank among our top performers</p>
        </div>

        {/* Your Rank */}
        {userRank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Card className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Rank</span>
                  <Badge className="text-lg px-4 py-1">#{userRank.rank}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <div className="text-sm text-gray-600">Total Leads</div>
                    <div className="text-2xl font-bold text-gray-900">{userRank.total_leads}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Rewards</div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(userRank.total_rewards)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Performance</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {userRank.rank <= 10 ? '⭐ Top 10' : '🚀 Keep Going!'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Top 3 Podium */}
        <div className="mb-12 grid gap-4 md:grid-cols-3 items-end">
          {leaderboard.slice(0, 3).map((entry, index) => {
            const { icon: Icon, color, bg } = getRankIcon(entry.rank);
            const heights = ['md:h-72', 'md:h-80', 'md:h-64'];
            return (
              <motion.div
                key={entry.user_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={index === 1 ? 'md:order-first' : index === 0 ? 'md:order-2' : ''}
              >
                <Card className={`${heights[index === 0 ? 1 : index === 1 ? 0 : 2]} hover-lift`}>
                  <CardHeader className="text-center">
                    <div className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full ${bg}`}>
                      <Icon className={`h-8 w-8 ${color}`} />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">#{entry.rank}</div>
                    <CardTitle className="text-xl">{entry.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-3">
                    <div>
                      <div className="text-sm text-gray-600">Total Leads</div>
                      <div className="text-2xl font-bold text-gray-900">{entry.total_leads}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Total Rewards</div>
                      <div className="text-xl font-bold text-green-600">
                        {formatCurrency(entry.total_rewards)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Remaining Rankings */}
        <Card>
          <CardHeader>
            <CardTitle>All Rankings</CardTitle>
            <CardDescription>Top 50 referrers by total rewards earned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.slice(3).map((entry, index) => (
                <motion.div
                  key={entry.user_id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                    entry.user_id === user?.id ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-700">
                      #{entry.rank}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{entry.name}</div>
                      <div className="text-sm text-gray-600">
                        {entry.total_leads} leads • {formatCurrency(entry.total_rewards)}
                      </div>
                    </div>
                  </div>
                  {entry.user_id === user?.id && (
                    <Badge variant="default">You</Badge>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Motivational Banner */}
        <Card className="mt-8 bg-gradient-to-r from-purple-600 to-purple-800 text-white border-0">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Want to climb the leaderboard?</CardTitle>
            <CardDescription className="text-purple-100">
              Refer more customers and earn rewards to improve your ranking!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/leads/new">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50">
                Add New Lead
              </Button>
            </Link>
          </CardContent>
        </Card>
    </div>
  );
}




