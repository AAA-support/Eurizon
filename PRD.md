# Product Requirements Document (PRD)
## Eurizon Investment Portal

**Version:** 1.0  
**Date:** 2025-01-21  
**Status:** Draft  
**Product Owner:** Eurizon Investment Management

---

## 1. Executive Summary

### 1.1 Product Vision
The Eurizon Investment Portal is a comprehensive, secure, and user-friendly web application designed to provide clients and administrators with real-time access to investment portfolios, market data, trading capabilities, document management, and analytical tools. The platform serves both accredited investors and demo users, offering a seamless experience from authentication to portfolio management.

### 1.2 Product Goals
- **Client Empowerment:** Provide clients with comprehensive tools to monitor and manage their investments
- **Administrative Control:** Enable administrators to manage users, documents, payments, and analytics
- **Educational Access:** Offer demo trading and learning resources for new investors
- **Security First:** Implement robust authentication and data protection
- **User Experience:** Deliver an intuitive, modern interface with professional design

### 1.3 Target Users
1. **Investment Clients** - Primary users who manage portfolios and access documents
2. **Administrators** - Staff managing users, documents, payments, and analytics
3. **Demo Users** - Prospective clients practicing with virtual trading
4. **Temporary Users** - Limited access users for viewing purposes

---

## 2. User Personas & Use Cases

### 2.1 Primary User Personas

#### Client User
- **Goals:** Monitor portfolio performance, access documents, view market data, track investments
- **Needs:** Easy navigation, real-time data, document downloads, portfolio insights
- **Pain Points:** Complex interfaces, slow load times, missing information

#### Administrator
- **Goals:** Manage user accounts, upload documents, process payments, view analytics
- **Needs:** Efficient user management, bulk operations, comprehensive reporting
- **Pain Points:** Manual processes, lack of automation, scattered data

#### Demo User
- **Goals:** Practice trading, learn investment strategies, explore platform
- **Needs:** Virtual trading environment, educational resources, risk-free practice
- **Pain Points:** Limited functionality, unclear guidance, lack of feedback

### 2.2 Key Use Cases

**UC1: User Authentication**
- User enters credentials on login page
- System validates credentials (hardcoded or Supabase)
- User redirected to appropriate dashboard based on role

**UC2: Portfolio Monitoring**
- Client views portfolio dashboard
- Real-time market data and performance metrics displayed
- Interactive charts and graphs show trends

**UC3: Document Management**
- Client searches and filters documents
- Downloads or previews PDF documents
- Administrator uploads new documents

**UC4: Demo Trading**
- Demo user practices trading with virtual funds
- Real-time market prices displayed
- Trade execution and portfolio tracking

**UC5: Administrative Management**
- Admin manages user accounts (CRUD operations)
- Admin uploads documents and manages categories
- Admin processes payments and tracks transactions
- Admin views analytics and reports

---

## 3. Product Features & Functionality

### 3.1 Authentication & Authorization

#### Login Page
- **Design:** Dark theme with rounded corners, professional layout
- **Elements:**
  - Eurizon logo at top (centered)
  - "Investment Portal" title
  - "Professional Investment Management" subtitle
  - "Sign In" section with form
  - "User Name" input field (label: "User Name")
  - "Password" input field with eye icon for show/hide toggle
  - "Sign In" button (blue, prominent)
  - Copyright footer
- **Validation:** Client-side validation for required fields
- **Error Handling:** Display error messages for invalid credentials
- **Authentication Methods:**
  - Hardcoded credentials (for development/demo)
  - Supabase authentication (for production)

#### User Roles & Permissions
- **Administrator:** Full access to all features
- **Client:** Portfolio, documents, market data, trading (if accredited)
- **Demo User:** Demo trading, limited market data
- **Temporary User:** View-only access

### 3.2 Dashboard & Navigation

#### Main Layout Structure
```
┌─────────────────────────────────────────────────┐
│ Header (Logo + Title + User Info + Actions)     │
├──────────────┬──────────────────────────────────┤
│              │                                    │
│  Sidebar     │  Main Content Area                 │
│  (Navigation)│  (Dynamic based on page)          │
│              │                                    │
│              │                                    │
└──────────────┴──────────────────────────────────┘
```

#### Sidebar Navigation
- **Market Dashboard** - Main dashboard with market overview
- **Portfolio** - Portfolio management and performance
- **Trading** - Live trading (accredited investors only)
- **Demo Trading** - Virtual trading environment
- **Watchlist** - Track favorite assets
- **Analysis** - Technical and fundamental analysis
- **Market News** - Financial news feed
- **Alerts** - Price alerts and notifications
- **Reports** - Performance reports and statements
- **Currency Converter** - Real-time currency conversion
- **Documents** - Document center
- **Settings** - User preferences and account settings
- **Admin** (Admin only) - Administrative panel
- **Logout** - Session termination

### 3.3 Market Dashboard Page

#### Features
- **Market Overview Cards:**
  - Demo Balance / Account Balance
  - Market Average performance
  - Account Status
  - Total Volume
- **Market Filter Tabs:**
  - All Markets
  - Stocks
  - Cryptocurrencies
  - Commodities
  - Currencies
- **Trading Interface:**
  - Asset selector dropdown
  - Live price chart (30-day trend)
  - Current price display
  - Holdings information
  - Quick trading controls (Buy/Sell)
  - Quantity input
  - Total cost calculator
- **Portfolio Widget:**
  - Cash balance
  - Invested amount
  - Total portfolio value
  - Current holdings list
- **Market News Feed:**
  - Real-time market news
  - Timestamped entries
- **Market Data Table:**
  - Symbol, Name, Price, Change, Volume
  - Filter by category
  - Sortable columns
  - Trade action buttons

#### Design Requirements
- Dark theme with blue accents
- Responsive grid layout
- Real-time data updates
- Interactive charts
- Smooth animations

### 3.4 Portfolio Page

#### Features
- **Portfolio Summary:**
  - Total portfolio value
  - Total gain/loss (absolute and percentage)
  - Asset allocation pie chart
  - Performance timeline
- **Holdings Table:**
  - Asset symbol and name
  - Quantity owned
  - Average purchase price
  - Current price
  - Market value
  - Unrealized P&L
  - Percentage allocation
- **Performance Metrics:**
  - 1D, 1W, 1M, 3M, 6M, 1Y performance
  - Best and worst performers
  - Sector breakdown
- **Transaction History:**
  - Buy/sell transactions
  - Date, quantity, price, total
  - Filter by date range and asset
- **Export Options:**
  - Download portfolio report (PDF)
  - Export transaction history (CSV)

#### Design Requirements
- Card-based layout
- Color-coded gains/losses (green/red)
- Interactive charts
- Export buttons

### 3.5 Trading Page

#### Features (Accredited Investors Only)
- **Trade Execution Panel:**
  - Order type selection (Market, Limit, Stop Loss, Stop Limit)
  - Asset search and selection
  - Quantity input
  - Price input (for limit orders)
  - Buy/Sell buttons
  - Order preview and confirmation
- **Live Market Data:**
  - Real-time price quotes
  - Bid/Ask spread
  - Volume information
  - 24h change percentage
- **Order Management:**
  - Pending orders list
  - Order cancellation
  - Order history
- **Restrictions:**
  - Only visible to accredited investors
  - Warning message for non-accredited users

#### Design Requirements
- Prominent warning for restricted access
- Clear order form layout
- Real-time price updates
- Confirmation dialogs

### 3.6 Demo Trading Page

#### Features
- **Demo Account Stats:**
  - Starting balance: $100
  - Current balance
  - Portfolio value
  - Total P&L (unrealized)
  - Total value (balance + portfolio)
- **Trading Interface:**
  - Order form (Market, Limit, Stop Loss, Stop Limit)
  - Stock symbol input
  - Shares quantity
  - Price per share
  - Execute buy order button
- **Current Positions:**
  - List of holdings
  - Symbol, shares, average price
  - Current value
  - Unrealized P&L
  - Empty state message
- **Live Market Data Widget:**
  - Popular stocks (AAPL, MSFT, GOOGL, TSLA, AMZN)
  - Current price
  - Change percentage
  - Quick trade button
- **Interactive Charts:**
  - Link to external charting platform
  - Price history visualization

#### Design Requirements
- Clear demo account indicators
- Virtual money warnings
- Educational tooltips
- Practice mode badges

### 3.7 Watchlist Page

#### Features
- **Watchlist Management:**
  - Add assets to watchlist
  - Remove assets
  - Organize by categories
- **Asset Cards:**
  - Symbol and company name
  - Current price
  - 24h change
  - Price alerts (set high/low thresholds)
  - Quick actions (view details, trade, remove)
- **Market Overview:**
  - Top gainers
  - Top losers
  - Most active
- **Search & Filter:**
  - Search by symbol or name
  - Filter by asset type
  - Sort options

#### Design Requirements
- Grid layout for asset cards
- Color-coded price changes
- Drag-and-drop organization (future)
- Alert indicators

### 3.8 Analysis Page

#### Features
- **Technical Analysis:**
  - Multiple chart types (Line, Candlestick, OHLC)
  - Technical indicators (MA, RSI, MACD, Bollinger Bands)
  - Timeframe selection (1D, 1W, 1M, 3M, 1Y)
  - Drawing tools
- **Fundamental Analysis:**
  - Company overview
  - Financial metrics (P/E, P/B, EPS, etc.)
  - Revenue trends
  - Earnings history
  - Analyst recommendations
- **Market Comparison:**
  - Compare multiple assets
  - Sector performance
  - Market indices
- **Reports:**
  - Generate analysis reports
  - Export PDF/Excel

#### Design Requirements
- Advanced charting library integration
- Professional analysis tools
- Exportable reports
- Comparison views

### 3.9 Market News Page

#### Features
- **News Feed:**
  - Latest financial news
  - Market updates
  - Company announcements
  - Economic indicators
- **News Categories:**
  - Market News
  - Company News
  - Economic News
  - Analysis & Opinions
- **News Article View:**
  - Headline
  - Publication date and source
  - Article content
  - Related articles
  - Share functionality
- **Filters:**
  - By date range
  - By category
  - By source
  - Search functionality

#### Design Requirements
- News card layout
- Read more/less functionality
- Source attribution
- Share buttons

### 3.10 Alerts Page

#### Features
- **Alert Management:**
  - Create price alerts (above/below threshold)
  - Set alert notifications (email, in-app)
  - Edit/delete alerts
- **Alert List:**
  - Active alerts
  - Triggered alerts
  - Alert history
- **Alert Types:**
  - Price alerts
  - Volume alerts
  - News alerts
  - Portfolio alerts
- **Notification Settings:**
  - Email preferences
  - In-app notification settings
  - Alert frequency

#### Design Requirements
- Alert status indicators
- Toggle switches for active/inactive
- Notification badges
- Settings panel

### 3.11 Reports Page

#### Features
- **Report Types:**
  - Portfolio Performance Report
  - Transaction History Report
  - Tax Documents
  - Monthly Statements
  - Annual Summary
- **Report Generation:**
  - Date range selection
  - Report customization
  - Generate PDF/Excel
  - Email delivery option
- **Report Library:**
  - Historical reports
  - Downloadable documents
  - Report categories

#### Design Requirements
- Report card layout
- Date picker for ranges
- Download buttons
- Report preview

### 3.12 Currency Converter Page

#### Features
- **Conversion Tool:**
  - Amount input
  - From currency selector
  - To currency selector
  - Swap currencies button
  - Converted amount display
  - Exchange rate display
- **Live Exchange Rates:**
  - Major currency pairs
  - Current rates
  - 24h change percentage
  - Refresh button
- **Exchange Rate Matrix:**
  - Cross-currency rates table
  - All major currencies
  - Real-time updates

#### Design Requirements
- Clean conversion interface
- Rate matrix table
- Color-coded changes
- Refresh indicators

### 3.13 Documents Page

#### Features
- **Document Library:**
  - All documents grid/list view
  - Document cards with preview
  - Category filtering
  - Search functionality
- **Document Categories:**
  - Policy documents
  - Reports
  - Guides
  - Legal documents
- **Document Actions:**
  - Preview (PDF viewer)
  - Download
  - Share link
- **Document Information:**
  - Title and description
  - Category badge
  - File type and size
  - Upload date
  - Download count
  - Tags
- **Statistics:**
  - Total documents
  - New this month
  - Categories count
  - Total downloads

#### Design Requirements
- Card-based grid layout
- Category badges
- Search bar
- Filter buttons
- Statistics cards

### 3.14 Settings Page

#### Features
- **Account Settings:**
  - Profile information
  - Change password
  - Email preferences
  - Two-factor authentication
- **Notification Settings:**
  - Email notifications
  - In-app notifications
  - Alert preferences
- **Display Settings:**
  - Theme selection (Dark/Light)
  - Language selection
  - Date format
  - Currency display
- **Privacy & Security:**
  - Privacy settings
  - Security logs
  - Active sessions
  - API keys management

#### Design Requirements
- Settings sections
- Toggle switches
- Input forms
- Save buttons

### 3.15 Admin Panel (Administrator Only)

#### Features
- **User Management:**
  - User list table
  - Add new user
  - Edit user details
  - Delete user
  - User status (Active/Inactive)
  - Role assignment
  - Search and filter
- **Document Management:**
  - Upload documents
  - Edit document details
  - Delete documents
  - Category management
  - Bulk operations
- **Payment Management:**
  - Payment records
  - Process payments
  - Payment history
  - Invoice generation
- **Analytics Dashboard:**
  - User statistics
  - Document statistics
  - Payment statistics
  - Activity logs
  - Charts and graphs
- **Portfolio Management:**
  - View all client portfolios
  - Portfolio analytics
  - Performance metrics

#### Design Requirements
- Tabbed interface
- Data tables with CRUD operations
- Modal dialogs for forms
- Statistics dashboard
- Export functionality

---

## 4. UI/UX Design Requirements

### 4.1 Design System

#### Color Palette
- **Primary Colors:**
  - Dark Navy: `#0F172A`
  - Medium Blue: `#1E293B`
  - Slate 800: `#1E293B`
  - Slate 700: `#334155`
  - Slate 600: `#475569`
- **Accent Colors:**
  - Blue 600: `#2563EB`
  - Blue 500: `#3B82F6`
  - Green 400: `#4ADE80` (gains)
  - Red 400: `#F87171` (losses)
  - Orange 400: `#FB923C`
  - Purple 400: `#C084FC`
- **Text Colors:**
  - White: `#F8FAFC`
  - Gray: `#94A3B8`
  - Dark Gray: `#CBD5E1`

#### Typography
- **Font Family:** Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Headings:**
  - H1: 1.875rem (30px), Bold
  - H2: 1.5rem (24px), Bold
  - H3: 1.25rem (20px), Semibold
- **Body:** 0.9rem (14.4px), Regular
- **Small:** 0.875rem (14px), Regular

#### Spacing
- Base unit: 0.25rem (4px)
- Common spacing: 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem, 3rem

#### Components
- **Buttons:**
  - Primary: Blue background, white text, rounded corners
  - Secondary: Gray background, white text
  - Danger: Red background, white text
  - Outline: Transparent with border
- **Input Fields:**
  - Dark background (#1e293b)
  - Rounded corners (6px)
  - Border on focus
  - Placeholder text in gray
- **Cards:**
  - Dark background with backdrop blur
  - Rounded corners (8-12px)
  - Border with subtle shadow
  - Padding: 1.5rem

### 4.2 Login Page Design Specifications

#### Layout
```
┌─────────────────────────────────────────┐
│                                         │
│         [Eurizon Logo]                  │
│                                         │
│      Investment Portal                 │
│  Professional Investment Management     │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         Sign In                  │   │
│  │  Enter your credentials...       │   │
│  │                                   │   │
│  │  User Name                       │   │
│  │  [________________________]       │   │
│  │                                   │   │
│  │  Password                         │   │
│  │  [________________________] 👁    │   │
│  │                                   │   │
│  │  [      Sign In Button      ]     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  © 2025 Eurizon Investment...           │
└─────────────────────────────────────────┘
```

#### Elements
- **Logo:** Centered, 80px height, auto width
- **Title:** Large, bold, white, centered
- **Subtitle:** Smaller, gray, centered
- **Form Card:** Dark gray (#334155), rounded (12px), padding (3rem)
- **Input Fields:** Dark background (#1e293b), rounded (6px), border on focus
- **Password Field:** Eye icon on right side, clickable to toggle visibility
- **Button:** Full width, blue (#3b82f6), rounded (6px), white text
- **Footer:** Small, gray, centered

### 4.3 Responsive Design

#### Breakpoints
- **Mobile:** < 768px
  - Single column layout
  - Collapsible sidebar
  - Stacked cards
  - Full-width buttons
- **Tablet:** 768px - 1024px
  - Two-column grids
  - Sidebar visible
  - Adjusted spacing
- **Desktop:** > 1024px
  - Full layout
  - Multi-column grids
  - Optimal spacing

### 4.4 Accessibility

#### Requirements
- **WCAG 2.1 AA Compliance:**
  - Color contrast ratios minimum 4.5:1
  - Keyboard navigation support
  - Screen reader compatibility
  - Focus indicators
  - Alt text for images
  - ARIA labels where needed

#### Interactive Elements
- Focus states visible
- Hover states for buttons and links
- Loading states for async operations
- Error states clearly displayed
- Success feedback for actions

### 4.5 Animations & Transitions

#### Guidelines
- **Transitions:** 0.2s - 0.3s duration
- **Easing:** Ease-in-out for most transitions
- **Hover Effects:** Subtle scale or color changes
- **Loading States:** Spinner animations
- **Page Transitions:** Smooth fade/slide

---

## 5. Technical Requirements

### 5.1 Technology Stack

#### Frontend
- **Framework:** React 19.1.1
- **Build Tool:** Create React App (react-scripts)
- **Routing:** React Router DOM 7.9.1
- **Styling:** 
  - Tailwind CSS 4.1.13
  - Custom CSS
  - Inline styles (to be refactored)
- **Charts:** 
  - Chart.js 4.5.0
  - React Chart.js 2 5.3.0
  - Recharts 3.2.1
- **Icons:** Lucide React 0.544.0
- **Backend Integration:** Supabase JS 2.57.4

#### Backend
- **Platform:** Supabase
- **Edge Functions:** Deno runtime
- **Database:** PostgreSQL (Supabase)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage

### 5.2 Architecture

#### Component Structure
```
src/
├── App.js (Main app component)
├── index.js (Entry point)
├── index.css (Global styles)
├── components/
│   ├── Login.js
│   ├── Dashboard.js
│   ├── AdminDashboard.js
│   ├── AdminPanel.jsx
│   ├── ClientDocuments.jsx
│   ├── CurrencyConverter.js
│   ├── CurrencyConverter.jsx
│   └── DemoTrading.js
├── lib/
│   └── supabase.js (Supabase client)
└── public/
    ├── eurizon-logo.png
    └── logo.png
```

#### State Management
- **Current:** React useState hooks
- **Recommendation:** Consider Context API or Redux for complex state
- **Local State:** Component-level state for UI
- **Global State:** User session, authentication

### 5.3 Data Flow

#### Authentication Flow
```
User Input → Validation → Authentication (Supabase/Hardcoded) 
→ Session Creation → Redirect to Dashboard
```

#### Data Fetching Flow
```
Component Mount → API Call (Supabase Functions) 
→ Data Processing → State Update → UI Render
```

#### Error Handling
- Try-catch blocks for async operations
- Error messages displayed to users
- Console logging for debugging
- Fallback UI for errors

### 5.4 API Integration

#### Supabase Functions Required
- `currency-convert` - Currency conversion
- `user-portfolio` - Portfolio data retrieval
- `demo-trade` - Demo trading execution
- `document-upload` - Document management
- `user-management` - Admin user operations

#### API Endpoints Structure
```
/api/functions/
├── currency-convert/
├── user-portfolio/
├── demo/trade/
├── documents/
└── admin/
```

### 5.5 Security Requirements

#### Authentication
- Secure password handling
- Session management
- Token refresh
- Logout functionality

#### Data Protection
- HTTPS only
- Input validation
- SQL injection prevention (Supabase handles)
- XSS protection
- CSRF tokens

#### Authorization
- Role-based access control
- Permission checks
- Route protection
- API endpoint security

### 5.6 Performance Requirements

#### Targets
- **Initial Load:** < 3 seconds
- **Page Transitions:** < 500ms
- **API Responses:** < 1 second
- **Image Loading:** Lazy loading for non-critical images
- **Code Splitting:** Route-based splitting

#### Optimization
- Code splitting
- Lazy loading components
- Image optimization
- Memoization for expensive operations
- Debouncing for search/filter

---

## 6. Workflow & User Journeys

### 6.1 New User Onboarding

```
1. User visits portal
2. Views login page
3. Enters credentials (or creates account)
4. Authenticated successfully
5. Redirected to dashboard
6. Sees welcome message/tutorial (optional)
7. Explores features
```

### 6.2 Daily Client Usage

```
1. Login
2. View dashboard with market overview
3. Check portfolio performance
4. Review documents
5. Monitor watchlist
6. Check market news
7. Set alerts (if needed)
8. Logout
```

### 6.3 Trading Workflow

```
1. Navigate to Trading/Demo Trading page
2. Select asset from market data
3. View current price and chart
4. Enter order details (quantity, price)
5. Review order summary
6. Confirm trade execution
7. View updated portfolio
8. Check trade confirmation
```

### 6.4 Document Management Workflow

#### Client
```
1. Navigate to Documents page
2. Search/filter documents
3. Preview or download document
4. View document details
```

#### Administrator
```
1. Navigate to Admin Panel
2. Go to Documents tab
3. Upload new document
4. Fill in document details
5. Assign category
6. Save document
7. Document appears in client library
```

### 6.5 Administrative Workflow

```
1. Login as administrator
2. Access Admin Panel
3. Manage users (add/edit/delete)
4. Upload documents
5. Process payments
6. View analytics
7. Generate reports
```

---

## 7. Integration Requirements

### 7.1 Supabase Integration

#### Authentication
- User sign-up/sign-in
- Password reset
- Session management
- Role-based access

#### Database
- User profiles
- Portfolio data
- Transaction history
- Document metadata
- User preferences

#### Storage
- Document files (PDF)
- User avatars
- Reports

#### Edge Functions
- Currency conversion API
- Portfolio calculations
- Trade execution
- Document processing

### 7.2 External APIs (Future)

#### Market Data
- Real-time stock prices
- Historical data
- Market news feed
- Currency exchange rates

#### Charting
- Interactive chart library
- Technical indicators
- Drawing tools

---

## 8. Success Metrics & KPIs

### 8.1 User Engagement
- Daily active users (DAU)
- Monthly active users (MAU)
- Session duration
- Pages per session
- Feature adoption rate

### 8.2 Performance Metrics
- Page load time
- API response time
- Error rate
- Uptime percentage

### 8.3 Business Metrics
- User registration rate
- Document download count
- Trading activity (demo)
- User retention rate

### 8.4 User Satisfaction
- User feedback scores
- Support ticket volume
- Feature request frequency
- Bug report rate

---

## 9. Future Enhancements

### 9.1 Phase 2 Features
- Mobile app (iOS/Android)
- Advanced analytics dashboard
- AI-powered investment recommendations
- Social trading features
- Multi-language support

### 9.2 Phase 3 Features
- Real-time chat support
- Video tutorials
- Advanced reporting tools
- API access for third-party integrations
- White-label solutions

---

## 10. Implementation Roadmap

### Phase 1: Core Features (Current)
- ✅ Login page
- ✅ Dashboard (basic)
- ✅ Market data display
- ✅ Demo trading
- ⏳ Documents page
- ⏳ Portfolio page
- ⏳ Currency converter

### Phase 2: Additional Pages
- Portfolio management
- Watchlist
- Analysis tools
- Market news
- Alerts system
- Reports generation

### Phase 3: Admin Features
- User management
- Document management
- Payment processing
- Analytics dashboard

### Phase 4: Enhancements
- Real-time data updates
- Advanced charting
- Mobile optimization
- Performance optimization

---

## 11. Appendix

### 11.1 Glossary
- **Portfolio:** Collection of investment holdings
- **P&L:** Profit and Loss
- **API:** Application Programming Interface
- **CRUD:** Create, Read, Update, Delete
- **UI/UX:** User Interface/User Experience

### 11.2 References
- React Documentation
- Supabase Documentation
- Tailwind CSS Documentation
- Chart.js Documentation

---

## Document Approval

**Prepared by:** AI Assistant  
**Reviewed by:** [Pending]  
**Approved by:** [Pending]  
**Last Updated:** 2025-01-21

---

**End of PRD**

