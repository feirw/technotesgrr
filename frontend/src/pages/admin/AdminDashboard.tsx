import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle, Activity, AlertTriangle, LucideIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';

// --- Types & Interfaces ---

interface RecentActivityItem {
  nickname: string;
  points_earned: number;
  question_id: string;
  submitted_at: string;
}

interface DashboardStats {
  total_users: number;
  total_submissions: number;
  total_questions: number;
  recent_activity: RecentActivityItem[];
}

interface AdminUserItem {
  id: string;
  username: string | null;
  email: string | null;
  role: string | null;
  created_at: string | null;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  delay: number;
}

// --- Components ---

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <span className="text-3xl font-black text-gray-800 dark:text-white">{value}</span>
    </div>
    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold">{title}</h3>
  </motion.div>
);

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Retrieve the session from Supabase to get the access token
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
          throw new Error('Authentication token not found.');
        }

        const [statsResponse, usersResponse] = await Promise.all([
          fetch('/api/admin/dashboard', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch('/api/admin/users?limit=100&offset=0', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!statsResponse.ok) {
          if (statsResponse.status === 401) throw new Error('Unauthorized');
          if (statsResponse.status === 403) throw new Error('Access Forbidden: Admins only');
          throw new Error('Failed to fetch admin data');
        }

        if (!usersResponse.ok) {
          if (usersResponse.status === 401) throw new Error('Unauthorized');
          if (usersResponse.status === 403) throw new Error('Access Forbidden: Admins only');
          throw new Error('Failed to fetch users');
        }

        const statsData: DashboardStats = await statsResponse.json();
        const usersData: { users: AdminUserItem[] } = await usersResponse.json();
        setStats(statsData);
        setUsers(usersData.users || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Δεν ήταν δυνατή η φόρτωση των δεδομένων.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="p-8 text-center text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 max-w-md w-full">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Σφάλμα Πρόσβασης</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Καλωσόρισες,{' '}
            <span className="font-bold text-pink-600">{user?.username || user?.email}</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            title="Εγγεγραμμένοι Χρήστες"
            value={stats?.total_users || 0}
            icon={Users}
            color="bg-blue-500 text-blue-500"
            delay={0.1}
          />
          <StatCard
            title="Συνολικές Απαντήσεις"
            value={stats?.total_submissions || 0}
            icon={CheckCircle}
            color="bg-green-500 text-green-500"
            delay={0.2}
          />
          <StatCard
            title="Ερωτήσεις στη Βάση"
            value={stats?.total_questions || 0}
            icon={FileText}
            color="bg-purple-500 text-purple-500"
            delay={0.3}
          />
        </div>

        {/* Recent Activity Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-pink-600" />
              Πρόσφατη Δραστηριότητα
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Χρήστης
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Πόντοι
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Question ID
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Ημερομηνία
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {stats?.recent_activity?.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {item.nickname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.points_earned > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {item.points_earned > 0 ? `+${item.points_earned}` : '0'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                      {item.question_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500 text-sm">
                      {new Date(item.submitted_at).toLocaleDateString('el-GR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
                {(!stats?.recent_activity || stats.recent_activity.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      Καμία πρόσφατη δραστηριότητα.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-pink-600" />
              Χρήστες
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Εγγραφή
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {u.username || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      {u.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2.5 py-1 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 font-bold">
                        {(u.role || 'user').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500 text-sm">
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString('el-GR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '-'}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      Δεν βρέθηκαν χρήστες.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
