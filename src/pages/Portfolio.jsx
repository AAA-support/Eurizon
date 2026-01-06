import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Plus, Trash2, Edit } from 'lucide-react';

const Portfolio = () => {
  const { portfolio, updatePortfolio, addNotification } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    quantity: '',
    buyPrice: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.symbol || formData.symbol.trim().length === 0) {
      newErrors.symbol = 'Stock symbol is required';
    }
    
    if (!formData.quantity || isNaN(formData.quantity) || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }
    
    if (!formData.buyPrice || isNaN(formData.buyPrice) || parseFloat(formData.buyPrice) <= 0) {
      newErrors.buyPrice = 'Valid buy price is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddStock = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addNotification('error', 'Please fix the errors in the form');
      return;
    }

    const newStock = {
      id: Date.now(),
      symbol: formData.symbol.toUpperCase(),
      quantity: parseFloat(formData.quantity),
      buyPrice: parseFloat(formData.buyPrice),
      currentPrice: parseFloat(formData.buyPrice),
      addedDate: new Date().toISOString()
    };

    updatePortfolio([...portfolio, newStock]);
    addNotification('success', `Added ${newStock.symbol} to portfolio`);
    
    setFormData({ symbol: '', quantity: '', buyPrice: '' });
    setShowAddModal(false);
    setErrors({});
  };

  const handleRemoveStock = (id) => {
    const updated = portfolio.filter(stock => stock.id !== id);
    updatePortfolio(updated);
    addNotification('info', 'Stock removed from portfolio');
  };

  const calculateTotalValue = () => {
    return portfolio.reduce((sum, stock) => 
      sum + (stock.currentPrice * stock.quantity), 0
    ).toFixed(2);
  };

  const calculatePL = (stock) => {
    const pl = (stock.currentPrice - stock.buyPrice) * stock.quantity;
    const plPercent = ((stock.currentPrice - stock.buyPrice) / stock.buyPrice * 100).toFixed(2);
    return { pl: pl.toFixed(2), plPercent };
  };

  return (
    <div className="page-container">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Clock size={28} />
            My Portfolio
          </h1>
          <p className="text-gray-400 mt-2">Manage your investment portfolio</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={20} />
          Add Stock
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <p className="text-sm text-gray-400 mb-1">Total Portfolio Value</p>
          <p className="text-3xl font-bold">${calculateTotalValue()}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-400 mb-1">Total Positions</p>
          <p className="text-3xl font-bold">{portfolio.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-400 mb-1">Today's Change</p>
          <p className="text-3xl font-bold text-green">+2.4%</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Holdings</h2>
        </div>
        <div className="card-content">
          {portfolio.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No stocks in portfolio yet</p>
              <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
                <Plus size={20} />
                Add Your First Stock
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Quantity</th>
                    <th>Buy Price</th>
                    <th>Current Price</th>
                    <th>P/L</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((stock) => {
                    const { pl, plPercent } = calculatePL(stock);
                    return (
                      <tr key={stock.id}>
                        <td className="font-bold">{stock.symbol}</td>
                        <td>{stock.quantity}</td>
                        <td>${stock.buyPrice.toFixed(2)}</td>
                        <td>${stock.currentPrice.toFixed(2)}</td>
                        <td className={pl >= 0 ? 'text-green' : 'text-red'}>
                          ${pl} ({plPercent}%)
                        </td>
                        <td>
                          <button 
                            onClick={() => handleRemoveStock(stock.id)}
                            className="btn btn-danger btn-sm"
                          >
                            <Trash2 size={16} />
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

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add Stock to Portfolio</h3>
            <form onSubmit={handleAddStock}>
              <div className="form-group">
                <label className="form-label">Stock Symbol</label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({...formData, symbol: e.target.value})}
                  className="form-input"
                  placeholder="e.g., AAPL"
                />
                {errors.symbol && <p className="form-error">{errors.symbol}</p>}
              </div>
              
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input
                  type="text"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="form-input"
                  placeholder="Number of shares"
                />
                {errors.quantity && <p className="form-error">{errors.quantity}</p>}
              </div>
              
              <div className="form-group">
                <label className="form-label">Buy Price</label>
                <input
                  type="text"
                  value={formData.buyPrice}
                  onChange={(e) => setFormData({...formData, buyPrice: e.target.value})}
                  className="form-input"
                  placeholder="Price per share"
                />
                {errors.buyPrice && <p className="form-error">{errors.buyPrice}</p>}
              </div>

              <div className="flex gap-3 mt-6">
                <button type="submit" className="btn btn-primary flex-1">
                  Add Stock
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ symbol: '', quantity: '', buyPrice: '' });
                    setErrors({});
                  }}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
