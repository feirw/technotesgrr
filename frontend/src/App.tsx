import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import ScrollToTop from '@/components/other/ScrollToTop';
import NativeAppBridge from '@/components/other/NativeAppBridge';
import SeoHead from '@/seo/SeoHead';
import routes, { RouteConfig } from './routes/routes';

const App: React.FC = () => {
  const routeLoadingFallback = (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <MainLayout>
      <SeoHead />
      <ScrollToTop />
      <NativeAppBridge />
      <Routes>
        {routes.map((route: RouteConfig, index: number) => (
          <Route
            key={index}
            path={route.path}
            element={<Suspense fallback={routeLoadingFallback}>{route.element}</Suspense>}
          />
        ))}
      </Routes>
    </MainLayout>
  );
};

export default App;
