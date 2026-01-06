import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, DollarSign } from 'lucide-react';

const AdminStockManagement = () => {
  const [stocks, setStocks] = useState([
    { id: 1, symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, commission: 0.5, sector: 'Technology' },
    { id: 2, symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.50, commission: 0.5, sector: 'Technology' }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    price: '',
    commission: '',
    sector: '',
    asset_type: 'stock',
    day_high: '',
    day_low: '',
    year_high: '',
    year_low: '',
    volume: '',
    market_cap: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddStock = () => {
    const newStock = {
      id: Date.now(),
      ...formData,
      price: parseFloat(formData.price) || 0,
      commission: parseFloat(formData.commission) || 0
    };
    setStocks([...stocks, newStock]);
    setShowAddForm(false);
    resetForm();
    alert(`Stock ${newStock.symbol} added successfully!`);
  };

  const handleEditStock = (stock) => {
    setEditingStock(stock);
    setFormData(stock);
    setShowAddForm(true);
  };

  const handleUpdateStock = () => {
    setStocks(stocks.map(stock =>
      stock.id === editingStock.id ? { ...formData, id: stock.id } : stock
    ));
    setShowAddForm(false);
    setEditingStock(null);
    resetForm();
    alert('Stock updated successfully!');
  };

  const handleDeleteStock = (id) => {
    if (confirm('Are you sure you want to delete this stock?')) {
      setStocks(stocks.filter(stock => stock.id !== id));
      alert('Stock deleted successfully!');
    }
  };

  const resetForm = () => {
    setFormData({
      symbol: '',
      name: '',
      price: '',
      commission: '',
      sector: '',
      asset_type: 'stock',
      day_high: '',
      day_low: '',
      year_high: '',
      year_low: '',
      volume: '',
      market_cap: ''
    });
    setEditingStock(null);
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <DollarSign size={28} />
            Stock Management
          </h1>
          <p className="text-gray-400 mt-2">Manually add and manage stock tickers</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
        >
          <Plus size={18} />
          Add New Stock
        </button>
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-800">
              <h2 className="text-xl font-bold">
                {editingStock ? 'Edit Stock' : 'Add New Stock'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-700 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Stock Symbol *</label>
                  <input
                    type="text"
                    name="symbol"
                    value={formData.symbol}
                    onChange={handleInputChange}
                    placeholder="AAPL"
                    className="form-input uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Asset Type *</label>
                  <select
                    name="asset_type"
                    value={formData.asset_type}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="stock">Stock</option>
                    <option value="cryptocurrency">Cryptocurrency</option>
                    <option value="forex">Forex</option>
                    <option value="commodity">Commodity</option>
                    <option value="etf">ETF</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Company Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Apple Inc."
                  className="form-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Current Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="175.43"
                    step="0.01"
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Commission (%) *</label>
                  <input
                    type="number"
                    name="commission"
                    value={formData.commission}
                    onChange={handleInputChange}
                    placeholder="0.5"
                    step="0.01"
                    className="form-input"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Trading fee percentage</p>
                </div>
              </div>

              <div>
                <label className="form-label">Sector/Category</label>
                <input
                  type="text"
                  name="sector"
                  value={formData.sector}
                  onChange={handleInputChange}
                  placeholder="Technology"
                  className="form-input"
                />
              </div>

              {/* Price Range */}
              <div className="border-t border-gray-700 pt-4">
                <h3 className="font-semibold mb-3">Price Range (Optional)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Day High ($)</label>
                    <input
                      type="number"
                      name="day_high"
                      value={formData.day_high}
                      onChange={handleInputChange}
                      placeholder="178.50"
                      step="0.01"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Day Low ($)</label>
                    <input
                      type="number"
                      name="day_low"
                      value={formData.day_low}
                      onChange={handleInputChange}
                      placeholder="172.30"
                      step="0.01"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">52-Week High ($)</label>
                    <input
                      type="number"
                      name="year_high"
                      value={formData.year_high}
                      onChange={handleInputChange}
                      placeholder="195.00"
                      step="0.01"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">52-Week Low ($)</label>
                    <input
                      type="number"
                      name="year_low"
                      value={formData.year_low}
                      onChange={handleInputChange}
                      placeholder="125.00"
                      step="0.01"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="border-t border-gray-700 pt-4">
                <h3 className="font-semibold mb-3">Additional Information (Optional)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Volume</label>
                    <input
                      type="number"
                      name="volume"
                      value={formData.volume}
                      onChange={handleInputChange}
                      placeholder="85000000"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Market Cap ($)</label>
                    <input
                      type="number"
                      name="market_cap"
                      value={formData.market_cap}
                      onChange={handleInputChange}
                      placeholder="2800000000000"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-700 flex gap-3">
              <button
                onClick={editingStock ? handleUpdateStock : handleAddStock}
                className="btn-primary flex-1"
              >
                <Save size={18} />
                {editingStock ? 'Update Stock' : 'Add Stock'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stocks Table */}
      <div className="card">
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Commission</th>
                  <th>Sector</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stocks.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-400">
                      No stocks added yet. Click "Add New Stock" to get started.
                    </td>
                  </tr>
                ) : (
                  stocks.map((stock) => (
                    <tr key={stock.id}>
                      <td className="font-bold">{stock.symbol}</td>
                      <td>{stock.name}</td>
                      <td className="font-mono">${stock.price?.toFixed(2) || '0.00'}</td>
                      <td className="text-yellow-400">{stock.commission}%</td>
                      <td className="text-gray-400">{stock.sector || '—'}</td>
                      <td>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                          {stock.asset_type || 'stock'}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditStock(stock)}
                            className="p-2 hover:bg-gray-700 rounded text-blue-400"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteStock(stock.id)}
                            className="p-2 hover:bg-gray-700 rounded text-red-400"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStockManagement;
