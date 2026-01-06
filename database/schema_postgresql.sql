-- ============================================
-- Eurizon Investment Client Portal Database Schema
-- PostgreSQL Version
-- ============================================
-- Optimized for PostgreSQL 12+
-- Created: 2026-01-06
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    user_role VARCHAR(50) NOT NULL DEFAULT 'client',
    is_active BOOLEAN DEFAULT TRUE,
    is_accredited_investor BOOLEAN DEFAULT FALSE,
    cash_balance DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(user_role);

-- ============================================
-- 2. STOCKS / MARKET DATA TABLE
-- ============================================
CREATE TABLE stocks (
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

CREATE INDEX idx_stocks_symbol ON stocks(symbol);
CREATE INDEX idx_stocks_asset_type ON stocks(asset_type);
CREATE INDEX idx_stocks_sector ON stocks(sector);
CREATE INDEX idx_stocks_active ON stocks(is_active);

-- ============================================
-- 3. PORTFOLIOS / HOLDINGS TABLE
-- ============================================
CREATE TABLE portfolios (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stock_id BIGINT NOT NULL REFERENCES stocks(id) ON DELETE RESTRICT,
    symbol VARCHAR(20) NOT NULL,
    shares DECIMAL(15, 6) NOT NULL,
    avg_price DECIMAL(15, 4) NOT NULL,
    total_cost DECIMAL(15, 2) GENERATED ALWAYS AS (shares * avg_price) STORED,
    account_type VARCHAR(50) DEFAULT 'live',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, stock_id, account_type)
);

CREATE INDEX idx_portfolios_user ON portfolios(user_id);
CREATE INDEX idx_portfolios_stock ON portfolios(stock_id);
CREATE INDEX idx_portfolios_symbol ON portfolios(symbol);
CREATE INDEX idx_portfolios_account_type ON portfolios(account_type);

-- ============================================
-- 4. TRANSACTIONS TABLE
-- ============================================
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stock_id BIGINT NOT NULL REFERENCES stocks(id) ON DELETE RESTRICT,
    symbol VARCHAR(20) NOT NULL,
    transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('buy', 'sell')),
    shares DECIMAL(15, 6) NOT NULL CHECK (shares > 0),
    price DECIMAL(15, 4) NOT NULL CHECK (price > 0),
    total_amount DECIMAL(15, 2) NOT NULL,
    fee DECIMAL(10, 2) DEFAULT 0.00,
    account_type VARCHAR(50) DEFAULT 'live',
    status VARCHAR(50) DEFAULT 'completed',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_stock ON transactions(stock_id);
CREATE INDEX idx_transactions_symbol ON transactions(symbol);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_account ON transactions(account_type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created ON transactions(created_at);

-- ============================================
-- 5. MARKET NEWS TABLE
-- ============================================
CREATE TABLE news (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    content TEXT,
    category VARCHAR(100) NOT NULL,
    impact VARCHAR(20) DEFAULT 'medium' CHECK (impact IN ('high', 'medium', 'low')),
    source VARCHAR(255),
    author VARCHAR(255),
    url VARCHAR(1000),
    image_url VARCHAR(1000),
    published_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_impact ON news(impact);
CREATE INDEX idx_news_published ON news(published_at);

-- ============================================
-- 6. CLIENTS TABLE (Admin Management)
-- ============================================
CREATE TABLE clients (
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
    account_status VARCHAR(50) DEFAULT 'active' CHECK (account_status IN ('active', 'inactive', 'suspended', 'closed')),
    risk_profile VARCHAR(50),
    is_accredited BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_status ON clients(account_status);
CREATE INDEX idx_clients_user ON clients(user_id);

-- ============================================
-- 7. WATCHLISTS TABLE
-- ============================================
CREATE TABLE watchlists (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL DEFAULT 'My Watchlist',
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_watchlists_user ON watchlists(user_id);

-- ============================================
-- 8. WATCHLIST ITEMS TABLE
-- ============================================
CREATE TABLE watchlist_items (
    id BIGSERIAL PRIMARY KEY,
    watchlist_id BIGINT NOT NULL REFERENCES watchlists(id) ON DELETE CASCADE,
    stock_id BIGINT NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(watchlist_id, stock_id)
);

CREATE INDEX idx_watchlist_items_watchlist ON watchlist_items(watchlist_id);
CREATE INDEX idx_watchlist_items_stock ON watchlist_items(stock_id);

-- ============================================
-- 9. PRICE HISTORY TABLE (for charts)
-- ============================================
CREATE TABLE price_history (
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

CREATE INDEX idx_price_history_stock ON price_history(stock_id);
CREATE INDEX idx_price_history_symbol ON price_history(symbol);
CREATE INDEX idx_price_history_timestamp ON price_history(timestamp);
CREATE INDEX idx_price_history_interval ON price_history(interval_type);

-- ============================================
-- 10. ALERTS TABLE
-- ============================================
CREATE TABLE alerts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stock_id BIGINT NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('price', 'volume', 'percent_change')),
    condition_type VARCHAR(50) NOT NULL CHECK (condition_type IN ('above', 'below', 'equals')),
    threshold_value DECIMAL(15, 4),
    is_active BOOLEAN DEFAULT TRUE,
    is_triggered BOOLEAN DEFAULT FALSE,
    triggered_at TIMESTAMP NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_user ON alerts(user_id);
CREATE INDEX idx_alerts_stock ON alerts(stock_id);
CREATE INDEX idx_alerts_active ON alerts(is_active);
CREATE INDEX idx_alerts_triggered ON alerts(is_triggered);

-- ============================================
-- 11. AUDIT LOG TABLE
-- ============================================
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id BIGINT,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_watchlists_updated_at BEFORE UPDATE ON watchlists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INITIAL DATA / SEED DATA
-- ============================================

-- Insert default superadmin user
-- Password: eurizon2024 (hash generated with bcrypt, cost factor 10)
INSERT INTO users (username, email, password_hash, first_name, last_name, user_role, is_active, cash_balance)
VALUES ('superadmin', 'admin@eurizoninvestment.com', '$2a$10$YourActualBcryptHashHere', 'Super', 'Admin', 'superadmin', TRUE, 100000.00);

-- Insert sample stocks (major US equities)
INSERT INTO stocks (symbol, name, asset_type, sector, price, previous_close, volume, market_cap) VALUES
('AAPL', 'Apple Inc.', 'stock', 'Technology', 175.43, 173.28, 85000000, 2800000000000),
('GOOGL', 'Alphabet Inc.', 'stock', 'Technology', 142.50, 141.20, 25000000, 1800000000000),
('MSFT', 'Microsoft Corporation', 'stock', 'Technology', 378.91, 376.45, 28000000, 2900000000000),
('AMZN', 'Amazon.com Inc.', 'stock', 'Technology', 152.33, 151.10, 45000000, 1600000000000),
('TSLA', 'Tesla Inc.', 'stock', 'Automotive', 248.50, 245.30, 120000000, 780000000000),
('META', 'Meta Platforms Inc.', 'stock', 'Technology', 358.75, 356.20, 18000000, 920000000000),
('NVDA', 'NVIDIA Corporation', 'stock', 'Technology', 495.22, 489.67, 42000000, 1200000000000),
('JPM', 'JPMorgan Chase & Co.', 'stock', 'Finance', 168.45, 167.20, 12000000, 480000000000),
('V', 'Visa Inc.', 'stock', 'Finance', 258.90, 257.15, 8000000, 520000000000),
('WMT', 'Walmart Inc.', 'stock', 'Retail', 162.75, 161.50, 9000000, 440000000000);

-- Insert sample cryptocurrencies
INSERT INTO stocks (symbol, name, asset_type, sector, price, previous_close, volume, market_cap) VALUES
('BTC', 'Bitcoin', 'cryptocurrency', 'Cryptocurrency', 45230.50, 44850.20, 28000000000, 885000000000),
('ETH', 'Ethereum', 'cryptocurrency', 'Cryptocurrency', 2340.75, 2315.40, 15000000000, 280000000000),
('BNB', 'Binance Coin', 'cryptocurrency', 'Cryptocurrency', 312.45, 308.90, 850000000, 48000000000);

-- Insert sample news
INSERT INTO news (title, summary, category, impact, published_at) VALUES
('Federal Reserve Maintains Interest Rates', 'The Federal Reserve announced it will keep interest rates steady at current levels.', 'Central Banking', 'high', NOW() - INTERVAL '2 hours'),
('Tech Stocks Rally on Strong Earnings', 'Major technology companies reported better-than-expected quarterly earnings.', 'Technology', 'medium', NOW() - INTERVAL '5 hours'),
('Oil Prices Surge Amid Supply Concerns', 'Crude oil prices jumped 3% on concerns about supply disruptions.', 'Energy', 'high', NOW() - INTERVAL '1 day');

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- User Portfolio Summary View
CREATE OR REPLACE VIEW vw_user_portfolio_summary AS
SELECT
    u.id as user_id,
    u.username,
    u.cash_balance,
    COALESCE(SUM(p.shares * s.price), 0) as holdings_value,
    u.cash_balance + COALESCE(SUM(p.shares * s.price), 0) as total_value,
    COUNT(DISTINCT p.stock_id) as total_positions
FROM users u
LEFT JOIN portfolios p ON u.id = p.user_id AND p.account_type = 'live'
LEFT JOIN stocks s ON p.stock_id = s.id
GROUP BY u.id, u.username, u.cash_balance;

-- Portfolio Performance View
CREATE OR REPLACE VIEW vw_portfolio_performance AS
SELECT
    p.id,
    p.user_id,
    p.symbol,
    s.name,
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
    p.account_type
FROM portfolios p
JOIN stocks s ON p.stock_id = s.id;

-- Market Movers View
CREATE OR REPLACE VIEW vw_market_movers AS
SELECT
    symbol,
    name,
    price,
    change_amount,
    change_percent,
    volume,
    sector,
    CASE
        WHEN change_percent > 0 THEN 'gainer'
        WHEN change_percent < 0 THEN 'loser'
        ELSE 'unchanged'
    END as mover_type
FROM stocks
WHERE asset_type = 'stock' AND is_active = TRUE
ORDER BY ABS(change_percent) DESC;

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
