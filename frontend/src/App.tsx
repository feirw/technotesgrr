import React, { Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import routes, { RouteConfig, prefetchCriticalPrivateRoutes } from './routes/routes';
import AuthRedirectHandler from './components/auth/AuthRedirectHandler';

const App: React.FC = () => {
  const routeLoadingFallback = (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  useEffect(() => {
    const prefetch = () => prefetchCriticalPrivateRoutes();
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(prefetch, { timeout: 2000 });
    } else {
      window.setTimeout(prefetch, 1200);
    }
  }, []);

  return (
    <AuthProvider>
      <AuthRedirectHandler />
      <MainLayout>
        <Routes>
          {routes.map((route: RouteConfig, index: number) => {
            const requireAdmin = route.roles?.includes('admin') && !route.roles?.includes('user');

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  route.protected ? (
                    <ProtectedRoute requireAdmin={requireAdmin}>
                      <Suspense fallback={routeLoadingFallback}>{route.element}</Suspense>
                    </ProtectedRoute>
                  ) : (
                    <Suspense fallback={routeLoadingFallback}>{route.element}</Suspense>
                  )
                }
              />
            );
          })}
        </Routes>
      </MainLayout>
    </AuthProvider>
  );
};

export default App;
