import React, { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, TrendingDown, X } from 'lucide-react';

const StockSearch = ({ onStockSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  // Mock stock data - replace with Supabase fetch
  const mockStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change_percent: 1.24, sector: 'Technology' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.50, change_percent: 0.92, sector: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.91, change_percent: 0.65, sector: 'Technology' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 152.33, change_percent: 0.81, sector: 'Technology' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change_percent: 1.30, sector: 'Automotive' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 495.22, change_percent: 1.13, sector: 'Technology' },
    { symbol: 'META', name: 'Meta Platforms Inc.', price: 358.75, change_percent: 0.72, sector: 'Technology' },
    { symbol: 'BTC', name: 'Bitcoin', price: 45230.50, change_percent: 0.85, sector: 'Cryptocurrency' },
    { symbol: 'ETH', name: 'Ethereum', price: 2340.75, change_percent: 1.09, sector: 'Cryptocurrency' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 168.45, change_percent: 0.75, sector: 'Finance' },
    { symbol: 'V', name: 'Visa Inc.', price: 258.90, change_percent: 0.68, sector: 'Finance' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', price: 158.45, change_percent: 0.41, sector: 'Healthcare' },
    { symbol: 'WMT', name: 'Walmart Inc.', price: 162.75, change_percent: 0.77, sector: 'Retail' },
    { symbol: 'XOM', name: 'Exxon Mobil Corp', price: 102.35, change_percent: 0.84, sector: 'Energy' },
    { symbol: 'GOLD', name: 'Gold Futures', price: 2042.50, change_percent: 0.21, sector: 'Precious Metals' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search stocks
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    // Simulate API delay
    const timeoutId = setTimeout(() => {
      const query = searchQuery.toLowerCase();
      const results = mockStocks.filter(
        stock =>
          stock.symbol.toLowerCase().includes(query) ||
          stock.name.toLowerCase().includes(query)
      );
      setSearchResults(results);
      setShowResults(true);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleStockClick = (stock) => {
    setSearchQuery('');
    setShowResults(false);
    if (onStockSelect) {
      onStockSelect(stock);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery && setShowResults(true)}
          placeholder="Search stocks by symbol or name..."
          className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              No stocks found for "{searchQuery}"
            </div>
          ) : (
            <div className="py-2">
              {searchResults.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => handleStockClick(stock)}
                  className="w-full px-4 py-3 hover:bg-gray-700 transition-colors text-left flex items-center justify-between group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="font-bold text-white text-lg">{stock.symbol}</div>
                      <div className="text-sm text-gray-400">{stock.name}</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{stock.sector}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">
                      ${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className={`text-sm flex items-center gap-1 justify-end ${
                      stock.change_percent >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stock.change_percent >= 0 ? (
                        <TrendingUp size={14} />
                      ) : (
                        <TrendingDown size={14} />
                      )}
                      {stock.change_percent >= 0 ? '+' : ''}{stock.change_percent}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockSearch;
