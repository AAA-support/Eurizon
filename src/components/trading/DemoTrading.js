import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  TrendingUp, TrendingDown, DollarSign, BarChart3, 
  ExternalLink, Play, Target, Activity, Zap
} from 'lucide-react';

const DemoTrading = ({ userProfile }) => {
  const [demoBalance, setDemoBalance] = useState(100.00);
  const [portfolioValue, setPortfolioValue] = useState(0.00);
  const [totalPnL, setTotalPnL] = useState(0.00);
  const [positions, setPositions] = useState([]);
  const [orderForm, setOrderForm] = useState({
    orderType: 'Market',
    stock: '',
    shares: '',
    price: ''
  });

  const marketData = [
    { symbol: 'AAPL', company: 'Apple Inc.', price: 175.43, change: 1.24, changePercent: '+1.24%', positive: true },
    { symbol: 'MSFT', company: 'Microsoft Corp.', price: 378.85, change: 1.25, changePercent: '+1.52%', positive: true },
    { symbol: 'GOOGL', company: 'Alphabet Inc.', price: 2847.63, change: -0.53, changePercent: '-0.53%', positive: false },
    { symbol: 'TSLA', company: 'Tesla Inc.', price: 248.42, change: -3.24, changePercent: '-3.24%', positive: false },
    { symbol: 'AMZN', company: 'Amazon.com Inc.', price: 3342.88, change: 0.37, changePercent: '+0.37%', positive: true }
  ];

  const handleExecuteTrade = () => {
    if (!orderForm.stock || !orderForm.shares || !orderForm.price) {
      alert('Please fill in all fields');
      return;
    }

    const shares = parseInt(orderForm.shares);
    const price = parseFloat(orderForm.price);
    const total = shares * price;

    if (total > demoBalance) {
      alert('Insufficient demo balance');
      return;
    }

    // Execute the trade
    setDemoBalance(prev => prev - total);
    setPortfolioValue(prev => prev + total);
    
    // Add to positions
    const newPosition = {
      symbol: orderForm.stock,
      shares: shares,
      avgPrice: price,
      currentValue: total,
      pnl: 0
    };
    setPositions(prev => [...prev, newPosition]);

    // Reset form
    setOrderForm({ orderType: 'Market', stock: '', shares: '', price: '' });
    
    alert('Demo trade executed successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Play className="text-green-400" size={32} />
              Demo Trading
            </h1>
            <p className="text-slate-400 mt-1">Practice trading with $100 demo money and interactive charts</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <ExternalLink size={16} />
            Open Interactive Charts
          </button>
        </div>

        {/* Demo Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Demo Balance</p>
                <p className="text-2xl font-bold text-green-400">${demoBalance.toFixed(2)}</p>
                <p className="text-slate-400 text-sm mt-1">Available for trading</p>
              </div>
              <DollarSign className="text-green-400" size={24} />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Portfolio Value</p>
                <p className="text-2xl font-bold text-white">${portfolioValue.toFixed(2)}</p>
                <p className="text-slate-400 text-sm mt-1">Current holdings value</p>
              </div>
              <BarChart3 className="text-blue-400" size={24} />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total P&L</p>
                <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${totalPnL.toFixed(2)}
                </p>
                <p className="text-slate-400 text-sm mt-1">Unrealized gains/losses</p>
              </div>
              {totalPnL >= 0 ? 
                <TrendingUp className="text-green-400" size={24} /> : 
                <TrendingDown className="text-red-400" size={24} />
              }
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Value</p>
                <p className="text-2xl font-bold text-white">${(demoBalance + portfolioValue).toFixed(2)}</p>
                <p className="text-slate-400 text-sm mt-1">Balance + Portfolio</p>
              </div>
              <Target className="text-purple-400" size={24} />
            </div>
          </div>
        </div>

        {/* Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* Place Demo Order */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Zap size={20} />
              Place Demo Order
            </h3>
            <p className="text-slate-400 text-sm mb-6">Practice trading with real market data</p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Order Type</label>
                  <select 
                    value={orderForm.orderType}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, orderType: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option>Market</option>
                    <option>Limit</option>
                    <option>Stop Loss</option>
                    <option>Stop Limit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Stock</label>
                  <input
                    type="text"
                    value={orderForm.stock}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, stock: e.target.value.toUpperCase() }))}
                    placeholder="AAPL"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Shares</label>
                  <input
                    type="number"
                    value={orderForm.shares}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, shares: e.target.value }))}
                    placeholder="Number of shares"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Price per Share</label>
                  <input
                    type="number"
                    step="0.01"
                    value={orderForm.price}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="Price"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleExecuteTrade}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Execute BUY Order
              </button>
            </div>
          </div>

          {/* Current Positions */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              Current Positions
            </h3>
            <p className="text-slate-400 text-sm mb-6">Your demo portfolio holdings</p>

            {positions.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="mx-auto text-slate-500 mb-4" size={48} />
                <p className="text-slate-400">No positions yet</p>
                <p className="text-slate-500 text-sm">Start trading to build your demo portfolio</p>
              </div>
            ) : (
              <div className="space-y-3">
                {positions.map((position, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{position.symbol}</p>
                      <p className="text-slate-400 text-sm">{position.shares} shares @ ${position.avgPrice}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white">${position.currentValue.toFixed(2)}</p>
                      <p className={`text-sm ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${position.pnl.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Market Data */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Activity size={20} />
              Live Market Data
            </h3>
            <p className="text-slate-400 text-sm">Real-time stock prices for demo trading</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketData.map((stock) => (
              <div key={stock.symbol} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-white font-semibold">{stock.symbol}</p>
                    <p className="text-slate-400 text-sm">{stock.company}</p>
                  </div>
                  <button 
                    onClick={() => setOrderForm(prev => ({ ...prev, stock: stock.symbol, price: stock.price.toString() }))}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Trade
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold text-white">${stock.price}</p>
                  <p className={`text-sm font-medium ${stock.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {stock.changePercent}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoTrading;