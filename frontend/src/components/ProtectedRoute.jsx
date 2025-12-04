import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const ProtectedRoute = ({ requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
    );
  }

  // 1. Check if logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check if Admin is required
  if (requireAdmin && !isAdmin) {
    // Redirect non-admins to home
    return <Navigate to="/" replace />;
  }

  // 3. Allow access
  return <Outlet />;
};

export default ProtectedRoute;