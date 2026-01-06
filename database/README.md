# Eurizon Investment Client Portal - Database Schema

## Overview

This directory contains the complete database schema for the Eurizon Investment Client Portal application. The schema is designed to support a full-featured investment management platform with user authentication, portfolio tracking, trading, market data, and news.

## Database Tables

### Core Tables

1. **users** - User accounts and authentication
   - Stores user credentials, profile information, and cash balance
   - Supports role-based access control (client, admin, superadmin)
   - Tracks accredited investor status for live trading access

2. **stocks** - Market data for tradeable assets
   - Supports multiple asset types: stocks, cryptocurrencies, forex, commodities
   - Real-time price data with change tracking
   - Market metrics (volume, market cap, highs/lows)

3. **portfolios** - User holdings/positions
   - Links users to their stock holdings
   - Tracks shares, average price, and total cost
   - Supports both live and demo trading accounts

4. **transactions** - Trading history
   - Complete audit trail of all buy/sell orders
   - Includes fees, status tracking, and execution timestamps
   - Links to users and stocks with proper referential integrity

5. **news** - Market news and updates
   - Categorized news articles with impact levels
   - Timestamps and source tracking
   - Support for rich content and images

6. **clients** - Client relationship management (Admin)
   - Extended client information for admin management
   - Address, risk profile, and account status
   - Links to user accounts

### Additional Features

7. **watchlists** - User-created stock watchlists
8. **watchlist_items** - Stocks in watchlists
9. **price_history** - Historical price data for charting
10. **alerts** - Price and volume alerts
11. **audit_logs** - System audit trail

## Schema Features

### Data Integrity
- Foreign key constraints to maintain referential integrity
- Check constraints for data validation
- Unique constraints to prevent duplicates
- Cascading deletes where appropriate

### Performance Optimization
- Comprehensive indexing strategy
- Indexes on frequently queried columns
- Composite indexes for common query patterns
- Generated/computed columns for derived values

### Scalability
- BIGINT primary keys for large datasets
- Efficient data types (DECIMAL for money, BIGINT for large numbers)
- Timestamp tracking for audit trails
- Partitioning-ready structure

### Security
- Password hash storage (never plain text)
- Audit logging for compliance
- Soft delete capabilities with is_active flags
- Role-based access control

## Installation

### PostgreSQL

```bash
# Create database
createdb eurizon_investment

# Run schema
psql eurizon_investment < schema.sql
```

### MySQL

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE eurizon_investment CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run schema (with modifications for MySQL)
mysql -u root -p eurizon_investment < schema.sql
```

**Note for MySQL:**
- Change `BIGINT PRIMARY KEY AUTO_INCREMENT` syntax as needed
- Replace `GENERATED ALWAYS AS ... STORED` with MySQL equivalent
- Adjust `INTERVAL` syntax in sample data inserts
- JSON columns require MySQL 5.7.8+

### SQLite

```bash
# Create and initialize database
sqlite3 eurizon_investment.db < schema_sqlite.sql
```

## Database Compatibility Notes

The main `schema.sql` file is written to be compatible with both PostgreSQL and MySQL with minor modifications:

### PostgreSQL (Recommended)
- Full support for all features
- JSON columns for flexible data
- Advanced constraint checking
- Best performance for concurrent users

### MySQL
- Requires MySQL 5.7+ for JSON support
- AUTO_INCREMENT syntax supported
- InnoDB engine recommended
- Good performance with proper indexing

### SQLite
- Suitable for development/testing
- Limited constraint support
- No concurrent write access
- Simplified schema in `schema_sqlite.sql`

## Sample Data

The schema includes initial seed data:
- Default superadmin user
- 10 major US stocks (AAPL, GOOGL, MSFT, etc.)
- 3 cryptocurrencies (BTC, ETH, BNB)
- Sample news articles

**Important:** Update the password hash for the superadmin user before deploying to production!

## Entity Relationships

```
users (1) ──→ (N) portfolios ──→ (1) stocks
users (1) ──→ (N) transactions ──→ (1) stocks
users (1) ──→ (N) watchlists ──→ (N) watchlist_items ──→ (1) stocks
users (1) ──→ (N) alerts ──→ (1) stocks
users (1) ──→ (1) clients
stocks (1) ──→ (N) price_history
users (1) ──→ (N) audit_logs
```

## Common Queries

### Get User Portfolio Value
```sql
SELECT
    u.username,
    u.cash_balance,
    COALESCE(SUM(p.shares * s.price), 0) as holdings_value,
    u.cash_balance + COALESCE(SUM(p.shares * s.price), 0) as total_value
FROM users u
LEFT JOIN portfolios p ON u.id = p.user_id
LEFT JOIN stocks s ON p.stock_id = s.id
WHERE u.id = ?
GROUP BY u.id;
```

### Get Portfolio Performance
```sql
SELECT
    p.symbol,
    s.name,
    p.shares,
    p.avg_price,
    s.price as current_price,
    (p.shares * s.price) as current_value,
    (p.shares * p.avg_price) as cost_basis,
    ((p.shares * s.price) - (p.shares * p.avg_price)) as profit_loss,
    (((s.price - p.avg_price) / p.avg_price) * 100) as pl_percent
FROM portfolios p
JOIN stocks s ON p.stock_id = s.id
WHERE p.user_id = ?
ORDER BY current_value DESC;
```

### Get Transaction History
```sql
SELECT
    t.id,
    t.symbol,
    s.name,
    t.transaction_type,
    t.shares,
    t.price,
    t.total_amount,
    t.fee,
    t.executed_at
FROM transactions t
JOIN stocks s ON t.stock_id = s.id
WHERE t.user_id = ?
ORDER BY t.executed_at DESC
LIMIT 50;
```

### Get Market Movers
```sql
-- Top Gainers
SELECT symbol, name, price, change_percent
FROM stocks
WHERE asset_type = 'stock'
ORDER BY change_percent DESC
LIMIT 10;

-- Top Losers
SELECT symbol, name, price, change_percent
FROM stocks
WHERE asset_type = 'stock'
ORDER BY change_percent ASC
LIMIT 10;
```

## Maintenance

### Backup
```bash
# PostgreSQL
pg_dump eurizon_investment > backup_$(date +%Y%m%d).sql

# MySQL
mysqldump -u root -p eurizon_investment > backup_$(date +%Y%m%d).sql
```

### Indexes
Monitor and optimize indexes based on query patterns:
```sql
-- PostgreSQL
EXPLAIN ANALYZE [your query];

-- MySQL
EXPLAIN [your query];
```

## Security Recommendations

1. **Password Hashing**: Use bcrypt with cost factor 10+ for password hashing
2. **Environment Variables**: Store database credentials in environment variables
3. **Least Privilege**: Create separate database users with minimal required permissions
4. **SSL/TLS**: Enable encrypted connections in production
5. **Audit Logging**: Regularly review audit logs for suspicious activity
6. **Backup Strategy**: Implement automated daily backups with off-site storage

## Migration Strategy

For production deployments, consider using migration tools:
- **Node.js**: Knex.js, Sequelize, TypeORM, Prisma
- **Python**: Alembic, Django migrations
- **Ruby**: ActiveRecord migrations
- **General**: Flyway, Liquibase

## Support

For questions or issues with the database schema, contact:
- Email: support@eurizoninvestment.com
- Documentation: See application README.md

## License

Proprietary - Eurizon Investment © 2026
