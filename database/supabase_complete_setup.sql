-- ============================================
-- EURIZON INVESTMENT PORTAL - COMPLETE SUPABASE SETUP
-- Copy this entire file and run in Supabase SQL Editor
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES (from schema_postgresql.sql)
-- Run the schema_postgresql.sql file first, then run this file
-- ============================================

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND user_role IN ('admin', 'superadmin')
    )
  );

-- Portfolios: Users can only see their own
CREATE POLICY "Users can view own portfolio"
  ON portfolios FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own portfolio"
  ON portfolios FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own portfolio"
  ON portfolios FOR UPDATE
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own portfolio"
  ON portfolios FOR DELETE
  USING (auth.uid()::text = user_id::text);

-- Transactions: Users can only see their own
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

-- Admins can view all transactions
CREATE POLICY "Admins can view all transactions"
  ON transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND user_role IN ('admin', 'superadmin')
    )
  );

-- Stocks: Public read for authenticated users
CREATE POLICY "Authenticated users can view stocks"
  ON stocks FOR SELECT
  TO authenticated
  USING (true);

-- Admins can manage stocks
CREATE POLICY "Admins can manage stocks"
  ON stocks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND user_role IN ('admin', 'superadmin')
    )
  );

-- News: Public read for authenticated users
CREATE POLICY "Authenticated users can view news"
  ON news FOR SELECT
  TO authenticated
  USING (true);

-- Admins can manage news
CREATE POLICY "Admins can manage news"
  ON news FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND user_role IN ('admin', 'superadmin')
    )
  );

-- Watchlists: Users own their watchlists
CREATE POLICY "Users can view own watchlists"
  ON watchlists FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own watchlists"
  ON watchlists FOR ALL
  USING (auth.uid()::text = user_id::text);

-- Watchlist items: Based on watchlist ownership
CREATE POLICY "Users can view own watchlist items"
  ON watchlist_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM watchlists
      WHERE watchlists.id = watchlist_items.watchlist_id
      AND watchlists.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can manage own watchlist items"
  ON watchlist_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM watchlists
      WHERE watchlists.id = watchlist_items.watchlist_id
      AND watchlists.user_id::text = auth.uid()::text
    )
  );

-- Clients: Admins only
CREATE POLICY "Admins can view clients"
  ON clients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND user_role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can manage clients"
  ON clients FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND user_role IN ('admin', 'superadmin')
    )
  );

-- Alerts: Users own their alerts
CREATE POLICY "Users can view own alerts"
  ON alerts FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own alerts"
  ON alerts FOR ALL
  USING (auth.uid()::text = user_id::text);

-- Audit logs: Admins can view all, users can view own
CREATE POLICY "Users can view own audit logs"
  ON audit_logs FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND user_role IN ('admin', 'superadmin')
    )
  );

-- Price history: Public read for authenticated users
CREATE POLICY "Authenticated users can view price history"
  ON price_history FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- FUNCTIONS FOR DEMO MODE
-- ============================================

-- Function to check if user is in demo mode
CREATE OR REPLACE FUNCTION is_demo_mode(user_account_id BIGINT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM portfolios
    WHERE user_id = user_account_id
    AND account_type = 'demo'
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create demo account for user
CREATE OR REPLACE FUNCTION create_demo_account(user_account_id BIGINT, demo_balance DECIMAL DEFAULT 100000.00)
RETURNS BOOLEAN AS $$
BEGIN
  -- Set user's demo cash balance
  UPDATE users
  SET cash_balance = demo_balance
  WHERE id = user_account_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to switch between demo and live mode
CREATE OR REPLACE FUNCTION switch_account_mode(user_account_id BIGINT, mode VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  -- Validate mode
  IF mode NOT IN ('demo', 'live') THEN
    RAISE EXCEPTION 'Invalid account mode. Must be demo or live.';
  END IF;

  -- For now, just return success
  -- You can add additional logic here
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION TO SYNC SUPABASE AUTH WITH USERS TABLE
-- ============================================

-- This function creates a user profile when someone signs up via Supabase Auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, email, user_role, cash_balance, created_at)
  VALUES (
    NEW.id::bigint,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_role', 'client'),
    100000.00, -- Default demo balance
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- SAMPLE DATA FOR TESTING
-- ============================================

-- Insert more stocks for better demo experience
INSERT INTO stocks (symbol, name, asset_type, sector, price, previous_close, change_amount, change_percent, volume, market_cap) VALUES
-- Tech Giants
('NFLX', 'Netflix Inc.', 'stock', 'Technology', 485.20, 482.10, 3.10, 0.64, 8500000, 210000000000),
('AMD', 'Advanced Micro Devices', 'stock', 'Technology', 142.80, 140.50, 2.30, 1.64, 42000000, 230000000000),
('CRM', 'Salesforce Inc.', 'stock', 'Technology', 268.50, 265.30, 3.20, 1.21, 7000000, 260000000000),

-- Finance
('BAC', 'Bank of America Corp', 'stock', 'Finance', 33.45, 33.10, 0.35, 1.06, 45000000, 260000000000),
('GS', 'Goldman Sachs Group', 'stock', 'Finance', 385.70, 382.40, 3.30, 0.86, 2500000, 130000000000),
('MA', 'Mastercard Inc', 'stock', 'Finance', 418.90, 415.20, 3.70, 0.89, 3200000, 390000000000),

-- Healthcare
('JNJ', 'Johnson & Johnson', 'stock', 'Healthcare', 158.45, 157.80, 0.65, 0.41, 8500000, 380000000000),
('UNH', 'UnitedHealth Group', 'stock', 'Healthcare', 528.30, 525.10, 3.20, 0.61, 3200000, 490000000000),
('PFE', 'Pfizer Inc', 'stock', 'Healthcare', 28.75, 28.50, 0.25, 0.88, 28000000, 160000000000),

-- Consumer
('KO', 'Coca-Cola Company', 'stock', 'Consumer Goods', 59.80, 59.50, 0.30, 0.50, 15000000, 260000000000),
('PEP', 'PepsiCo Inc', 'stock', 'Consumer Goods', 172.35, 171.80, 0.55, 0.32, 5500000, 238000000000),
('NKE', 'Nike Inc', 'stock', 'Consumer Goods', 108.90, 107.50, 1.40, 1.30, 9800000, 165000000000),

-- More Crypto
('ADA', 'Cardano', 'cryptocurrency', 'Cryptocurrency', 0.62, 0.60, 0.02, 3.33, 580000000, 22000000000),
('SOL', 'Solana', 'cryptocurrency', 'Cryptocurrency', 102.45, 98.30, 4.15, 4.22, 2100000000, 45000000000),
('DOT', 'Polkadot', 'cryptocurrency', 'Cryptocurrency', 7.85, 7.60, 0.25, 3.29, 420000000, 10500000000),

-- Forex
('EUR/USD', 'Euro / US Dollar', 'forex', 'Forex', 1.0842, 1.0835, 0.0007, 0.06, 0, 0),
('GBP/USD', 'British Pound / US Dollar', 'forex', 'Forex', 1.2658, 1.2645, 0.0013, 0.10, 0, 0),
('USD/JPY', 'US Dollar / Japanese Yen', 'forex', 'Forex', 148.52, 148.35, 0.17, 0.11, 0, 0),
('USD/CHF', 'US Dollar / Swiss Franc', 'forex', 'Forex', 0.8425, 0.8418, 0.0007, 0.08, 0, 0),

-- Commodities
('GOLD', 'Gold Futures', 'commodity', 'Precious Metals', 2042.50, 2038.20, 4.30, 0.21, 185000, 0),
('SILVER', 'Silver Futures', 'commodity', 'Precious Metals', 24.85, 24.70, 0.15, 0.61, 52000, 0),
('CRUDE', 'Crude Oil WTI', 'commodity', 'Energy', 78.45, 77.80, 0.65, 0.84, 420000, 0),
('NATGAS', 'Natural Gas', 'commodity', 'Energy', 2.85, 2.92, -0.07, -2.40, 285000, 0);

-- Insert more news
INSERT INTO news (title, summary, category, impact, published_at, source) VALUES
('AI Boom Drives Tech Stock Rally', 'Artificial intelligence developments continue to push technology stocks higher.', 'Technology', 'high', NOW() - INTERVAL '3 hours', 'MarketWatch'),
('Inflation Data Beats Expectations', 'Latest CPI numbers show cooling inflation, markets respond positively.', 'Economics', 'high', NOW() - INTERVAL '6 hours', 'Bloomberg'),
('Cryptocurrency Market Surges', 'Bitcoin and major altcoins see significant gains amid institutional adoption.', 'Cryptocurrency', 'medium', NOW() - INTERVAL '8 hours', 'CoinDesk'),
('Healthcare Sector Shows Strong Growth', 'Pharmaceutical companies report record earnings amid growing demand.', 'Healthcare', 'medium', NOW() - INTERVAL '12 hours', 'Reuters'),
('Retail Sales Exceed Forecasts', 'Consumer spending remains robust despite economic concerns.', 'Retail', 'medium', NOW() - INTERVAL '1 day', 'CNBC'),
('Gold Hits New High', 'Safe-haven demand pushes gold prices to record levels.', 'Commodities', 'high', NOW() - INTERVAL '1 day', 'Kitco News');

-- ============================================
-- PERFORMANCE INDEXES
-- ============================================

-- Additional indexes for better query performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_portfolios_user_account ON portfolios(user_id, account_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_price_history_stock_time ON price_history(stock_id, timestamp DESC);

-- ============================================
-- DONE!
-- ============================================

-- Verify installation
SELECT 'Database setup complete!' as status,
       (SELECT COUNT(*) FROM stocks) as total_stocks,
       (SELECT COUNT(*) FROM news) as total_news_articles;
