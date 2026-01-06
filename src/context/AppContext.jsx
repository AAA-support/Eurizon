import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [activeTab, setActiveTab] = useState('login');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [demoBalance, setDemoBalance] = useState(100000);
  const [demoPortfolio, setDemoPortfolio] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('eurizon_user');
    const storedRole = localStorage.getItem('eurizon_role');
    
    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setUserRole(storedRole);
      setIsLoggedIn(true);
      setActiveTab('dashboard');
    }
  }, []);

  const handleLogin = (credentials, role = 'user') => {
    // Validate credentials
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      throw new Error('Invalid email format');
    }

    const userData = {
      id: Date.now(),
      email: credentials.email,
      name: credentials.email.split('@')[0],
      role: role,
      loginTime: new Date().toISOString()
    };

    setUser(userData);
    setUserRole(role);
    setIsLoggedIn(true);
    setActiveTab('dashboard');

    // Store in localStorage
    localStorage.setItem('eurizon_user', JSON.stringify(userData));
    localStorage.setItem('eurizon_role', role);

    addNotification('success', `Welcome back, ${userData.name}!`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('user');
    setUser(null);
    setActiveTab('login');
    setSidebarOpen(false);
    setPortfolio([]);
    setDemoBalance(100000);
    setDemoPortfolio([]);
    
    // Clear localStorage
    localStorage.removeItem('eurizon_user');
    localStorage.removeItem('eurizon_role');
    
    addNotification('info', 'You have been logged out successfully');
  };

  const addNotification = (type, message) => {
    const notification = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date()
    };
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const updatePortfolio = (newPortfolio) => {
    setPortfolio(newPortfolio);
  };

  const updateDemoPortfolio = (trade) => {
    setDemoPortfolio(prev => [...prev, trade]);
  };

  const updateDemoBalance = (amount) => {
    setDemoBalance(prev => prev + amount);
  };

  const value = {
    // Auth state
    isLoggedIn,
    userRole,
    user,
    handleLogin,
    handleLogout,

    // Navigation
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,

    // Portfolio
    portfolio,
    updatePortfolio,
    demoBalance,
    updateDemoBalance,
    demoPortfolio,
    updateDemoPortfolio,

    // Notifications
    notifications,
    addNotification
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
