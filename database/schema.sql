-- ============================================
-- Eurizon Investment Client Portal Database Schema
-- ============================================
-- Compatible with PostgreSQL and MySQL
-- Created: 2026-01-06
-- ============================================

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_user_role (user_role)
);

-- ============================================
-- 2. STOCKS / MARKET DATA TABLE
-- ============================================
CREATE TABLE stocks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
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
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_symbol (symbol),
    INDEX idx_asset_type (asset_type),
    INDEX idx_sector (sector),
    INDEX idx_is_active (is_active)
);

-- ============================================
-- 3. PORTFOLIOS / HOLDINGS TABLE
-- ============================================
CREATE TABLE portfolios (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    stock_id BIGINT NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    shares DECIMAL(15, 6) NOT NULL,
    avg_price DECIMAL(15, 4) NOT NULL,
    total_cost DECIMAL(15, 2) GENERATED ALWAYS AS (shares * avg_price) STORED,
    account_type VARCHAR(50) DEFAULT 'live',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE RESTRICT,
    INDEX idx_user_id (user_id),
    INDEX idx_stock_id (stock_id),
    INDEX idx_symbol (symbol),
    INDEX idx_account_type (account_type),
    UNIQUE KEY unique_user_stock (user_id, stock_id, account_type)
);

-- ============================================
-- 4. TRANSACTIONS TABLE
-- ============================================
CREATE TABLE transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    stock_id BIGINT NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    transaction_type VARCHAR(10) NOT NULL,
    shares DECIMAL(15, 6) NOT NULL,
    price DECIMAL(15, 4) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    fee DECIMAL(10, 2) DEFAULT 0.00,
    account_type VARCHAR(50) DEFAULT 'live',
    status VARCHAR(50) DEFAULT 'completed',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE RESTRICT,
    INDEX idx_user_id (user_id),
    INDEX idx_stock_id (stock_id),
    INDEX idx_symbol (symbol),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_account_type (account_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    CHECK (transaction_type IN ('buy', 'sell')),
    CHECK (shares > 0),
    CHECK (price > 0)
);

-- ============================================
-- 5. MARKET NEWS TABLE
-- ============================================
CREATE TABLE news (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_impact (impact),
    INDEX idx_published_at (published_at),
    CHECK (impact IN ('high', 'medium', 'low'))
);

-- ============================================
-- 6. CLIENTS TABLE (Admin Management)
-- ============================================
CREATE TABLE clients (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE,
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_account_status (account_status),
    INDEX idx_user_id (user_id),
    CHECK (account_status IN ('active', 'inactive', 'suspended', 'closed'))
);

-- ============================================
-- 7. WATCHLISTS TABLE
-- ============================================
CREATE TABLE watchlists (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL DEFAULT 'My Watchlist',
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- ============================================
-- 8. WATCHLIST ITEMS TABLE
-- ============================================
CREATE TABLE watchlist_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    watchlist_id BIGINT NOT NULL,
    stock_id BIGINT NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (watchlist_id) REFERENCES watchlists(id) ON DELETE CASCADE,
    FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE,
    INDEX idx_watchlist_id (watchlist_id),
    INDEX idx_stock_id (stock_id),
    UNIQUE KEY unique_watchlist_stock (watchlist_id, stock_id)
);

-- ============================================
-- 9. PRICE HISTORY TABLE (for charts)
-- ============================================
CREATE TABLE price_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    stock_id BIGINT NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    open_price DECIMAL(15, 4),
    high_price DECIMAL(15, 4),
    low_price DECIMAL(15, 4),
    close_price DECIMAL(15, 4),
    volume BIGINT,
    timestamp TIMESTAMP NOT NULL,
    interval_type VARCHAR(20) DEFAULT '1d',
    FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE,
    INDEX idx_stock_id (stock_id),
    INDEX idx_symbol (symbol),
    INDEX idx_timestamp (timestamp),
    INDEX idx_interval_type (interval_type),
    UNIQUE KEY unique_stock_timestamp (stock_id, timestamp, interval_type)
);

-- ============================================
-- 10. ALERTS TABLE
-- ============================================
CREATE TABLE alerts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    stock_id BIGINT NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    condition_type VARCHAR(50) NOT NULL,
    threshold_value DECIMAL(15, 4),
    is_active BOOLEAN DEFAULT TRUE,
    is_triggered BOOLEAN DEFAULT FALSE,
    triggered_at TIMESTAMP NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_stock_id (stock_id),
    INDEX idx_is_active (is_active),
    INDEX idx_is_triggered (is_triggered),
    CHECK (alert_type IN ('price', 'volume', 'percent_change')),
    CHECK (condition_type IN ('above', 'below', 'equals'))
);

-- ============================================
-- 11. AUDIT LOG TABLE
-- ============================================
CREATE TABLE audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id BIGINT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_entity_type (entity_type),
    INDEX idx_created_at (created_at)
);

-- ============================================
-- INITIAL DATA / SEED DATA
-- ============================================

-- Insert default superadmin user
-- Password: eurizon2024 (should be hashed in production)
INSERT INTO users (username, email, password_hash, first_name, last_name, user_role, is_active, cash_balance)
VALUES ('superadmin', 'admin@eurizoninvestment.com', '$2a$10$YourHashedPasswordHere', 'Super', 'Admin', 'superadmin', TRUE, 100000.00);

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
('Federal Reserve Maintains Interest Rates', 'The Federal Reserve announced it will keep interest rates steady at current levels.', 'Central Banking', 'high', NOW() - INTERVAL 2 HOUR),
('Tech Stocks Rally on Strong Earnings', 'Major technology companies reported better-than-expected quarterly earnings.', 'Technology', 'medium', NOW() - INTERVAL 5 HOUR),
('Oil Prices Surge Amid Supply Concerns', 'Crude oil prices jumped 3% on concerns about supply disruptions.', 'Energy', 'high', NOW() - INTERVAL 1 DAY);
