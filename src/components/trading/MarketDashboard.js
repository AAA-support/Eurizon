import React from 'react';
import { useApp } from '../../context/AppContext';
import '../dashboard/Dashboard.css';

const MarketDashboard = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedAsset,
    setSelectedAsset,
    orderQuantity,
    setOrderQuantity,
    demoBalance,
    demoHoldings,
    getDemoPortfolioValue,
    getCurrentPrice,
    generateChartData,
    getAllMarketData,
    handleDemoBuy,
    handleDemoSell,
  } = useApp();

  const getFilteredData = () => {
    const allData = getAllMarketData();
    if (selectedCategory === 'all') return allData;
    // Filter by category - this would need category mapping
    return allData;
  };

  const filteredData = getFilteredData();
  const chartData = generateChartData(selectedAsset);
  const currentPrice = getCurrentPrice(selectedAsset);
  const currentHolding = demoHoldings[selectedAsset] || 0;

  const handleBuy = () => {
    const result = handleDemoBuy();
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  const handleSell = () => {
    const result = handleDemoSell();
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

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
            Stocks
          </button>
          <button 
            className={selectedCategory === 'crypto' ? 'active' : ''} 
            onClick={() => setSelectedCategory('crypto')}
          >
            Crypto
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
                <option value="AAPL">AAPL - Apple Inc. (${getCurrentPrice('AAPL').toFixed(2)})</option>
                <option value="MSFT">MSFT - Microsoft (${getCurrentPrice('MSFT').toFixed(2)})</option>
                <option value="GOOGL">GOOGL - Google (${getCurrentPrice('GOOGL').toFixed(2)})</option>
                <option value="TSLA">TSLA - Tesla (${getCurrentPrice('TSLA').toFixed(2)})</option>
                <option value="NVDA">NVDA - NVIDIA (${getCurrentPrice('NVDA').toFixed(2)})</option>
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
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#22c55e', stopOpacity: 0.3}} />
                      <stop offset="100%" style={{stopColor: '#22c55e', stopOpacity: 0}} />
                    </linearGradient>
                  </defs>
                  <polyline
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="3"
                    points={chartData.map((point, index) => 
                      `${(index * 500) / (chartData.length - 1)},${250 - ((point.price - Math.min(...chartData.map(d => d.price))) / (Math.max(...chartData.map(d => d.price)) - Math.min(...chartData.map(d => d.price)))) * 200 - 25}`
                    ).join(' ')}
                  />
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
                    onClick={handleBuy}
                    disabled={orderQuantity <= 0 || (currentPrice * orderQuantity) > demoBalance}
                  >
                    BUY {orderQuantity} shares
                  </button>
                  <button 
                    className="sell-btn-quick"
                    onClick={handleSell}
                    disabled={orderQuantity <= 0 || orderQuantity > currentHolding}
                  >
                    SELL {orderQuantity} shares
                  </button>
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
                <span>Invested:</span>
                <span className="invested-amount">${(getDemoPortfolioValue() - demoBalance).toFixed(2)}</span>
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
            {filteredData.slice(0, 20).map((item, index) => (
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
};

export default MarketDashboard;

