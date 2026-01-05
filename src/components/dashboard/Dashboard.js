import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Home, Users, TrendingUp, Play, Briefcase, DollarSign, 
  FileText, Settings, GraduationCap, LogOut, Bell, Search,
  BarChart3, Activity, Target, Zap, ArrowUpDown, RefreshCw
} from 'lucide-react';

const Dashboard = ({ userProfile }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [portfolioData, setPortfolioData] = useState(null);

  // Currency converter state
  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState('850.00');

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('user-portfolio', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      if (error) throw error;
      setPortfolioData(data.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'admin', label: 'Admin', icon: Users, adminOnly: true },
    { id: 'trading', label: 'Trading', icon: TrendingUp },
    { id: 'demo', label: 'Demo Trading', icon: Play },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'currency', label: 'Currency Converter', icon: DollarSign },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'learning', label: 'Learning Centre', icon: GraduationCap },
  ];

  const renderCurrencyConverter = () => {
    const currencyPairs = [
      { pair: 'EUR / US Dollar', rate: 1.18, change: '+0.19%', positive: true },
      { pair: 'GBP/USD', rate: 1.23, change: '-0.07%', positive: false },
      { pair: 'USD/JPY', rate: 149.66, change: '+1.84%', positive: true },
      { pair: 'USD/CAD', rate: 1.35, change: '+0.45%', positive: true },
      { pair: 'AUD/USD', rate: 0.66, change: '-0.23%', positive: false },
      { pair: 'USD/CHF', rate: 0.91, change: '+0.12%', positive: true }
    ];

    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
            <DollarSign className="text-green-400" size={32} />
            Currency Converter
          </h1>
          <p className="text-slate-400">Real-time currency exchange rates and conversion tools</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-semibold text-white mb-6">Convert Currency</h3>
            
            <div className="space-y-6">
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
                </select>
              </div>

              <div className="flex justify-center">
                <button className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors">
                  <ArrowUpDown size={20} />
                </button>
              </div>

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
                </select>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-400">€{convertedAmount}</p>
                  <p className="text-slate-400 mt-2">${amount} = €{convertedAmount}</p>
                  <p className="text-slate-500 text-sm">Exchange Rate: 1 {fromCurrency} = 0.8500 {toCurrency}</p>
                </div>
              </div>
            </div>
          </div>

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
                    <p className={`text-sm ${pair.positive ? 'text-green-400' : 'text-red-400'}`}>
                      {pair.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboardContent = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <BarChart3 className="text-blue-400" size={32} />
              Market Dashboard
            </h1>
            <p className="text-slate-400 mt-1">Real-time market data, news, and performance analytics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Demo Balance</p>
                <p className="text-2xl font-bold text-white">${portfolioData?.demo_balance?.toFixed(2) || '100.00'}</p>
              </div>
              <DollarSign className="text-green-400" size={24} />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Market Average</p>
                <p className="text-2xl font-bold text-green-400">+0.57%</p>
              </div>
              <TrendingUp className="text-green-400" size={24} />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Account Status</p>
                <p className="text-xl font-semibold text-blue-400 capitalize">{userProfile?.user_status || 'Demo'}</p>
              </div>
              <Target className="text-blue-400" size={24} />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Volume</p>
                <p className="text-2xl font-bold text-white">$2.4M</p>
              </div>
              <Activity className="text-orange-400" size={24} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return renderDashboardContent();
      case 'currency':
        return renderCurrencyConverter();
      case 'trading':
        return (
          <div className="text-center py-12">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-orange-400 font-medium">Live Trading Restricted</p>
              <p className="text-slate-400 text-sm mt-2">Live trading is available for accredited investors only.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-12">
            <p className="text-slate-400">This section is coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex">
      <div className="w-64 bg-slate-900/50 backdrop-blur-sm border-r border-slate-700/50 flex flex-col">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex justify-center mb-4">
            <img 
              src="/eurizon-logo.png" 
              alt="Eurizon Logo" 
              className="h-16 w-auto object-contain"
              onError={(e) => {
                // Fallback to logo.png if eurizon-logo.png doesn't exist
                e.target.src = '/logo.png';
              }}
            />
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              if (item.adminOnly && !userProfile?.is_admin) return null;
              
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeSection === item.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-red-600/20 hover:text-red-400 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/eurizon-logo.png" 
                alt="Eurizon Logo" 
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  // Fallback to logo.png if eurizon-logo.png doesn't exist
                  e.target.src = '/logo.png';
                }}
              />
              <h1 className="text-2xl font-bold text-white">Eurizon Investment Client Portal</h1>
            </div>
            <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;