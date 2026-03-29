import { useEffect } from 'react';
import { useLocation, useNavigate, Location } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * AuthRedirectHandler Component
 * 
 * Handles redirects for authenticated users trying to access auth pages (login/register).
 * This component runs AFTER session restoration to avoid interfering with refresh behavior.
 * 
 * Key features:
 * - Only redirects AFTER loading completes (preserves page on refresh)
 * - Redirects logged-in users away from login/register pages
 * - Preserves intended destination from location state
 */

interface LocationState {
  from?: Location;
}

const AuthRedirectHandler = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // CRITICAL: Don't do anything while auth state is being restored
    // This ensures refresh doesn't cause unwanted redirects
    if (loading) return;

    // Define auth pages that logged-in users shouldn't access
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    // If user is logged in and trying to access login/register pages,
    // redirect ONLY when they came from a protected route.
    // This keeps refresh on auth pages stable (no unexpected jump).
    if (user && isAuthPage) {
      // Check if there's an intended destination from the location state
      // This happens when ProtectedRoute redirects to login
      const state = location.state as LocationState | null;
      const intendedDestination = state?.from?.pathname;

      // Only redirect when there is a valid intended destination from ProtectedRoute.
      if (
        intendedDestination &&
        intendedDestination !== location.pathname &&
        intendedDestination !== '/login' &&
        intendedDestination !== '/register'
      ) {
        const destination = intendedDestination;
        console.log(`✅ User logged in, redirecting from ${location.pathname} to ${destination}`);
        navigate(destination, { replace: true });
      }
    }
  }, [user, loading, location.pathname, location.state, navigate]);

  return null; // This component renders nothing
};

export default AuthRedirectHandler;
