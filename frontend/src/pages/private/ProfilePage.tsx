import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  LogOut,
  Trophy,
  Edit2,
  Save,
  X,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, logout, updateProfileUsername } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Stats Logic
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
    setLogoutLoading(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user || !newUsername.trim()) return;

    const normalizedUsername = newUsername.trim();
    const usernameRegex = /^[\p{L}\p{N}._-]{3,24}$/u;
    if (!usernameRegex.test(normalizedUsername)) {
      setMsg({
        type: 'error',
        text: 'Το username πρέπει να είναι 3-24 χαρακτήρες και να περιέχει μόνο γράμματα, αριθμούς, . _ -',
      });
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      await updateProfileUsername(normalizedUsername);

      setMsg({ type: 'success', text: 'Το προφίλ ενημερώθηκε επιτυχώς!' });
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMsg({ type: 'error', text: error?.message || 'Σφάλμα κατά την ενημέρωση.' });
    } finally {
      setLoading(false);
    }
  };

  const cancelEditing = () => {
    setNewUsername(user?.username || '');
    setIsEditing(false);
    setMsg(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      {/* 🎨 Header Background */}
      <div className="h-48 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
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
                    {(newUsername || user?.email || '?').charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          disabled={loading}
                          className="w-full md:w-auto text-2xl font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                          placeholder="Όνομα χρήστη"
                        />
                        <div className="flex items-center justify-center md:justify-start gap-2">
                          <button
                            onClick={handleUpdateProfile}
                            disabled={loading || !newUsername.trim()}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 transition-all text-sm"
                          >
                            {loading ? (
                               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : <Save className="w-4 h-4" />}
                            Αποθήκευση
                          </button>
                          <button
                            onClick={cancelEditing}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-all text-sm"
                          >
                            <X className="w-4 h-4" />
                            Άκυρο
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-center md:justify-start gap-3">
                          <h1 className="text-3xl font-black text-gray-900 dark:text-white truncate">
                            {user?.username || 'Student'}
                          </h1>
                          <button 
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-gray-400 hover:text-pink-600 transition-colors"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2 mt-1">
                          <Mail className="w-4 h-4" />
                          {user?.email}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                  <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold tracking-wider">
                    {user?.role === 'admin' ? 'Administrator' : 'Student'}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    Μέλος από: {joinDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Success/Error Messages */}
            <AnimatePresence>
              {msg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mx-8 mb-6 p-4 rounded-xl text-center font-bold ${
                    msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {msg.text}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 🏆 Stats Grid (Placeholder logic added) */}
            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-gray-100 dark:border-gray-700 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
               <div className="p-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Quizzes</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{totalQuizzesStarted}</p>
               </div>
               <div className="p-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Ερωτήσεις</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{totalQuestionsAnswered}</p>
               </div>
               <div className="p-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Status</p>
                  <p className="text-2xl font-black text-green-500">Active</p>
               </div>
            </div>
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
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-between group hover:border-red-300 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900 dark:text-white">Αποσύνδεση</h3>
                  <p className="text-sm text-gray-500">
                    {logoutLoading ? 'Γίνεται αποσύνδεση...' : 'Έξοδος από το λογαριασμό'}
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
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