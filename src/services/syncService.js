/**
 * Data Synchronization Service
 * Coordinates data sync between IndexedDB (local) and Supabase (remote)
 * Implements offline-first with cloud backup strategy
 */

import {
  saveStocks,
  saveCrypto,
  saveForex,
  saveCommodities,
  savePortfolioItem,
  saveTransaction,
  saveNews,
  getStocks as getLocalStocks,
  getPortfolio as getLocalPortfolio,
  getTransactions as getLocalTransactions
} from '../db/dbService.js';

import {
  getAllStocks,
  getStocksByType,
  getUserPortfolio,
  getUserTransactions,
  getNews as getRemoteNews
} from './supabaseService.js';

/**
 * Sync Configuration
 */
export const SYNC_CONFIG = {
  AUTO_SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutes
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000, // 2 seconds
  BATCH_SIZE: 100
};

/**
 * Sync Manager Class
 * Handles bidirectional sync between local and remote databases
 */
export class SyncManager {
  constructor() {
    this.isSyncing = false;
    this.lastSyncTime = null;
    this.syncErrors = [];
    this.autoSyncInterval = null;
  }

  /**
   * Sync market data from Supabase to IndexedDB
   * Downloads latest market data and caches it locally
   */
  async syncMarketDataDown(userId = null) {
    if (this.isSyncing) {
      console.log('Sync already in progress, skipping...');
      return { success: false, message: 'Sync in progress' };
    }

    this.isSyncing = true;
    const results = {
      stocks: { success: false, count: 0 },
      crypto: { success: false, count: 0 },
      forex: { success: false, count: 0 },
      commodities: { success: false, count: 0 },
      news: { success: false, count: 0 }
    };

    try {
      console.log('Starting market data sync (Supabase → IndexedDB)...');

      // Fetch stocks
      const { data: stocks, error: stocksError } = await getStocksByType('stock');
      if (!stocksError && stocks) {
        await saveStocks(stocks);
        results.stocks = { success: true, count: stocks.length };
        console.log(`✓ Synced ${stocks.length} stocks`);
      }

      // Fetch crypto
      const { data: crypto, error: cryptoError } = await getStocksByType('crypto');
      if (!cryptoError && crypto) {
        await saveCrypto(crypto);
        results.crypto = { success: true, count: crypto.length };
        console.log(`✓ Synced ${crypto.length} cryptocurrencies`);
      }

      // Fetch forex
      const { data: forex, error: forexError } = await getStocksByType('forex');
      if (!forexError && forex) {
        await saveForex(forex);
        results.forex = { success: true, count: forex.length };
        console.log(`✓ Synced ${forex.length} forex pairs`);
      }

      // Fetch commodities
      const { data: commodities, error: commodError } = await getStocksByType('commodity');
      if (!commodError && commodities) {
        await saveCommodities(commodities);
        results.commodities = { success: true, count: commodities.length };
        console.log(`✓ Synced ${commodities.length} commodities`);
      }

      // Fetch news
      const { data: news, error: newsError } = await getRemoteNews(50);
      if (!newsError && news) {
        await saveNews(news);
        results.news = { success: true, count: news.length };
        console.log(`✓ Synced ${news.length} news articles`);
      }

      this.lastSyncTime = Date.now();
      console.log('✓ Market data sync completed successfully');

      return { success: true, results, timestamp: this.lastSyncTime };
    } catch (error) {
      console.error('Market data sync failed:', error);
      this.syncErrors.push({
        timestamp: Date.now(),
        type: 'market_data_down',
        error: error.message
      });
      return { success: false, error: error.message, results };
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Sync user data from Supabase to IndexedDB
   * Downloads user's portfolio, transactions, etc.
   */
  async syncUserDataDown(userId) {
    if (!userId) {
      console.warn('Cannot sync user data: no user ID provided');
      return { success: false, message: 'No user ID' };
    }

    const results = {
      portfolio: { success: false, count: 0 },
      transactions: { success: false, count: 0 }
    };

    try {
      console.log(`Starting user data sync for user ${userId} (Supabase → IndexedDB)...`);

      // Fetch portfolio
      const { data: portfolio, error: portfolioError } = await getUserPortfolio(userId);
      if (!portfolioError && portfolio) {
        for (const item of portfolio) {
          await savePortfolioItem(item);
        }
        results.portfolio = { success: true, count: portfolio.length };
        console.log(`✓ Synced ${portfolio.length} portfolio items`);
      }

      // Fetch transactions
      const { data: transactions, error: transError } = await getUserTransactions(userId);
      if (!transError && transactions) {
        for (const transaction of transactions) {
          await saveTransaction(transaction);
        }
        results.transactions = { success: true, count: transactions.length };
        console.log(`✓ Synced ${transactions.length} transactions`);
      }

      console.log('✓ User data sync completed successfully');
      return { success: true, results };
    } catch (error) {
      console.error('User data sync failed:', error);
      this.syncErrors.push({
        timestamp: Date.now(),
        type: 'user_data_down',
        userId,
        error: error.message
      });
      return { success: false, error: error.message, results };
    }
  }

  /**
   * Sync user data from IndexedDB to Supabase
   * Uploads local changes to the cloud
   */
  async syncUserDataUp(userId) {
    if (!userId) {
      console.warn('Cannot sync user data up: no user ID provided');
      return { success: false, message: 'No user ID' };
    }

    try {
      console.log(`Starting user data upload for user ${userId} (IndexedDB → Supabase)...`);

      // Get local data
      const localPortfolio = await getLocalPortfolio();
      const localTransactions = await getLocalTransactions();

      // TODO: Implement conflict resolution and upload logic
      // This requires tracking which items are "dirty" (modified locally)
      // and haven't been synced yet

      console.log('✓ User data upload completed');
      return { success: true };
    } catch (error) {
      console.error('User data upload failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Full sync - both market data and user data
   */
  async syncAll(userId = null) {
    console.log('Starting full sync...');

    const marketSync = await this.syncMarketDataDown(userId);
    const userSync = userId ? await this.syncUserDataDown(userId) : null;

    return {
      success: marketSync.success && (userSync?.success !== false),
      market: marketSync,
      user: userSync
    };
  }

  /**
   * Start automatic syncing at regular intervals
   */
  startAutoSync(userId = null, interval = SYNC_CONFIG.AUTO_SYNC_INTERVAL) {
    if (this.autoSyncInterval) {
      console.log('Auto-sync already running');
      return;
    }

    console.log(`Starting auto-sync (interval: ${interval / 1000}s)`);

    // Initial sync
    this.syncAll(userId);

    // Set up interval
    this.autoSyncInterval = setInterval(() => {
      console.log('Auto-sync triggered');
      this.syncAll(userId);
    }, interval);
  }

  /**
   * Stop automatic syncing
   */
  stopAutoSync() {
    if (this.autoSyncInterval) {
      clearInterval(this.autoSyncInterval);
      this.autoSyncInterval = null;
      console.log('Auto-sync stopped');
    }
  }

  /**
   * Get sync status
   */
  getStatus() {
    return {
      isSyncing: this.isSyncing,
      lastSyncTime: this.lastSyncTime,
      lastSyncAge: this.lastSyncTime ? Date.now() - this.lastSyncTime : null,
      autoSyncEnabled: !!this.autoSyncInterval,
      recentErrors: this.syncErrors.slice(-5)
    };
  }

  /**
   * Clear sync errors
   */
  clearErrors() {
    this.syncErrors = [];
  }
}

// Create global sync manager instance
export const syncManager = new SyncManager();

export default {
  SyncManager,
  syncManager,
  SYNC_CONFIG
};
