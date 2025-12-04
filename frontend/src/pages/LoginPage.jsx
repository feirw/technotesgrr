import React, { useState, useEffect } from 'react';
import { LogIn, Mail, Lock, AlertTriangle, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Ανακατεύθυνση αν ο χρήστης είναι ήδη συνδεδεμένος
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!email || !password) {
            setError('Παρακαλώ συμπληρώστε και τα δύο πεδία.');
            return;
        }

        setLoading(true);
        try {
            // Καλεί τη συνάρτηση login από το AuthContext
            await login(email, password); 
            // Επιτυχής σύνδεση, ανακατεύθυνση στο Home
            navigate('/'); 

        } catch (err) {
            let errorMessage = 'Σφάλμα σύνδεσης. Ελέγξτε τα στοιχεία σας.';
            
            // Προσαρμογή μηνυμάτων σφάλματος (πρέπει να υποστηρίζονται από το FastAPI backend)
            if (err.response && err.response.status === 401) {
                errorMessage = 'Λάθος email ή κωδικός πρόσβασης.';
            } else if (err.response) {
                 errorMessage = `Σφάλμα: ${err.response.data.detail || 'Ανεπιθύμητο σφάλμα.'}`;
            }

            setError(errorMessage);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-rose-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border-t-8 border-rose-500">
                
                <header className="text-center mb-8">
                    <LogIn className="w-12 h-12 text-rose-600 mx-auto mb-2" />
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        Σύνδεση Μέλους
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Πρόσβαση στο πλήρες εκπαιδευτικό υλικό
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Μήνυμα Σφάλματος */}
                    {error && (
                        <div className="flex items-center p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900 dark:border-red-600 dark:text-red-200" role="alert">
                            <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Πεδίο Email */}
                    <div>
                        <label 
                            htmlFor="email" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition duration-150"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Πεδίο Κωδικού */}
                    <div>
                        <label 
                            htmlFor="password" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Κωδικός Πρόσβασης
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition duration-150"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Κουμπί Σύνδεσης */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-lg text-lg font-extrabold text-white transition duration-300 ${
                            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700 transform hover:scale-[1.01] active:scale-[0.99]'
                        }`}
                    >
                        {loading ? 'Σύνδεση...' : <><LogIn className="w-5 h-5 mr-2" /> Είσοδος</>}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Δεν έχετε λογαριασμό; 
                        {/* Προσαρμόστε τη διαδρομή εγγραφής αν είναι διαφορετική */}
                        <Link to="/register" className="ml-1 font-bold text-fuchsia-600 hover:text-fuchsia-500 dark:text-fuchsia-400 hover:underline transition duration-150 flex items-center justify-center mt-2">
                             <UserPlus className="w-4 h-4 mr-1" /> Δημιουργήστε έναν τώρα!
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;