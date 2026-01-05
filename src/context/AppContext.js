import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Navigation state
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Market data state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState('AAPL');

  // Demo trading state
  const [demoBalance, setDemoBalance] = useState(100);
  const [demoHoldings, setDemoHoldings] = useState({});
  const [orderQuantity, setOrderQuantity] = useState(0);

  // User accounts (should be moved to backend in production)
  const users = {
    admin: { password: 'admin123', role: 'Administrator', permissions: ['all'] },
    temp: { password: 'temp123', role: 'Temporary User', permissions: ['view'] },
    demo: { password: 'demo123', role: 'Demo User', permissions: ['view', 'trade'] }
  };

  // Market data (should be moved to API/service)
  const marketData = {
    stocks: [
      {symbol: 'AAPL', name: 'Apple Inc.', price: 195.25, change: 1.8, volume: '45.2M'},
      {symbol: 'MSFT', name: 'Microsoft Corporation', price: 365.80, change: 2.1, volume: '28.7M'},
      {symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.35, change: -0.5, volume: '22.1M'},
      {symbol: 'AMZN', name: 'Amazon.com Inc.', price: 156.78, change: 3.2, volume: '35.8M'},
      {symbol: 'TSLA', name: 'Tesla Inc.', price: 245.60, change: -1.2, volume: '32.4M'},
      {symbol: 'META', name: 'Meta Platforms Inc.', price: 485.20, change: 2.8, volume: '18.9M'},
      {symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.30, change: 4.5, volume: '41.2M'},
      {symbol: 'NFLX', name: 'Netflix Inc.', price: 445.67, change: -0.8, volume: '12.5M'},
      {symbol: 'CRM', name: 'Salesforce Inc.', price: 234.15, change: 1.9, volume: '8.7M'},
      {symbol: 'ORCL', name: 'Oracle Corporation', price: 118.45, change: 0.7, volume: '15.3M'},
    ],
    crypto: [
      {symbol: 'BTC', name: 'Bitcoin', price: 45200.00, change: 2.8, volume: '28.5B'},
      {symbol: 'ETH', name: 'Ethereum', price: 2450.75, change: 1.9, volume: '18.2B'},
      {symbol: 'BNB', name: 'Binance Coin', price: 315.40, change: -0.5, volume: '4.8B'},
    ],
    commodities: [
      {symbol: 'GOLD', name: 'Gold Futures', price: 2015.50, change: 0.8, volume: '180K'},
      {symbol: 'OIL', name: 'Crude Oil WTI', price: 78.45, change: -1.5, volume: '520K'},
    ],
    currencies: [
      {symbol: 'EUR/USD', name: 'Euro/US Dollar', price: 1.0845, change: 0.2, volume: '1.2T'},
      {symbol: 'GBP/USD', name: 'British Pound/US Dollar', price: 1.2675, change: -0.1, volume: '850B'},
    ]
  };

  // Helper functions
  const getAllMarketData = useCallback(() => {
    return [...marketData.stocks, ...marketData.crypto, ...marketData.commodities, ...marketData.currencies];
  }, []);

  const getCurrentPrice = useCallback((symbol) => {
    const allData = getAllMarketData();
    const asset = allData.find(item => item.symbol === symbol);
    return asset ? asset.price : 100;
  }, [getAllMarketData]);

  const getDemoPortfolioValue = useCallback(() => {
    let totalValue = demoBalance;
    Object.entries(demoHoldings).forEach(([symbol, quantity]) => {
      if (quantity > 0) {
        totalValue += getCurrentPrice(symbol) * quantity;
      }
    });
    return totalValue;
  }, [demoBalance, demoHoldings, getCurrentPrice]);

  const generateChartData = useCallback((symbol) => {
    const basePrice = getCurrentPrice(symbol);
    const data = [];
    let price = basePrice * 0.95;
    
    for (let i = 0; i < 30; i++) {
      const change = (Math.random() - 0.5) * 0.04;
      price = price * (1 + change);
      data.push({
        day: i + 1,
        price: parseFloat(price.toFixed(2))
      });
    }
    
    data[29].price = basePrice;
    return data;
  }, [getCurrentPrice]);

  // Login handler
  const handleLogin = useCallback(() => {
    if (users[username] && users[username].password === password) {
      setIsLoggedIn(true);
      setCurrentUser({
        username,
        role: users[username].role,
        permissions: users[username].permissions
      });
      return true;
    }
    return false;
  }, [username, password]);

  // Logout handler
  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setCurrentUser(null);
    setCurrentPage('dashboard');
  }, []);

  // Demo trading handlers
  const handleDemoBuy = useCallback(() => {
    const price = getCurrentPrice(selectedAsset);
    const totalCost = price * orderQuantity;
    
    if (totalCost <= demoBalance && orderQuantity > 0) {
      setDemoBalance(prev => prev - totalCost);
      setDemoHoldings(prev => ({
        ...prev,
        [selectedAsset]: (prev[selectedAsset] || 0) + orderQuantity
      }));
      setOrderQuantity(0);
      return { success: true, message: `Bought ${orderQuantity} shares of ${selectedAsset} for $${totalCost.toFixed(2)}` };
    }
    return { success: false, message: 'Insufficient funds or invalid quantity!' };
  }, [selectedAsset, orderQuantity, demoBalance, getCurrentPrice]);

  const handleDemoSell = useCallback(() => {
    const currentHolding = demoHoldings[selectedAsset] || 0;
    const price = getCurrentPrice(selectedAsset);
    
    if (orderQuantity <= currentHolding && orderQuantity > 0) {
      const totalValue = price * orderQuantity;
      setDemoBalance(prev => prev + totalValue);
      setDemoHoldings(prev => ({
        ...prev,
        [selectedAsset]: prev[selectedAsset] - orderQuantity
      }));
      setOrderQuantity(0);
      return { success: true, message: `Sold ${orderQuantity} shares of ${selectedAsset} for $${totalValue.toFixed(2)}` };
    }
    return { success: false, message: 'Insufficient shares or invalid quantity!' };
  }, [selectedAsset, orderQuantity, demoHoldings, getCurrentPrice]);

  const value = {
    // State
    isLoggedIn,
    currentUser,
    username,
    password,
    currentPage,
    selectedCategory,
    selectedAsset,
    demoBalance,
    demoHoldings,
    orderQuantity,
    marketData,
    
    // Setters
    setUsername,
    setPassword,
    setCurrentPage,
    setSelectedCategory,
    setSelectedAsset,
    setDemoBalance,
    setDemoHoldings,
    setOrderQuantity,
    
    // Functions
    handleLogin,
    handleLogout,
    getAllMarketData,
    getCurrentPrice,
    getDemoPortfolioValue,
    generateChartData,
    handleDemoBuy,
    handleDemoSell,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

