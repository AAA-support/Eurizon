# 🏦 Eurizon Investment Portal

A modern, full-featured investment management platform built with React, featuring real-time portfolio tracking, demo trading, currency conversion, and comprehensive admin controls.

![React](https://img.shields.io/badge/React-19.1.1-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.7-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🔐 Authentication System
- Secure login with email validation
- Role-based access control (Admin/User)
- Persistent sessions with localStorage
- Password strength validation

### 📊 Market Dashboard
- Real-time market data display
- Portfolio performance metrics
- Stock price tracking
- Market news feed

### 💼 Portfolio Management
- Add/remove stocks with validation
- Automatic profit/loss calculation
- Total portfolio value tracking
- Real-time position updates

### 💰 Demo Trading
- $100,000 virtual starting balance
- Buy/sell functionality with authentication
- Balance validation
- Trade history tracking
- Real-time market prices

### 💱 Currency Converter
- Support for 10 major currencies (USD, EUR, GBP, JPY, CHF, CAD, AUD, CNY, INR, SGD)
- Real-time conversion rates
- Bidirectional currency swap
- Live exchange rate display

### 👥 Admin Dashboard
- User CRUD operations
- Search and filter functionality
- Role management
- System statistics
- Active session tracking

### 🛡️ Security & Validation
- Comprehensive input validation on all forms
- XSS prevention
- Protected routes
- Error boundaries for graceful failure handling

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/eurizon-portal.git

# Navigate to project directory
cd eurizon-portal

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🎮 Demo Access

### Try the Application:
- Click **"Admin Demo"** for admin access
- Click **"User Demo"** for standard user access
- Or enter any email/password (minimum 6 characters)

### Test Features:
1. ✅ Login with demo credentials
2. ✅ Add stocks to your portfolio
3. ✅ Execute demo trades
4. ✅ Convert currencies
5. ✅ Explore admin dashboard (admin role)

## 📁 Project Structure

```
eurizon-portal/
├── public/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AppRouter.jsx   # Application routing
│   │   ├── ErrorBoundary.jsx  # Error handling
│   │   └── Layout.jsx      # Main layout with sidebar
│   │
│   ├── context/            # State management
│   │   └── AppContext.jsx  # Global application state
│   │
│   ├── pages/              # Page components
│   │   ├── LoginPage.jsx
│   │   ├── MarketDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── Portfolio.jsx
│   │   ├── DemoTrading.jsx
│   │   ├── CurrencyConverter.jsx
│   │   └── ...
│   │
│   ├── styles/             # CSS files
│   │   └── main.css        # Main stylesheet
│   │
│   ├── App.jsx             # Root component
│   └── main.jsx            # Application entry point
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Technologies

- **React 19.1.1** - UI library
- **Vite 7.1.7** - Build tool and dev server
- **Context API** - State management
- **Lucide React** - Icon library
- **CSS3** - Styling

## 🎨 Key Architecture Decisions

### State Management - Context API
Centralized state management using React Context API provides:
- Global access to authentication state
- Portfolio and trading data management
- Notification system
- Persistent user sessions

### Component Architecture
Modular component structure with:
- Separation of concerns
- Reusable components
- Single responsibility principle
- Easy testing and maintenance

### Error Handling
Comprehensive error boundaries that:
- Prevent complete application crashes
- Display user-friendly error messages
- Log errors for debugging
- Provide recovery options

### Styling System
External CSS with:
- Reusable utility classes
- Consistent design system
- Responsive grid layout
- Mobile-first approach

## 📖 API Usage

### Using the Context API

```javascript
import { useApp } from './context/AppContext';

function MyComponent() {
  const { 
    user,              // Current user object
    isLoggedIn,        // Authentication status
    userRole,          // User role (admin/user)
    portfolio,         // User's stock portfolio
    demoBalance,       // Demo trading balance
    addNotification,   // Show notification
    handleLogin,       // Login function
    handleLogout       // Logout function
  } = useApp();
  
  // Use the state and functions
  addNotification('success', 'Operation completed!');
}
```

### Notification System

```javascript
// Show different types of notifications
addNotification('success', 'Stock added successfully!');
addNotification('error', 'Invalid input');
addNotification('info', 'Logged out');
addNotification('warning', 'Low balance');
```

## 🧪 Input Validation

All forms include comprehensive validation:

| Form | Validations |
|------|-------------|
| **Login** | Email format (regex), password length (6+), required fields |
| **Portfolio** | Stock symbol (non-empty), quantity (positive number), price (positive number) |
| **Demo Trading** | User authentication, balance sufficiency, valid amounts |
| **Currency Converter** | Numeric inputs, positive amounts, valid currency selection |
| **Admin** | Email format, user data validation, role validation |

## 📱 Responsive Design

- ✅ Desktop optimized (1920px+)
- ✅ Tablet friendly (768px - 1024px)
- ✅ Mobile responsive (320px+)
- ✅ Touch-friendly navigation
- ✅ Collapsible sidebar for mobile

## 🔐 Security Features

- Input sanitization on all forms
- XSS prevention
- Protected admin routes
- Email format validation
- Numeric value validation
- Authentication checks
- Secure localStorage usage

## 🌟 Features in Detail

### Portfolio Management
- Track multiple stock positions
- Real-time P/L calculations
- Add new positions with full validation
- Remove positions
- View total portfolio value

### Demo Trading
- Virtual $100,000 starting balance
- Realistic buy/sell operations
- Authentication required
- Balance validation prevents overdrafts
- Trade history tracking

### Currency Converter
- Real-time exchange rate calculations
- 10 major world currencies
- Swap currencies instantly
- Live rate updates
- Clean, intuitive interface

### Admin Dashboard
- Manage all users
- Search and filter capabilities
- Add/edit/delete users
- Role assignment
- View system statistics

## 🚧 Roadmap

Future enhancements planned:

- [ ] Real-time stock market data integration
- [ ] WebSocket for live updates
- [ ] Advanced charting with Chart.js
- [ ] Transaction history export (CSV/PDF)
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Dark/light theme toggle
- [ ] Multi-language support
- [ ] Advanced portfolio analytics
- [ ] API integration for live exchange rates

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Built with ❤️ for professional investment management

## 🙏 Acknowledgments

- React team for the amazing framework
- Lucide for beautiful icons
- Vite team for the lightning-fast build tool

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review the code comments

---

**⭐ If you find this project helpful, please consider giving it a star!**

Last Updated: November 4, 2025
