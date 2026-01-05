import React, { useState, useEffect } from 'react';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState('AAPL');
  const [demoBalance, setDemoBalance] = useState(100);
  const [demoHoldings, setDemoHoldings] = useState({});
  const [orderQuantity, setOrderQuantity] = useState(0);

  const [users, setUsers] = useState({
    admin: { password: 'admin123', role: 'Administrator', permissions: ['all'], balance: 1000, holdings: {} },
    temp: { password: 'temp123', role: 'Temporary User', permissions: ['view'], balance: 100, holdings: {} },
    demo: { password: 'demo123', role: 'Demo User', permissions: ['view', 'trade'], balance: 100, holdings: {} }
  });
  
  const [newUser, setNewUser] = useState({ username: '', password: '', role: '', permissions: [] });
  const [selectedUser, setSelectedUser] = useState('');
  const [positionData, setPositionData] = useState({ symbol: '', quantity: 0, action: 'add' });
  const [logoUrl, setLogoUrl] = useState('');

  // Logo component
  const Logo = ({ size = '1.5rem', className = '' }) => {
    if (logoUrl) {
      return (
        <img 
          src={logoUrl} 
          alt="Eurizon Logo" 
          className={`logo-image ${className}`}
          style={{ width: size, height: size, objectFit: 'contain' }}
        />
      );
    }
    return <div className={`logo ${className}`} style={{ fontSize: size }}>📊</div>;
  };

  // Load saved logo on startup
  useEffect(() => {
    const savedLogo = localStorage.getItem('eurizonLogo');
    if (savedLogo) {
      setLogoUrl(savedLogo);
    }
  }, []);

  // Demo trading functions
  const getCurrentPrice = (symbol) => {
    const allData = getAllMarketData();
    const asset = allData.find(item => item.symbol === symbol);
    return asset ? asset.price : 100;
  };

  const handleDemoBuy = () => {
    const price = getCurrentPrice(selectedAsset);
    const totalCost = price * orderQuantity;
    
    if (totalCost <= demoBalance && orderQuantity > 0) {
      setDemoBalance(prev => prev - totalCost);
      setDemoHoldings(prev => ({
        ...prev,
        [selectedAsset]: (prev[selectedAsset] || 0) + orderQuantity
      }));
      setOrderQuantity(0);
      alert(`Bought ${orderQuantity} shares of ${selectedAsset} for $${totalCost.toFixed(2)}`);
    } else {
      alert('Insufficient funds or invalid quantity!');
    }
  };

  const handleDemoSell = () => {
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
      alert(`Sold ${orderQuantity} shares of ${selectedAsset} for $${totalValue.toFixed(2)}`);
    } else {
      alert('Insufficient shares or invalid quantity!');
    }
  };

  const getDemoPortfolioValue = () => {
    let totalValue = demoBalance;
    Object.entries(demoHoldings).forEach(([symbol, quantity]) => {
      if (quantity > 0) {
        totalValue += getCurrentPrice(symbol) * quantity;
      }
    });
    return totalValue;
  };

  // Admin management functions
  const addUser = () => {
    if (newUser.username && newUser.password && newUser.role && newUser.permissions.length > 0) {
      if (users[newUser.username]) {
        alert('User already exists!');
        return;
      }
      setUsers(prev => ({
        ...prev,
        [newUser.username]: {
          password: newUser.password,
          role: newUser.role,
          permissions: newUser.permissions,
          balance: 100,
          holdings: {}
        }
      }));
      setNewUser({ username: '', password: '', role: '', permissions: [] });
      alert(`User ${newUser.username} created successfully!`);
    } else {
      alert('Please fill all fields and select at least one permission');
    }
  };

  const removeUser = (username) => {
    if (username === 'admin') {
      alert('Cannot delete admin user!');
      return;
    }
    if (window.confirm(`Are you sure you want to delete user ${username}?`)) {
      setUsers(prev => {
        const newUsers = { ...prev };
        delete newUsers[username];
        return newUsers;
      });
      alert(`User ${username} deleted successfully!`);
    }
  };

  const updateUserPermissions = (username, newPermissions) => {
    setUsers(prev => ({
      ...prev,
      [username]: {
        ...prev[username],
        permissions: newPermissions
      }
    }));
    alert(`Permissions updated for ${username}`);
  };

  const addUserPosition = () => {
    if (!selectedUser || !positionData.symbol || positionData.quantity <= 0) {
      alert('Please select user, symbol, and enter valid quantity');
      return;
    }

    const price = getCurrentPrice(positionData.symbol);
    const totalCost = price * positionData.quantity;

    if (positionData.action === 'add') {
      setUsers(prev => ({
        ...prev,
        [selectedUser]: {
          ...prev[selectedUser],
          holdings: {
            ...prev[selectedUser].holdings,
            [positionData.symbol]: (prev[selectedUser].holdings[positionData.symbol] || 0) + positionData.quantity
          },
          balance: prev[selectedUser].balance - totalCost
        }
      }));
      alert(`Added ${positionData.quantity} shares of ${positionData.symbol} to ${selectedUser}`);
    } else {
      const currentHolding = users[selectedUser].holdings[positionData.symbol] || 0;
      if (positionData.quantity > currentHolding) {
        alert('Cannot remove more shares than user owns');
        return;
      }
      setUsers(prev => ({
        ...prev,
        [selectedUser]: {
          ...prev[selectedUser],
          holdings: {
            ...prev[selectedUser].holdings,
            [positionData.symbol]: Math.max(0, (prev[selectedUser].holdings[positionData.symbol] || 0) - positionData.quantity)
          },
          balance: prev[selectedUser].balance + totalCost
        }
      }));
      alert(`Removed ${positionData.quantity} shares of ${positionData.symbol} from ${selectedUser}`);
    }
    
    setPositionData({ symbol: '', quantity: 0, action: 'add' });
  };

  const resetUserPortfolio = (username) => {
    if (window.confirm(`Reset ${username}'s portfolio to initial state?`)) {
      setUsers(prev => ({
        ...prev,
        [username]: {
          ...prev[username],
          balance: 100,
          holdings: {}
        }
      }));
      alert(`${username}'s portfolio has been reset`);
    }
  };

  // Generate mock chart data
  const generateChartData = (symbol) => {
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
  };

  const marketData = {
    stocks: [
      // Tech Giants
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
      {symbol: 'AMD', name: 'Advanced Micro Devices', price: 145.67, change: 3.8, volume: '23.4M'},
      {symbol: 'INTC', name: 'Intel Corporation', price: 43.21, change: -0.9, volume: '28.7M'},
      {symbol: 'QCOM', name: 'QUALCOMM Incorporated', price: 123.45, change: 2.1, volume: '8.9M'},
      {symbol: 'ADBE', name: 'Adobe Inc.', price: 567.89, change: 1.7, volume: '2.8M'},
      {symbol: 'IBM', name: 'International Business Machines', price: 167.43, change: 0.3, volume: '4.2M'},
      {symbol: 'UBER', name: 'Uber Technologies Inc.', price: 68.45, change: 2.3, volume: '15.6M'},
      {symbol: 'SHOP', name: 'Shopify Inc.', price: 89.23, change: 1.5, volume: '7.8M'},
      {symbol: 'SQ', name: 'Block Inc.', price: 78.90, change: -1.8, volume: '12.3M'},
      {symbol: 'ZOOM', name: 'Zoom Video Communications', price: 89.45, change: 0.9, volume: '5.4M'},
      
      // Financial Sector
      {symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 165.43, change: 1.5, volume: '12.8M'},
      {symbol: 'BAC', name: 'Bank of America Corp.', price: 32.67, change: 0.9, volume: '45.2M'},
      {symbol: 'WFC', name: 'Wells Fargo & Company', price: 45.89, change: -0.3, volume: '28.9M'},
      {symbol: 'GS', name: 'Goldman Sachs Group Inc.', price: 387.21, change: 2.3, volume: '2.1M'},
      {symbol: 'MS', name: 'Morgan Stanley', price: 89.76, change: 1.7, volume: '8.4M'},
      {symbol: 'C', name: 'Citigroup Inc.', price: 48.32, change: -1.1, volume: '18.7M'},
      {symbol: 'AXP', name: 'American Express Company', price: 167.89, change: 0.8, volume: '3.2M'},
      {symbol: 'V', name: 'Visa Inc.', price: 254.31, change: 1.2, volume: '8.9M'},
      {symbol: 'MA', name: 'Mastercard Incorporated', price: 421.65, change: 0.6, volume: '3.1M'},
      {symbol: 'PYPL', name: 'PayPal Holdings Inc.', price: 89.34, change: 1.4, volume: '14.2M'},
      
      // Healthcare & Pharma
      {symbol: 'JNJ', name: 'Johnson & Johnson', price: 162.45, change: 0.3, volume: '6.8M'},
      {symbol: 'PFE', name: 'Pfizer Inc.', price: 28.91, change: -2.1, volume: '32.4M'},
      {symbol: 'UNH', name: 'UnitedHealth Group Inc.', price: 512.78, change: 1.8, volume: '2.9M'},
      {symbol: 'ABBV', name: 'AbbVie Inc.', price: 154.23, change: 0.9, volume: '7.6M'},
      {symbol: 'MRK', name: 'Merck & Co. Inc.', price: 108.54, change: -0.4, volume: '9.2M'},
      {symbol: 'LLY', name: 'Eli Lilly and Company', price: 598.12, change: 3.4, volume: '3.7M'},
      {symbol: 'BMY', name: 'Bristol Myers Squibb Company', price: 67.89, change: 0.7, volume: '8.1M'},
      {symbol: 'GILD', name: 'Gilead Sciences Inc.', price: 78.45, change: 1.2, volume: '6.5M'},
      
      // Consumer Goods & Retail
      {symbol: 'KO', name: 'The Coca-Cola Company', price: 59.87, change: 0.5, volume: '14.2M'},
      {symbol: 'PEP', name: 'PepsiCo Inc.', price: 171.23, change: 0.8, volume: '4.9M'},
      {symbol: 'WMT', name: 'Walmart Inc.', price: 163.45, change: 1.3, volume: '8.7M'},
      {symbol: 'HD', name: 'The Home Depot Inc.', price: 324.56, change: 2.1, volume: '4.3M'},
      {symbol: 'MCD', name: 'McDonald\'s Corporation', price: 289.45, change: 0.9, volume: '2.8M'},
      {symbol: 'NKE', name: 'Nike Inc.', price: 134.67, change: 1.5, volume: '6.2M'},
      {symbol: 'SBUX', name: 'Starbucks Corporation', price: 98.76, change: 0.4, volume: '5.8M'},
      {symbol: 'TGT', name: 'Target Corporation', price: 145.23, change: 2.8, volume: '3.4M'},
      
      // Industrial & Manufacturing
      {symbol: 'BA', name: 'The Boeing Company', price: 205.43, change: -2.3, volume: '7.8M'},
      {symbol: 'CAT', name: 'Caterpillar Inc.', price: 287.65, change: 1.9, volume: '3.4M'},
      {symbol: 'GE', name: 'General Electric Company', price: 112.89, change: 2.8, volume: '12.6M'},
      {symbol: 'MMM', name: '3M Company', price: 134.56, change: 0.6, volume: '2.9M'},
      {symbol: 'HON', name: 'Honeywell International Inc.', price: 198.34, change: 1.1, volume: '2.1M'},
      
      // Energy
      {symbol: 'XOM', name: 'Exxon Mobil Corporation', price: 108.76, change: 2.4, volume: '18.7M'},
      {symbol: 'CVX', name: 'Chevron Corporation', price: 154.32, change: 1.8, volume: '9.3M'},
      {symbol: 'COP', name: 'ConocoPhillips', price: 89.45, change: 3.2, volume: '7.1M'},
      {symbol: 'SLB', name: 'Schlumberger Limited', price: 56.78, change: 2.7, volume: '12.4M'},
      
      // Telecom & Media
      {symbol: 'VZ', name: 'Verizon Communications Inc.', price: 45.67, change: 0.3, volume: '15.8M'},
      {symbol: 'T', name: 'AT&T Inc.', price: 18.34, change: -0.5, volume: '28.9M'},
      {symbol: 'DIS', name: 'The Walt Disney Company', price: 112.45, change: 1.7, volume: '8.6M'},
      {symbol: 'CMCSA', name: 'Comcast Corporation', price: 43.21, change: 0.8, volume: '14.2M'}
    ],
    crypto: [
      // Major Cryptocurrencies
      {symbol: 'BTC', name: 'Bitcoin', price: 45200.00, change: 2.8, volume: '28.5B'},
      {symbol: 'ETH', name: 'Ethereum', price: 2450.75, change: 1.9, volume: '18.2B'},
      {symbol: 'BNB', name: 'Binance Coin', price: 315.40, change: -0.5, volume: '4.8B'},
      {symbol: 'XRP', name: 'Ripple', price: 0.63, change: -1.8, volume: '1.9B'},
      {symbol: 'ADA', name: 'Cardano', price: 0.52, change: 3.1, volume: '2.1B'},
      {symbol: 'SOL', name: 'Solana', price: 98.67, change: 4.2, volume: '3.5B'},
      {symbol: 'DOT', name: 'Polkadot', price: 6.85, change: 2.3, volume: '890M'},
      {symbol: 'DOGE', name: 'Dogecoin', price: 0.078, change: 5.6, volume: '1.2B'},
      {symbol: 'AVAX', name: 'Avalanche', price: 38.92, change: 1.4, volume: '650M'},
      {symbol: 'LINK', name: 'Chainlink', price: 14.56, change: -0.9, volume: '450M'},
      {symbol: 'MATIC', name: 'Polygon', price: 1.23, change: 6.7, volume: '1.1B'},
      {symbol: 'LTC', name: 'Litecoin', price: 89.45, change: 2.1, volume: '780M'},
      {symbol: 'ATOM', name: 'Cosmos', price: 12.34, change: 3.8, volume: '320M'},
      {symbol: 'XLM', name: 'Stellar', price: 0.134, change: 4.2, volume: '245M'},
      {symbol: 'ALGO', name: 'Algorand', price: 0.89, change: 7.3, volume: '189M'},
      {symbol: 'VET', name: 'VeChain', price: 0.045, change: 5.1, volume: '234M'},
      {symbol: 'FIL', name: 'Filecoin', price: 7.89, change: 2.9, volume: '167M'},
      {symbol: 'SAND', name: 'The Sandbox', price: 0.67, change: 8.4, volume: '234M'},
      {symbol: 'MANA', name: 'Decentraland', price: 0.89, change: 6.2, volume: '198M'},
      {symbol: 'CRO', name: 'Cronos', price: 0.123, change: 3.7, volume: '145M'},
      {symbol: 'NEAR', name: 'NEAR Protocol', price: 4.56, change: 9.1, volume: '278M'},
      {symbol: 'FLOW', name: 'Flow', price: 1.78, change: 4.8, volume: '89M'},
      {symbol: 'ICP', name: 'Internet Computer', price: 12.45, change: -2.1, volume: '167M'},
      {symbol: 'THETA', name: 'Theta Network', price: 2.34, change: 5.6, volume: '123M'},
      {symbol: 'FTM', name: 'Fantom', price: 0.67, change: 7.8, volume: '234M'}
    ],
    commodities: [
      // Precious Metals
      {symbol: 'GOLD', name: 'Gold Futures', price: 2015.50, change: 0.8, volume: '180K'},
      {symbol: 'SILVER', name: 'Silver Futures', price: 24.78, change: 1.2, volume: '85K'},
      {symbol: 'PLATINUM', name: 'Platinum Futures', price: 967.45, change: -0.4, volume: '12K'},
      {symbol: 'PALLADIUM', name: 'Palladium Futures', price: 1234.67, change: 2.3, volume: '8K'},
      
      // Energy Commodities
      {symbol: 'OIL', name: 'Crude Oil WTI', price: 78.45, change: -1.5, volume: '520K'},
      {symbol: 'BRENT', name: 'Brent Crude Oil', price: 82.34, change: -1.2, volume: '340K'},
      {symbol: 'GAS', name: 'Natural Gas', price: 2.87, change: 3.2, volume: '275K'},
      {symbol: 'HEATING', name: 'Heating Oil', price: 2.45, change: -0.8, volume: '45K'},
      {symbol: 'GASOLINE', name: 'Gasoline RBOB', price: 2.34, change: -1.1, volume: '78K'},
      
      // Base Metals
      {symbol: 'COPPER', name: 'Copper Futures', price: 3.89, change: 0.9, volume: '95K'},
      {symbol: 'ALUMINUM', name: 'Aluminum Futures', price: 2.45, change: 1.4, volume: '67K'},
      {symbol: 'ZINC', name: 'Zinc Futures', price: 2.78, change: 0.6, volume: '34K'},
      {symbol: 'NICKEL', name: 'Nickel Futures', price: 18.45, change: 2.1, volume: '23K'},
      {symbol: 'LEAD', name: 'Lead Futures', price: 2.12, change: -0.3, volume: '18K'},
      
      // Agricultural
      {symbol: 'WHEAT', name: 'Wheat Futures', price: 645.25, change: -0.7, volume: '45K'},
      {symbol: 'CORN', name: 'Corn Futures', price: 485.50, change: 1.8, volume: '380K'},
      {symbol: 'SOYBEANS', name: 'Soybean Futures', price: 1234.75, change: 0.9, volume: '156K'},
      {symbol: 'RICE', name: 'Rice Futures', price: 16.78, change: 1.2, volume: '23K'},
      {symbol: 'COFFEE', name: 'Coffee Futures', price: 168.75, change: 2.1, volume: '25K'},
      {symbol: 'SUGAR', name: 'Sugar Futures', price: 23.45, change: -1.1, volume: '180K'},
      {symbol: 'COCOA', name: 'Cocoa Futures', price: 3245.00, change: 0.5, volume: '12K'},
      {symbol: 'COTTON', name: 'Cotton Futures', price: 78.90, change: 1.7, volume: '34K'},
      {symbol: 'OJ', name: 'Orange Juice Futures', price: 145.67, change: -2.3, volume: '8K'},
      
      // Livestock
      {symbol: 'CATTLE', name: 'Live Cattle Futures', price: 167.45, change: 1.1, volume: '67K'},
      {symbol: 'HOGS', name: 'Lean Hogs Futures', price: 89.34, change: -0.8, volume: '45K'}
    ],
    currencies: [
      // Major Pairs
      {symbol: 'EUR/USD', name: 'Euro/US Dollar', price: 1.0845, change: 0.2, volume: '1.2T'},
      {symbol: 'GBP/USD', name: 'British Pound/US Dollar', price: 1.2675, change: -0.1, volume: '850B'},
      {symbol: 'USD/JPY', name: 'US Dollar/Japanese Yen', price: 149.85, change: 0.3, volume: '950B'},
      {symbol: 'USD/CHF', name: 'US Dollar/Swiss Franc', price: 0.8945, change: 0.1, volume: '320B'},
      {symbol: 'AUD/USD', name: 'Australian Dollar/US Dollar', price: 0.6587, change: -0.4, volume: '280B'},
      {symbol: 'USD/CAD', name: 'US Dollar/Canadian Dollar', price: 1.3678, change: 0.3, volume: '245B'},
      {symbol: 'NZD/USD', name: 'New Zealand Dollar/US Dollar', price: 0.6123, change: -0.2, volume: '145B'},
      
      // Cross Pairs
      {symbol: 'EUR/GBP', name: 'Euro/British Pound', price: 0.8567, change: 0.1, volume: '234B'},
      {symbol: 'EUR/JPY', name: 'Euro/Japanese Yen', price: 162.45, change: 0.4, volume: '189B'},
      {symbol: 'GBP/JPY', name: 'British Pound/Japanese Yen', price: 189.67, change: 0.2, volume: '123B'},
      
      // Emerging Markets
      {symbol: 'USD/CNY', name: 'US Dollar/Chinese Yuan', price: 7.2345, change: 0.1, volume: '456B'},
      {symbol: 'USD/MXN', name: 'US Dollar/Mexican Peso', price: 17.8945, change: -0.3, volume: '89B'},
      {symbol: 'USD/BRL', name: 'US Dollar/Brazilian Real', price: 5.1234, change: 0.5, volume: '67B'}
    ]
  };

  const getAllMarketData = () => {
    return [...marketData.stocks, ...marketData.crypto, ...marketData.commodities, ...marketData.currencies];
  };

  const getFilteredData = () => {
    if (selectedCategory === 'all') return getAllMarketData();
    return marketData[selectedCategory] || [];
  };

  const handleLogin = () => {
    if (users[username] && users[username].password === password) {
      setIsLoggedIn(true);
      setCurrentUser({
        username,
        role: users[username].role,
        permissions: users[username].permissions
      });
    } else {
      alert('Invalid credentials!');
      setUsername('');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        const filteredData = getFilteredData();
        const chartData = generateChartData(selectedAsset);
        const currentPrice = getCurrentPrice(selectedAsset);
        const currentHolding = demoHoldings[selectedAsset] || 0;
        
        return (
          <div className="dashboard-main">
            <div className="demo-banner">
              <h2>Demo Trading Dashboard - Practice with Virtual Money</h2>
              <div className="demo-stats">
                <div className="demo-stat">
                  <span>Demo Balance:</span>
                  <span className="balance">${demoBalance.toFixed(2)}</span>
                </div>
                <div className="demo-stat">
                  <span>Portfolio Value:</span>
                  <span className="portfolio-val">${getDemoPortfolioValue().toFixed(2)}</span>
                </div>
                <div className="demo-stat">
                  <span>Total P&L:</span>
                  <span className={getDemoPortfolioValue() >= 100 ? 'positive' : 'negative'}>
                    ${(getDemoPortfolioValue() - 100).toFixed(2)} ({((getDemoPortfolioValue() - 100) / 100 * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>

            <div className="dashboard-header">
              <h2>Market Overview & Trading</h2>
              <div className="market-filter">
                <button 
                  className={selectedCategory === 'all' ? 'active' : ''} 
                  onClick={() => setSelectedCategory('all')}
                >
                  All ({getAllMarketData().length})
                </button>
                <button 
                  className={selectedCategory === 'stocks' ? 'active' : ''} 
                  onClick={() => setSelectedCategory('stocks')}
                >
                  Stocks ({marketData.stocks.length})
                </button>
                <button 
                  className={selectedCategory === 'crypto' ? 'active' : ''} 
                  onClick={() => setSelectedCategory('crypto')}
                >
                  Crypto ({marketData.crypto.length})
                </button>
                <button 
                  className={selectedCategory === 'commodities' ? 'active' : ''} 
                  onClick={() => setSelectedCategory('commodities')}
                >
                  Commodities ({marketData.commodities.length})
                </button>
                <button 
                  className={selectedCategory === 'currencies' ? 'active' : ''} 
                  onClick={() => setSelectedCategory('currencies')}
                >
                  Currencies ({marketData.currencies.length})
                </button>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-left">
                <div className="trading-section">
                  <div className="asset-selector">
                    <h3>Select Asset to Trade</h3>
                    <select 
                      value={selectedAsset} 
                      onChange={(e) => setSelectedAsset(e.target.value)}
                      className="asset-dropdown"
                    >
                      <optgroup label="Popular Stocks">
                        <option value="AAPL">AAPL - Apple Inc. (${getCurrentPrice('AAPL').toFixed(2)})</option>
                        <option value="MSFT">MSFT - Microsoft (${getCurrentPrice('MSFT').toFixed(2)})</option>
                        <option value="GOOGL">GOOGL - Google (${getCurrentPrice('GOOGL').toFixed(2)})</option>
                        <option value="TSLA">TSLA - Tesla (${getCurrentPrice('TSLA').toFixed(2)})</option>
                        <option value="NVDA">NVDA - NVIDIA (${getCurrentPrice('NVDA').toFixed(2)})</option>
                        <option value="AMZN">AMZN - Amazon (${getCurrentPrice('AMZN').toFixed(2)})</option>
                        <option value="META">META - Meta Platforms (${getCurrentPrice('META').toFixed(2)})</option>
                        <option value="NFLX">NFLX - Netflix (${getCurrentPrice('NFLX').toFixed(2)})</option>
                      </optgroup>
                      <optgroup label="Financial Stocks">
                        <option value="JPM">JPM - JPMorgan Chase (${getCurrentPrice('JPM').toFixed(2)})</option>
                        <option value="BAC">BAC - Bank of America (${getCurrentPrice('BAC').toFixed(2)})</option>
                        <option value="V">V - Visa (${getCurrentPrice('V').toFixed(2)})</option>
                        <option value="MA">MA - Mastercard (${getCurrentPrice('MA').toFixed(2)})</option>
                      </optgroup>
                      <optgroup label="Major Cryptocurrencies">
                        <option value="BTC">BTC - Bitcoin (${getCurrentPrice('BTC').toLocaleString()})</option>
                        <option value="ETH">ETH - Ethereum (${getCurrentPrice('ETH').toFixed(2)})</option>
                        <option value="BNB">BNB - Binance Coin (${getCurrentPrice('BNB').toFixed(2)})</option>
                        <option value="SOL">SOL - Solana (${getCurrentPrice('SOL').toFixed(2)})</option>
                        <option value="ADA">ADA - Cardano (${getCurrentPrice('ADA').toFixed(3)})</option>
                        <option value="DOT">DOT - Polkadot (${getCurrentPrice('DOT').toFixed(2)})</option>
                      </optgroup>
                      <optgroup label="DeFi Tokens">
                        <option value="LINK">LINK - Chainlink (${getCurrentPrice('LINK').toFixed(2)})</option>
                        <option value="MATIC">MATIC - Polygon (${getCurrentPrice('MATIC').toFixed(3)})</option>
                        <option value="AVAX">AVAX - Avalanche (${getCurrentPrice('AVAX').toFixed(2)})</option>
                        <option value="NEAR">NEAR - NEAR Protocol (${getCurrentPrice('NEAR').toFixed(2)})</option>
                      </optgroup>
                      <optgroup label="Precious Metals">
                        <option value="GOLD">GOLD - Gold Futures (${getCurrentPrice('GOLD').toFixed(2)})</option>
                        <option value="SILVER">SILVER - Silver Futures (${getCurrentPrice('SILVER').toFixed(2)})</option>
                        <option value="PLATINUM">PLATINUM - Platinum (${getCurrentPrice('PLATINUM').toFixed(2)})</option>
                      </optgroup>
                      <optgroup label="Energy Commodities">
                        <option value="OIL">OIL - Crude Oil WTI (${getCurrentPrice('OIL').toFixed(2)})</option>
                        <option value="BRENT">BRENT - Brent Crude (${getCurrentPrice('BRENT').toFixed(2)})</option>
                        <option value="GAS">GAS - Natural Gas (${getCurrentPrice('GAS').toFixed(2)})</option>
                      </optgroup>
                      <optgroup label="Agricultural">
                        <option value="CORN">CORN - Corn Futures (${getCurrentPrice('CORN').toFixed(2)})</option>
                        <option value="WHEAT">WHEAT - Wheat Futures (${getCurrentPrice('WHEAT').toFixed(2)})</option>
                        <option value="SOYBEANS">SOYBEANS - Soybeans (${getCurrentPrice('SOYBEANS').toFixed(2)})</option>
                      </optgroup>
                    </select>
                  </div>

                  <div className="price-chart">
                    <h3>{selectedAsset} Live Chart</h3>
                    <div className="current-price">
                      <div>
                        <span className="price-label">Current Price:</span>
                        <span className="price-value">${currentPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                      </div>
                      <div className="holdings-info">
                        You own: {currentHolding} shares (${(currentHolding * currentPrice).toFixed(2)})
                      </div>
                    </div>
                    
                    <div className="chart-container">
                      <svg width="100%" height="250" viewBox="0 0 500 250">
                        <defs>
                          <pattern id="grid" width="50" height="25" patternUnits="userSpaceOnUse">
                            <path d="M 50 0 L 0 0 0 25" fill="none" stroke="#2a3441" strokeWidth="0.5"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        
                        <polyline
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="3"
                          points={chartData.map((point, index) => 
                            `${(index * 500) / (chartData.length - 1)},${250 - ((point.price - Math.min(...chartData.map(d => d.price))) / (Math.max(...chartData.map(d => d.price)) - Math.min(...chartData.map(d => d.price)))) * 200 - 25}`
                          ).join(' ')}
                        />
                        
                        {chartData.map((point, index) => (
                          <circle
                            key={index}
                            cx={(index * 500) / (chartData.length - 1)}
                            cy={250 - ((point.price - Math.min(...chartData.map(d => d.price))) / (Math.max(...chartData.map(d => d.price)) - Math.min(...chartData.map(d => d.price)))) * 200 - 25}
                            r="4"
                            fill="#22c55e"
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                        ))}
                      </svg>
                    </div>
                  </div>

                  <div className="quick-trading">
                    <h3>Quick Demo Trading</h3>
                    <div className="trading-controls">
                      <div className="quantity-control">
                        <label>Quantity:</label>
                        <input 
                          type="number" 
                          value={orderQuantity}
                          onChange={(e) => setOrderQuantity(Number(e.target.value))}
                          placeholder="0" 
                          min="0"
                          step="1"
                          className="quantity-input"
                        />
                      </div>
                      
                      <div className="cost-display">
                        <span>Total Cost: ${(currentPrice * orderQuantity).toFixed(2)}</span>
                      </div>
                      
                      <div className="trade-buttons">
                        <button 
                          className="buy-btn-quick"
                          onClick={handleDemoBuy}
                          disabled={orderQuantity <= 0 || (currentPrice * orderQuantity) > demoBalance}
                        >
                          BUY {orderQuantity} shares
                        </button>
                        <button 
                          className="sell-btn-quick"
                          onClick={handleDemoSell}
                          disabled={orderQuantity <= 0 || orderQuantity > currentHolding}
                        >
                          SELL {orderQuantity} shares
                        </button>
                      </div>
                      
                      <div className="trade-info">
                        Virtual trading - Start with $100 and practice!
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-right">
                <div className="demo-portfolio-widget">
                  <h3>Your Demo Portfolio</h3>
                  <div className="portfolio-summary">
                    <div className="portfolio-stat">
                      <span>Cash:</span>
                      <span className="cash-amount">${demoBalance.toFixed(2)}</span>
                    </div>
                    <div className="portfolio-stat">
                      <span>Total:</span>
                      <span className="total-amount">${getDemoPortfolioValue().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="current-holdings">
                    <h4>Current Holdings:</h4>
                    {Object.entries(demoHoldings).filter(([_, quantity]) => quantity > 0).length === 0 ? (
                      <div className="no-holdings">No positions yet - Start trading!</div>
                    ) : (
                      Object.entries(demoHoldings)
                        .filter(([_, quantity]) => quantity > 0)
                        .map(([symbol, quantity]) => {
                          const price = getCurrentPrice(symbol);
                          const value = price * quantity;
                          return (
                            <div key={symbol} className="holding-row">
                              <div className="holding-info">
                                <span className="holding-symbol">{symbol}</span>
                                <span className="holding-qty">{quantity} shares</span>
                              </div>
                              <div className="holding-value">${value.toFixed(2)}</div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>

                <div className="market-news">
                  <h3>Market News</h3>
                  <div className="news-feed">
                    <div className="news-item">
                      <div className="news-time">09:30</div>
                      <div className="news-content">Tech stocks surge as AI adoption accelerates</div>
                    </div>
                    <div className="news-item">
                      <div className="news-time">09:15</div>
                      <div className="news-content">Bitcoin breaks $45K resistance level</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="market-table-container">
              <div className="market-table">
                <div className="table-header">
                  <div>Symbol</div>
                  <div>Name</div>
                  <div>Price</div>
                  <div>Change</div>
                  <div>Volume</div>
                  <div>Action</div>
                </div>
                <div className="table-body">
                  {filteredData.slice(0, 10).map((item, index) => (
                    <div key={index} className="table-row">
                      <div className="symbol">{item.symbol}</div>
                      <div className="name">{item.name}</div>
                      <div className="price">
                        {item.symbol.includes('/') ? item.price.toFixed(4) : 
                         item.price < 1 ? item.price.toFixed(6) : 
                         item.price.toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </div>
                      <div className={`change ${item.change >= 0 ? 'positive' : 'negative'}`}>
                        {item.change >= 0 ? '+' : ''}{item.change}%
                      </div>
                      <div className="volume">{item.volume}</div>
                      <div className="action">
                        <button 
                          className="trade-btn"
                          onClick={() => setSelectedAsset(item.symbol)}
                        >
                          Trade
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'portfolio':
        return (
          <div className="page-content">
            <h2>Portfolio Overview</h2>
            
            {currentUser?.role === 'Administrator' && (
              <div className="admin-controls">
                <h3>Administrator Controls</h3>
                <div className="admin-section">
                  <div className="user-selector">
                    <label>Manage User Portfolio:</label>
                    <select className="user-select">
                      <option>admin (Current User)</option>
                      <option>demo - Demo User</option>
                      <option>temp - Temporary User</option>
                    </select>
                  </div>
                  <div className="admin-actions">
                    <button className="admin-btn reset">Reset Portfolio</button>
                    <button className="admin-btn modify">Modify Holdings</button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="portfolio-stats">
              <div className="stat-card">
                <h4>Total Value</h4>
                <div className="stat-value">${getDemoPortfolioValue().toFixed(2)}</div>
              </div>
              <div className="stat-card">
                <h4>Available Cash</h4>
                <div className="stat-value">${demoBalance.toFixed(2)}</div>
              </div>
              <div className="stat-card">
                <h4>Total P&L</h4>
                <div className={getDemoPortfolioValue() >= 100 ? 'stat-value positive' : 'stat-value negative'}>
                  ${(getDemoPortfolioValue() - 100).toFixed(2)}
                </div>
              </div>
            </div>
            
            <div className="holdings-section">
              <h3>Current Holdings</h3>
              {Object.entries(demoHoldings).filter(([_, quantity]) => quantity > 0).length === 0 ? (
                <div className="empty-portfolio">
                  <p>Your portfolio is currently empty.</p>
                  <p>Start trading from the Dashboard to build your portfolio!</p>
                </div>
              ) : (
                <div className="holdings-list">
                  {Object.entries(demoHoldings)
                    .filter(([_, quantity]) => quantity > 0)
                    .map(([symbol, quantity]) => {
                      const price = getCurrentPrice(symbol);
                      const value = price * quantity;
                      return (
                        <div key={symbol} className="holding-detail">
                          <div className="holding-header">
                            <span className="holding-symbol">{symbol}</span>
                            <span className="holding-value">${value.toFixed(2)}</span>
                          </div>
                          <div className="holding-info">
                            <span>Quantity: {quantity} shares</span>
                            <span>Price: ${price.toFixed(2)}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        );

      case 'trading':
        if (!currentUser?.permissions.includes('trade') && currentUser?.role !== 'Administrator') {
          return (
            <div className="page-content">
              <div className="access-denied">
                <div className="warning-icon">⚠️</div>
                <h2>Access Restricted</h2>
                <p>Trading functionality is not available for your account type.</p>
                <div className="permission-info">
                  <p><strong>Your current permissions:</strong> {currentUser?.permissions.join(', ')}</p>
                  <p><strong>Required permission:</strong> Trading access</p>
                </div>
                <button 
                  className="back-btn"
                  onClick={() => setCurrentPage('dashboard')}
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          );
        }

        return (
          <div className="page-content">
            <h2>Advanced Trading</h2>
            <p>Advanced trading features coming soon...</p>
          </div>
        );

      case 'admin':
        if (currentUser?.role !== 'Administrator') {
          return (
            <div className="page-content">
              <div className="access-denied">
                <div className="warning-icon">🚫</div>
                <h2>Administrative Access Required</h2>
                <p>This section is restricted to administrators only.</p>
                <button 
                  className="back-btn"
                  onClick={() => setCurrentPage('dashboard')}
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          );
        }

        return (
          <div className="page-content">
            <h2>Administration Panel</h2>
            
            <div className="admin-tabs">
              <div className="admin-section">
                <h3>User Management</h3>
                
                <div className="user-management-grid">
                  <div className="add-user-section">
                    <h4>Add New User</h4>
                    <div className="add-user-form">
                      <div className="form-row">
                        <input
                          type="text"
                          placeholder="Username"
                          value={newUser.username}
                          onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                          className="admin-input"
                        />
                        <input
                          type="password"
                          placeholder="Password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                          className="admin-input"
                        />
                      </div>
                      
                      <div className="form-row">
                        <select
                          value={newUser.role}
                          onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                          className="admin-select"
                        >
                          <option value="">Select Role</option>
                          <option value="Administrator">Administrator</option>
                          <option value="Demo User">Demo User</option>
                          <option value="Temporary User">Temporary User</option>
                          <option value="Premium User">Premium User</option>
                        </select>
                      </div>
                      
                      <div className="permissions-section">
                        <label>Permissions:</label>
                        <div className="permissions-grid">
                          {['view', 'trade', 'admin', 'reports'].map(permission => (
                            <label key={permission} className="permission-checkbox">
                              <input
                                type="checkbox"
                                checked={newUser.permissions.includes(permission)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewUser({...newUser, permissions: [...newUser.permissions, permission]});
                                  } else {
                                    setNewUser({...newUser, permissions: newUser.permissions.filter(p => p !== permission)});
                                  }
                                }}
                              />
                              {permission}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <button onClick={addUser} className="admin-btn add">
                        Create User
                      </button>
                    </div>
                  </div>

                  <div className="existing-users-section">
                    <h4>Existing Users</h4>
                    <div className="users-list">
                      {Object.entries(users).map(([username, userData]) => (
                        <div key={username} className="user-card">
                          <div className="user-card-header">
                            <div className="user-info">
                              <span className="username">{username}</span>
                              <span className="user-role">{userData.role}</span>
                            </div>
                            <div className="user-actions">
                              <button 
                                className="admin-btn small modify"
                                onClick={() => setSelectedUser(username)}
                              >
                                Edit
                              </button>
                              {username !== 'admin' && (
                                <button 
                                  className="admin-btn small delete"
                                  onClick={() => removeUser(username)}
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <div className="user-card-details">
                            <div className="user-stat">
                              <span>Balance:</span>
                              <span>${userData.balance?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="user-stat">
                              <span>Holdings:</span>
                              <span>{Object.keys(userData.holdings || {}).length} positions</span>
                            </div>
                            <div className="user-stat">
                              <span>Permissions:</span>
                              <span>{userData.permissions.join(', ')}</span>
                            </div>
                          </div>
                          
                          <div className="user-card-actions">
                            <button 
                              className="admin-btn small reset"
                              onClick={() => resetUserPortfolio(username)}
                            >
                              Reset Portfolio
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-section">
                <h3>Position Management</h3>
                
                <div className="position-management-grid">
                  <div className="position-controls">
                    <h4>Manage User Positions</h4>
                    
                    <div className="position-form">
                      <div className="form-row">
                        <select
                          value={selectedUser}
                          onChange={(e) => setSelectedUser(e.target.value)}
                          className="admin-select"
                        >
                          <option value="">Select User</option>
                          {Object.keys(users).map(username => (
                            <option key={username} value={username}>{username}</option>
                          ))}
                        </select>
                        
                        <select
                          value={positionData.symbol}
                          onChange={(e) => setPositionData({...positionData, symbol: e.target.value})}
                          className="admin-select"
                        >
                          <option value="">Select Symbol</option>
                          {getAllMarketData().map(item => (
                            <option key={item.symbol} value={item.symbol}>
                              {item.symbol} - {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="form-row">
                        <input
                          type="number"
                          placeholder="Quantity"
                          value={positionData.quantity}
                          onChange={(e) => setPositionData({...positionData, quantity: Number(e.target.value)})}
                          className="admin-input"
                          min="0"
                          step="1"
                        />
                        
                        <select
                          value={positionData.action}
                          onChange={(e) => setPositionData({...positionData, action: e.target.value})}
                          className="admin-select"
                        >
                          <option value="add">Add Position</option>
                          <option value="remove">Remove Position</option>
                        </select>
                      </div>
                      
                      <button onClick={addUserPosition} className="admin-btn modify">
                        {positionData.action === 'add' ? 'Add Position' : 'Remove Position'}
                      </button>
                    </div>
                  </div>

                  <div className="user-positions">
                    <h4>User Positions</h4>
                    {selectedUser && users[selectedUser] ? (
                      <div className="positions-display">
                        <div className="user-balance">
                          <h5>{selectedUser}'s Portfolio</h5>
                          <div className="balance-info">
                            <span>Balance: ${users[selectedUser].balance?.toFixed(2) || '0.00'}</span>
                            <span>Role: {users[selectedUser].role}</span>
                          </div>
                        </div>
                        
                        <div className="positions-list">
                          {Object.entries(users[selectedUser].holdings || {})
                            .filter(([_, quantity]) => quantity > 0)
                            .length === 0 ? (
                            <div className="no-positions">No positions found</div>
                          ) : (
                            Object.entries(users[selectedUser].holdings || {})
                              .filter(([_, quantity]) => quantity > 0)
                              .map(([symbol, quantity]) => {
                                const price = getCurrentPrice(symbol);
                                const value = price * quantity;
                                return (
                                  <div key={symbol} className="position-item">
                                    <div className="position-info">
                                      <span className="position-symbol">{symbol}</span>
                                      <span className="position-details">
                                        {quantity} shares @ ${price.toFixed(2)}
                                      </span>
                                    </div>
                                    <div className="position-value">
                                      ${value.toFixed(2)}
                                    </div>
                                  </div>
                                );
                              })
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="select-user-message">
                        Select a user to view their positions
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="admin-section">
                <h3>Platform Settings</h3>
                
                <div className="platform-settings-grid">
                  <div className="setting-group">
                    <h4>Branding & Appearance</h4>
                    <div className="setting-row">
                      <label>Upload Company Logo:</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setLogoUrl(event.target.result);
                              localStorage.setItem('eurizonLogo', event.target.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="file-input" 
                      />
                    </div>
                    <div className="setting-row">
                      <label>Current Logo Preview:</label>
                      <div className="logo-preview">
                        <Logo size="2rem" />
                      </div>
                    </div>
                    <div className="setting-item">
                      <button 
                        className="admin-btn small reset"
                        onClick={() => {
                          setLogoUrl('');
                          localStorage.removeItem('eurizonLogo');
                        }}
                      >
                        Reset to Default Logo
                      </button>
                    </div>
                  </div>
                  
                  <div className="setting-group">
                    <h4>Market Data</h4>
                    <div className="setting-item">
                      <label>
                        <input type="checkbox" defaultChecked />
                        Real-time price updates
                      </label>
                    </div>
                    <div className="setting-item">
                      <label>
                        <input type="checkbox" defaultChecked />
                        Extended trading hours
                      </label>
                    </div>
                    <div className="setting-item">
                      <label>
                        <input type="checkbox" />
                        Crypto trading enabled
                      </label>
                    </div>
                  </div>
                  
                  <div className="setting-group">
                    <h4>User Defaults</h4>
                    <div className="setting-row">
                      <label>Default Starting Balance:</label>
                      <input type="number" defaultValue="100" className="setting-input" />
                    </div>
                    <div className="setting-row">
                      <label>Session Timeout (minutes):</label>
                      <input type="number" defaultValue="30" className="setting-input" />
                    </div>
                    <div className="setting-row">
                      <label>Max Daily Trades:</label>
                      <input type="number" defaultValue="50" className="setting-input" />
                    </div>
                  </div>
                  
                  <div className="setting-group">
                    <h4>Risk Management</h4>
                    <div className="setting-item">
                      <label>
                        <input type="checkbox" defaultChecked />
                        Enable position limits
                      </label>
                    </div>
                    <div className="setting-item">
                      <label>
                        <input type="checkbox" />
                        Require stop-loss orders
                      </label>
                    </div>
                    <div className="setting-row">
                      <label>Max position size (%):</label>
                      <input type="number" defaultValue="25" className="setting-input" />
                    </div>
                  </div>
                </div>
                
                <div className="platform-actions">
                  <button className="admin-btn save">Save Platform Settings</button>
                  <button className="admin-btn export">Export User Data</button>
                  <button className="admin-btn backup">Backup Database</button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="page-content">
            <h2>{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</h2>
            <p>This section is coming soon...</p>
          </div>
        );
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <Logo size="3rem" />
          <h1>Eurizon Portal</h1>
          <p>Professional Investment Management</p>
          
          <div className="login-section">
            <h2>Sign In</h2>
            <p className="login-subtitle">Enter your credentials to access your account</p>
            
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            
            <button onClick={handleLogin} className="sign-in-btn">
              Sign In
            </button>
          </div>
          
          <div className="login-footer">
            © 2025 Eurizon Investment. All Rights Reserved.
          </div>
        </div>

        <style jsx>{`
          .login-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          .login-card {
            background: #334155;
            border-radius: 12px;
            padding: 3rem;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
            border: 1px solid #475569;
            width: 100%;
            max-width: 420px;
            text-align: center;
          }
          .login-logo {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          h1 {
            color: #f8fafc;
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
          }
          .login-card > p {
            color: #cbd5e1;
            margin-bottom: 2rem;
            font-size: 0.95rem;
          }
          .login-section {
            background: #475569;
            border-radius: 8px;
            padding: 2rem;
            margin-bottom: 1.5rem;
          }
          h2 {
            color: #f8fafc;
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
          }
          .login-subtitle {
            color: #94a3b8;
            font-size: 0.875rem;
            margin-bottom: 1.5rem;
          }
          .form-group {
            margin-bottom: 1.25rem;
            text-align: left;
          }
          label {
            display: block;
            color: #f1f5f9;
            font-weight: 500;
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
          }
          input {
            width: 100%;
            padding: 0.875rem;
            background: #1e293b;
            border: 1px solid #64748b;
            border-radius: 6px;
            color: #f8fafc;
            font-size: 0.9rem;
            transition: border-color 0.2s;
            box-sizing: border-box;
          }
          input:focus {
            outline: none;
            border-color: #3b82f6;
          }
          input::placeholder {
            color: #94a3b8;
          }
          .sign-in-btn {
            width: 100%;
            background: #3b82f6;
            color: white;
            border: none;
            padding: 0.875rem;
            border-radius: 6px;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .sign-in-btn:hover {
            background: #2563eb;
          }
          .login-footer {
            color: #94a3b8;
            font-size: 0.75rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="header">
        <div className="header-left">
          <Logo />
          <h1>Eurizon Portal</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{currentUser?.username}</span>
            <span className="user-role">({currentUser?.role})</span>
          </div>
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
            className={`sidebar-item ${currentPage === 'trading' ? 'active' : ''} ${!currentUser?.permissions.includes('trade') && currentUser?.role !== 'Administrator' ? 'restricted' : ''}`}
            onClick={() => setCurrentPage('trading')}
          >
            🔄 Trading {!currentUser?.permissions.includes('trade') && currentUser?.role !== 'Administrator' && <span className="lock-icon">🔒</span>}
          </div>
          <div 
            className={`sidebar-item ${currentPage === 'watchlist' ? 'active' : ''}`}
            onClick={() => setCurrentPage('watchlist')}
          >
            👁 Watchlist
          </div>
          <div 
            className={`sidebar-item ${currentPage === 'reports' ? 'active' : ''}`}
            onClick={() => setCurrentPage('reports')}
          >
            📋 Reports
          </div>
          <div 
            className={`sidebar-item ${currentPage === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentPage('settings')}
          >
            ⚙️ Settings
          </div>
          {currentUser?.role === 'Administrator' && (
            <div 
              className={`sidebar-item ${currentPage === 'admin' ? 'active' : ''}`}
              onClick={() => setCurrentPage('admin')}
            >
              👨‍💼 Administration
            </div>
          )}
        </div>

        <div className="content-area">
          {renderContent()}
        </div>
      </div>

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          background: #0a0e1a;
          color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .header {
          background: #1a1f2e;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #2a3441;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .logo {
          font-size: 1.5rem;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .user-info {
          display: flex;
          flex-direction: column;
          text-align: right;
          margin-right: 1rem;
        }
        .user-name {
          font-weight: bold;
          color: #3b82f6;
        }
        .user-role {
          font-size: 0.8rem;
          color: #9ca3af;
        }
        .logout-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .main-layout {
          display: flex;
          min-height: calc(100vh - 80px);
        }
        .sidebar {
          width: 250px;
          background: #1a1f2e;
          border-right: 1px solid #2a3441;
          padding: 1rem 0;
        }
        .sidebar-item {
          padding: 0.75rem 1.5rem;
          cursor: pointer;
          transition: all 0.2s;
          border-left: 3px solid transparent;
        }
        .sidebar-item:hover {
          background: #2a3441;
        }
        .sidebar-item.active {
          background: #2a3441;
          border-left-color: #3b82f6;
          color: #3b82f6;
        }
        .sidebar-item.restricted {
          opacity: 0.7;
        }
        .lock-icon {
          margin-left: 0.5rem;
          font-size: 0.8rem;
        }
        .content-area {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }
        .demo-banner {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          color: white;
        }
        .demo-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }
        .demo-stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .balance, .portfolio-val {
          font-weight: bold;
          font-size: 1.2rem;
          color: #22c55e;
        }
        .portfolio-val {
          color: #f59e0b;
        }
        .positive {
          color: #22c55e;
        }
        .negative {
          color: #ef4444;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .market-filter {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .market-filter button {
          padding: 0.5rem 1rem;
          background: #2a3441;
          color: #ffffff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .market-filter button:hover {
          background: #3a4451;
        }
        .market-filter button.active {
          background: #3b82f6;
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        .trading-section {
          background: #1a1f2e;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #2a3441;
          margin-bottom: 1.5rem;
        }
        .asset-dropdown {
          width: 100%;
          padding: 0.75rem;
          background: #2a3441;
          border: 1px solid #3a4451;
          border-radius: 4px;
          color: white;
          margin-top: 0.5rem;
        }
        .price-chart {
          margin: 1.5rem 0;
        }
        .current-price {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding: 1rem;
          background: #2a3441;
          border-radius: 6px;
        }
        .price-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #22c55e;
        }
        .holdings-info {
          color: #9ca3af;
          font-size: 0.9rem;
        }
        .chart-container {
          background: #0a0e1a;
          border-radius: 6px;
          padding: 1rem;
          margin: 1rem 0;
        }
        .quick-trading {
          padding: 1.5rem;
          background: #0f172a;
          border-radius: 6px;
          border: 2px solid #1e40af;
        }
        .trading-controls {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .quantity-control {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .quantity-input {
          padding: 0.5rem;
          background: #2a3441;
          border: 1px solid #3a4451;
          border-radius: 4px;
          color: white;
          width: 120px;
        }
        .cost-display {
          font-size: 1.2rem;
          font-weight: bold;
          color: #3b82f6;
          text-align: center;
          padding: 1rem;
          background: #1e3a8a;
          border-radius: 6px;
        }
        .trade-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .buy-btn-quick, .sell-btn-quick {
          padding: 1rem;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .buy-btn-quick {
          background: #22c55e;
          color: white;
        }
        .sell-btn-quick {
          background: #ef4444;
          color: white;
        }
        .buy-btn-quick:disabled, .sell-btn-quick:disabled {
          background: #6b7280;
          cursor: not-allowed;
        }
        .trade-info {
          text-align: center;
          font-size: 0.95rem;
          color: #22c55e;
          font-style: italic;
        }
        .demo-portfolio-widget {
          background: #1a1f2e;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #2a3441;
          margin-bottom: 1.5rem;
        }
        .portfolio-summary {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .portfolio-stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #2a3441;
          border-radius: 4px;
        }
        .cash-amount, .total-amount {
          font-weight: bold;
          color: #22c55e;
        }
        .total-amount {
          color: #f59e0b;
          font-size: 1.1rem;
        }
        .current-holdings h4 {
          margin-bottom: 0.75rem;
          color: #f8fafc;
        }
        .holding-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #2a3441;
          border-radius: 4px;
          margin-bottom: 0.5rem;
        }
        .holding-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .holding-symbol {
          font-weight: bold;
          color: #3b82f6;
        }
        .holding-qty {
          font-size: 0.8rem;
          color: #9ca3af;
        }
        .holding-value {
          font-weight: bold;
          color: #22c55e;
        }
        .no-holdings {
          text-align: center;
          padding: 1.5rem;
          color: #9ca3af;
          font-style: italic;
          background: #2a3441;
          border-radius: 4px;
        }
        .market-news {
          background: #1a1f2e;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #2a3441;
        }
        .news-feed {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .news-item {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #2a3441;
          border-radius: 4px;
        }
        .news-time {
          color: #9ca3af;
          font-size: 0.8rem;
          min-width: 40px;
        }
        .news-content {
          font-size: 0.9rem;
          line-height: 1.4;
        }
        .market-table-container {
          background: #1a1f2e;
          border-radius: 8px;
          border: 1px solid #2a3441;
          overflow: hidden;
        }
        .market-table {
          width: 100%;
        }
        .table-header {
          display: grid;
          grid-template-columns: 100px 1fr 120px 80px 100px 80px;
          gap: 1rem;
          padding: 1rem;
          background: #2a3441;
          font-weight: bold;
          border-bottom: 1px solid #3a4451;
        }
        .table-body {
          max-height: 400px;
          overflow-y: auto;
        }
        .table-row {
          display: grid;
          grid-template-columns: 100px 1fr 120px 80px 100px 80px;
          gap: 1rem;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #2a3441;
          transition: background 0.2s;
        }
        .table-row:hover {
          background: #2a3441;
        }
        .symbol {
          font-weight: bold;
          color: #3b82f6;
        }
        .name {
          color: #9ca3af;
          font-size: 0.9rem;
        }
        .price {
          font-weight: bold;
          text-align: right;
        }
        .change {
          text-align: right;
          font-weight: bold;
        }
        .volume {
          text-align: right;
          color: #9ca3af;
          font-size: 0.9rem;
        }
        .trade-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: bold;
        }
        .page-content {
          background: #1a1f2e;
          padding: 2rem;
          border-radius: 8px;
          border: 1px solid #2a3441;
        }
        .admin-controls {
          background: #2a3441;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          border: 2px solid #3b82f6;
        }
        .admin-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .user-selector {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .user-select {
          padding: 0.5rem;
          background: #1a1f2e;
          border: 1px solid #3a4451;
          border-radius: 4px;
          color: white;
          min-width: 200px;
        }
        .admin-actions {
          display: flex;
          gap: 0.75rem;
        }
        .admin-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-size: 0.9rem;
        }
        .admin-btn.reset {
          background: #ef4444;
          color: white;
        }
        .admin-btn.modify {
          background: #f59e0b;
          color: white;
        }
        .portfolio-stats {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .stat-card {
          background: #2a3441;
          padding: 1.5rem;
          border-radius: 8px;
          text-align: center;
        }
        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #3b82f6;
          margin-top: 0.5rem;
        }
        .holdings-section {
          background: #2a3441;
          padding: 1.5rem;
          border-radius: 8px;
        }
        .holdings-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .holding-detail {
          background: #1a1f2e;
          padding: 1rem;
          border-radius: 6px;
        }
        .holding-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .empty-portfolio {
          text-align: center;
          padding: 2rem;
          color: #9ca3af;
        }
        .access-denied {
          text-align: center;
          padding: 3rem 2rem;
          background: #2a3441;
          border-radius: 8px;
          border: 2px solid #ef4444;
        }
        .warning-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        .permission-info {
          background: #1a1f2e;
          padding: 1.5rem;
          border-radius: 6px;
          margin: 1.5rem 0;
          border-left: 4px solid #f59e0b;
        }
        .permission-info p {
          margin: 0.5rem 0;
          color: #9ca3af;
        }
        .back-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          margin-top: 1rem;
        }
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          .portfolio-stats {
            grid-template-columns: 1fr;
          }
          .table-header, .table-row {
            grid-template-columns: 80px 1fr 80px 60px 80px 60px;
            gap: 0.5rem;
            padding: 0.5rem;
          }
        }
        .admin-section {
          background: #2a3441;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          border: 1px solid #3a4451;
        }
        .user-management-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 1rem;
        }
        .add-user-section, .existing-users-section {
          background: #1a1f2e;
          padding: 1.5rem;
          border-radius: 6px;
        }
        .add-user-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
        }
        .form-row {
          display: flex;
          gap: 1rem;
        }
        .admin-input, .admin-select {
          flex: 1;
          padding: 0.75rem;
          background: #2a3441;
          border: 1px solid #3a4451;
          border-radius: 4px;
          color: white;
          font-size: 0.9rem;
        }
        .admin-input::placeholder {
          color: #9ca3af;
        }
        .permissions-section {
          margin-top: 1rem;
        }
        .permissions-section label {
          display: block;
          margin-bottom: 0.5rem;
          color: #f8fafc;
          font-weight: 500;
        }
        .permissions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }
        .permission-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #9ca3af;
          font-size: 0.9rem;
          cursor: pointer;
        }
        .admin-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .admin-btn.add {
          background: #22c55e;
          color: white;
        }
        .admin-btn.modify {
          background: #3b82f6;
          color: white;
        }
        .admin-btn.delete {
          background: #ef4444;
          color: white;
        }
        .admin-btn.reset {
          background: #f59e0b;
          color: white;
        }
        .admin-btn.save {
          background: #22c55e;
          color: white;
        }
        .admin-btn.export {
          background: #8b5cf6;
          color: white;
        }
        .admin-btn.backup {
          background: #06b6d4;
          color: white;
        }
        .admin-btn.small {
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
        }
        .admin-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .users-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
          max-height: 600px;
          overflow-y: auto;
        }
        .user-card {
          background: #2a3441;
          padding: 1rem;
          border-radius: 6px;
          border: 1px solid #3a4451;
        }
        .user-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .user-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .username {
          font-weight: bold;
          color: #3b82f6;
          font-size: 1.1rem;
        }
        .user-role {
          color: #9ca3af;
          font-size: 0.8rem;
        }
        .user-actions {
          display: flex;
          gap: 0.5rem;
        }
        .user-card-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .user-stat {
          display: flex;
          justify-content: space-between;
          color: #9ca3af;
          font-size: 0.9rem;
        }
        .user-card-actions {
          display: flex;
          gap: 0.5rem;
        }
        .position-management-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 1rem;
        }
        .position-controls, .user-positions {
          background: #1a1f2e;
          padding: 1.5rem;
          border-radius: 6px;
        }
        .position-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
        }
        .positions-display {
          margin-top: 1rem;
        }
        .user-balance {
          background: #2a3441;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1rem;
        }
        .user-balance h5 {
          margin: 0 0 0.5rem 0;
          color: #3b82f6;
        }
        .balance-info {
          display: flex;
          justify-content: space-between;
          color: #9ca3af;
          font-size: 0.9rem;
        }
        .positions-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .position-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #2a3441;
          padding: 1rem;
          border-radius: 4px;
        }
        .position-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .position-symbol {
          font-weight: bold;
          color: #22c55e;
        }
        .position-details {
          color: #9ca3af;
          font-size: 0.8rem;
        }
        .position-value {
          font-weight: bold;
          color: #f59e0b;
        }
        .no-positions, .select-user-message {
          text-align: center;
          padding: 2rem;
          color: #9ca3af;
          font-style: italic;
        }
        .platform-settings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 2rem;
          margin-top: 1rem;
        }
        .setting-group {
          background: #1a1f2e;
          padding: 1.5rem;
          border-radius: 6px;
        }
        .setting-group h4 {
          margin: 0 0 1rem 0;
          color: #3b82f6;
        }
        .setting-item {
          margin-bottom: 0.75rem;
        }
        .setting-item label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #9ca3af;
          cursor: pointer;
        }
        .setting-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        .setting-row label {
          color: #9ca3af;
          font-size: 0.9rem;
        }
        .setting-input {
          padding: 0.5rem;
          background: #2a3441;
          border: 1px solid #3a4451;
          border-radius: 4px;
          color: white;
          width: 80px;
        }
        .platform-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          justify-content: center;
        }
        .logo-image {
          border-radius: 4px;
        }
        .file-input {
          padding: 0.5rem;
          background: #2a3441;
          border: 1px solid #3a4451;
          border-radius: 4px;
          color: white;
          cursor: pointer;
        }
        .logo-preview {
          display: flex;
          align-items: center;
          padding: 0.5rem;
          background: #2a3441;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}

export default App;