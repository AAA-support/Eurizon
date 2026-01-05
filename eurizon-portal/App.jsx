import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Wallet, 
  FileText, 
  Newspaper, 
  Bell, 
  FileBarChart, 
  Settings,
  Users,
  DollarSign,
  Menu,
  X,
  Eye,
  FolderOpen,
  GraduationCap,
  Plus,
  Trash2,
  Edit,
  Download,
  Upload,
  UserPlus,
  Search,
  Calendar,
  Tag,
  File,
  ArrowLeftRight,
  TrendingDown,
  RefreshCw,
  Clock,
  Calculator,
  Globe,
  Filter,
  ChevronUp,
  ChevronDown,
  Activity,
  LogIn,
  User,
  Lock,
  ArrowRight,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  PlayCircle,
  Copy,
  CreditCard,
  Building2,
  Banknote
} from 'lucide-react';

// Login Component
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e, role = 'user') => {
    e.preventDefault();
    onLogin(role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-4 shadow-lg">
            <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Investment Portal</h1>
          <p className="text-gray-300 text-sm">Professional Investment Management</p>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-700">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Sign In</h2>
            <p className="text-gray-400 text-sm">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={(e) => handleLogin(e, 'user')} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300">
                  <Eye size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300 font-medium">
                Contact your advisor
              </a>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-center text-xs text-gray-500 mb-3">Demo Access:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={(e) => handleLogin(e, 'admin')}
                className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded-md transition-colors"
              >
                Admin Demo
              </button>
              <button
                onClick={(e) => handleLogin(e, 'user')}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-4 rounded-md transition-colors"
              >
                User Demo
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">© 2025 Eurizon Investment. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
};

// Market Dashboard Component
const MarketDashboard = ({ userRole }) => {
  const marketData = {
    totalAssets: userRole === 'admin' ? '$2.4M' : '-',
    marketAverage: '-0.89%',
    topSector: 'Commodities',
    totalVolume: '-'
  };

  const stocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: '$411.81', change: '+2.47%', volume: '0.7M', positive: true },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: '$86.30', change: '-2.88%', volume: '5.0M', positive: false },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$189.21', change: '-2.85%', volume: '0.7M', positive: false },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: '$108.97', change: '-1.87%', volume: '6.0M', positive: false },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: '$335.14', change: '-4.02%', volume: '5.0M', positive: false },
    { symbol: 'META', name: 'Meta Platforms Inc.', price: '$288.73', change: '-3.00%', volume: '3.0M', positive: false }
  ];

  const news = [
    {
      priority: 'HIGH',
      category: 'Central Banking',
      title: 'Federal Reserve Signals Potential Rate Cut in Q2 2024',
      description: 'Fed Chair Jerome Powell hints at monetary policy adjustments amid cooling inflation data.',
      time: 'Just now',
      impact: 'High impact'
    },
    {
      priority: 'MEDIUM',
      category: 'Technology',
      title: 'Tech Stocks Rally on Strong AI Revenue Reports',
      description: 'Major technology companies report significant growth in artificial intelligence segments.',
      time: '1 hour ago',
      impact: 'Market Moving'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <BarChart3 className="mr-3" size={28} />
                Market Dashboard
              </h1>
              <p className="text-gray-400 mt-1">Real-time market data, news, and performance analytics</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-green-600 text-white px-3 py-1 rounded text-sm">
                <div className="w-2 h-2 bg-green-300 rounded-full mr-2"></div>
                Live Data
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <RefreshCw size={16} className="mr-2" />
                Updated Now
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Total Assets</div>
                <div className="text-xl font-bold">{marketData.totalAssets}</div>
                <div className="text-xs text-gray-500 mt-1">Across all markets</div>
              </div>
              <BarChart3 className="text-blue-400" size={24} />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Market Average</div>
                <div className="text-xl font-bold text-red-400">{marketData.marketAverage}</div>
                <div className="text-xs text-gray-500 mt-1">Overall performance</div>
              </div>
              <TrendingDown className="text-red-400" size={24} />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Top Sector</div>
                <div className="text-xl font-bold text-purple-400">{marketData.topSector}</div>
                <div className="text-xs text-gray-500 mt-1">Best performing</div>
              </div>
              <DollarSign className="text-purple-400" size={24} />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Total Volume</div>
                <div className="text-xl font-bold">{marketData.totalVolume}</div>
                <div className="text-xs text-gray-500 mt-1">Trading volume</div>
              </div>
              <Activity className="text-orange-400" size={24} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <BarChart3 className="mr-2" size={20} />
                  Market Overview
                  <span className="ml-2 bg-blue-600 text-xs px-2 py-1 rounded">Live Data</span>
                </h2>
                <button className="flex items-center text-gray-400 hover:text-white text-sm">
                  <RefreshCw size={16} className="mr-1" />
                  Refresh
                </button>
              </div>
              
              <div className="flex space-x-1 mb-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">Stocks</button>
                <button className="bg-gray-700 text-gray-300 px-4 py-2 rounded-md text-sm">Crypto</button>
                <button className="bg-gray-700 text-gray-300 px-4 py-2 rounded-md text-sm">Forex</button>
                <button className="bg-gray-700 text-gray-300 px-4 py-2 rounded-md text-sm">Commodities</button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-900 rounded p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">52</div>
                  <div className="text-sm text-gray-400">Gainers</div>
                </div>
                <div className="bg-gray-900 rounded p-4 text-center">
                  <div className="text-2xl font-bold text-red-400">48</div>
                  <div className="text-sm text-gray-400">Losers</div>
                </div>
                <div className="bg-gray-900 rounded p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">+0.27%</div>
                  <div className="text-sm text-gray-400">Avg Change</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Top Stocks (100 Available)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2">Symbol</th>
                        <th className="text-left py-2">Name</th>
                        <th className="text-right py-2">Price</th>
                        <th className="text-right py-2">Change</th>
                        <th className="text-right py-2">Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stocks.map((stock, i) => (
                        <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                          <td className="py-2 font-medium">{stock.symbol}</td>
                          <td className="py-2 text-gray-400">{stock.name}</td>
                          <td className="py-2 text-right font-medium">{stock.price}</td>
                          <td className={`py-2 text-right font-medium ${stock.positive ? 'text-green-400' : 'text-red-400'}`}>
                            {stock.change}
                          </td>
                          <td className="py-2 text-right text-gray-400">{stock.volume}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <Newspaper className="mr-2" size={20} />
                  Market News
                  <span className="ml-2 bg-green-600 text-xs px-2 py-1 rounded">Live</span>
                </h2>
                <button className="flex items-center text-gray-400 hover:text-white text-sm">
                  <RefreshCw size={16} className="mr-1" />
                  Refresh
                </button>
              </div>

              <div className="mb-4">
                <div className="text-xs text-gray-400 mb-2">Filter by category:</div>
                <div className="flex flex-wrap gap-1">
                  <button className="bg-blue-600 text-xs px-2 py-1 rounded">All</button>
                  <button className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">Technology</button>
                  <button className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">Finance</button>
                  <button className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">Energy</button>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  <button className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">Healthcare</button>
                  <button className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">Commodities</button>
                  <button className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">Forex</button>
                </div>
              </div>

              <div className="space-y-4">
                {news.map((item, i) => (
                  <div key={i} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.priority === 'HIGH' ? 'bg-red-600 text-white' : 'bg-yellow-600 text-white'
                      }`}>
                        {item.priority}
                      </span>
                      <span className="text-xs text-gray-400">{item.time}</span>
                    </div>
                    <div className="mb-2">
                      <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-gray-400">{item.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-400">{item.category}</span>
                      <button className="text-xs text-gray-400 hover:text-white flex items-center">
                        <ArrowRight size={12} className="ml-1" />
                        Read More
                      </button>
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
// Admin Dashboard Component
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Users');

  const adminStats = {
    totalUsers: { value: 4, change: '+2 from last month' },
    bankAccounts: { value: 2, change: 'Active payment methods' },
    cryptoWallets: { value: 2, change: 'Active crypto addresses' },
    totalAUM: { value: '$463.5K', change: '+12.5% from last month' }
  };

  const users = [
    { name: 'John Smith', email: 'john@example.com', role: 'Client', status: 'Active', portfolio: '$125,000' },
    { name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Client', status: 'Active', portfolio: '$89,500' },
    { name: 'Mike Wilson', email: 'mike@example.com', role: 'Client', status: 'Inactive', portfolio: '$45,200' },
    { name: 'Emma Davis', email: 'emma@example.com', role: 'Client', status: 'Active', portfolio: '$203,800' }
  ];

  const bankDetails = [
    {
      id: 1,
      bankName: 'JPMorgan Chase',
      accountNumber: '****-****-****-1234',
      accountType: 'Business Checking',
      balance: '$245,670.00',
      status: 'Active',
      lastUpdated: '2024-01-15'
    },
    {
      id: 2,
      bankName: 'Bank of America',
      accountNumber: '****-****-****-5678',
      accountType: 'Investment Account',
      balance: '$892,340.00',
      status: 'Active',
      lastUpdated: '2024-01-14'
    }
  ];

  const cryptoWallets = [
    {
      id: 1,
      currency: 'Bitcoin (BTC)',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      balance: '2.45 BTC',
      usdValue: '$98,750.00',
      status: 'Active'
    },
    {
      id: 2,
      currency: 'Ethereum (ETH)',
      address: '0x742d35Cc6634C0532925a3b8D0a3EF5D3F2a3F2a',
      balance: '15.67 ETH',
      usdValue: '$45,230.00',
      status: 'Active'
    }
  ];

  const renderUserManagement = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">User Management</h2>
          <p className="text-gray-400 text-sm">Manage client accounts and permissions</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <UserPlus size={16} className="mr-2" />
          Add User
        </button>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Portfolio Value</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={i} className="border-b border-gray-700">
                <td className="p-4 font-medium">{user.name}</td>
                <td className="p-4 text-gray-400">{user.email}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'Active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 font-medium">{user.portfolio}</td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded">
                      <Edit size={14} />
                    </button>
                    <button className="p-2 bg-red-600 hover:bg-red-700 rounded">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBankDetails = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Bank Account Details</h2>
          <p className="text-gray-400 text-sm">Manage payment methods and bank accounts</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus size={16} className="mr-2" />
          Add Bank Account
        </button>
      </div>

      <div className="grid gap-6">
        {bankDetails.map((bank) => (
          <div key={bank.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <Building2 size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{bank.bankName}</h3>
                  <p className="text-gray-400 text-sm">{bank.accountType}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{bank.balance}</div>
                <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                  bank.status === 'Active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                }`}>
                  {bank.status}
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">Account Number</div>
                <div className="font-medium">{bank.accountNumber}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Last Updated</div>
                <div className="font-medium">{bank.lastUpdated}</div>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center">
                <Edit size={16} className="mr-2" />
                Edit
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center">
                <Eye size={16} className="mr-2" />
                View Details
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center">
                <Trash2 size={16} className="mr-2" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCryptoWallets = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Crypto Wallet Management</h2>
          <p className="text-gray-400 text-sm">Manage cryptocurrency wallet addresses</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus size={16} className="mr-2" />
          Add Wallet
        </button>
      </div>

      <div className="grid gap-6">
        {cryptoWallets.map((wallet) => (
          <div key={wallet.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mr-4">
                  <DollarSign size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{wallet.currency}</h3>
                  <p className="text-gray-400 text-sm font-mono text-xs">{wallet.address}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">{wallet.balance}</div>
                <div className="text-green-400 text-sm">{wallet.usdValue}</div>
                <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                  wallet.status === 'Active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                }`}>
                  {wallet.status}
                </div>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center">
                <Edit size={16} className="mr-2" />
                Edit
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center">
                <Copy size={16} className="mr-2" />
                Copy Address
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center">
                <Trash2 size={16} className="mr-2" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">Manage users, payment methods, and system settings</p>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Total Users</div>
                <div className="text-3xl font-bold">{adminStats.totalUsers.value}</div>
                <div className="text-xs text-green-400 mt-1">{adminStats.totalUsers.change}</div>
              </div>
              <Users className="text-blue-400" size={32} />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Bank Accounts</div>
                <div className="text-3xl font-bold">{adminStats.bankAccounts.value}</div>
                <div className="text-xs text-gray-400 mt-1">{adminStats.bankAccounts.change}</div>
              </div>
              <Building2 className="text-green-400" size={32} />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Crypto Wallets</div>
                <div className="text-3xl font-bold">{adminStats.cryptoWallets.value}</div>
                <div className="text-xs text-gray-400 mt-1">{adminStats.cryptoWallets.change}</div>
              </div>
              <DollarSign className="text-orange-400" size={32} />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Total AUM</div>
                <div className="text-3xl font-bold">{adminStats.totalAUM.value}</div>
                <div className="text-xs text-green-400 mt-1">{adminStats.totalAUM.change}</div>
              </div>
              <BarChart3 className="text-purple-400" size={32} />
            </div>
          </div>
        </div>

        <div className="border-b border-gray-700 mb-8">
          <nav className="flex space-x-8">
            {['Users', 'Bank Details', 'Crypto Wallets'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div>
          {activeTab === 'Users' && renderUserManagement()}
          {activeTab === 'Bank Details' && renderBankDetails()}
          {activeTab === 'Crypto Wallets' && renderCryptoWallets()}
        </div>
      </div>
    </div>
  );
};

// User Payment Component  
const UserPayment = () => {
  const [selectedMethod, setSelectedMethod] = useState('bank');
  const [copiedAddress, setCopiedAddress] = useState('');

  const bankAccounts = [
    {
      id: 1,
      bankName: 'JPMorgan Chase',
      accountName: 'Eurizon Investment Fund',
      accountNumber: '1234-5678-9012-3456',
      routingNumber: '021000021',
      swiftCode: 'CHASUS33'
    },
    {
      id: 2,
      bankName: 'Bank of America',
      accountName: 'Eurizon Investment LLC',
      accountNumber: '9876-5432-1098-7654',
      routingNumber: '026009593',
      swiftCode: 'BOFAUS3N'
    }
  ];

  const cryptoWallets = [
    {
      id: 1,
      currency: 'Bitcoin (BTC)',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      network: 'Bitcoin Network',
      icon: '₿'
    },
    {
      id: 2,
      currency: 'Ethereum (ETH)',
      address: '0x742d35Cc6634C0532925a3b8D0a3EF5D3F2a3F2a',
      network: 'Ethereum Mainnet',
      icon: 'Ξ'
    }
  ];

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(`${type}-${text}`);
    setTimeout(() => setCopiedAddress(''), 2000);
  };

  const renderBankPayment = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Bank Transfer Details</h3>
        <p className="text-gray-400 text-sm mb-6">Use the following bank account details for your wire transfer or deposit:</p>
      </div>

      {bankAccounts.map((bank) => (
        <div key={bank.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <h4 className="text-xl font-semibold">{bank.bankName}</h4>
              <p className="text-gray-400">{bank.accountName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Account Number</label>
                <div className="flex items-center justify-between bg-gray-700 rounded p-3 mt-1">
                  <span className="font-mono text-sm">{bank.accountNumber}</span>
                  <button
                    onClick={() => copyToClipboard(bank.accountNumber, 'account')}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400">Routing Number</label>
                <div className="flex items-center justify-between bg-gray-700 rounded p-3 mt-1">
                  <span className="font-mono text-sm">{bank.routingNumber}</span>
                  <button
                    onClick={() => copyToClipboard(bank.routingNumber, 'routing')}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">SWIFT Code</label>
                <div className="flex items-center justify-between bg-gray-700 rounded p-3 mt-1">
                  <span className="font-mono text-sm">{bank.swiftCode}</span>
                  <button
                    onClick={() => copyToClipboard(bank.swiftCode, 'swift')}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400">Account Type</label>
                <div className="bg-gray-700 rounded p-3 mt-1">
                  <span className="text-sm">Business Checking</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded">
            <div className="flex items-start">
              <AlertTriangle className="text-blue-400 mr-3 mt-0.5" size={20} />
              <div className="text-sm">
                <p className="text-blue-400 font-medium mb-1">Important Instructions:</p>
                <ul className="text-gray-300 space-y-1">
                  <li>• Please include your account ID as a reference</li>
                  <li>• Processing time: 1-3 business days</li>
                  <li>• Minimum transfer amount: $1,000</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCryptoPayment = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Cryptocurrency Payment</h3>
        <p className="text-gray-400 text-sm mb-6">Send your cryptocurrency to the following wallet addresses:</p>
      </div>

      {cryptoWallets.map((wallet) => (
        <div key={wallet.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">{wallet.icon}</span>
            </div>
            <div>
              <h4 className="text-xl font-semibold">{wallet.currency}</h4>
              <p className="text-gray-400">{wallet.network}</p>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400">Wallet Address</label>
            <div className="flex items-center justify-between bg-gray-700 rounded p-4 mt-2">
              <span className="font-mono text-sm break-all mr-4">{wallet.address}</span>
              <button
                onClick={() => copyToClipboard(wallet.address, `crypto-${wallet.id}`)}
                className={`flex items-center px-3 py-2 rounded transition-colors ${
                  copiedAddress === `crypto-${wallet.id}-${wallet.address}`
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {copiedAddress === `crypto-${wallet.id}-${wallet.address}` ? (
                  <>
                    <CheckCircle size={16} className="mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} className="mr-1" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-orange-900/20 border border-orange-500/30 rounded">
            <div className="flex items-start">
              <AlertTriangle className="text-orange-400 mr-3 mt-0.5" size={20} />
              <div className="text-sm">
                <p className="text-orange-400 font-medium mb-1">Important Notes:</p>
                <ul className="text-gray-300 space-y-1">
                  <li>• Only send {wallet.currency.split(' ')[0]} to this address</li>
                  <li>• Minimum confirmations required: 3</li>
                  <li>• Double-check the address before sending</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <CreditCard className="mr-3" size={32} />
            Payment Methods
          </h1>
          <p className="text-gray-400 mt-2">Make deposits using bank transfers or cryptocurrency</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedMethod('bank')}
              className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
                selectedMethod === 'bank'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Building2 size={20} className="mr-2" />
              Bank Transfer
            </button>
            <button
              onClick={() => setSelectedMethod('crypto')}
              className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
                selectedMethod === 'crypto'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <DollarSign size={20} className="mr-2" />
              Cryptocurrency
            </button>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          {selectedMethod === 'bank' ? renderBankPayment() : renderCryptoPayment()}
        </div>

        <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Payment Support</h4>
              <p className="text-gray-400 text-sm mb-3">Having trouble with your payment? Contact our support team.</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Contact Support
              </button>
            </div>
            <div>
              <h4 className="font-medium mb-2">Processing Times</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Bank transfers: 1-3 business days</li>
                <li>• Cryptocurrency: 10-30 minutes</li>
                <li>• International wires: 3-5 business days</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// Portfolio Component
const Portfolio = () => {
  const portfolioStats = {
    totalValue: 98843.75,
    dayChange: -160.70,
    dayChangePercent: -0.16,
    activePositions: 4
  };

  const holdings = [
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 50, price: 175.43, value: 8771.5, change: 1.35, positive: true },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 25, price: 2847.63, value: 71190.75, change: -0.53, positive: false },
    { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 40, price: 378.85, value: 15154, change: 1.25, positive: true },
    { symbol: 'TSLA', name: 'Tesla Inc.', shares: 15, price: 248.50, value: 3727.5, change: -3.21, positive: false }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <Clock className="mr-3" size={28} />
                Portfolio
              </h1>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Add Position
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Total Value</div>
                <div className="text-2xl font-bold">${portfolioStats.totalValue.toLocaleString()}</div>
                <div className="text-xs text-gray-400 mt-1">Portfolio balance</div>
              </div>
              <DollarSign className="text-blue-400" size={28} />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Today's Change</div>
                <div className="text-2xl font-bold text-red-400">${portfolioStats.dayChange}</div>
                <div className="text-xs text-red-400 mt-1">{portfolioStats.dayChangePercent}%</div>
              </div>
              <TrendingDown className="text-red-400" size={28} />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Active Positions</div>
                <div className="text-2xl font-bold">{portfolioStats.activePositions}</div>
                <div className="text-xs text-gray-400 mt-1">Open positions</div>
              </div>
              <Activity className="text-green-400" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Current Holdings</h2>
              <p className="text-gray-400 text-sm">Your current stock positions and their performance</p>
            </div>
            <div className="flex space-x-2">
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Holdings</button>
              <button className="bg-gray-600 text-gray-300 px-3 py-1 rounded text-sm">Performance</button>
              <button className="bg-gray-600 text-gray-300 px-3 py-1 rounded text-sm">Transactions</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="text-left p-4">Symbol</th>
                  <th className="text-right p-4">Shares</th>
                  <th className="text-right p-4">Price</th>
                  <th className="text-right p-4">Value</th>
                  <th className="text-right p-4">Change</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding, i) => (
                  <tr key={i} className="border-b border-gray-700">
                    <td className="p-4">
                      <div>
                        <div className="font-semibold">{holding.symbol}</div>
                        <div className="text-sm text-gray-400">{holding.name}</div>
                      </div>
                    </td>
                    <td className="p-4 text-right">{holding.shares} shares</td>
                    <td className="p-4 text-right">${holding.price} each</td>
                    <td className="p-4 text-right font-semibold">${holding.value.toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <span className={`px-2 py-1 rounded text-xs ${
                        holding.positive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {holding.positive ? '+' : ''}{holding.change}%
                      </span>
                    </td>
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

// Trading Component
const Trading = () => {
  const liveData = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: '$175.43', change: '+1.24%', positive: true },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$2847.63', change: '-0.53%', positive: false },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: '$378.85', change: '+1.25%', positive: true },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: '$248.42', change: '-3.24%', positive: false },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: '$3342.88', change: '+0.37%', positive: true },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: '$421.13', change: '+3.86%', positive: true }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Trading</h1>
              <p className="text-gray-400 mt-1">View real-time market data</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">$46,019.00</div>
              <div className="text-gray-400 text-sm">Available Balance</div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="text-yellow-400 mr-3" size={20} />
            <div>
              <div className="text-yellow-400 font-medium">Live Trading Restricted</div>
              <div className="text-sm text-gray-300">Live trading is available for accredited investors only. Use Demo Trading to practice your investment strategies.</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search stocks by symbol or name..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold flex items-center mb-4">
            <TrendingUp className="mr-2" size={20} />
            Market Data (105 stocks)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="text-left p-4">Symbol</th>
                  <th className="text-left p-4">Company</th>
                  <th className="text-right p-4">Price</th>
                  <th className="text-right p-4">Change</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {liveData.map((stock, i) => (
                  <tr key={i} className="border-b border-gray-700">
                    <td className="p-4 font-semibold">{stock.symbol}</td>
                    <td className="p-4 text-gray-400">{stock.name}</td>
                    <td className="p-4 text-right font-semibold">{stock.price}</td>
                    <td className={`p-4 text-right font-medium ${
                      stock.positive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stock.change}
                    </td>
                    <td className="p-4 text-right">
                      <button className="bg-gray-600 text-gray-300 px-3 py-1 rounded text-sm">
                        Restricted
                      </button>
                    </td>
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

// Demo Trading Component
const DemoTrading = () => {
  const [demoBalance] = useState(100000);
  const [portfolioValue] = useState(0);
  const [totalPnL] = useState(0);

  const demoStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 489.86, change: 1.61, sector: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 81.56, change: 0.89, sector: 'Technology' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 272.75, change: 0.80, sector: 'Technology' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 57.15, change: -1.82, sector: 'Technology' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 237.76, change: -0.85, sector: 'Technology' },
    { symbol: 'META', name: 'Meta Platforms Inc.', price: 479.22, change: -0.26, sector: 'Technology' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Demo Trading</h1>
              <p className="text-gray-400 mt-1">Practice trading with $100 demo money and interactive charts</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
              <PlayCircle size={16} className="mr-2" />
              Open Interactive Charts
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Demo Balance</div>
                <div className="text-2xl font-bold text-green-400">${demoBalance.toLocaleString()}.00</div>
                <div className="text-xs text-gray-400 mt-1">Available for trading</div>
              </div>
              <DollarSign className="text-green-400" size={24} />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Portfolio Value</div>
                <div className="text-2xl font-bold">${portfolioValue.toLocaleString()}.00</div>
                <div className="text-xs text-gray-400 mt-1">Current holdings value</div>
              </div>
              <BarChart3 className="text-blue-400" size={24} />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Total P&L</div>
                <div className="text-2xl font-bold text-green-400">${totalPnL.toLocaleString()}.00</div>
                <div className="text-xs text-gray-400 mt-1">Unrealized gains/losses</div>
              </div>
              <TrendingUp className="text-green-400" size={24} />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Total Value</div>
                <div className="text-2xl font-bold">${(demoBalance + portfolioValue).toLocaleString()}.00</div>
                <div className="text-xs text-gray-400 mt-1">Balance + Portfolio</div>
              </div>
              <Calculator className="text-purple-400" size={24} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold flex items-center mb-4">
                <TrendingUp className="mr-2" size={20} />
                Place Demo Order
                <span className="ml-2 bg-green-600 text-xs px-2 py-1 rounded">Practice trading with real market data</span>
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Order Type</label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white">
                      <option>Market</option>
                      <option>Limit</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Stock</label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white">
                      <option>Select stock...</option>
                      <option>AAPL</option>
                      <option>MSFT</option>
                      <option>GOOGL</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Shares</label>
                    <input
                      type="number"
                      placeholder="Number of shares"
                      className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Price per Share</label>
                    <input
                      type="number"
                      placeholder="Price"
                      className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-medium">
                  Execute BUY Order
                </button>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold flex items-center mb-4">
                <BarChart3 className="mr-2" size={20} />
                Current Positions
                <span className="ml-2 text-gray-400 text-sm">Your demo portfolio holdings</span>
              </h2>
              
              <div className="text-center py-8">
                <Activity className="mx-auto mb-4 text-gray-600" size={48} />
                <p className="text-gray-400">No positions yet</p>
                <p className="text-gray-500 text-sm mt-1">Start trading to build your demo portfolio</p>
              </div>
            </div>
          </div>

          <div className="col-span-3">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold flex items-center mb-4">
                <TrendingUp className="mr-2" size={20} />
                Live Market Data
                <span className="ml-2 bg-green-600 text-xs px-2 py-1 rounded">Real-time stock prices for demo trading</span>
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {demoStocks.map((stock, i) => (
                  <div key={i} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold">{stock.symbol}</div>
                        <div className="text-sm text-gray-400">{stock.sector}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${stock.price}</div>
                        <div className={`text-xs px-2 py-1 rounded ${
                          stock.change >= 0 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change}%
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">{stock.name}</div>
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

// Placeholder components
const CurrencyConverter = () => (
  <div className="min-h-screen bg-gray-900 text-white p-6">
    <h1 className="text-2xl font-bold mb-4 flex items-center">
      <ArrowLeftRight className="mr-3" size={28} />
      Currency Converter
    </h1>
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <p className="text-gray-400">Currency conversion tools will be here...</p>
    </div>
  </div>
);

const Documents = () => (
  <div className="min-h-screen bg-gray-900 text-white p-6">
    <h1 className="text-2xl font-bold mb-4 flex items-center">
      <FolderOpen className="mr-3" size={28} />
      Documents
    </h1>
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <p className="text-gray-400">Document management will be here...</p>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="min-h-screen bg-gray-900 text-white p-6">
    <h1 className="text-2xl font-bold mb-4 flex items-center">
      <Settings className="mr-3" size={28} />
      Settings
    </h1>
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <p className="text-gray-400">Account settings will be here...</p>
    </div>
  </div>
);

const LearningCenter = () => (
  <div className="min-h-screen bg-gray-900 text-white p-6">
    <h1 className="text-2xl font-bold mb-4 flex items-center">
      <GraduationCap className="mr-3" size={28} />
      Learning Centre
    </h1>
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <p className="text-gray-400">Educational resources will be here...</p>
    </div>
  </div>
);
// Main App Component
const EurizonApp = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminNavigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'admin', name: 'Admin', icon: Users },
    { id: 'trading', name: 'Trading', icon: TrendingUp },
    { id: 'demo-trading', name: 'Demo Trading', icon: PlayCircle },
    { id: 'portfolio', name: 'Portfolio', icon: Clock },
    { id: 'currency', name: 'Currency Converter', icon: DollarSign },
    { id: 'documents', name: 'Documents', icon: FolderOpen },
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'learning', name: 'Learning Centre', icon: GraduationCap }
  ];

  const userNavigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'trading', name: 'Trading', icon: TrendingUp },
    { id: 'demo-trading', name: 'Demo Trading', icon: PlayCircle },
    { id: 'portfolio', name: 'Portfolio', icon: Clock },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'currency', name: 'Currency Converter', icon: DollarSign },
    { id: 'documents', name: 'Documents', icon: FolderOpen },
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'learning', name: 'Learning Centre', icon: GraduationCap }
  ];

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('user');
    setActiveTab('login');
    setSidebarOpen(false);
  };

  const renderContent = () => {
    if (!isLoggedIn) {
      return <LoginPage onLogin={handleLogin} />;
    }

    switch(activeTab) {
      case 'dashboard':
        return <MarketDashboard userRole={userRole} />;
      case 'admin':
        return userRole === 'admin' ? <AdminDashboard /> : <div className="p-6 text-white">Access Denied</div>;
      case 'trading':
        return <Trading />;
      case 'demo-trading':
        return <DemoTrading />;
      case 'portfolio':
        return <Portfolio />;
      case 'payment':
        return userRole === 'user' ? <UserPayment /> : <div className="p-6 text-white">Admin users don't have payment access</div>;
      case 'currency':
        return <CurrencyConverter />;
      case 'documents':
        return <Documents />;
      case 'settings':
        return <SettingsPage />;
      case 'learning':
        return <LearningCenter />;
      default:
        return <MarketDashboard userRole={userRole} />;
    }
  };

  if (!isLoggedIn) {
    return renderContent();
  }

  const navigationItems = userRole === 'admin' ? adminNavigationItems : userNavigationItems;

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-md border border-gray-700"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-gray-800 font-bold text-sm">E</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Eurizon Investment Client Portal</h1>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                        activeTab === item.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Logout */}
            <div className="mt-8 pt-4 border-t border-gray-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium text-red-400 hover:bg-red-900 hover:text-red-300"
              >
                <LogIn size={18} />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-0 bg-gray-950 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default EurizonApp;