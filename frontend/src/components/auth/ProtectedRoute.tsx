import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

/**
 * ProtectedRoute Component
 *
 * Protects routes that require authentication.
 * Key features:
 * - Shows loading spinner during session restoration (preserves current page on refresh)
 * - Redirects to login only if no user exists AFTER loading completes
 * - Preserves intended destination in location state for post-login redirect
 * - Supports admin-only routes
 */

type ProtectedRouteProps = {
  requireAdmin?: boolean;
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin = false, children }) => {
  const { user, loading, profileLoading, isAdmin } = useAuth();
  const location = useLocation();

  // Wait for getSession / initial resolution only (fast — local storage).
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <motion.div
            className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-gray-600 dark:text-gray-400">Φόρτωση...</p>
        </div>
      </div>
    );
  }

  // Only redirect to login if loading is complete AND no user exists
  // This ensures we don't redirect prematurely during session restoration
  // The location state preserves where the user was trying to go
  if (!loading && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin routes: wait for DB profile so role is correct (avoids wrong redirect on refresh).
  if (user && requireAdmin && profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <motion.div
            className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-gray-600 dark:text-gray-400">Φόρτωση...</p>
        </div>
      </div>
    );
  }

  if (user && requireAdmin && !isAdmin) {
    return <Navigate to="/not-authorized" replace />;
  }

  // Access granted - render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
