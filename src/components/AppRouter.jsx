import React from 'react';
import { useApp } from '../context/AppContext';
import Layout from './Layout';
import LoginPage from '../pages/LoginPage';
import MarketDashboard from '../pages/MarketDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import AdminStockManagement from '../pages/AdminStockManagement';
import AdminPortfolioManagement from '../pages/AdminPortfolioManagement';
import Trading from '../pages/Trading';
import DemoTrading from '../pages/DemoTrading';
import Portfolio from '../pages/Portfolio';
import UserPayment from '../pages/UserPayment';
import CurrencyConverter from '../pages/CurrencyConverter';
import Documents from '../pages/Documents';
import SettingsPage from '../pages/SettingsPage';
import LearningCenter from '../pages/LearningCenter';

const AppRouter = () => {
  const { isLoggedIn, activeTab, userRole } = useApp();

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <MarketDashboard />;
      case 'admin':
        return userRole === 'admin' ? (
          <AdminDashboard />
        ) : (
          <div className="p-6 text-white">Access Denied</div>
        );
      case 'stock-management':
        return userRole === 'admin' ? (
          <AdminStockManagement />
        ) : (
          <div className="p-6 text-white">Access Denied</div>
        );
      case 'user-portfolios':
        return userRole === 'admin' ? (
          <AdminPortfolioManagement />
        ) : (
          <div className="p-6 text-white">Access Denied</div>
        );
      case 'trading':
        return <Trading />;
      case 'demo-trading':
        return <DemoTrading />;
      case 'portfolio':
        return <Portfolio />;
      case 'payment':
        return userRole === 'user' ? (
          <UserPayment />
        ) : (
          <div className="p-6 text-white">Admin users don't have payment access</div>
        );
      case 'currency':
        return <CurrencyConverter />;
      case 'documents':
        return <Documents />;
      case 'settings':
        return <SettingsPage />;
      case 'learning':
        return <LearningCenter />;
      default:
        return <MarketDashboard />;
    }
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
};

export default AppRouter;
