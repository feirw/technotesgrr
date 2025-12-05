import React from 'react';
import { Route, Routes } from 'react-router-dom';
// import { AuthProvider } from '@/contexts/AuthContext';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import routes, { RouteConfig } from './routes/routes';

const App: React.FC = () => {
  return (
    // <AuthProvider>
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
                  <ProtectedRoute requireAdmin={requireAdmin}>{route.element}</ProtectedRoute>
                ) : (
                  route.element
                )
              }
            />
          );
        })}
      </Routes>
    </MainLayout>
    //</AuthProvider>
  );
};

export default App;
