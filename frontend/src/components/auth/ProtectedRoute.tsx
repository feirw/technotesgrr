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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
    );
  }

  // 2. Auth finished, no user? -> Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. User is here, check Admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/not-authorized" replace />;
  }

  // 4. Access granted
  return <>{children}</>;
};

export default ProtectedRoute;
