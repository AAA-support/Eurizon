import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, TrendingUp, Wallet, Activity } from 'lucide-react';
import CurrencyConverterWidget from '../components/CurrencyConverterWidget';

const MarketDashboard = () => {
  const { userRole } = useApp();

  const stats = [
    {
      title: 'Total Assets',
      value: userRole === 'admin' ? '$2.4M' : '$125,000',
      change: '+12.5%',
      positive: true,
      icon: Wallet
    },
    {
      title: 'Portfolio Growth',
      value: '+$15,250',
      change: '+8.3%',
      positive: true,
      icon: TrendingUp
    },
    {
      title: 'Active Positions',
      value: '12',
      change: '+2',
      positive: true,
      icon: Activity
    },
    {
      title: 'Market Performance',
      value: '-0.89%',
      change: 'Today',
      positive: false,
      icon: BarChart3
    }
  ];

  const stocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: '$411.81', change: '+2.47%', positive: true },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: '$86.30', change: '-2.88%', positive: false },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$189.21', change: '-2.85%', positive: false },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: '$108.97', change: '-1.87%', positive: false },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: '$335.14', change: '-4.02%', positive: false }
  ];

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Market Dashboard</h1>
        <p className="text-gray-400 mt-2">Overview of your investment portfolio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-sm mt-2 ${stat.positive ? 'text-green' : 'text-red'}`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.positive ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                  <Icon size={24} className={stat.positive ? 'text-green-400' : 'text-red-400'} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Top Stocks</h2>
            </div>
            <div className="card-content">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Company</th>
                      <th>Price</th>
                      <th>Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.map((stock, index) => (
                      <tr key={index}>
                        <td className="font-bold">{stock.symbol}</td>
                        <td>{stock.name}</td>
                        <td>{stock.price}</td>
                        <td className={stock.positive ? 'text-green' : 'text-red'}>
                          {stock.change}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Currency Converter Widget */}
        <div>
          <CurrencyConverterWidget />
        </div>
      </div>
    </div>
  );
};

export default MarketDashboard;
