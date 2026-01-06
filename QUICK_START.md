# 🚀 Quick Start Guide - Eurizon Investment Portal

## What You Need to Do (5 Steps)

### Step 1: Set Up Supabase (10 minutes)

1. **Create Supabase Account**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up (free)
   - Create new project called "eurizon-investment"
   - **Save your database password!**

2. **Run the Database Schema**
   - In Supabase dashboard, go to **SQL Editor**
   - Click **New Query**
   - Copy ALL contents from `database/schema_postgresql.sql`
   - Paste and click **RUN**
   - Wait for "Success" message

3. **Run the RLS Policies & Setup**
   - Still in SQL Editor, click **New Query**
   - Copy ALL contents from `database/supabase_complete_setup.sql`
   - Paste and click **RUN**
   - You should see "Database setup complete!" with stock and news counts

4. **Get Your API Keys**
   - Go to **Settings** → **API**
   - Copy these two values:
     - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
     - **anon public key**: `eyJhbGc...` (long string)

5. **Add to .env File**
   ```bash
   # Create .env file in project root
   cp .env.example .env

   # Edit .env and add your keys:
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

### Step 2: Install Dependencies (2 minutes)

```bash
npm install
```

This installs:
- ✅ Supabase client (@supabase/supabase-js)
- ✅ **Chart libraries** (lightweight-charts, recharts)
- ✅ React Router (react-router-dom)
- ✅ Date utilities (date-fns)
- ✅ Icons (lucide-react)

---

### Step 3: Run the App (1 minute)

```bash
npm run dev
```

App will open at: **http://localhost:5173**

---

### Step 4: Create Your First User

1. Click **Sign Up**
2. Enter:
   - Email: `test@example.com`
   - Password: `password123` (minimum 6 characters)
3. Click **Create Account**
4. You're in!

---

### Step 5: Test Everything

**Demo Mode:**
- ✅ All new users start with $100,000 demo cash
- ✅ Practice trading without real money
- ✅ Switch to live mode when ready

**Features to Test:**
1. **Dashboard** - View portfolio summary
2. **Markets** - Browse stocks, crypto, forex, commodities
3. **Trading** - Buy/sell in demo mode
4. **Portfolio** - See your holdings
5. **Charts** - Interactive Yahoo Finance-style charts
6. **Go Offline** - Disable internet, app still works!
7. **Go Online** - Data syncs automatically

---

## 📊 What You Have Now

### Database Tables (Supabase)
- ✅ **users** - User accounts
- ✅ **stocks** - 40+ stocks, crypto, forex, commodities
- ✅ **portfolios** - User holdings (demo + live)
- ✅ **transactions** - Trading history
- ✅ **news** - Market news feed
- ✅ **watchlists** - Custom stock lists
- ✅ **price_history** - For candlestick charts
- ✅ **alerts** - Price alerts
- ✅ **audit_logs** - Activity tracking

### Pages Implemented
- ✅ Login / Sign Up
- ✅ Dashboard (overview)
- ✅ Markets (watchlist)
- ✅ Portfolio
- ✅ Trading (demo mode)
- ✅ Settings
- ✅ Admin panel

### Interactive Charts (Like Yahoo Finance)
- ✅ **Candlestick charts** (lightweight-charts)
- ✅ **Line charts** (price over time)
- ✅ **Bar charts** (volume)
- ✅ **Pie charts** (portfolio allocation)
- ✅ **Performance charts** (profit/loss)

### Demo Mode Features
- ✅ $100,000 starting balance
- ✅ Separate demo portfolio
- ✅ Practice trading
- ✅ Switch to live mode
- ✅ No real money risk

---

## 🎯 Navigation Structure

### Public (Not Logged In)
```
/ (Login page)
/forgot-password
/reset-password
/terms-of-service
/privacy-policy
```

### User Dashboard (Client Role)
```
/dashboard
  /overview - Portfolio summary + charts
  /portfolio - Holdings, allocation, history
  /markets
    /watchlist - Saved stocks
    /ticker/:symbol - Stock details + chart
    /sectors - Sector performance
  /trading - Buy/sell (demo mode)
  /documents - View/sign documents
  /payments - Transaction history
  /learning-center - Investment education
  /notifications
  /profile
  /support
```

### Admin Dashboard
```
/admin
  /overview - Platform stats
  /users - Manage users
  /markets - Manage tickers
  /documents - Upload/manage docs
  /payments - View all transactions
  /settings
  /audit-logs
```

---

## 🛠️ Tech Stack

**Frontend:**
- React 19 + Vite
- React Router 6 (navigation)
- Lightweight Charts (advanced charts like TradingView)
- Recharts (simple charts)
- Lucide Icons

**Backend:**
- Supabase (PostgreSQL database)
- Supabase Auth (user authentication)
- Row Level Security (data protection)

**Data Layer:**
- IndexedDB (local caching)
- Supabase (cloud sync)
- Automatic bidirectional sync

---

## 📈 Chart Libraries Explained

### 1. **Lightweight Charts** (Yahoo Finance/TradingView style)
```javascript
import { createChart } from 'lightweight-charts';

// Candlestick charts
// Line charts with volume
// Real-time updates
// Professional trading charts
```

**Use for:**
- Stock price charts
- Candlestick charts
- Volume bars
- Technical indicators

### 2. **Recharts** (Simple & Beautiful)
```javascript
import { LineChart, PieChart, BarChart } from 'recharts';

// Easy to use
// Great for dashboards
// Pie charts, bar charts
```

**Use for:**
- Portfolio allocation (pie chart)
- Performance over time (line chart)
- Sector comparison (bar chart)

---

## 🔐 Security Features

- ✅ Row Level Security (RLS) - Users can only see their own data
- ✅ Secure authentication - Supabase Auth
- ✅ Password hashing - bcrypt
- ✅ JWT tokens - Auto-managed
- ✅ HTTPS - Required for production
- ✅ API keys in .env - Never committed to Git

---

## 🎮 Demo Mode Details

**How It Works:**
1. All users get $100,000 demo cash
2. Demo trades use `account_type = 'demo'`
3. Live trades use `account_type = 'live'`
4. Separate portfolios for each mode

**SQL to check demo balance:**
```sql
SELECT username, cash_balance,
       (SELECT account_type FROM portfolios WHERE user_id = users.id LIMIT 1) as mode
FROM users;
```

**Switch modes:**
```sql
SELECT switch_account_mode(user_id, 'live'); -- or 'demo'
```

---

## 🐛 Troubleshooting

**Problem:** Can't log in
- Check Supabase project is running
- Verify .env has correct URL and key
- Check browser console for errors

**Problem:** No charts showing
- Run `npm install` again
- Clear browser cache
- Check console for errors

**Problem:** Data not syncing
- Check internet connection
- Open browser console, look for Supabase errors
- Verify RLS policies are set (run supabase_complete_setup.sql again)

**Problem:** "Invalid API key"
- Double-check .env file
- Make sure you copied the **anon public key** (not service role key)
- Restart dev server after changing .env

---

## 📞 Next Steps

1. ✅ **Customize the UI** - Edit colors, logos, styles
2. ✅ **Add more stocks** - Insert into `stocks` table
3. ✅ **Enable email confirmation** - Supabase Auth settings
4. ✅ **Deploy to production** - Vercel, Netlify, or Render
5. ✅ **Add real-time updates** - Supabase Realtime
6. ✅ **Connect to market data API** - Alpha Vantage, Polygon.io

---

## 🎓 Learn More

- **SUPABASE_SETUP.md** - Detailed Supabase guide
- **database/README.md** - Database schema docs
- **docs/ARCHITECTURE.md** - System architecture

---

**🎉 You're ready to go! Start with `npm install && npm run dev`**
