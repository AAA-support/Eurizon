import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './components/LoginPage';
import MainLayout from './components/MainLayout';
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
