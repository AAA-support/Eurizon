import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CurrencyConverter = () => {
  const { addNotification } = useApp();
  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exchangeRates, setExchangeRates] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);

  // Mock exchange rates (in production, fetch from API)
  const mockRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.50,
    CHF: 0.88,
    CAD: 1.36,
    AUD: 1.53,
    CNY: 7.24,
    INR: 83.12,
    SGD: 1.34
  };

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' }
  ];

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      convertCurrency();
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  const fetchExchangeRates = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setExchangeRates(mockRates);
      setLastUpdated(new Date());
      addNotification('success', 'Exchange rates updated successfully');
    } catch (error) {
      addNotification('error', 'Failed to fetch exchange rates');
    } finally {
      setLoading(false);
    }
  };

  const convertCurrency = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setResult(null);
      return;
    }

    const amountNum = parseFloat(amount);
    const fromRate = exchangeRates[fromCurrency] || 1;
    const toRate = exchangeRates[toCurrency] || 1;
    
    // Convert to USD first, then to target currency
    const usdAmount = amountNum / fromRate;
    const convertedAmount = usdAmount * toRate;
    
    setResult({
      amount: convertedAmount.toFixed(2),
      rate: (toRate / fromRate).toFixed(4)
    });
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getChangeIndicator = (code) => {
    // Mock change data
    const changes = {
      EUR: -0.15,
      GBP: 0.23,
      JPY: -0.45,
      CHF: 0.12,
      CAD: -0.08
    };
    const change = changes[code] || 0;
    return (
      <span className={change >= 0 ? 'text-green' : 'text-red'}>
        {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {Math.abs(change)}%
      </span>
    );
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <ArrowLeftRight size={28} />
          Currency Converter
        </h1>
        <p className="text-gray-400 mt-2">Convert between major world currencies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Converter Card */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h2 className="card-title">Convert Currency</h2>
              <button 
                onClick={fetchExchangeRates}
                disabled={loading}
                className="btn btn-secondary btn-sm"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh Rates
              </button>
            </div>

            <div className="card-content">
              {lastUpdated && (
                <p className="text-sm text-gray-400 mb-4">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}

              <div className="space-y-4">
                {/* From Currency */}
                <div>
                  <label className="form-label">From</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="Enter amount"
                      className="form-input"
                    />
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="form-input"
                    >
                      {currencies.map(curr => (
                        <option key={curr.code} value={curr.code}>
                          {curr.code} - {curr.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <button
                    onClick={swapCurrencies}
                    className="btn btn-secondary"
                    aria-label="Swap currencies"
                  >
                    <ArrowLeftRight size={20} />
                  </button>
                </div>

                {/* To Currency */}
                <div>
                  <label className="form-label">To</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={result ? result.amount : ''}
                      readOnly
                      placeholder="Converted amount"
                      className="form-input bg-gray-700"
                    />
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="form-input"
                    >
                      {currencies.map(curr => (
                        <option key={curr.code} value={curr.code}>
                          {curr.code} - {curr.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Conversion Result */}
                {result && (
                  <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-gray-400 mb-2">Conversion Result</p>
                      <p className="text-3xl font-bold text-white mb-2">
                        {currencies.find(c => c.code === toCurrency)?.symbol} {result.amount}
                      </p>
                      <p className="text-sm text-gray-400">
                        1 {fromCurrency} = {result.rate} {toCurrency}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Exchange Rates Card */}
        <div>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Live Rates</h2>
              <p className="text-sm text-gray-400 mt-1">Base: USD</p>
            </div>
            <div className="card-content">
              <div className="space-y-3">
                {currencies.filter(c => c.code !== 'USD').map(curr => (
                  <div 
                    key={curr.code}
                    className="flex justify-between items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{curr.code}</p>
                      <p className="text-xs text-gray-400">{curr.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {exchangeRates[curr.code]?.toFixed(4) || '—'}
                      </p>
                      <div className="text-xs flex items-center gap-1 justify-end">
                        {getChangeIndicator(curr.code)}
                      </div>
                    </div>
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

export default CurrencyConverter;
