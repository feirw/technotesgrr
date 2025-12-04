import React, { useState } from 'react';
import { LogIn, Mail, Lock, AlertTriangle, UserPlus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth(); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/'); // Redirect to home on success
        } catch (err) {
            console.error(err);
            // Handle Supabase specific errors
            if (err.message.includes("Invalid login credentials")) {
                setError('Λάθος email ή κωδικός πρόσβασης.');
            } else if (err.message.includes("Email not confirmed")) {
                setError('Παρακαλώ επιβεβαιώστε το email σας.');
            } else {
                setError('Προέκυψε σφάλμα σύνδεσης.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border-2 border-pink-100 dark:border-gray-700"
            >
                <header className="text-center mb-8">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn className="w-8 h-8 text-pink-600" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Συνδέσου για να δεις την πρόοδο των Quiz σου
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="flex items-center p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl"
                        >
                            <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </motion.div>
                    )}

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all dark:text-white"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Κωδικός</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all dark:text-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? 'Σύνδεση...' : (
                            <>
                                Είσοδος
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Δεν έχεις λογαριασμό;
                    </p>
                    <Link 
                        to="/register" 
                        className="inline-flex items-center justify-center px-6 py-3 border-2 border-pink-100 dark:border-gray-600 rounded-xl font-bold text-gray-700 dark:text-white hover:border-pink-500 hover:text-pink-600 transition-all w-full"
                    >
                        <UserPlus className="w-5 h-5 mr-2" />
                        Δημιουργία Λογαριασμού
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;