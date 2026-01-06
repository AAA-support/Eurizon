import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';

const CurrencyConverterWidget = () => {
  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(null);

  const mockRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.50,
    CHF: 0.88,
    CAD: 1.36,
    AUD: 1.53
  };

  const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'JPY', symbol: '¥' },
    { code: 'CHF', symbol: 'Fr' },
    { code: 'CAD', symbol: 'C$' },
    { code: 'AUD', symbol: 'A$' }
  ];

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      const amountNum = parseFloat(amount) || 0;
      const fromRate = mockRates[fromCurrency] || 1;
      const toRate = mockRates[toCurrency] || 1;
      const usdAmount = amountNum / fromRate;
      const convertedAmount = usdAmount * toRate;

      setResult({
        amount: convertedAmount.toFixed(2),
        rate: (toRate / fromRate).toFixed(4)
      });
    }
  }, [amount, fromCurrency, toCurrency]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title flex items-center gap-2">
          <ArrowLeftRight size={20} />
          Quick Currency Converter
        </h2>
      </div>
      <div className="card-content">
        <div className="space-y-3">
          {/* From */}
          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="form-input flex-1"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="form-input w-24"
            >
              {currencies.map(curr => (
                <option key={curr.code} value={curr.code}>{curr.code}</option>
              ))}
            </select>
          </div>

          {/* Swap */}
          <div className="flex justify-center">
            <button
              onClick={swapCurrencies}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RefreshCw size={16} className="text-gray-400" />
            </button>
          </div>

          {/* To */}
          <div className="flex gap-2">
            <input
              type="text"
              value={result ? result.amount : ''}
              readOnly
              placeholder="Result"
              className="form-input flex-1 bg-gray-700"
            />
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="form-input w-24"
            >
              {currencies.map(curr => (
                <option key={curr.code} value={curr.code}>{curr.code}</option>
              ))}
            </select>
          </div>

          {/* Rate */}
          {result && (
            <div className="text-center text-sm text-gray-400 pt-2 border-t border-gray-700">
              1 {fromCurrency} = {result.rate} {toCurrency}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverterWidget;
