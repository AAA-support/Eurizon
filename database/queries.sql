-- ============================================
-- Eurizon Investment Portal - Common Queries
-- ============================================

-- ============================================
-- USER & AUTHENTICATION QUERIES
-- ============================================

-- Get user by username
SELECT * FROM users WHERE username = 'superadmin';

-- Get user with full profile
SELECT
    id, username, email, first_name, last_name,
    user_role, is_active, is_accredited_investor,
    cash_balance, created_at, last_login
FROM users
WHERE id = ?;

-- Update last login
UPDATE users
SET last_login = CURRENT_TIMESTAMP
WHERE id = ?;

-- Update cash balance after transaction
UPDATE users
SET cash_balance = cash_balance + ?
WHERE id = ?;

-- ============================================
-- PORTFOLIO QUERIES
-- ============================================

-- Get user's complete portfolio
SELECT
    p.id,
    p.symbol,
    s.name,
    s.asset_type,
    p.shares,
    p.avg_price,
    s.price as current_price,
    (p.shares * s.price) as current_value,
    (p.shares * p.avg_price) as cost_basis,
    ((p.shares * s.price) - (p.shares * p.avg_price)) as profit_loss,
    (((s.price - p.avg_price) / p.avg_price) * 100) as pl_percent,
    s.change_percent as daily_change
FROM portfolios p
JOIN stocks s ON p.stock_id = s.id
WHERE p.user_id = ? AND p.account_type = 'live'
ORDER BY current_value DESC;

-- Get portfolio summary
SELECT
    COUNT(*) as total_positions,
    SUM(p.shares * s.price) as total_holdings_value,
    SUM(p.shares * p.avg_price) as total_cost_basis,
    SUM((p.shares * s.price) - (p.shares * p.avg_price)) as total_pl
FROM portfolios p
JOIN stocks s ON p.stock_id = s.id
WHERE p.user_id = ? AND p.account_type = 'live';

-- Get portfolio diversity by sector
SELECT
    s.sector,
    COUNT(*) as position_count,
    SUM(p.shares * s.price) as sector_value,
    (SUM(p.shares * s.price) / (
        SELECT SUM(p2.shares * s2.price)
        FROM portfolios p2
        JOIN stocks s2 ON p2.stock_id = s2.id
        WHERE p2.user_id = ? AND p2.account_type = 'live'
    )) * 100 as sector_percent
FROM portfolios p
JOIN stocks s ON p.stock_id = s.id
WHERE p.user_id = ? AND p.account_type = 'live'
GROUP BY s.sector
ORDER BY sector_value DESC;

-- Get portfolio by asset type
SELECT
    s.asset_type,
    COUNT(*) as position_count,
    SUM(p.shares * s.price) as asset_type_value
FROM portfolios p
JOIN stocks s ON p.stock_id = s.id
WHERE p.user_id = ? AND p.account_type = 'live'
GROUP BY s.asset_type;

-- ============================================
-- TRADING / TRANSACTION QUERIES
-- ============================================

-- Get transaction history
SELECT
    t.id,
    t.symbol,
    s.name,
    t.transaction_type,
    t.shares,
    t.price,
    t.total_amount,
    t.fee,
    t.account_type,
    t.executed_at
FROM transactions t
JOIN stocks s ON t.stock_id = s.id
WHERE t.user_id = ?
ORDER BY t.executed_at DESC
LIMIT 50;

-- Get transactions for specific stock
SELECT
    t.id,
    t.transaction_type,
    t.shares,
    t.price,
    t.total_amount,
    t.fee,
    t.executed_at
FROM transactions t
WHERE t.user_id = ? AND t.symbol = ?
ORDER BY t.executed_at DESC;

-- Insert buy transaction
INSERT INTO transactions (
    user_id, stock_id, symbol, transaction_type,
    shares, price, total_amount, fee, account_type
)
VALUES (?, ?, ?, 'buy', ?, ?, ?, ?, ?);

-- Insert sell transaction
INSERT INTO transactions (
    user_id, stock_id, symbol, transaction_type,
    shares, price, total_amount, fee, account_type
)
VALUES (?, ?, ?, 'sell', ?, ?, ?, ?, ?);

-- Get trading volume by period
SELECT
    DATE(executed_at) as trade_date,
    COUNT(*) as trade_count,
    SUM(CASE WHEN transaction_type = 'buy' THEN 1 ELSE 0 END) as buy_count,
    SUM(CASE WHEN transaction_type = 'sell' THEN 1 ELSE 0 END) as sell_count,
    SUM(total_amount) as total_volume
FROM transactions
WHERE user_id = ?
    AND executed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(executed_at)
ORDER BY trade_date DESC;

-- ============================================
-- MARKET DATA QUERIES
-- ============================================

-- Get all active stocks
SELECT * FROM stocks
WHERE is_active = TRUE
ORDER BY symbol;

-- Get stocks by asset type
SELECT * FROM stocks
WHERE asset_type = ? AND is_active = TRUE
ORDER BY market_cap DESC;

-- Get stocks by sector
SELECT * FROM stocks
WHERE sector = ? AND is_active = TRUE
ORDER BY market_cap DESC;

-- Search stocks by symbol or name
SELECT symbol, name, price, change_percent, asset_type, sector
FROM stocks
WHERE (symbol LIKE ? OR name LIKE ?)
    AND is_active = TRUE
ORDER BY market_cap DESC
LIMIT 20;

-- Get top gainers
SELECT
    symbol, name, price, change_amount,
    change_percent, volume, sector
FROM stocks
WHERE asset_type = 'stock' AND is_active = TRUE
ORDER BY change_percent DESC
LIMIT 10;

-- Get top losers
SELECT
    symbol, name, price, change_amount,
    change_percent, volume, sector
FROM stocks
WHERE asset_type = 'stock' AND is_active = TRUE
ORDER BY change_percent ASC
LIMIT 10;

-- Get most active (by volume)
SELECT
    symbol, name, price, change_percent,
    volume, market_cap
FROM stocks
WHERE asset_type = 'stock' AND is_active = TRUE
    AND volume IS NOT NULL
ORDER BY volume DESC
LIMIT 10;

-- Update stock price
UPDATE stocks
SET
    price = ?,
    change_amount = ? - previous_close,
    change_percent = ((? - previous_close) / previous_close) * 100,
    volume = ?,
    last_updated = CURRENT_TIMESTAMP
WHERE symbol = ?;

-- ============================================
-- NEWS QUERIES
-- ============================================

-- Get recent news
SELECT * FROM news
ORDER BY published_at DESC
LIMIT 20;

-- Get news by category
SELECT * FROM news
WHERE category = ?
ORDER BY published_at DESC
LIMIT 20;

-- Get high impact news
SELECT * FROM news
WHERE impact = 'high'
ORDER BY published_at DESC
LIMIT 10;

-- Get news for specific time period
SELECT * FROM news
WHERE published_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY published_at DESC;

-- ============================================
-- WATCHLIST QUERIES
-- ============================================

-- Get user's watchlists
SELECT * FROM watchlists
WHERE user_id = ?
ORDER BY is_default DESC, name;

-- Get watchlist with stocks
SELECT
    wi.id,
    wi.symbol,
    s.name,
    s.price,
    s.change_percent,
    wi.notes
FROM watchlist_items wi
JOIN stocks s ON wi.stock_id = s.id
WHERE wi.watchlist_id = ?
ORDER BY s.symbol;

-- Add stock to watchlist
INSERT INTO watchlist_items (watchlist_id, stock_id, symbol, notes)
VALUES (?, ?, ?, ?);

-- Remove stock from watchlist
DELETE FROM watchlist_items
WHERE watchlist_id = ? AND stock_id = ?;

-- ============================================
-- ALERTS QUERIES
-- ============================================

-- Get active alerts for user
SELECT
    a.id,
    a.symbol,
    s.name,
    a.alert_type,
    a.condition_type,
    a.threshold_value,
    s.price as current_price
FROM alerts a
JOIN stocks s ON a.stock_id = s.id
WHERE a.user_id = ? AND a.is_active = TRUE
ORDER BY a.created_at DESC;

-- Check and trigger alerts
UPDATE alerts a
JOIN stocks s ON a.stock_id = s.id
SET
    a.is_triggered = TRUE,
    a.triggered_at = CURRENT_TIMESTAMP,
    a.is_active = FALSE
WHERE a.is_active = TRUE
    AND (
        (a.condition_type = 'above' AND s.price > a.threshold_value) OR
        (a.condition_type = 'below' AND s.price < a.threshold_value) OR
        (a.condition_type = 'equals' AND s.price = a.threshold_value)
    );

-- ============================================
-- ADMIN / CLIENT MANAGEMENT QUERIES
-- ============================================

-- Get all clients
SELECT
    c.id,
    c.first_name,
    c.last_name,
    c.email,
    c.account_status,
    c.is_accredited,
    u.username,
    u.cash_balance,
    u.last_login
FROM clients c
LEFT JOIN users u ON c.user_id = u.id
ORDER BY c.created_at DESC;

-- Get client details
SELECT
    c.*,
    u.username,
    u.cash_balance,
    u.is_active as account_active
FROM clients c
LEFT JOIN users u ON c.user_id = u.id
WHERE c.id = ?;

-- Update client status
UPDATE clients
SET account_status = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ?;

-- ============================================
-- REPORTING QUERIES
-- ============================================

-- Get user's total account value
SELECT
    u.id,
    u.username,
    u.cash_balance,
    COALESCE(SUM(p.shares * s.price), 0) as holdings_value,
    u.cash_balance + COALESCE(SUM(p.shares * s.price), 0) as total_account_value
FROM users u
LEFT JOIN portfolios p ON u.id = p.user_id AND p.account_type = 'live'
LEFT JOIN stocks s ON p.stock_id = s.id
WHERE u.id = ?
GROUP BY u.id, u.username, u.cash_balance;

-- Get realized gains/losses
SELECT
    SUM(CASE
        WHEN t.transaction_type = 'sell'
        THEN t.total_amount - (t.shares * (
            SELECT AVG(t2.price)
            FROM transactions t2
            WHERE t2.user_id = t.user_id
                AND t2.symbol = t.symbol
                AND t2.transaction_type = 'buy'
                AND t2.executed_at < t.executed_at
        ))
        ELSE 0
    END) as realized_pl
FROM transactions t
WHERE t.user_id = ?
    AND t.account_type = 'live';

-- Get monthly trading summary
SELECT
    DATE_FORMAT(executed_at, '%Y-%m') as month,
    COUNT(*) as total_trades,
    SUM(CASE WHEN transaction_type = 'buy' THEN 1 ELSE 0 END) as buys,
    SUM(CASE WHEN transaction_type = 'sell' THEN 1 ELSE 0 END) as sells,
    SUM(total_amount) as total_volume,
    SUM(fee) as total_fees
FROM transactions
WHERE user_id = ?
GROUP BY DATE_FORMAT(executed_at, '%Y-%m')
ORDER BY month DESC;

-- ============================================
-- AUDIT & ANALYTICS QUERIES
-- ============================================

-- Get recent audit logs for user
SELECT * FROM audit_logs
WHERE user_id = ?
ORDER BY created_at DESC
LIMIT 50;

-- Get audit logs by action
SELECT * FROM audit_logs
WHERE action = ?
ORDER BY created_at DESC
LIMIT 100;

-- Insert audit log
INSERT INTO audit_logs (
    user_id, action, entity_type, entity_id,
    old_values, new_values, ip_address, user_agent
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);

-- ============================================
-- PERFORMANCE OPTIMIZATION QUERIES
-- ============================================

-- Analyze query performance (PostgreSQL)
EXPLAIN ANALYZE
SELECT * FROM portfolios p
JOIN stocks s ON p.stock_id = s.id
WHERE p.user_id = ?;

-- Check index usage (PostgreSQL)
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Table size and row counts (PostgreSQL)
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    n_live_tup AS row_count
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
