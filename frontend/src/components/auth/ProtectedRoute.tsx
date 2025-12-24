import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

type ProtectedRouteProps = {
  requireAdmin?: boolean;
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin = false, children }) => {
  const { user, loading, isAdmin } = useAuth();

  // Show loading spinner for maximum 2 seconds (handled by AuthContext timeout)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <motion.div
            className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Auth finished, no user? -> Redirect to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User exists, check if admin access is required
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/not-authorized" replace />;
  }

  // Access granted
  return <>{children}</>;
};

export default ProtectedRoute;