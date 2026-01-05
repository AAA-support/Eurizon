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

  const handleLogin = (role = 'user') => {
    onLogin(role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center p-6">
      <div className="w-full max-w-xs mx-auto">
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-3">
            <span className="text-lg font-bold text-white">E</span>
          </div>
          <h1 className="text-xl font-bold text-white">Eurizon Investment Portal</h1>
          <p className="text-gray-300 mt-1 text-xs">Sign in to your account</p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl p-5 border border-gray-700">
          <div className="space-y-3">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3 h-3 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-1.5 text-gray-300">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-blue-400 hover:text-blue-300">
                Forgot password?
              </a>
            </div>

            <button
              onClick={() => handleLogin('user')}
              className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors font-medium text-sm mt-4"
            >
              <LogIn size={16} className="mr-1.5" />
              Sign In
            </button>
          </div>

          <div className="mt-3 text-center">
            <p className="text-xs text-gray-400">
              Don't have an account?{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300 font-medium">
                Contact your advisor
              </a>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-700">
            <p className="text-center text-xs text-gray-500 mb-2">Demo Access:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleLogin('admin')}
                className="bg-green-600 hover:bg-green-700 text-white text-xs py-1.5 px-3 rounded transition-colors"
              >
                Admin Demo
              </button>
              <button
                onClick={() => handleLogin('user')}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs py-1.5 px-3 rounded transition-colors"
              >
                User Demo
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 text-center text-xs text-gray-400">
          <p>Protected by 256-bit SSL encryption</p>
          <p className="mt-0.5">© 2024 Eurizon Investment Management. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

// Market Dashboard with the original layout
const MarketDashboard = () => {
  const indices = [
    { name: 'S&P 500', value: '4,567.23', change: '+56.78', percent: '+1.24%', positive: true },
    { name: 'Dow Jones', value: '34,892.10', change: '+289.45', percent: '+0.89%', positive: true },
    { name: 'NASDAQ', value: '14,256.78', change: '+234.56', percent: '+1.87%', positive: true },
    { name: 'Russell 2000', value: '2,123.45', change: '-4.89', percent: '-0.23%', positive: false }
  ];

  const topMovers = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 195.25, change: 4.75, percent: 2.49, volume: '89.2M' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 380.12, change: 7.23, percent: 1.94, volume: '45.7M' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.56, change: 4.45, percent: 3.22, volume: '32.4M' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.73, change: 13.67, percent: 5.82, volume: '67.8M' },
    { symbol: 'AMZN', name: 'Amazon.com', price: 167.89, change: 2.04, percent: 1.23, volume: '28.9M' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 489.32, change: 19.45, percent: 4.14, volume: '78.3M' }
  ];

  const losers = [
    { symbol: 'META', name: 'Meta Platforms', price: 312.45, change: -6.12, percent: -1.92, volume: '34.5M' },
    { symbol: 'NFLX', name: 'Netflix Inc.', price: 425.67, change: -10.23, percent: -2.35, volume: '12.7M' },
    { symbol: 'BABA', name: 'Alibaba Group', price: 89.23, change: -3.21, percent: -3.47, volume: '23.1M' },
    { symbol: 'DIS', name: 'Walt Disney Co.', price: 98.76, change: -1.24, percent: -1.24, volume: '15.8M' }
  ];

  const news = [
    { time: '09:30', title: 'Federal Reserve Signals Potential Rate Cut in Q2 2024', category: 'Economics' },
    { time: '08:15', title: 'Tech Stocks Surge on AI Investment Announcements', category: 'Technology' },
    { time: '08:45', title: 'Oil Prices Rise 2% on Supply Chain Concerns', category: 'Commodities' },
    { time: '08:30', title: 'European Markets Close Higher Amid Inflation Data', category: 'International' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-full mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Market Dashboard</h1>
              <p className="text-gray-400 mt-1">Real-time market data, news, and performance analytics</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Last Updated</div>
              <div className="font-medium">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {indices.map((index, i) => (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">{index.name}</div>
              <div className="text-xl font-bold mb-1">{index.value}</div>
              <div className={`text-sm flex items-center ${index.positive ? 'text-green-400' : 'text-red-400'}`}>
                {index.positive ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                <span className="ml-1">{index.percent}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Market Overview</h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1D</button>
                  <button className="px-3 py-1 bg-gray-600 text-gray-300 rounded text-sm">1W</button>
                  <button className="px-3 py-1 bg-gray-600 text-gray-300 rounded text-sm">1M</button>
                  <button className="px-3 py-1 bg-gray-600 text-gray-300 rounded text-sm">1Y</button>
                </div>
              </div>
              
              <div className="h-80 bg-gray-700 rounded flex items-end justify-between p-4 relative">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 320">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d="M50 250 Q200 180 350 200 T650 120 L650 300 L50 300 Z" fill="url(#gradient)"/>
                  <path d="M50 250 Q200 180 350 200 T650 120" stroke="#3B82F6" strokeWidth="2" fill="none"/>
                  <circle cx="50" cy="250" r="3" fill="#3B82F6"/>
                  <circle cx="200" cy="180" r="3" fill="#3B82F6"/>
                  <circle cx="350" cy="200" r="3" fill="#3B82F6"/>
                  <circle cx="500" cy="160" r="3" fill="#3B82F6"/>
                  <circle cx="650" cy="120" r="3" fill="#3B82F6"/>
                </svg>
                <div className="absolute bottom-4 left-4 z-10">
                  <div className="text-2xl font-bold">4,567.23</div>
                  <div className="text-green-400 text-sm">+1.24% (+56.78)</div>
                </div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>9:30</span>
                <span>11:00</span>
                <span>12:30</span>
                <span>2:00</span>
                <span>4:00</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center">
                    <TrendingUp className="text-green-400 mr-2" size={18} />
                    Top Gainers
                  </h3>
                  <span className="text-xs text-green-400">NEW</span>
                </div>
                <div className="space-y-2">
                  {topMovers.slice(0, 6).map((stock, i) => (
                    <div key={i} className="flex justify-between items-center text-sm py-1">
                      <div>
                        <div className="font-medium">{stock.symbol}</div>
                        <div className="text-xs text-gray-400">{stock.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${stock.price}</div>
                        <div className="text-green-400 text-xs">+{stock.percent}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center">
                    <TrendingDown className="text-red-400 mr-2" size={18} />
                    Top Losers
                  </h3>
                  <span className="text-xs text-red-400">NEW</span>
                </div>
                <div className="space-y-2">
                  {losers.map((stock, i) => (
                    <div key={i} className="flex justify-between items-center text-sm py-1">
                      <div>
                        <div className="font-medium">{stock.symbol}</div>
                        <div className="text-xs text-gray-400">{stock.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${stock.price}</div>
                        <div className="text-red-400 text-xs">{stock.percent}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center">
                  <Newspaper className="text-blue-400 mr-2" size={18} />
                  Market News
                </h3>
                <button className="text-xs text-blue-400">View All</button>
              </div>
              <div className="space-y-3">
                {news.map((item, i) => (
                  <div key={i} className="border-l-2 border-blue-500 pl-3 py-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs text-gray-400">{item.time}</span>
                      <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">{item.category}</span>
                    </div>
                    <div className="text-sm font-medium hover:text-blue-400 cursor-pointer">{item.title}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-4">Account Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Value</span>
                  <span className="font-semibold">$125,847.23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Day's Change</span>
                  <span className="text-green-400 font-semibold">+$2,847.12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Cash Available</span>
                  <span className="font-semibold">$8,392.45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Buying Power</span>
                  <span className="font-semibold">$16,784.90</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 py-2 rounded font-medium">
                Place Order
              </button>
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
    totalValue: 125847.23,
    dayChange: 2847.12,
    dayChangePercent: 2.31,
    cashAvailable: 8392.45,
    investedAmount: 117454.78
  };

  const holdings = [
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 250, avgPrice: 178.50, currentPrice: 195.25, value: 48812.50, dayChange: 1187.50, allocation: 38.8 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 75, avgPrice: 365.20, currentPrice: 380.12, value: 28509.00, dayChange: 1119.00, allocation: 22.7 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 100, avgPrice: 135.80, currentPrice: 142.56, value: 14256.00, dayChange: 676.00, allocation: 11.3 },
    { symbol: 'TSLA', name: 'Tesla Inc.', shares: 50, avgPrice: 235.00, currentPrice: 248.73, value: 12436.50, dayChange: 686.50, allocation: 9.9 }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-full mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Portfolio</h1>
          <p className="text-gray-400 mt-1">Monitor your investments and track performance</p>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Total Portfolio Value</div>
            <div className="text-2xl font-bold text-white">${portfolioStats.totalValue.toLocaleString()}</div>
            <div className="text-sm text-green-400 mt-1">
              +${portfolioStats.dayChange.toLocaleString()} (+{portfolioStats.dayChangePercent}%)
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Invested Amount</div>
            <div className="text-xl font-bold">${portfolioStats.investedAmount.toLocaleString()}</div>
            <div className="text-sm text-gray-400 mt-1">93.3% of portfolio</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Cash Available</div>
            <div className="text-xl font-bold">${portfolioStats.cashAvailable.toLocaleString()}</div>
            <div className="text-sm text-gray-400 mt-1">6.7% of portfolio</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Day's Best Performer</div>
            <div className="text-xl font-bold text-green-400">AAPL</div>
            <div className="text-sm text-green-400 mt-1">+$1,187.50</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Total Return</div>
            <div className="text-xl font-bold text-green-400">+12.4%</div>
            <div className="text-sm text-gray-400 mt-1">Since inception</div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Holdings</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">All</button>
              <button className="px-3 py-1 bg-gray-600 text-gray-300 rounded text-sm">Stocks</button>
              <button className="px-3 py-1 bg-gray-600 text-gray-300 rounded text-sm">ETFs</button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="text-left py-3 px-2">Symbol</th>
                  <th className="text-left py-3 px-2">Shares</th>
                  <th className="text-right py-3 px-2">Avg Cost</th>
                  <th className="text-right py-3 px-2">Current Price</th>
                  <th className="text-right py-3 px-2">Market Value</th>
                  <th className="text-right py-3 px-2">Day Change</th>
                  <th className="text-right py-3 px-2">Allocation</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding, i) => (
                  <tr key={i} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="py-3 px-2">
                      <div>
                        <div className="font-semibold">{holding.symbol}</div>
                        <div className="text-xs text-gray-400">{holding.name}</div>
                      </div>
                    </td>
                    <td className="py-3 px-2">{holding.shares}</td>
                    <td className="py-3 px-2 text-right">${holding.avgPrice}</td>
                    <td className="py-3 px-2 text-right font-semibold">${holding.currentPrice}</td>
                    <td className="py-3 px-2 text-right font-semibold">${holding.value.toLocaleString()}</td>
                    <td className="py-3 px-2 text-right">
                      <span className="font-semibold text-green-400">
                        +${holding.dayChange.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">{holding.allocation}%</td>
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

// Admin Dashboard and other components
const AdminDashboard = () => (
  <div className="min-h-screen bg-gray-900 text-white p-6">
    <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <p className="text-gray-400">Manage users, payment methods, and system settings</p>
    </div>
  </div>
);

const Trading = () => (
  <div className="min-h-screen bg-gray-900 text-white p-6">
    <h1 className="text-2xl font-bold mb-4">Trading</h1>
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <p className="text-gray-400">Advanced trading interface will be here...</p>
    </div>
  </div>
);

const DemoTrading = () => (
  <div className="min-h-screen bg-gray-900 text-white p-6">
    <h1 className="text-2xl font-bold mb-4">Demo Trading</h1>
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <p className="text-gray-400">Demo trading platform will be here...</p>
    </div>
  </div>
);

const UserPayment = () => (
  <div className="min-h-screen bg-gray-900 text-white p-6">
    <h1 className="text-2xl font-bold mb-4">Payment Methods</h1>
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <p className="text-gray-400">Payment options will be here...</p>
    </div>
  </div>
);

const CurrencyConverter = () => (
  <div className="min-h-screen bg-gray-900 text-white p-6">
    <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <p className="text-gray-400">Currency conversion tools will be here...</p>
    </div>
  </div>
);

const Documents = () => (
  <div className="min-h-screen bg-gray-900 text-white p-6">
    <h1 className="text-2xl font-bold mb-4">Documents</h1>
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <p className="text-gray-400">Document management will be here...</p>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="min-h-screen bg-gray-900 text-white p-6">
    <h1 className="text-2xl font-bold mb-4">Settings</h1>
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <p className="text-gray-400">Account settings will be here...</p>
    </div>
  </div>
);

const LearningCenter = () => (
  <div className="min-h-screen bg-gray-900 text-white p-6">
    <h1 className="text-2xl font-bold mb-4">Learning Center</h1>
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

  const mainNavigationItems = [
    { id: 'dashboard', name: 'Market Dashboard', icon: BarChart3 },
    { id: 'portfolio', name: 'Portfolio', icon: Wallet },
    { id: 'trading', name: 'Trading', icon: TrendingUp },
    { id: 'demo-trading', name: 'Demo Trading', icon: PlayCircle },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'currency', name: 'Currency Converter', icon: DollarSign },
    { id: 'documents', name: 'Documents', icon: FolderOpen },
    { id: 'admin', name: 'Admin', icon: Users }
  ];

  const bottomNavigationItems = [
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'learning', name: 'Learning Center', icon: GraduationCap }
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
  };

  const renderContent = () => {
    if (!isLoggedIn) {
      return <LoginPage onLogin={handleLogin} />;
    }

    switch(activeTab) {
      case 'dashboard': return <MarketDashboard />;
      case 'portfolio': return <Portfolio />;
      case 'trading': return <Trading />;
      case 'demo-trading': return <DemoTrading />;
      case 'payment': return <UserPayment />;
      case 'currency': return <CurrencyConverter />;
      case 'documents': return <Documents />;
      case 'admin': return userRole === 'admin' ? <AdminDashboard /> : <div className="p-6 text-white">Access Denied</div>;
      case 'settings': return <SettingsPage />;
      case 'learning': return <LearningCenter />;
      default: return <MarketDashboard />;
    }
  };

  if (!isLoggedIn) {
    return renderContent();
  }

  return (
    <div className="flex h-screen bg-gray-950">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-md border border-gray-700"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">E</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Eurizon Investment Portal</h1>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {mainNavigationItems.map((item) => {
                if ((item.id === 'payment' && userRole === 'admin') || 
                    (item.id === 'admin' && userRole !== 'admin')) {
                  return null;
                }

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

            <div className="mt-8 pt-4 border-t border-gray-800">
              <ul className="space-y-1">
                {bottomNavigationItems.map((item) => {
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
            </div>

            <div className="mt-4">
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

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 lg:ml-0 bg-gray-950 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default EurizonApp;