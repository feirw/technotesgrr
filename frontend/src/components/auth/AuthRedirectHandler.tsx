import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AuthRedirectHandler = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    // 1. Logged-in users should not see Login or Register pages
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    if (user && isAuthPage) {
      // If Admin, go to dashboard, otherwise profile
      const destination = isAdmin ? '/admin' : '/profile';
      navigate(destination, { replace: true });
    }

    // Note: We do NOT handle "Non-logged in users accessing protected pages" here.
    // That is handled securely by your <ProtectedRoute /> component.
  }, [user, loading, isAdmin, location, navigate]);

  return null; // This component renders nothing
};

export default AuthRedirectHandler;
