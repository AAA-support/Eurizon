import React from 'react';
import { useApp } from '../../context/AppContext';
import MarketDashboard from '../trading/MarketDashboard';
import ClientDocuments from '../documents/ClientDocuments';
import './MainLayout.css';

const MainLayout = () => {
  const { currentPage, setCurrentPage, currentUser, handleLogout } = useApp();

  const renderContent = () => {
    switch(currentPage) {
      case 'dashboard':
        return <MarketDashboard />;
      case 'documents':
        return <ClientDocuments />;
      case 'portfolio':
        return <div className="page-content"><h2>Portfolio - Coming Soon</h2></div>;
      case 'trading':
        return <div className="page-content"><h2>Trading - Coming Soon</h2></div>;
      case 'watchlist':
        return <div className="page-content"><h2>Watchlist - Coming Soon</h2></div>;
      case 'analysis':
        return <div className="page-content"><h2>Analysis - Coming Soon</h2></div>;
      case 'news':
        return <div className="page-content"><h2>Market News - Coming Soon</h2></div>;
      case 'alerts':
        return <div className="page-content"><h2>Alerts - Coming Soon</h2></div>;
      case 'reports':
        return <div className="page-content"><h2>Reports - Coming Soon</h2></div>;
      case 'settings':
        return <div className="page-content"><h2>Settings - Coming Soon</h2></div>;
      default:
        return <MarketDashboard />;
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <div className="header-left">
          <img 
            src="/eurizon-logo.png" 
            alt="Eurizon Logo" 
            className="header-logo"
            onError={(e) => {
              e.target.src = '/logo.png';
            }}
          />
          <h1>Investment Portal</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{currentUser?.username}</span>
            <span className="user-role">({currentUser?.role})</span>
          </div>
          <button className="live-data">Live Data</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="main-layout">
        <div className="sidebar">
          <div 
            className={`sidebar-item ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            📈 Market Dashboard
          </div>
          <div 
            className={`sidebar-item ${currentPage === 'portfolio' ? 'active' : ''}`}
            onClick={() => setCurrentPage('portfolio')}
          >
            💼 Portfolio
          </div>
          <div 
            className={`sidebar-item ${currentPage === 'trading' ? 'active' : ''}`}
            onClick={() => setCurrentPage('trading')}
          >
            🔄 Trading
          </div>
          <div 
            className={`sidebar-item ${currentPage === 'watchlist' ? 'active' : ''}`}
            onClick={() => setCurrentPage('watchlist')}
          >
            👁 Watchlist
          </div>
          <div 
            className={`sidebar-item ${currentPage === 'analysis' ? 'active' : ''}`}
            onClick={() => setCurrentPage('analysis')}
          >
            📊 Analysis
          </div>
          <div 
            className={`sidebar-item ${currentPage === 'news' ? 'active' : ''}`}
            onClick={() => setCurrentPage('news')}
          >
            📰 Market News
          </div>
          <div 
            className={`sidebar-item ${currentPage === 'alerts' ? 'active' : ''}`}
            onClick={() => setCurrentPage('alerts')}
          >
            🔔 Alerts
          </div>
          <div 
            className={`sidebar-item ${currentPage === 'reports' ? 'active' : ''}`}
            onClick={() => setCurrentPage('reports')}
          >
            📋 Reports
          </div>
          <div 
            className={`sidebar-item ${currentPage === 'documents' ? 'active' : ''}`}
            onClick={() => setCurrentPage('documents')}
          >
            📄 Documents
          </div>
          <div 
            className={`sidebar-item ${currentPage === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentPage('settings')}
          >
            ⚙️ Settings
          </div>
        </div>

        <div className="content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;

