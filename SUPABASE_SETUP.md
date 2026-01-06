# 🚀 Supabase Setup Guide for Eurizon Investment Portal

This guide will walk you through setting up Supabase as the backend database for the Eurizon Investment Portal, enabling user authentication, data persistence, and real-time synchronization.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Create Supabase Project](#create-supabase-project)
3. [Set Up Database Schema](#set-up-database-schema)
4. [Configure Authentication](#configure-authentication)
5. [Configure Environment Variables](#configure-environment-variables)
6. [Initialize the Application](#initialize-the-application)
7. [Testing the Integration](#testing-the-integration)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, make sure you have:

- ✅ A Supabase account (free tier works fine)
- ✅ Node.js 16+ installed
- ✅ This repository cloned locally
- ✅ Basic understanding of SQL

---

## 1. Create Supabase Project

### Step 1.1: Sign Up / Log In to Supabase

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub, Google, or email

### Step 1.2: Create a New Project

1. Click "New Project"
2. Fill in the details:
   - **Name**: `eurizon-investment` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free (or paid if needed)
3. Click "Create new project"
4. Wait 2-3 minutes for the project to provision

### Step 1.3: Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. You'll need these two values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string starting with eyJ)
3. **Keep these safe!** You'll need them in step 5

---

## 2. Set Up Database Schema

### Step 2.1: Open SQL Editor

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New Query**

### Step 2.2: Run the Database Schema

1. Open the file `database/schema_postgresql.sql` from this repository
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Click **Run** (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

This creates all the necessary tables:
- ✅ `users` - User accounts
- ✅ `stocks` - Market data (stocks, crypto, forex, commodities)
- ✅ `portfolios` - User holdings
- ✅ `transactions` - Trading history
- ✅ `news` - Market news
- ✅ `watchlists` - User watchlists
- ✅ And more!

### Step 2.3: (Optional) Insert Sample Data

If you want to test with sample data:

1. Open `database/queries.sql`
2. Copy the sample data INSERT statements
3. Paste into SQL Editor
4. Click **Run**

---

## 3. Configure Authentication

### Step 3.1: Enable Email Authentication

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Make sure **Email** is enabled (it should be by default)
3. Configure email templates if desired:
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation and password reset emails

### Step 3.2: Configure Auth Settings

1. Go to **Authentication** → **Settings**
2. Recommended settings:
   - ✅ **Enable email confirmations**: OFF (for development) or ON (for production)
   - ✅ **Mailer settings**: Configure for production
   - ✅ **JWT expiry**: 3600 seconds (default)

### Step 3.3: Set Up Row Level Security (RLS)

This is crucial for data security!

Run this SQL in the SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist_items ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own data
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Users can only see their own portfolio
CREATE POLICY "Users can view own portfolio"
  ON portfolios FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own portfolio"
  ON portfolios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolio"
  ON portfolios FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolio"
  ON portfolios FOR DELETE
  USING (auth.uid() = user_id);

-- Users can only see their own transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Stocks are public (everyone can read)
CREATE POLICY "Anyone can view stocks"
  ON stocks FOR SELECT
  TO authenticated
  USING (true);

-- News is public
CREATE POLICY "Anyone can view news"
  ON news FOR SELECT
  TO authenticated
  USING (true);
```

---

## 4. Configure Environment Variables

### Step 4.1: Create .env File

1. In the root of this project, copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### Step 4.2: Add Your Supabase Credentials

Edit `.env` and add your credentials from Step 1.3:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:**
- ⚠️ Never commit `.env` to Git (it's already in `.gitignore`)
- ✅ The `VITE_` prefix is required for Vite to expose these to the frontend
- ✅ The anon key is safe to use in the frontend (it's public)

---

## 5. Install Dependencies

```bash
npm install
```

This will install:
- `@supabase/supabase-js` - Supabase client library
- All other dependencies from `package.json`

---

## 6. Initialize the Application

### Step 6.1: Start the Development Server

```bash
npm run dev
```

The app will start at `http://localhost:5173`

### Step 6.2: Create Your First User

1. Open the app in your browser
2. Click "Sign Up" or use the registration form
3. Enter email and password (minimum 6 characters)
4. If email confirmation is enabled, check your email
5. Sign in!

---

## 7. How It Works

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   REACT FRONTEND                         │
│                                                          │
│  ┌──────────────┐      ┌──────────────┐                 │
│  │  Components  │◄────►│   Context    │                 │
│  └──────────────┘      └──────────────┘                 │
│         │                      │                         │
│         ▼                      ▼                         │
│  ┌──────────────┐      ┌──────────────┐                 │
│  │ React Hooks  │      │ Sync Service │                 │
│  └──────────────┘      └──────────────┘                 │
│         │                      │                         │
│         ├──────────┬───────────┤                         │
│         ▼          ▼           ▼                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                 │
│  │ IndexedDB│ │ Supabase │ │   Auth   │                 │
│  │ (Local)  │ │ Service  │ │ Service  │                 │
│  └──────────┘ └──────────┘ └──────────┘                 │
│                      │           │                       │
└──────────────────────┼───────────┼───────────────────────┘
                       │           │
                       ▼           ▼
              ┌─────────────────────────┐
              │   SUPABASE (Cloud)      │
              │                         │
              │  ┌──────────────────┐   │
              │  │   PostgreSQL     │   │
              │  │    Database      │   │
              │  └──────────────────┘   │
              │                         │
              │  ┌──────────────────┐   │
              │  │  Authentication  │   │
              │  └──────────────────┘   │
              └─────────────────────────┘
```

### Data Flow

1. **User authenticates** → Supabase Auth handles login
2. **Data is fetched** → From Supabase PostgreSQL database
3. **Data is cached** → Locally in IndexedDB for offline access
4. **Sync Manager** → Keeps IndexedDB and Supabase in sync
5. **Offline-first** → App works even without internet, syncs when online

---

## 8. Using the Database Mirroring System

### Automatic Synchronization

The app automatically syncs data every 5 minutes when you're logged in:

```javascript
// Happens automatically after login!
syncManager.startAutoSync(userId);
```

### Manual Synchronization

You can also manually trigger a sync:

```javascript
import { syncManager } from './services/syncService';

// Sync all data
await syncManager.syncAll(userId);

// Or sync specific data
await syncManager.syncMarketDataDown();
await syncManager.syncUserDataDown(userId);
```

### Using React Hooks

The easiest way to use Supabase in your components:

```javascript
import { useAuth, usePortfolio, useMarketData } from './hooks/useSupabase';

function MyComponent() {
  // Authentication
  const { user, signIn, signOut } = useAuth();

  // Market data
  const { data: stocks, loading } = useMarketData('stock');

  // User's portfolio
  const { portfolio, addStock } = usePortfolio(user?.id);

  return (
    <div>
      {loading ? 'Loading...' : `${stocks.length} stocks available`}
    </div>
  );
}
```

---

## 9. Testing the Integration

### Test Checklist

- [ ] **Sign up a new user** → Check that user appears in Supabase `users` table
- [ ] **Sign in** → Verify you can log in with the created account
- [ ] **Add to portfolio** → Add a stock, check it saves to Supabase
- [ ] **View transactions** → Create a trade, verify it appears in transactions table
- [ ] **Offline mode** → Disable internet, verify app still works with cached data
- [ ] **Re-enable internet** → Verify data syncs back to Supabase
- [ ] **Sign out and sign in** → Verify data persists across sessions

---

## 10. Troubleshooting

### Problem: "Missing Supabase environment variables"

**Solution:** Make sure `.env` file exists with correct values:
```bash
cat .env  # View your .env file
```

---

### Problem: "Failed to fetch data from Supabase"

**Possible causes:**
1. Wrong API credentials
2. Table doesn't exist
3. Row Level Security blocking access

**Solution:**
```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Check RLS policies
SELECT * FROM pg_policies;
```

---

### Problem: "Auth session not persisting"

**Solution:** Check that localStorage is enabled in your browser and not being cleared.

---

### Problem: "CORS errors"

**Solution:** Supabase handles CORS automatically, but make sure your `VITE_SUPABASE_URL` is correct.

---

## 11. Production Deployment

When deploying to production:

1. ✅ **Enable email confirmations** in Supabase Auth settings
2. ✅ **Set up proper email templates**
3. ✅ **Use environment variables** for different environments
4. ✅ **Enable database backups** in Supabase (automatic on paid plans)
5. ✅ **Monitor usage** in Supabase dashboard
6. ✅ **Set up custom domain** (optional)

### Environment-Specific Variables

For different environments (development, staging, production):

```bash
# .env.development
VITE_SUPABASE_URL=https://dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=dev-key...

# .env.production
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=prod-key...
```

---

## 12. Next Steps

Now that Supabase is set up, you can:

- ✅ **Customize the schema** - Add more tables as needed
- ✅ **Set up real-time subscriptions** - Get live updates
- ✅ **Add storage** - Upload user documents, images
- ✅ **Implement advanced auth** - OAuth, magic links, etc.
- ✅ **Add database functions** - Custom SQL functions for complex queries
- ✅ **Set up webhooks** - Trigger actions on database changes

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

---

## 🆘 Support

If you run into issues:

1. Check the Supabase logs: **Dashboard → Logs**
2. Review the browser console for errors
3. Check the database with SQL Editor
4. Refer to the [Supabase Discord](https://discord.supabase.com/)

---

**🎉 Congratulations!** Your Eurizon Investment Portal is now powered by Supabase with full database mirroring and offline-first capabilities!
