import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AuthRedirectHandler = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't do anything while auth state is being restored (e.g., on page refresh)
    if (loading) return;

    // Define auth pages
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    // If user is logged in and trying to access login/register pages, redirect them
    // This prevents logged-in users from seeing the login/register pages
    if (user && isAuthPage) {
      // Redirect based on role - but preserve the intended destination if they came from somewhere
      const destination = isAdmin ? '/admin' : '/profile';
      console.log(`✅ User logged in, redirecting from ${location.pathname} to ${destination}`);
      navigate(destination, { replace: true });
    }
  }, [user, loading, isAdmin, location.pathname, navigate]);

  return null; // This component renders nothing
};

export default AuthRedirectHandler;
