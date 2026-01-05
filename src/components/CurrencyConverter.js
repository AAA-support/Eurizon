import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { DollarSign, RefreshCw, TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState('850.00');
  const [exchangeRate, setExchangeRate] = useState(0.8500);
  const [loading, setLoading] = useState(false);

  // Mock exchange rates data matching your design
  const currencyPairs = [
    { pair: 'EUR / US Dollar', rate: 1.18, change: '+0.19%', positive: true },
    { pair: 'GBP/USD', rate: 1.23, change: '-0.07%', positive: false },
    { pair: 'USD/JPY', rate: 149.66, change: '+1.84%', positive: true },
    { pair: 'USD/CAD', rate: 1.35, change: '+0.45%', positive: true },
    { pair: 'AUD/USD', rate: 0.66, change: '-0.23%', positive: false },
    { pair: 'USD/CHF', rate: 0.91, change: '+0.12%', positive: true }
  ];

  const exchangeMatrix = {
    USD: { USD: 1.0000, EUR: 0.8500, GBP: 0.7300, JPY: 110.0000, CAD: 1.2500, AUD: 1.3500 },
    EUR: { USD: 1.1800, EUR: 1.0000, GBP: 0.8600, JPY: 129.5000, CAD: 1.4700, AUD: 1.5900 },
    GBP: { USD: 1.3700, EUR: 1.1600, GBP: 1.0000, JPY: 150.8000, CAD: 1.7100, AUD: 1.8500 },
    JPY: { USD: 0.0091, EUR: 0.0077, GBP: 0.0066, JPY: 1.0000, CAD: 0.0110, AUD: 0.0120 }
  };

  const handleConvert = useCallback(async () => {
    setLoading(true);
    try {
      // Use your currency converter Edge Function
      const { data, error } = await supabase.functions.invoke('currency-convert', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (data?.data) {
        setConvertedAmount(data.data.conversion_result.toFixed(2));
        setExchangeRate(data.data.conversion_rate);
      } else {
        // Fallback to mock calculation
        const rate = exchangeMatrix[fromCurrency]?.[toCurrency] || 1;
        const result = parseFloat(amount) * rate;
        setConvertedAmount(result.toFixed(2));
        setExchangeRate(rate);
      }
    } catch (error) {
      console.error('Conversion error:', error);
      // Fallback calculation
      const rate = exchangeMatrix[fromCurrency]?.[toCurrency] || 1;
      const result = parseFloat(amount) * rate;
      setConvertedAmount(result.toFixed(2));
      setExchangeRate(rate);
    } finally {
      setLoading(false);
    }
  }, [amount, fromCurrency, toCurrency]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setAmount(convertedAmount);
    setConvertedAmount(amount);
  };

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      handleConvert();
    }
  }, [amount, fromCurrency, toCurrency, handleConvert]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
            <DollarSign className="text-green-400" size={32} />
            Currency Converter
          </h1>
          <p className="text-slate-400">Real-time currency exchange rates and conversion tools</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* Currency Converter */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-semibold text-white mb-6">Convert Currency</h3>
            
            <div className="space-y-6">
              {/* Amount Input */}
              <div>
                <label className="block text-slate-300 text-sm mb-2">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white text-lg font-semibold focus:border-blue-500 focus:outline-none"
                  placeholder="1000"
                />
              </div>

              {/* From Currency */}
              <div>
                <label className="block text-slate-300 text-sm mb-2">From</label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <button
                  onClick={swapCurrencies}
                  className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                >
                  <ArrowUpDown size={20} />
                </button>
              </div>

              {/* To Currency */}
              <div>
                <label className="block text-slate-300 text-sm mb-2">To</label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="EUR">EUR - Euro</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              </div>

              {/* Result */}
              <div className="bg-slate-700/50 rounded-lg p-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-400">€{convertedAmount}</p>
                  <p className="text-slate-400 mt-2">${amount} = €{convertedAmount}</p>
                  <p className="text-slate-500 text-sm">Exchange Rate: 1 {fromCurrency} = {exchangeRate} {toCurrency}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Exchange Rates */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Live Exchange Rates</h3>
              <button className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                <RefreshCw size={14} />
                Refresh
              </button>
            </div>

            <div className="space-y-3">
              {currencyPairs.map((pair, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-slate-700/50 last:border-b-0">
                  <div>
                    <p className="text-white font-medium">{pair.pair.split('/')[0]}</p>
                    <p className="text-slate-400 text-sm">{pair.pair}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{pair.rate}</p>
                    <div className="flex items-center gap-1">
                      {pair.positive ? 
                        <TrendingUp size={12} className="text-green-400" /> : 
                        <TrendingDown size={12} className="text-red-400" />
                      }
                      <p className={`text-sm ${pair.positive ? 'text-green-400' : 'text-red-400'}`}>
                        {pair.change}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Exchange Rate Matrix */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-semibold text-white mb-6">Exchange Rate Matrix</h3>
          <p className="text-slate-400 text-sm mb-6">Cross-currency exchange rates</p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300">Currency</th>
                  <th className="text-center py-3 px-4 text-slate-300">USD</th>
                  <th className="text-center py-3 px-4 text-slate-300">EUR</th>
                  <th className="text-center py-3 px-4 text-slate-300">GBP</th>
                  <th className="text-center py-3 px-4 text-slate-300">JPY</th>
                  <th className="text-center py-3 px-4 text-slate-300">CAD</th>
                  <th className="text-center py-3 px-4 text-slate-300">AUD</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(exchangeMatrix).map(([currency, rates]) => (
                  <tr key={currency} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 text-white font-medium">{currency}</td>
                    {Object.values(rates).map((rate, index) => (
                      <td key={index} className="py-3 px-4 text-center text-slate-300">
                        {typeof rate === 'number' ? rate.toFixed(4) : rate}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;