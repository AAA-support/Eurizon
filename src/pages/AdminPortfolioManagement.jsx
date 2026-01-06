import React, { useState } from 'react';
import { Users, Plus, TrendingUp, Search, DollarSign, Percent, Calculator } from 'lucide-react';

const AdminPortfolioManagement = () => {
  // Mock users data - replace with Supabase fetch
  const [users] = useState([
    { id: 1, name: 'John Smith', email: 'john@example.com', balance: 5000 },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', balance: 10000 },
    { id: 3, name: 'Mike Davis', email: 'mike@example.com', balance: 7500 }
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [userPortfolio, setUserPortfolio] = useState([
    { id: 1, symbol: 'AAPL', shares: 10, purchase_price: 150.00, current_price: 175.43 },
    { id: 2, symbol: 'GOOGL', shares: 5, purchase_price: 130.00, current_price: 142.50 }
  ]);

  const [showAddStockForm, setShowAddStockForm] = useState(false);
  const [newStock, setNewStock] = useState({
    symbol: '',
    shares: '',
    purchase_price: '',
    current_price: '',
    commission: 0.5
  });

  // Auto-calculate portfolio totals
  const calculatePortfolioSummary = () => {
    const totalCost = userPortfolio.reduce((sum, stock) =>
      sum + (stock.shares * stock.purchase_price), 0);

    const currentValue = userPortfolio.reduce((sum, stock) =>
      sum + (stock.shares * stock.current_price), 0);

    const profitLoss = currentValue - totalCost;
    const profitLossPercent = totalCost > 0 ? ((profitLoss / totalCost) * 100) : 0;

    return {
      totalCost: totalCost.toFixed(2),
      currentValue: currentValue.toFixed(2),
      profitLoss: profitLoss.toFixed(2),
      profitLossPercent: profitLossPercent.toFixed(2)
    };
  };

  const summary = calculatePortfolioSummary();

  const handleAddStock = () => {
    const stock = {
      id: Date.now(),
      symbol: newStock.symbol.toUpperCase(),
      shares: parseFloat(newStock.shares),
      purchase_price: parseFloat(newStock.purchase_price),
      current_price: parseFloat(newStock.current_price),
      commission: parseFloat(newStock.commission)
    };

    setUserPortfolio([...userPortfolio, stock]);
    setShowAddStockForm(false);
    setNewStock({ symbol: '', shares: '', purchase_price: '', current_price: '', commission: 0.5 });
    alert(`Added ${stock.shares} shares of ${stock.symbol} to ${selectedUser.name}'s portfolio`);
  };

  const handleRemoveStock = (stockId) => {
    if (confirm('Remove this stock from portfolio?')) {
      setUserPortfolio(userPortfolio.filter(stock => stock.id !== stockId));
    }
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Users size={28} />
          User Portfolio Management
        </h1>
        <p className="text-gray-400 mt-2">View and manage any user's investment portfolio</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* User Selection */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Select User</h2>
            </div>
            <div className="card-content">
              <div className="space-y-2">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedUser?.id === user.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm opacity-75">{user.email}</div>
                    <div className="text-xs mt-1 opacity-60">
                      Balance: ${user.balance.toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Details */}
        <div className="lg:col-span-3">
          {selectedUser ? (
            <>
              {/* Portfolio Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="card">
                  <div className="card-content">
                    <div className="text-sm text-gray-400 mb-1">Total Cost</div>
                    <div className="text-2xl font-bold">${summary.totalCost}</div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-content">
                    <div className="text-sm text-gray-400 mb-1">Current Value</div>
                    <div className="text-2xl font-bold text-blue-400">${summary.currentValue}</div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-content">
                    <div className="text-sm text-gray-400 mb-1">Profit/Loss</div>
                    <div className={`text-2xl font-bold ${
                      parseFloat(summary.profitLoss) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      ${summary.profitLoss}
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-content">
                    <div className="text-sm text-gray-400 mb-1">Return %</div>
                    <div className={`text-2xl font-bold ${
                      parseFloat(summary.profitLossPercent) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {summary.profitLossPercent}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Portfolio Holdings */}
              <div className="card">
                <div className="card-header flex justify-between items-center">
                  <h2 className="card-title">
                    {selectedUser.name}'s Portfolio
                  </h2>
                  <button
                    onClick={() => setShowAddStockForm(true)}
                    className="btn-primary"
                  >
                    <Plus size={18} />
                    Add Stock
                  </button>
                </div>

                {showAddStockForm && (
                  <div className="px-6 py-4 bg-gray-900/50 border-b border-gray-700">
                    <h3 className="font-semibold mb-4">Add Stock to Portfolio</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div>
                        <label className="form-label text-xs">Symbol</label>
                        <input
                          type="text"
                          value={newStock.symbol}
                          onChange={(e) => setNewStock({...newStock, symbol: e.target.value})}
                          placeholder="AAPL"
                          className="form-input text-sm uppercase"
                        />
                      </div>
                      <div>
                        <label className="form-label text-xs">Shares</label>
                        <input
                          type="number"
                          value={newStock.shares}
                          onChange={(e) => setNewStock({...newStock, shares: e.target.value})}
                          placeholder="10"
                          className="form-input text-sm"
                        />
                      </div>
                      <div>
                        <label className="form-label text-xs">Purchase Price</label>
                        <input
                          type="number"
                          value={newStock.purchase_price}
                          onChange={(e) => setNewStock({...newStock, purchase_price: e.target.value})}
                          placeholder="150.00"
                          step="0.01"
                          className="form-input text-sm"
                        />
                      </div>
                      <div>
                        <label className="form-label text-xs">Current Price</label>
                        <input
                          type="number"
                          value={newStock.current_price}
                          onChange={(e) => setNewStock({...newStock, current_price: e.target.value})}
                          placeholder="175.43"
                          step="0.01"
                          className="form-input text-sm"
                        />
                      </div>
                      <div>
                        <label className="form-label text-xs">Commission %</label>
                        <input
                          type="number"
                          value={newStock.commission}
                          onChange={(e) => setNewStock({...newStock, commission: e.target.value})}
                          placeholder="0.5"
                          step="0.01"
                          className="form-input text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={handleAddStock} className="btn-primary text-sm">
                        Add to Portfolio
                      </button>
                      <button
                        onClick={() => setShowAddStockForm(false)}
                        className="btn-secondary text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="card-content">
                  {userPortfolio.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <TrendingUp size={48} className="mx-auto mb-3 opacity-30" />
                      <p>No stocks in portfolio yet</p>
                      <p className="text-sm mt-2">Click "Add Stock" to get started</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Symbol</th>
                            <th>Shares</th>
                            <th>Purchase Price</th>
                            <th>Current Price</th>
                            <th>Total Cost</th>
                            <th>Current Value</th>
                            <th>Profit/Loss</th>
                            <th>Return %</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userPortfolio.map((stock) => {
                            const totalCost = stock.shares * stock.purchase_price;
                            const currentValue = stock.shares * stock.current_price;
                            const profitLoss = currentValue - totalCost;
                            const returnPercent = totalCost > 0 ? ((profitLoss / totalCost) * 100) : 0;

                            return (
                              <tr key={stock.id}>
                                <td className="font-bold">{stock.symbol}</td>
                                <td>{stock.shares}</td>
                                <td className="font-mono">${stock.purchase_price.toFixed(2)}</td>
                                <td className="font-mono">${stock.current_price.toFixed(2)}</td>
                                <td className="font-mono">${totalCost.toFixed(2)}</td>
                                <td className="font-mono text-blue-400">${currentValue.toFixed(2)}</td>
                                <td className={`font-mono ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  ${profitLoss.toFixed(2)}
                                </td>
                                <td className={`font-mono ${returnPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {returnPercent >= 0 ? '+' : ''}{returnPercent.toFixed(2)}%
                                </td>
                                <td>
                                  <button
                                    onClick={() => handleRemoveStock(stock.id)}
                                    className="text-red-400 hover:text-red-300 text-sm"
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="card">
              <div className="card-content py-24 text-center">
                <Users size={64} className="mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold mb-2">Select a User</h3>
                <p className="text-gray-400">Choose a user from the list to view and manage their portfolio</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPortfolioManagement;
