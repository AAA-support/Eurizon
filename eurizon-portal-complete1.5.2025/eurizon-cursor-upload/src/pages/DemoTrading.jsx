import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlayCircle, TrendingUp, TrendingDown } from 'lucide-react';

const DemoTrading = () => {
  const { demoBalance, updateDemoBalance, updateDemoPortfolio, addNotification, user } = useApp();
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [tradeType, setTradeType] = useState('buy');
  const [errors, setErrors] = useState({});

  // Mock stock prices
  const stocks = {
    AAPL: 411.81,
    MSFT: 86.30,
    GOOGL: 189.21,
    AMZN: 108.97,
    TSLA: 335.14
  };

  const validateTrade = () => {
    const newErrors = {};

    if (!user) {
      newErrors.auth = 'You must be logged in to trade';
    }

    if (!symbol || !stocks[symbol.toUpperCase()]) {
      newErrors.symbol = 'Please select a valid stock symbol';
    }

    if (!quantity || isNaN(quantity) || parseFloat(quantity) <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }

    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    const totalCost = parseFloat(quantity || 0) * parseFloat(price || 0);
    if (tradeType === 'buy' && totalCost > demoBalance) {
      newErrors.balance = `Insufficient funds. You need $${totalCost.toFixed(2)} but only have $${demoBalance.toFixed(2)}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const executeTrade = (e) => {
    e.preventDefault();

    if (!validateTrade()) {
      addNotification('error', 'Please fix the errors before trading');
      return;
    }

    const qtyNum = parseFloat(quantity);
    const priceNum = parseFloat(price);
    const totalCost = qtyNum * priceNum;

    const trade = {
      id: Date.now(),
      symbol: symbol.toUpperCase(),
      type: tradeType,
      quantity: qtyNum,
      price: priceNum,
      total: totalCost,
      timestamp: new Date().toISOString()
    };

    if (tradeType === 'buy') {
      updateDemoBalance(-totalCost);
      addNotification('success', `Bought ${qtyNum} shares of ${symbol.toUpperCase()} at $${priceNum}`);
    } else {
      updateDemoBalance(totalCost);
      addNotification('success', `Sold ${qtyNum} shares of ${symbol.toUpperCase()} at $${priceNum}`);
    }

    updateDemoPortfolio(trade);
    setSymbol('');
    setQuantity('');
    setPrice('');
    setErrors({});
  };

  const handleSymbolChange = (e) => {
    const sym = e.target.value.toUpperCase();
    setSymbol(sym);
    if (stocks[sym]) {
      setPrice(stocks[sym].toString());
    }
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <PlayCircle size={28} />
          Demo Trading
        </h1>
        <p className="text-gray-400 mt-2">Practice trading with virtual money</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <div className="card-header">
              <h2 className="card-title">Available Balance</h2>
            </div>
            <div className="card-content">
              <p className="text-4xl font-bold text-green">${demoBalance.toFixed(2)}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Place Demo Trade</h2>
            </div>
            <div className="card-content">
              {errors.auth && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200">
                  {errors.auth}
                </div>
              )}
              {errors.balance && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200">
                  {errors.balance}
                </div>
              )}

              <form onSubmit={executeTrade}>
                <div className="form-group">
                  <label className="form-label">Trade Type</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setTradeType('buy')}
                      className={`btn flex-1 ${tradeType === 'buy' ? 'btn-success' : 'btn-secondary'}`}
                    >
                      <TrendingUp size={20} />
                      Buy
                    </button>
                    <button
                      type="button"
                      onClick={() => setTradeType('sell')}
                      className={`btn flex-1 ${tradeType === 'sell' ? 'btn-danger' : 'btn-secondary'}`}
                    >
                      <TrendingDown size={20} />
                      Sell
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Symbol</label>
                  <select
                    value={symbol}
                    onChange={handleSymbolChange}
                    className="form-input"
                  >
                    <option value="">Select a stock</option>
                    {Object.keys(stocks).map(sym => (
                      <option key={sym} value={sym}>{sym}</option>
                    ))}
                  </select>
                  {errors.symbol && <p className="form-error">{errors.symbol}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="form-input"
                    placeholder="Number of shares"
                  />
                  {errors.quantity && <p className="form-error">{errors.quantity}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Price per Share</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-input"
                    placeholder="Price"
                  />
                  {errors.price && <p className="form-error">{errors.price}</p>}
                </div>

                {quantity && price && (
                  <div className="p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg mb-4">
                    <p className="text-sm text-gray-400">Total Cost</p>
                    <p className="text-2xl font-bold">
                      ${(parseFloat(quantity) * parseFloat(price)).toFixed(2)}
                    </p>
                  </div>
                )}

                <button type="submit" className="btn btn-primary w-full">
                  Execute {tradeType === 'buy' ? 'Buy' : 'Sell'} Order
                </button>
              </form>
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Market Prices</h2>
            </div>
            <div className="card-content">
              <div className="space-y-3">
                {Object.entries(stocks).map(([sym, price]) => (
                  <div key={sym} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                    <span className="font-bold">{sym}</span>
                    <span className="text-green">${price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoTrading;
