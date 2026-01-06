/**
 * Ticker Detail Page
 * Shows detailed stock information with interactive candlestick chart
 * Similar to Yahoo Finance / Interactive Brokers
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CandlestickChart } from '../components/charts';
import { getStockBySymbol } from '../services/supabaseService';
import { ArrowUp, ArrowDown, Plus, TrendingUp } from 'lucide-react';

const TickerDetail = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [stock, setStock] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('1D');

  useEffect(() => {
    loadStockData();
  }, [symbol]);

  const loadStockData = async () => {
    setLoading(true);
    try {
      // Fetch stock data from Supabase
      const { data, error } = await getStockBySymbol(symbol);

      if (error) throw error;

      setStock(data);

      // Generate sample candlestick data
      // In production, fetch from price_history table
      const sampleData = generateSampleChartData(data?.price || 100);
      setChartData(sampleData);
    } catch (error) {
      console.error('Error loading stock:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate sample candlestick data for demonstration
  const generateSampleChartData = (currentPrice) => {
    const data = [];
    const days = 30;
    let price = currentPrice * 0.95; // Start 5% below current

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const open = price;
      const close = price * (1 + (Math.random() - 0.5) * 0.03);
      const high = Math.max(open, close) * (1 + Math.random() * 0.02);
      const low = Math.min(open, close) * (1 - Math.random() * 0.02);
      const volume = Math.floor(Math.random() * 50000000) + 10000000;

      data.push({
        time: date.toISOString().split('T')[0], // Format: YYYY-MM-DD
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: volume
      });

      price = close;
    }

    return data;
  };

  const handleAddToWatchlist = () => {
    // TODO: Implement add to watchlist
    alert(`Added ${symbol} to watchlist`);
  };

  const handleTrade = (action) => {
    navigate(`/trading?symbol=${symbol}&action=${action}`);
  };

  if (loading) {
    return (
      <div className="ticker-detail-loading">
        <p>Loading {symbol}...</p>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="ticker-detail-error">
        <h2>Stock Not Found</h2>
        <p>Could not find ticker symbol: {symbol}</p>
        <button onClick={() => navigate('/markets')}>Back to Markets</button>
      </div>
    );
  }

  const isPositive = stock.change_amount >= 0;

  return (
    <div className="ticker-detail-page">
      {/* Header */}
      <div className="ticker-header">
        <div className="ticker-title">
          <h1>{stock.symbol}</h1>
          <p className="company-name">{stock.name}</p>
          <span className="asset-type-badge">{stock.asset_type}</span>
          {stock.sector && <span className="sector-badge">{stock.sector}</span>}
        </div>

        <div className="ticker-actions">
          <button className="btn-secondary" onClick={handleAddToWatchlist}>
            <Plus size={16} /> Watchlist
          </button>
          <button className="btn-success" onClick={() => handleTrade('buy')}>
            Buy
          </button>
          <button className="btn-danger" onClick={() => handleTrade('sell')}>
            Sell
          </button>
        </div>
      </div>

      {/* Price Summary */}
      <div className="price-summary">
        <div className="current-price">
          <h2>${stock.price?.toFixed(2)}</h2>
          <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
            <span>{isPositive ? '+' : ''}{stock.change_amount?.toFixed(2)}</span>
            <span>({isPositive ? '+' : ''}{stock.change_percent?.toFixed(2)}%)</span>
          </div>
        </div>

        <div className="price-stats">
          <div className="stat">
            <label>Previous Close</label>
            <value>${stock.previous_close?.toFixed(2)}</value>
          </div>
          <div className="stat">
            <label>Day High</label>
            <value>${stock.day_high?.toFixed(2)}</value>
          </div>
          <div className="stat">
            <label>Day Low</label>
            <value>${stock.day_low?.toFixed(2)}</value>
          </div>
          <div className="stat">
            <label>Volume</label>
            <value>{stock.volume?.toLocaleString()}</value>
          </div>
          {stock.market_cap && (
            <div className="stat">
              <label>Market Cap</label>
              <value>${(stock.market_cap / 1000000000).toFixed(2)}B</value>
            </div>
          )}
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="timeframe-selector">
        {['1D', '1W', '1M', '3M', '1Y', '5Y', 'MAX'].map(tf => (
          <button
            key={tf}
            className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
            onClick={() => setTimeframe(tf)}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Candlestick Chart */}
      <div className="chart-container">
        <CandlestickChart
          data={chartData}
          symbol={stock.symbol}
          height={500}
          showVolume={true}
        />
      </div>

      {/* Key Statistics */}
      <div className="key-statistics">
        <h3>Key Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <label>52 Week High</label>
            <value>${stock.year_high?.toFixed(2) || 'N/A'}</value>
          </div>
          <div className="stat-card">
            <label>52 Week Low</label>
            <value>${stock.year_low?.toFixed(2) || 'N/A'}</value>
          </div>
          <div className="stat-card">
            <label>Asset Type</label>
            <value>{stock.asset_type}</value>
          </div>
          {stock.sector && (
            <div className="stat-card">
              <label>Sector</label>
              <value>{stock.sector}</value>
            </div>
          )}
        </div>
      </div>

      {/* About Section */}
      <div className="about-section">
        <h3>About {stock.name}</h3>
        <p>
          {stock.name} ({stock.symbol}) is a {stock.asset_type} in the {stock.sector || 'market'} sector.
          Current price: ${stock.price?.toFixed(2)} with a {isPositive ? 'gain' : 'loss'} of {stock.change_percent?.toFixed(2)}% today.
        </p>
      </div>

      <style jsx>{`
        .ticker-detail-page {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .ticker-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
        }

        .ticker-title h1 {
          margin: 0;
          font-size: 32px;
        }

        .company-name {
          color: #666;
          margin: 5px 0;
        }

        .asset-type-badge, .sector-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 4px;
          background: #f0f0f0;
          font-size: 12px;
          margin-right: 8px;
        }

        .ticker-actions {
          display: flex;
          gap: 10px;
        }

        .ticker-actions button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .btn-secondary {
          background: #f0f0f0;
          color: #333;
        }

        .btn-success {
          background: #26a69a;
          color: white;
        }

        .btn-danger {
          background: #ef5350;
          color: white;
        }

        .price-summary {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .current-price {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .current-price h2 {
          margin: 0;
          font-size: 48px;
        }

        .price-change {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          font-weight: 600;
        }

        .price-change.positive {
          color: #26a69a;
        }

        .price-change.negative {
          color: #ef5350;
        }

        .price-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
        }

        .stat label {
          display: block;
          color: #666;
          font-size: 12px;
          margin-bottom: 5px;
        }

        .stat value {
          display: block;
          font-size: 16px;
          font-weight: 600;
        }

        .timeframe-selector {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .timeframe-btn {
          padding: 8px 16px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .timeframe-btn.active {
          background: #0066cc;
          color: white;
          border-color: #0066cc;
        }

        .chart-container {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .key-statistics {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .stat-card {
          padding: 15px;
          background: #f9f9f9;
          border-radius: 4px;
        }

        .stat-card label {
          display: block;
          color: #666;
          font-size: 12px;
          margin-bottom: 5px;
        }

        .stat-card value {
          display: block;
          font-size: 18px;
          font-weight: 600;
        }

        .about-section {
          background: white;
          padding: 20px;
          border-radius: 8px;
        }

        .about-section h3 {
          margin-top: 0;
        }

        .ticker-detail-loading, .ticker-detail-error {
          text-align: center;
          padding: 100px 20px;
        }
      `}</style>
    </div>
  );
};

export default TickerDetail;
