import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Menu,
  X,
  BarChart3,
  TrendingUp,
  Clock,
  DollarSign,
  FolderOpen,
  Settings,
  GraduationCap,
  LogIn,
  Users,
  PlayCircle,
  CreditCard
} from 'lucide-react';
import NotificationBell from './NotificationBell';
import EurizonLogo from './EurizonLogo';

const Layout = ({ children }) => {
  const { 
    userRole, 
    activeTab, 
    setActiveTab, 
    sidebarOpen, 
    setSidebarOpen,
    handleLogout 
  } = useApp();

  const adminNavigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'admin', name: 'Admin', icon: Users },
    { id: 'user-portfolios', name: 'User Portfolios', icon: Users },
    { id: 'stock-management', name: 'Manage Stocks', icon: TrendingUp },
    { id: 'trading', name: 'Trading', icon: TrendingUp },
    { id: 'demo-trading', name: 'Demo Trading', icon: PlayCircle },
    { id: 'portfolio', name: 'My Portfolio', icon: Clock },
    { id: 'currency', name: 'Currency Converter', icon: DollarSign },
    { id: 'documents', name: 'Documents', icon: FolderOpen },
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'learning', name: 'Learning Centre', icon: GraduationCap }
  ];

  const userNavigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'trading', name: 'Trading', icon: TrendingUp },
    { id: 'demo-trading', name: 'Demo Trading', icon: PlayCircle },
    { id: 'portfolio', name: 'Portfolio', icon: Clock },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'currency', name: 'Currency Converter', icon: DollarSign },
    { id: 'documents', name: 'Documents', icon: FolderOpen },
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'learning', name: 'Learning Centre', icon: GraduationCap }
  ];

  const navigationItems = userRole === 'admin' ? adminNavigationItems : userNavigationItems;

  return (
    <div className="layout-container">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="mobile-menu-button"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-content">
          {/* Logo */}
          <div className="sidebar-header">
            <div className="mb-4 px-4 pt-4">
              <EurizonLogo variant="light" size="small" />
            </div>
            <div className="flex items-center justify-end px-4 pb-4">
              <NotificationBell />
            </div>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            <ul className="nav-list">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`nav-item ${activeTab === item.id ? 'nav-item-active' : ''}`}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Logout */}
            <div className="sidebar-footer">
              <button
                onClick={handleLogout}
                className="logout-button"
              >
                <LogIn size={18} />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
