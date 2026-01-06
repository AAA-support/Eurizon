import React, { useState } from 'react';
import { TrendingUp, ShoppingCart, TrendingDown, DollarSign } from 'lucide-react';
import StockSearch from '../components/StockSearch';

const Trading = () => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState('market');

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
  };

  const handleBuy = () => {
    if (!selectedStock) return;
    alert(`Buy ${quantity} shares of ${selectedStock.symbol} at $${selectedStock.price}`);
  };

  const handleSell = () => {
    if (!selectedStock) return;
    alert(`Sell ${quantity} shares of ${selectedStock.symbol} at $${selectedStock.price}`);
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <TrendingUp size={28} />
          Live Trading
        </h1>
        <p className="text-gray-400 mt-2">Search and trade from 100+ stocks, crypto, forex, and commodities</p>
      </div>

      {/* Stock Search */}
      <div className="mb-6">
        <StockSearch onStockSelect={handleStockSelect} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Details & Chart */}
        <div className="lg:col-span-2">
          <div className="card">
            {selectedStock ? (
              <div>
                <div className="card-header border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedStock.symbol}</h2>
                      <p className="text-sm text-gray-400">{selectedStock.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">
                        ${selectedStock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className={`flex items-center gap-1 justify-end text-sm ${
                        selectedStock.change_percent >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {selectedStock.change_percent >= 0 ? (
                          <TrendingUp size={16} />
                        ) : (
                          <TrendingDown size={16} />
                        )}
                        {selectedStock.change_percent >= 0 ? '+' : ''}{selectedStock.change_percent}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-content">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="text-xs text-gray-400 mb-1">Sector</div>
                      <div className="font-semibold">{selectedStock.sector}</div>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="text-xs text-gray-400 mb-1">Type</div>
                      <div className="font-semibold capitalize">{selectedStock.sector}</div>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="text-xs text-gray-400 mb-1">24h Change</div>
                      <div className={`font-semibold ${
                        selectedStock.change_percent >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {selectedStock.change_percent >= 0 ? '+' : ''}{selectedStock.change_percent}%
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-6 text-center">
                    <p className="text-gray-400 text-sm">Chart will be displayed here</p>
                    <p className="text-gray-500 text-xs mt-2">Candlestick chart with volume bars</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-content py-12 text-center">
                <TrendingUp size={48} className="mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold mb-2">Search for a Stock</h3>
                <p className="text-gray-400">Use the search bar above to find stocks, crypto, forex, or commodities</p>
              </div>
            )}
          </div>
        </div>

        {/* Trading Panel */}
        <div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Place Order</h3>
            </div>
            <div className="card-content">
              {selectedStock ? (
                <div className="space-y-4">
                  {/* Order Type */}
                  <div>
                    <label className="form-label">Order Type</label>
                    <select
                      value={orderType}
                      onChange={(e) => setOrderType(e.target.value)}
                      className="form-input"
                    >
                      <option value="market">Market Order</option>
                      <option value="limit">Limit Order</option>
                      <option value="stop">Stop Order</option>
                    </select>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="form-input"
                    />
                  </div>

                  {/* Total */}
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-400">Price per share</span>
                      <span className="font-semibold">
                        ${selectedStock.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-400">Quantity</span>
                      <span className="font-semibold">{quantity}</span>
                    </div>
                    <div className="border-t border-gray-700 mt-2 pt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="text-xl font-bold">
                          ${(selectedStock.price * quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleBuy}
                      className="btn-primary bg-green-600 hover:bg-green-700"
                    >
                      <ShoppingCart size={18} />
                      Buy
                    </button>
                    <button
                      onClick={handleSell}
                      className="btn-primary bg-red-600 hover:bg-red-700"
                    >
                      <DollarSign size={18} />
                      Sell
                    </button>
                  </div>

                  <div className="text-xs text-gray-500 text-center">
                    Demo mode: No real money will be used
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <ShoppingCart size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Select a stock to start trading</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card mt-4">
            <div className="card-header">
              <h3 className="card-title">Your Balance</h3>
            </div>
            <div className="card-content">
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-green-400">$100.00</div>
                <div className="text-sm text-gray-400 mt-1">Demo Cash Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;
