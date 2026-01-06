-- ============================================
-- EURIZON INVESTMENT PORTAL - COMPLETE PRODUCTION SQL
-- 100 STOCKS + PAYMENTS + INVOICES + WALLETS + DOCS + NOTIFICATIONS
-- Copy and paste this ENTIRE block into Supabase SQL Editor
-- ============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    user_role VARCHAR(50) NOT NULL DEFAULT 'client',
    is_active BOOLEAN DEFAULT TRUE,
    is_accredited_investor BOOLEAN DEFAULT FALSE,
    cash_balance DECIMAL(15, 2) DEFAULT 100.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(user_role);

-- ============================================
-- 2. STOCKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS stocks (
    id BIGSERIAL PRIMARY KEY,
    symbol VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(50) NOT NULL DEFAULT 'stock',
    sector VARCHAR(100),
    price DECIMAL(15, 4) NOT NULL,
    previous_close DECIMAL(15, 4),
    change_amount DECIMAL(15, 4),
    change_percent DECIMAL(8, 4),
    volume BIGINT,
    market_cap BIGINT,
    day_high DECIMAL(15, 4),
    day_low DECIMAL(15, 4),
    year_high DECIMAL(15, 4),
    year_low DECIMAL(15, 4),
    is_active BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_stocks_symbol ON stocks(symbol);
CREATE INDEX IF NOT EXISTS idx_stocks_asset_type ON stocks(asset_type);
CREATE INDEX IF NOT EXISTS idx_stocks_sector ON stocks(sector);
CREATE INDEX IF NOT EXISTS idx_stocks_search ON stocks(symbol, name);

-- ============================================
-- 3. PORTFOLIOS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS portfolios (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stock_id BIGINT NOT NULL REFERENCES stocks(id) ON DELETE RESTRICT,
    symbol VARCHAR(20) NOT NULL,
    shares DECIMAL(15, 6) NOT NULL,
    avg_price DECIMAL(15, 4) NOT NULL,
    total_cost DECIMAL(15, 2) GENERATED ALWAYS AS (shares * avg_price) STORED,
    account_type VARCHAR(50) DEFAULT 'demo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, stock_id, account_type)
);

CREATE INDEX IF NOT EXISTS idx_portfolios_user ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_account_type ON portfolios(account_type);
CREATE INDEX IF NOT EXISTS idx_portfolios_symbol ON portfolios(symbol);

-- ============================================
-- 4. TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stock_id BIGINT NOT NULL REFERENCES stocks(id) ON DELETE RESTRICT,
    symbol VARCHAR(20) NOT NULL,
    transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('buy', 'sell')),
    shares DECIMAL(15, 6) NOT NULL CHECK (shares > 0),
    price DECIMAL(15, 4) NOT NULL CHECK (price > 0),
    total_amount DECIMAL(15, 2) NOT NULL,
    fee DECIMAL(10, 2) DEFAULT 0.00,
    account_type VARCHAR(50) DEFAULT 'demo',
    status VARCHAR(50) DEFAULT 'completed',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_symbol ON transactions(symbol);

-- ============================================
-- 5. NEWS TABLE (15-minute refresh)
-- ============================================
CREATE TABLE IF NOT EXISTS news (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    content TEXT,
    category VARCHAR(100) NOT NULL,
    impact VARCHAR(20) DEFAULT 'medium',
    source VARCHAR(255),
    author VARCHAR(255),
    url VARCHAR(1000),
    image_url VARCHAR(1000),
    published_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP GENERATED ALWAYS AS (published_at + INTERVAL '15 minutes') STORED
);

CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_expires ON news(expires_at);

-- ============================================
-- 6. WATCHLISTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS watchlists (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL DEFAULT 'My Watchlist',
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS watchlist_items (
    id BIGSERIAL PRIMARY KEY,
    watchlist_id BIGINT NOT NULL REFERENCES watchlists(id) ON DELETE CASCADE,
    stock_id BIGINT NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(watchlist_id, stock_id)
);

-- ============================================
-- 7. PRICE HISTORY TABLE (for charts)
-- ============================================
CREATE TABLE IF NOT EXISTS price_history (
    id BIGSERIAL PRIMARY KEY,
    stock_id BIGINT NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    open_price DECIMAL(15, 4),
    high_price DECIMAL(15, 4),
    low_price DECIMAL(15, 4),
    close_price DECIMAL(15, 4),
    volume BIGINT,
    timestamp TIMESTAMP NOT NULL,
    interval_type VARCHAR(20) DEFAULT '1d',
    UNIQUE(stock_id, timestamp, interval_type)
);

CREATE INDEX IF NOT EXISTS idx_price_history_stock_time ON price_history(stock_id, timestamp DESC);

-- ============================================
-- 8. ALERTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS alerts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stock_id BIGINT NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    condition_type VARCHAR(50) NOT NULL,
    threshold_value DECIMAL(15, 4),
    is_active BOOLEAN DEFAULT TRUE,
    is_triggered BOOLEAN DEFAULT FALSE,
    triggered_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 9. CLIENTS TABLE (Admin)
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'USA',
    postal_code VARCHAR(20),
    account_status VARCHAR(50) DEFAULT 'active',
    risk_profile VARCHAR(50),
    is_accredited BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 10. AUDIT LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id BIGINT,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================
-- 11. INVOICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_type VARCHAR(50) DEFAULT 'service_fee',
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending',
    description TEXT,
    due_date DATE,
    paid_date TIMESTAMP NULL,
    payment_method VARCHAR(50),
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);

-- ============================================
-- 12. CRYPTO WALLETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS crypto_wallets (
    id BIGSERIAL PRIMARY KEY,
    wallet_type VARCHAR(20) NOT NULL CHECK (wallet_type IN ('BTC', 'ETH', 'USDT', 'USDC')),
    wallet_address VARCHAR(255) UNIQUE NOT NULL,
    wallet_name VARCHAR(100),
    network VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    qr_code_url VARCHAR(1000),
    added_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_wallets_type ON crypto_wallets(wallet_type);
CREATE INDEX IF NOT EXISTS idx_wallets_active ON crypto_wallets(is_active);

-- ============================================
-- 13. BANKING INSTRUCTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS banking_instructions (
    id BIGSERIAL PRIMARY KEY,
    bank_name VARCHAR(255) NOT NULL,
    account_holder_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(100),
    routing_number VARCHAR(100),
    swift_code VARCHAR(50),
    iban VARCHAR(100),
    bank_address TEXT,
    currency VARCHAR(10) DEFAULT 'USD',
    instruction_type VARCHAR(50) DEFAULT 'wire_transfer',
    additional_info TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    document_url VARCHAR(1000),
    added_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_banking_active ON banking_instructions(is_active);

-- ============================================
-- 14. DOCUMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS documents (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(1000) NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(50),
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    requires_signature BOOLEAN DEFAULT FALSE,
    signed_at TIMESTAMP NULL,
    signature_url VARCHAR(1000),
    uploaded_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    is_visible_to_user BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);

-- ============================================
-- 15. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_entity_type VARCHAR(50),
    related_entity_id BIGINT,
    is_read BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'normal',
    action_url VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE banking_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Portfolios policies
CREATE POLICY "Users view own portfolio" ON portfolios FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users manage own portfolio" ON portfolios FOR ALL USING (auth.uid()::text = user_id::text);

-- Transactions policies
CREATE POLICY "Users view own transactions" ON transactions FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users create own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Stocks policy (public read)
CREATE POLICY "Anyone can view stocks" ON stocks FOR SELECT TO authenticated USING (true);

-- News policy (public read)
CREATE POLICY "Anyone can view news" ON news FOR SELECT TO authenticated USING (true);

-- Price history policy (public read)
CREATE POLICY "Anyone can view price history" ON price_history FOR SELECT TO authenticated USING (true);

-- Watchlists policies
CREATE POLICY "Users manage own watchlists" ON watchlists FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users manage own watchlist items" ON watchlist_items FOR ALL USING (
  EXISTS (SELECT 1 FROM watchlists WHERE watchlists.id = watchlist_items.watchlist_id AND watchlists.user_id::text = auth.uid()::text)
);

-- Alerts policies
CREATE POLICY "Users manage own alerts" ON alerts FOR ALL USING (auth.uid()::text = user_id::text);

-- Clients policy (admin only)
CREATE POLICY "Admins can manage clients" ON clients FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND user_role IN ('admin', 'superadmin'))
);

-- Audit logs policy
CREATE POLICY "Users view own audit logs" ON audit_logs FOR SELECT USING (auth.uid()::text = user_id::text);

-- Invoices policies
CREATE POLICY "Users view own invoices" ON invoices FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Admins manage all invoices" ON invoices FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND user_role IN ('admin', 'superadmin'))
);

-- Crypto wallets policy (public read for authenticated, admin write)
CREATE POLICY "Users can view wallets" ON crypto_wallets FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Admins manage wallets" ON crypto_wallets FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND user_role IN ('admin', 'superadmin'))
);

-- Banking instructions policy (public read for authenticated, admin write)
CREATE POLICY "Users can view banking instructions" ON banking_instructions FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Admins manage banking instructions" ON banking_instructions FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND user_role IN ('admin', 'superadmin'))
);

-- Documents policies
CREATE POLICY "Users view own documents" ON documents FOR SELECT USING (
  auth.uid()::text = user_id::text AND is_visible_to_user = true
);
CREATE POLICY "Users update own documents" ON documents FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Admins manage all documents" ON documents FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND user_role IN ('admin', 'superadmin'))
);

-- Notifications policies
CREATE POLICY "Users view own notifications" ON notifications FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Admins create notifications" ON notifications FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND user_role IN ('admin', 'superadmin'))
);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, email, user_role, cash_balance, created_at)
  VALUES (
    NEW.id::bigint,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_role', 'client'),
    100.00,
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to get portfolio performance
CREATE OR REPLACE FUNCTION get_portfolio_performance(user_account_id BIGINT)
RETURNS TABLE (
  symbol VARCHAR,
  name VARCHAR,
  shares DECIMAL,
  avg_price DECIMAL,
  current_price DECIMAL,
  total_cost DECIMAL,
  current_value DECIMAL,
  profit_loss DECIMAL,
  profit_loss_percent DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.symbol,
    s.name,
    p.shares,
    p.avg_price,
    s.price as current_price,
    (p.shares * p.avg_price) as total_cost,
    (p.shares * s.price) as current_value,
    ((p.shares * s.price) - (p.shares * p.avg_price)) as profit_loss,
    CASE
      WHEN p.avg_price > 0 THEN (((s.price - p.avg_price) / p.avg_price) * 100)
      ELSE 0
    END as profit_loss_percent
  FROM portfolios p
  JOIN stocks s ON p.stock_id = s.id
  WHERE p.user_id = user_account_id
  ORDER BY (p.shares * s.price) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create notification when document is uploaded
CREATE OR REPLACE FUNCTION notify_document_upload()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, notification_type, title, message, related_entity_type, related_entity_id)
    VALUES (
      NEW.user_id,
      'document_uploaded',
      'New Document Available',
      'A new document "' || NEW.document_name || '" has been uploaded for your review.',
      'document',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for document upload notification
DROP TRIGGER IF EXISTS on_document_uploaded ON documents;
CREATE TRIGGER on_document_uploaded
  AFTER INSERT ON documents
  FOR EACH ROW EXECUTE FUNCTION notify_document_upload();

-- Function to notify admin when document is signed
CREATE OR REPLACE FUNCTION notify_document_signed()
RETURNS TRIGGER AS $$
DECLARE
  admin_id BIGINT;
BEGIN
  IF NEW.signed_at IS NOT NULL AND OLD.signed_at IS NULL THEN
    -- Get first admin user
    SELECT id INTO admin_id FROM users WHERE user_role IN ('admin', 'superadmin') LIMIT 1;

    IF admin_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, notification_type, title, message, related_entity_type, related_entity_id)
      VALUES (
        admin_id,
        'document_signed',
        'Document Signed',
        'User has signed document "' || NEW.document_name || '".',
        'document',
        NEW.id
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for document signature notification
DROP TRIGGER IF EXISTS on_document_signed ON documents;
CREATE TRIGGER on_document_signed
  AFTER UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION notify_document_signed();

-- ============================================
-- 100 STOCKS DATA
-- ============================================

INSERT INTO stocks (symbol, name, asset_type, sector, price, previous_close, change_amount, change_percent, volume, market_cap) VALUES
-- Tech Giants (10)
('AAPL', 'Apple Inc.', 'stock', 'Technology', 175.43, 173.28, 2.15, 1.24, 85000000, 2800000000000),
('GOOGL', 'Alphabet Inc.', 'stock', 'Technology', 142.50, 141.20, 1.30, 0.92, 25000000, 1800000000000),
('MSFT', 'Microsoft Corporation', 'stock', 'Technology', 378.91, 376.45, 2.46, 0.65, 28000000, 2900000000000),
('AMZN', 'Amazon.com Inc.', 'stock', 'Technology', 152.33, 151.10, 1.23, 0.81, 45000000, 1600000000000),
('META', 'Meta Platforms Inc.', 'stock', 'Technology', 358.75, 356.20, 2.55, 0.72, 18000000, 920000000000),
('NVDA', 'NVIDIA Corporation', 'stock', 'Technology', 495.22, 489.67, 5.55, 1.13, 42000000, 1200000000000),
('TSLA', 'Tesla Inc.', 'stock', 'Automotive', 248.50, 245.30, 3.20, 1.30, 120000000, 780000000000),
('NFLX', 'Netflix Inc.', 'stock', 'Technology', 485.20, 482.10, 3.10, 0.64, 8500000, 210000000000),
('AMD', 'Advanced Micro Devices', 'stock', 'Technology', 142.80, 140.50, 2.30, 1.64, 42000000, 230000000000),
('CRM', 'Salesforce Inc.', 'stock', 'Technology', 268.50, 265.30, 3.20, 1.21, 7000000, 260000000000),

-- Finance (15)
('JPM', 'JPMorgan Chase & Co.', 'stock', 'Finance', 168.45, 167.20, 1.25, 0.75, 12000000, 480000000000),
('V', 'Visa Inc.', 'stock', 'Finance', 258.90, 257.15, 1.75, 0.68, 8000000, 520000000000),
('BAC', 'Bank of America Corp', 'stock', 'Finance', 33.45, 33.10, 0.35, 1.06, 45000000, 260000000000),
('GS', 'Goldman Sachs Group', 'stock', 'Finance', 385.70, 382.40, 3.30, 0.86, 2500000, 130000000000),
('MA', 'Mastercard Inc', 'stock', 'Finance', 418.90, 415.20, 3.70, 0.89, 3200000, 390000000000),
('WFC', 'Wells Fargo & Co', 'stock', 'Finance', 48.75, 48.20, 0.55, 1.14, 28000000, 170000000000),
('C', 'Citigroup Inc', 'stock', 'Finance', 52.30, 51.80, 0.50, 0.97, 18000000, 100000000000),
('MS', 'Morgan Stanley', 'stock', 'Finance', 89.65, 88.90, 0.75, 0.84, 8500000, 145000000000),
('AXP', 'American Express Co', 'stock', 'Finance', 178.25, 176.80, 1.45, 0.82, 3200000, 130000000000),
('BLK', 'BlackRock Inc', 'stock', 'Finance', 785.40, 780.20, 5.20, 0.67, 550000, 120000000000),
('SCHW', 'Charles Schwab Corp', 'stock', 'Finance', 68.45, 67.90, 0.55, 0.81, 7200000, 125000000000),
('PNC', 'PNC Financial Services', 'stock', 'Finance', 165.30, 164.10, 1.20, 0.73, 1800000, 68000000000),
('USB', 'US Bancorp', 'stock', 'Finance', 45.80, 45.40, 0.40, 0.88, 9500000, 67000000000),
('TFC', 'Truist Financial Corp', 'stock', 'Finance', 38.95, 38.60, 0.35, 0.91, 6200000, 52000000000),
('COF', 'Capital One Financial', 'stock', 'Finance', 135.70, 134.50, 1.20, 0.89, 2800000, 56000000000),

-- Healthcare (15)
('JNJ', 'Johnson & Johnson', 'stock', 'Healthcare', 158.45, 157.80, 0.65, 0.41, 8500000, 380000000000),
('UNH', 'UnitedHealth Group', 'stock', 'Healthcare', 528.30, 525.10, 3.20, 0.61, 3200000, 490000000000),
('PFE', 'Pfizer Inc', 'stock', 'Healthcare', 28.75, 28.50, 0.25, 0.88, 28000000, 160000000000),
('ABBV', 'AbbVie Inc', 'stock', 'Healthcare', 165.30, 164.20, 1.10, 0.67, 6500000, 292000000000),
('MRK', 'Merck & Co Inc', 'stock', 'Healthcare', 108.25, 107.50, 0.75, 0.70, 9200000, 274000000000),
('TMO', 'Thermo Fisher Scientific', 'stock', 'Healthcare', 545.80, 542.30, 3.50, 0.65, 1500000, 215000000000),
('LLY', 'Eli Lilly and Co', 'stock', 'Healthcare', 595.40, 590.20, 5.20, 0.88, 2800000, 565000000000),
('DHR', 'Danaher Corporation', 'stock', 'Healthcare', 248.90, 246.70, 2.20, 0.89, 2100000, 180000000000),
('BMY', 'Bristol-Myers Squibb', 'stock', 'Healthcare', 52.15, 51.80, 0.35, 0.68, 9800000, 108000000000),
('AMGN', 'Amgen Inc', 'stock', 'Healthcare', 285.60, 283.40, 2.20, 0.78, 2300000, 152000000000),
('GILD', 'Gilead Sciences Inc', 'stock', 'Healthcare', 78.90, 78.30, 0.60, 0.77, 6500000, 99000000000),
('CVS', 'CVS Health Corp', 'stock', 'Healthcare', 72.35, 71.80, 0.55, 0.77, 7200000, 94000000000),
('MDT', 'Medtronic PLC', 'stock', 'Healthcare', 82.45, 81.90, 0.55, 0.67, 5100000, 108000000000),
('CI', 'Cigna Corp', 'stock', 'Healthcare', 298.70, 296.40, 2.30, 0.78, 1600000, 92000000000),
('HUM', 'Humana Inc', 'stock', 'Healthcare', 465.80, 462.30, 3.50, 0.76, 850000, 58000000000),

-- Consumer (15)
('WMT', 'Walmart Inc.', 'stock', 'Retail', 162.75, 161.50, 1.25, 0.77, 9000000, 440000000000),
('KO', 'Coca-Cola Company', 'stock', 'Consumer Goods', 59.80, 59.50, 0.30, 0.50, 15000000, 260000000000),
('PEP', 'PepsiCo Inc', 'stock', 'Consumer Goods', 172.35, 171.80, 0.55, 0.32, 5500000, 238000000000),
('NKE', 'Nike Inc', 'stock', 'Consumer Goods', 108.90, 107.50, 1.40, 1.30, 9800000, 165000000000),
('MCD', 'McDonalds Corp', 'stock', 'Consumer Goods', 295.40, 293.80, 1.60, 0.54, 3100000, 215000000000),
('DIS', 'Walt Disney Co', 'stock', 'Entertainment', 92.65, 91.80, 0.85, 0.93, 11000000, 169000000000),
('SBUX', 'Starbucks Corp', 'stock', 'Consumer Goods', 95.75, 95.10, 0.65, 0.68, 8200000, 109000000000),
('HD', 'Home Depot Inc', 'stock', 'Retail', 368.90, 366.50, 2.40, 0.65, 3400000, 375000000000),
('LOW', 'Lowes Companies Inc', 'stock', 'Retail', 245.30, 243.80, 1.50, 0.62, 3800000, 145000000000),
('TGT', 'Target Corp', 'stock', 'Retail', 148.25, 147.10, 1.15, 0.78, 4200000, 68000000000),
('COST', 'Costco Wholesale Corp', 'stock', 'Retail', 725.80, 721.40, 4.40, 0.61, 1800000, 322000000000),
('PG', 'Procter & Gamble Co', 'stock', 'Consumer Goods', 155.60, 154.80, 0.80, 0.52, 7100000, 370000000000),
('PM', 'Philip Morris Intl', 'stock', 'Consumer Goods', 98.45, 97.80, 0.65, 0.66, 4600000, 153000000000),
('UL', 'Unilever PLC', 'stock', 'Consumer Goods', 52.30, 51.95, 0.35, 0.67, 3200000, 132000000000),
('CL', 'Colgate-Palmolive Co', 'stock', 'Consumer Goods', 82.15, 81.70, 0.45, 0.55, 3900000, 68000000000),

-- Energy (10)
('XOM', 'Exxon Mobil Corp', 'stock', 'Energy', 102.35, 101.50, 0.85, 0.84, 18000000, 420000000000),
('CVX', 'Chevron Corp', 'stock', 'Energy', 148.70, 147.40, 1.30, 0.88, 9500000, 285000000000),
('COP', 'ConocoPhillips', 'stock', 'Energy', 118.45, 117.30, 1.15, 0.98, 7200000, 145000000000),
('SLB', 'Schlumberger NV', 'stock', 'Energy', 52.80, 52.20, 0.60, 1.15, 12000000, 74000000000),
('EOG', 'EOG Resources Inc', 'stock', 'Energy', 125.90, 124.70, 1.20, 0.96, 3800000, 73000000000),
('PSX', 'Phillips 66', 'stock', 'Energy', 138.25, 137.10, 1.15, 0.84, 2600000, 62000000000),
('MPC', 'Marathon Petroleum', 'stock', 'Energy', 162.40, 160.90, 1.50, 0.93, 4100000, 67000000000),
('VLO', 'Valero Energy Corp', 'stock', 'Energy', 145.60, 144.30, 1.30, 0.90, 3500000, 55000000000),
('OXY', 'Occidental Petroleum', 'stock', 'Energy', 58.95, 58.40, 0.55, 0.94, 15000000, 54000000000),
('HAL', 'Halliburton Co', 'stock', 'Energy', 34.75, 34.40, 0.35, 1.02, 9200000, 31000000000),

-- Crypto (10)
('BTC', 'Bitcoin', 'cryptocurrency', 'Cryptocurrency', 45230.50, 44850.20, 380.30, 0.85, 28000000000, 885000000000),
('ETH', 'Ethereum', 'cryptocurrency', 'Cryptocurrency', 2340.75, 2315.40, 25.35, 1.09, 15000000000, 280000000000),
('BNB', 'Binance Coin', 'cryptocurrency', 'Cryptocurrency', 312.45, 308.90, 3.55, 1.15, 850000000, 48000000000),
('SOL', 'Solana', 'cryptocurrency', 'Cryptocurrency', 102.45, 98.30, 4.15, 4.22, 2100000000, 45000000000),
('ADA', 'Cardano', 'cryptocurrency', 'Cryptocurrency', 0.62, 0.60, 0.02, 3.33, 580000000, 22000000000),
('DOT', 'Polkadot', 'cryptocurrency', 'Cryptocurrency', 7.85, 7.60, 0.25, 3.29, 420000000, 10500000000),
('XRP', 'Ripple', 'cryptocurrency', 'Cryptocurrency', 0.58, 0.57, 0.01, 1.75, 1200000000, 31000000000),
('MATIC', 'Polygon', 'cryptocurrency', 'Cryptocurrency', 0.82, 0.79, 0.03, 3.80, 380000000, 7600000000),
('AVAX', 'Avalanche', 'cryptocurrency', 'Cryptocurrency', 38.25, 36.90, 1.35, 3.66, 285000000, 14000000000),
('LINK', 'Chainlink', 'cryptocurrency', 'Cryptocurrency', 15.45, 15.10, 0.35, 2.32, 420000000, 8900000000),

-- Forex (10)
('EUR/USD', 'Euro / US Dollar', 'forex', 'Forex', 1.0842, 1.0835, 0.0007, 0.06, 0, 0),
('GBP/USD', 'British Pound / US Dollar', 'forex', 'Forex', 1.2658, 1.2645, 0.0013, 0.10, 0, 0),
('USD/JPY', 'US Dollar / Japanese Yen', 'forex', 'Forex', 148.52, 148.35, 0.17, 0.11, 0, 0),
('USD/CHF', 'US Dollar / Swiss Franc', 'forex', 'Forex', 0.8425, 0.8418, 0.0007, 0.08, 0, 0),
('AUD/USD', 'Australian Dollar / US Dollar', 'forex', 'Forex', 0.6532, 0.6518, 0.0014, 0.21, 0, 0),
('USD/CAD', 'US Dollar / Canadian Dollar', 'forex', 'Forex', 1.3582, 1.3568, 0.0014, 0.10, 0, 0),
('NZD/USD', 'New Zealand Dollar / US Dollar', 'forex', 'Forex', 0.6125, 0.6110, 0.0015, 0.25, 0, 0),
('EUR/GBP', 'Euro / British Pound', 'forex', 'Forex', 0.8568, 0.8560, 0.0008, 0.09, 0, 0),
('EUR/JPY', 'Euro / Japanese Yen', 'forex', 'Forex', 161.05, 160.82, 0.23, 0.14, 0, 0),
('GBP/JPY', 'British Pound / Japanese Yen', 'forex', 'Forex', 187.95, 187.65, 0.30, 0.16, 0, 0),

-- Commodities (10)
('GOLD', 'Gold Futures', 'commodity', 'Precious Metals', 2042.50, 2038.20, 4.30, 0.21, 185000, 0),
('SILVER', 'Silver Futures', 'commodity', 'Precious Metals', 24.85, 24.70, 0.15, 0.61, 52000, 0),
('CRUDE', 'Crude Oil WTI', 'commodity', 'Energy', 78.45, 77.80, 0.65, 0.84, 420000, 0),
('NATGAS', 'Natural Gas', 'commodity', 'Energy', 2.85, 2.92, -0.07, -2.40, 285000, 0),
('BRENT', 'Brent Crude Oil', 'commodity', 'Energy', 82.65, 81.95, 0.70, 0.85, 380000, 0),
('COPPER', 'Copper Futures', 'commodity', 'Industrial Metals', 3.82, 3.79, 0.03, 0.79, 42000, 0),
('PLAT', 'Platinum Futures', 'commodity', 'Precious Metals', 945.30, 941.80, 3.50, 0.37, 8500, 0),
('PALL', 'Palladium Futures', 'commodity', 'Precious Metals', 1125.60, 1118.40, 7.20, 0.64, 6200, 0),
('CORN', 'Corn Futures', 'commodity', 'Agriculture', 4.85, 4.82, 0.03, 0.62, 125000, 0),
('WHEAT', 'Wheat Futures', 'commodity', 'Agriculture', 6.12, 6.08, 0.04, 0.66, 98000, 0)

ON CONFLICT (symbol) DO NOTHING;

-- ============================================
-- NEWS DATA (refreshes every 15 minutes)
-- ============================================

INSERT INTO news (title, summary, category, impact, published_at) VALUES
('Markets Open Higher on Strong Economic Data', 'Stock markets rallied at opening bell following positive employment figures.', 'Market News', 'high', NOW()),
('Tech Sector Leads Gains', 'Technology stocks outperform as AI investments surge.', 'Technology', 'medium', NOW() - INTERVAL '5 minutes'),
('Federal Reserve Maintains Rates', 'Fed keeps interest rates unchanged amid economic stability.', 'Central Banking', 'high', NOW() - INTERVAL '10 minutes'),
('Oil Prices Surge on Supply Concerns', 'Crude oil jumps 3% on geopolitical tensions.', 'Energy', 'high', NOW() - INTERVAL '12 minutes'),
('Gold Reaches New High', 'Safe-haven demand drives gold to record levels.', 'Commodities', 'medium', NOW() - INTERVAL '14 minutes'),
('Crypto Markets Rally', 'Bitcoin and Ethereum see significant gains.', 'Cryptocurrency', 'medium', NOW() - INTERVAL '8 minutes')
ON CONFLICT DO NOTHING;

-- ============================================
-- SAMPLE PAYMENT DATA (FOR DEMO)
-- ============================================

-- Sample crypto wallets
INSERT INTO crypto_wallets (wallet_type, wallet_address, wallet_name, network, qr_code_url) VALUES
('BTC', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'Primary Bitcoin Wallet', 'Bitcoin Mainnet', NULL),
('ETH', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', 'Primary Ethereum Wallet', 'Ethereum Mainnet', NULL)
ON CONFLICT DO NOTHING;

-- Sample banking instructions
INSERT INTO banking_instructions (bank_name, account_holder_name, account_number, routing_number, swift_code, currency, instruction_type, additional_info) VALUES
('JPMorgan Chase Bank', 'Eurizon Investment Portal LLC', '****1234', '021000021', 'CHASUS33', 'USD', 'wire_transfer', 'For wire transfers, please include your account number in the reference field.')
ON CONFLICT DO NOTHING;

-- ============================================
-- VIEWS FOR PORTFOLIO PERFORMANCE
-- ============================================

CREATE OR REPLACE VIEW vw_portfolio_performance AS
SELECT
    p.id,
    p.user_id,
    p.symbol,
    s.name,
    s.sector,
    p.shares,
    p.avg_price,
    s.price as current_price,
    (p.shares * s.price) as current_value,
    (p.shares * p.avg_price) as cost_basis,
    ((p.shares * s.price) - (p.shares * p.avg_price)) as profit_loss,
    CASE
        WHEN p.avg_price > 0 THEN (((s.price - p.avg_price) / p.avg_price) * 100)
        ELSE 0
    END as pl_percent,
    s.change_percent as today_change_percent,
    p.account_type,
    p.created_at
FROM portfolios p
JOIN stocks s ON p.stock_id = s.id
WHERE s.is_active = TRUE;

-- ============================================
-- DONE!
-- ============================================

SELECT 'Complete setup finished!' as status,
       (SELECT COUNT(*) FROM stocks) as stocks_count,
       (SELECT COUNT(*) FROM news) as news_count,
       (SELECT COUNT(*) FROM crypto_wallets) as wallets_count,
       (SELECT COUNT(*) FROM banking_instructions) as banking_count,
       '100 stocks + invoices + wallets + docs + notifications!' as features;
