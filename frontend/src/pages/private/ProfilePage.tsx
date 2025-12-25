import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  LogOut,
  Trophy,
  Star,
  Zap,
  Edit2,
  Save,
  X,
  Camera,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const totalQuizzesStarted = user?.quiz_progress ? Object.keys(user.quiz_progress).length : 0;

  const totalQuestionsAnswered = user?.quiz_progress
    ? Object.values(user.quiz_progress).reduce((acc: number, quizAnswers: any) => {
        return acc + Object.keys(quizAnswers).length;
      }, 0)
    : 0;

  // Format Join Date
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('el-GR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Άγνωστο';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleUpdateProfile = async () => {
    if (!user || !newUsername.trim()) return;
    setLoading(true);
    setMsg(null);

    try {
      // 1. Update public.profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ username: newUsername })
        .eq('id', user.id);

      if (error) throw error;

      // 2. Update Supabase Auth Metadata (optional, but good for consistency)
      await supabase.auth.updateUser({
        data: { username: newUsername },
      });

      setMsg({ type: 'success', text: 'Το προφίλ ενημερώθηκε επιτυχώς!' });
      setIsEditing(false);
      // Ideally, trigger a reload of the AuthContext user here,
      // but a page refresh works for now or let the realtime subscription handle it.
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMsg({ type: 'error', text: 'Σφάλμα κατά την ενημέρωση.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      {/* 🎨 Header Background */}
      <div className="h-48 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {/* Abstract circles */}
          <div className="absolute top-[-50%] left-[-10%] w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-[-50%] right-[-10%] w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* 👤 Main Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="px-8 pt-8 pb-6 text-center md:text-left flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center shadow-lg">
                  <span className="text-5xl font-black text-pink-600">
                    {user?.username?.charAt(0).toUpperCase() ||
                      user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 bg-gray-900 text-white p-2 rounded-full cursor-pointer hover:bg-pink-600 transition-colors shadow-md">
                  <Camera className="w-4 h-4" />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-center md:justify-between mb-2">
                  <div>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          className="text-2xl font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 focus:ring-2 focus:ring-pink-500 outline-none"
                        />
                      </div>
                    ) : (
                      <h1 className="text-3xl font-black text-gray-900 dark:text-white truncate">
                        {user?.username || 'Student'}
                      </h1>
                    )}
                    <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2 mt-1">
                      <Mail className="w-4 h-4" />
                      {user?.email}
                    </p>
                  </div>

                  {/* Edit Buttons (Desktop) */}
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-wider">
                    {user?.role === 'admin' ? 'Administrator' : 'Student'}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    Μέλος από: {joinDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Edit Button */}
            <div className="md:hidden px-8 pb-6">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-pink-50 dark:bg-gray-700 text-pink-600 dark:text-pink-400 rounded-xl font-bold border border-pink-200 dark:border-gray-600"
              >
                <Edit2 className="w-4 h-4" />
                Επεξεργασία Προφίλ
              </button>
              {isEditing && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={handleUpdateProfile}
                    className="flex-1 bg-green-500 text-white py-2 rounded-xl font-bold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Success/Error Messages */}
            {msg && (
              <div
                className={`mx-8 mb-6 p-4 rounded-xl text-center font-bold ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              >
                {msg.text}
              </div>
            )}

            {/* 🏆 Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-gray-100 dark:border-gray-700 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700 bg-gray-50/50 dark:bg-gray-800/50"></div>
          </div>

          {/* 👇 Action Buttons */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-between group hover:border-pink-300 transition-all"
              onClick={() => navigate('/quiz')}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-pink-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900 dark:text-white">Συνέχισε το Quiz</h3>
                  <p className="text-sm text-gray-500">Επιστροφή στη δράση</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>

            <button
              onClick={handleLogout}
              className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-between group hover:border-red-300 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900 dark:text-white">Αποσύνδεση</h3>
                  <p className="text-sm text-gray-500">Έξοδος από το λογαριασμό</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
                <LogOut className="w-4 h-4" />
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
