import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/*
      1. BrowserRouter (γιατί το MainLayout έχει NavLink)
      2. AuthProvider (από το πρώτο σφάλμα σου)
      3. AppProvider (από το δεύτερο σφάλμα σου)
    */}
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          {/* Το App τώρα έχει πρόσβαση σε όλα τα Contexts */}
          <App />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);