import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, TrendingUp, TrendingDown, RefreshCw, Clock, Calculator, BarChart3, Globe } from 'lucide-react';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock exchange rates data
  const exchangeRates = {
    USD: { EUR: 0.92, GBP: 0.79, JPY: 149.50, CHF: 0.91, CAD: 1.35, AUD: 1.52, CNY: 7.24, SGD: 1.34, HKD: 7.82 },
    EUR: { USD: 1.09, GBP: 0.86, JPY: 162.80, CHF: 0.99, CAD: 1.47, AUD: 1.65, CNY: 7.88, SGD: 1.46, HKD: 8.52 },
    GBP: { USD: 1.27, EUR: 1.16, JPY: 189.20, CHF: 1.15, CAD: 1.71, AUD: 1.92, CNY: 9.18, SGD: 1.70, HKD: 9.93 },
    JPY: { USD: 0.0067, EUR: 0.0061, GBP: 0.0053, CHF: 0.0061, CAD: 0.0090, AUD: 0.0102, CNY: 0.0484, SGD: 0.0090, HKD: 0.0523 },
    CHF: { USD: 1.10, EUR: 1.01, GBP: 0.87, JPY: 164.29, CAD: 1.48, AUD: 1.67, CNY: 7.96, SGD: 1.47, HKD: 8.60 },
    CAD: { USD: 0.74, EUR: 0.68, GBP: 0.58, JPY: 110.74, CHF: 0.68, AUD: 1.13, CNY: 5.36, SGD: 0.99, HKD: 5.79 },
    AUD: { USD: 0.66, EUR: 0.61, GBP: 0.52, JPY: 98.36, CHF: 0.60, CAD: 0.89, CNY: 4.76, SGD: 0.88, HKD: 5.14 },
    CNY: { USD: 0.14, EUR: 0.13, GBP: 0.11, JPY: 20.66, CHF: 0.13, CAD: 0.19, AUD: 0.21, SGD: 0.18, HKD: 1.08 },
    SGD: { USD: 0.75, EUR: 0.68, GBP: 0.59, JPY: 111.57, CHF: 0.68, CAD: 1.01, AUD: 1.14, CNY: 5.40, HKD: 5.84 },
    HKD: { USD: 0.13, EUR: 0.12, GBP: 0.10, JPY: 19.11, CHF: 0.12, CAD: 0.17, AUD: 0.19, CNY: 0.93, SGD: 0.17 }
  };

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' }
  ];

  const popularPairs = [
    { from: 'USD', to: 'EUR', rate: 0.92, change: -0.15 },
    { from: 'USD', to: 'GBP', rate: 0.79, change: 0.23 },
    { from: 'USD', to: 'JPY', rate: 149.50, change: 1.12 },
    { from: 'EUR', to: 'GBP', rate: 0.86, change: 0.08 },
    { from: 'USD', to: 'CHF', rate: 0.91, change: -0.05 },
    { from: 'USD', to: 'SGD', rate: 1.34, change: 0.12 }
  ];

  useEffect(() => {
    convertCurrency();
  }, [amount, fromCurrency, toCurrency]);

  const convertCurrency = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (fromCurrency === toCurrency) {
        setConvertedAmount(parseFloat(amount) || 0);
        setExchangeRate(1);
      } else if (exchangeRates[fromCurrency] && exchangeRates[fromCurrency][toCurrency]) {
        const rate = exchangeRates[fromCurrency][toCurrency];
        setExchangeRate(rate);
        setConvertedAmount((parseFloat(amount) || 0) * rate);
      }
      setIsLoading(false);
      setLastUpdated(new Date());
    }, 500);
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const formatCurrency = (value, currencyCode) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: currencyCode === 'JPY' ? 0 : 4
    }).format(value);
  };

  const getCurrencyInfo = (code) => currencies.find(c => c.code === code);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-3 mb-2">
            <Globe size={32} />
            <h1 className="text-3xl font-bold">Currency Converter</h1>
          </div>
          <p className="text-blue-100">Real-time exchange rates for global currencies</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Main Converter */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* From Currency */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300">From</label>
              <div className="relative">
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {getCurrencyInfo(fromCurrency)?.symbol}
                </span>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={swapCurrencies}
                className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full transition-colors"
              >
                <ArrowLeftRight size={24} />
              </button>
            </div>

            {/* To Currency */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300">To</label>
              <div className="relative">
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-xl font-semibold text-green-400 min-h-[56px] flex items-center">
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="animate-spin" size={20} />
                      <span>Converting...</span>
                    </div>
                  ) : (
                    formatCurrency(convertedAmount, toCurrency)
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Exchange Rate Info */}
          <div className="mt-8 p-4 bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Calculator size={20} className="text-blue-400" />
                <span className="text-sm text-gray-300">
                  1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Clock size={16} />
                <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Popular Currency Pairs */}
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-6">
              <BarChart3 className="text-blue-400" size={24} />
              <h2 className="text-xl font-semibold">Popular Currency Pairs</h2>
            </div>
            <div className="space-y-4">
              {popularPairs.map((pair, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-650 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <span>{getCurrencyInfo(pair.from)?.flag}</span>
                      <span>{getCurrencyInfo(pair.to)?.flag}</span>
                    </div>
                    <span className="font-medium">{pair.from}/{pair.to}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{pair.rate.toFixed(4)}</div>
                    <div className={`text-sm flex items-center ${
                      pair.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {pair.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      <span className="ml-1">{Math.abs(pair.change)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Convert */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Quick Convert</h2>
            <div className="space-y-4">
              {[1, 10, 100, 1000, 10000].map(value => {
                const converted = value * exchangeRate;
                return (
                  <div key={value} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                    <span className="font-medium">
                      {formatCurrency(value, fromCurrency)}
                    </span>
                    <span className="text-green-400 font-semibold">
                      {formatCurrency(converted, toCurrency)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Currency Information */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Currency Information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium mb-4 text-blue-400">
                {getCurrencyInfo(fromCurrency)?.flag} {getCurrencyInfo(fromCurrency)?.name}
              </h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p><strong>Code:</strong> {fromCurrency}</p>
                <p><strong>Symbol:</strong> {getCurrencyInfo(fromCurrency)?.symbol}</p>
                <p><strong>Type:</strong> Fiat Currency</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-4 text-green-400">
                {getCurrencyInfo(toCurrency)?.flag} {getCurrencyInfo(toCurrency)?.name}
              </h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p><strong>Code:</strong> {toCurrency}</p>
                <p><strong>Symbol:</strong> {getCurrencyInfo(toCurrency)?.symbol}</p>
                <p><strong>Type:</strong> Fiat Currency</p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg border-l-4 border-yellow-500">
          <p className="text-sm text-gray-400">
            <strong className="text-yellow-400">Disclaimer:</strong> Exchange rates are provided for informational purposes only and may not reflect real-time market rates. 
            For actual trading or financial decisions, please consult with official financial institutions or real-time trading platforms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;