import React from 'react';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './components/auth/LoginPage';
import MainLayout from './components/dashboard/MainLayout';
import './App.css';

const AppContent = () => {
  const { isLoggedIn } = useApp();

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
