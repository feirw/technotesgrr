import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle, Activity, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabaseClient'; // Import directly

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
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
    <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">
      {title}
    </h3>
  </motion.div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Correctly retrieve the session from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
          throw new Error('Authentication token not found.');
        }

        const response = await fetch('http://localhost:8001/api/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) throw new Error('Unauthorized');
          if (response.status === 403) throw new Error('Access Forbidden: Admins only');
          throw new Error('Failed to fetch admin data');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Δεν ήταν δυνατή η φόρτωση των δεδομένων.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="p-8 text-center text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 max-w-md w-full">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Σφάλμα Πρόσβασης</h3>
          <p>{error}</p>
        </div>
      </div>
    );

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
                        className={`px-3 py-1 rounded-full text-xs font-bold ${item.points_earned > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
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
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      Καμία πρόσφατη δραστηριότητα.
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