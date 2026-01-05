import React from 'react';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './components/auth/LoginPage';
import MainLayout from './components/dashboard/MainLayout';
import './App.css';

const AppContent = () => {
  const { isLoggedIn, loading } = useApp();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#f8fafc'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(59, 130, 246, 0.2)',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (isLoggedIn) {
    return <MainLayout />;
  }

  return <LoginPage />;
};

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
