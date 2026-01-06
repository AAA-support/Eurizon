import React from 'react';
import { AppProvider } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import AppRouter from './components/AppRouter';
import './styles/main.css';

const App = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;
