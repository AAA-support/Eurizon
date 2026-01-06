/**
 * Data Mirroring Utilities for Eurizon Investment Portal
 * Provides cache invalidation, data refresh strategies, and sync management
 */

import {
  syncAllMarketData,
  restoreAllData,
  getDatabaseStats
} from '../db/dbService.js';
import { clearStore, clearAllStores, getDatabaseSize } from '../db/indexedDB.js';

/**
 * Cache Configuration
 */
export const CACHE_CONFIG = {
  // Time-to-live for different data types (in milliseconds)
  TTL: {
    STOCKS: 5 * 60 * 1000,        // 5 minutes
    CRYPTO: 3 * 60 * 1000,        // 3 minutes
    FOREX: 5 * 60 * 1000,         // 5 minutes
    COMMODITIES: 10 * 60 * 1000,  // 10 minutes
    NEWS: 30 * 60 * 1000,         // 30 minutes
    PORTFOLIO: 60 * 60 * 1000,    // 1 hour
    TRANSACTIONS: 60 * 60 * 1000  // 1 hour
  },

  // Max age before forcing refresh
  MAX_AGE: {
    STOCKS: 15 * 60 * 1000,       // 15 minutes
    CRYPTO: 10 * 60 * 1000,       // 10 minutes
    FOREX: 15 * 60 * 1000,        // 15 minutes
    COMMODITIES: 30 * 60 * 1000,  // 30 minutes
    NEWS: 2 * 60 * 60 * 1000,     // 2 hours
    PORTFOLIO: 24 * 60 * 60 * 1000,    // 24 hours
    TRANSACTIONS: 24 * 60 * 60 * 1000  // 24 hours
  }
};

/**
 * Check if cached data is still valid
 * @param {number} timestamp - Timestamp of cached data
 * @param {number} ttl - Time-to-live in milliseconds
 * @returns {boolean}
 */
export const isCacheValid = (timestamp, ttl) => {
  if (!timestamp) return false;
  const age = Date.now() - timestamp;
  return age < ttl;
};

/**
 * Check if data needs refresh based on max age
 * @param {number} timestamp - Timestamp of cached data
 * @param {number} maxAge - Maximum age in milliseconds
 * @returns {boolean}
 */
export const needsRefresh = (timestamp, maxAge) => {
  if (!timestamp) return true;
  const age = Date.now() - timestamp;
  return age >= maxAge;
};

/**
 * Invalidate cache for a specific data type
 * @param {string} storeName - Name of the store to invalidate
 */
export const invalidateCache = async (storeName) => {
  try {
    await clearStore(storeName);
    console.log(`Cache invalidated: ${storeName}`);
    return true;
  } catch (error) {
    console.error(`Failed to invalidate cache for ${storeName}:`, error);
    return false;
  }
};

/**
 * Invalidate all caches
 */
export const invalidateAllCaches = async () => {
  try {
    await clearAllStores();
    console.log('All caches invalidated');
    return true;
  } catch (error) {
    console.error('Failed to invalidate all caches:', error);
    return false;
  }
};

/**
 * Smart data refresh strategy
 * Determines if data should be fetched from cache or needs refresh
 */
export class DataRefreshStrategy {
  constructor() {
    this.lastRefreshTimes = new Map();
  }

  /**
   * Check if data should be loaded from cache or needs refresh
   * @param {string} dataType - Type of data (stocks, crypto, etc.)
   * @param {number} cachedTimestamp - Timestamp of cached data
   * @returns {Object} - Strategy decision
   */
  shouldRefresh(dataType, cachedTimestamp) {
    const ttl = CACHE_CONFIG.TTL[dataType.toUpperCase()];
    const maxAge = CACHE_CONFIG.MAX_AGE[dataType.toUpperCase()];

    const isValid = isCacheValid(cachedTimestamp, ttl);
    const needsUpdate = needsRefresh(cachedTimestamp, maxAge);

    return {
      useCache: isValid && !needsUpdate,
      shouldUpdate: !isValid || needsUpdate,
      reason: !isValid ? 'expired' : needsUpdate ? 'max_age_reached' : 'valid'
    };
  }

  /**
   * Record refresh time for a data type
   * @param {string} dataType - Type of data
   */
  recordRefresh(dataType) {
    this.lastRefreshTimes.set(dataType, Date.now());
  }

  /**
   * Get last refresh time for a data type
   * @param {string} dataType - Type of data
   * @returns {number|null} - Timestamp or null
   */
  getLastRefreshTime(dataType) {
    return this.lastRefreshTimes.get(dataType) || null;
  }

  /**
   * Check if minimum refresh interval has passed
   * @param {string} dataType - Type of data
   * @param {number} minInterval - Minimum interval in milliseconds (default: 1 minute)
   * @returns {boolean}
   */
  canRefresh(dataType, minInterval = 60000) {
    const lastRefresh = this.getLastRefreshTime(dataType);
    if (!lastRefresh) return true;

    const timeSinceRefresh = Date.now() - lastRefresh;
    return timeSinceRefresh >= minInterval;
  }
}

/**
 * Global refresh strategy instance
 */
export const refreshStrategy = new DataRefreshStrategy();

/**
 * Sync manager for coordinating data synchronization
 */
export class SyncManager {
  constructor() {
    this.isSyncing = false;
    this.syncQueue = [];
    this.lastSyncTime = null;
    this.syncErrors = [];
  }

  /**
   * Sync all data with debouncing to prevent excessive syncs
   * @param {Object} data - Data to sync
   * @param {number} debounceMs - Debounce delay
   * @returns {Promise}
   */
  async syncAll(data, debounceMs = 1000) {
    return new Promise((resolve, reject) => {
      this.syncQueue.push({ data, resolve, reject });

      setTimeout(async () => {
        if (this.isSyncing) return;

        this.isSyncing = true;
        const queue = [...this.syncQueue];
        this.syncQueue = [];

        try {
          // Use the latest data from queue
          const latestData = queue[queue.length - 1].data;
          await syncAllMarketData(latestData);

          this.lastSyncTime = Date.now();
          this.syncErrors = [];

          // Resolve all queued promises
          queue.forEach(item => item.resolve());

          console.log('Sync completed successfully');
        } catch (error) {
          this.syncErrors.push({
            timestamp: Date.now(),
            error: error.message
          });

          // Reject all queued promises
          queue.forEach(item => item.reject(error));

          console.error('Sync failed:', error);
        } finally {
          this.isSyncing = false;
        }
      }, debounceMs);
    });
  }

  /**
   * Get sync status
   * @returns {Object}
   */
  getStatus() {
    return {
      isSyncing: this.isSyncing,
      queueLength: this.syncQueue.length,
      lastSyncTime: this.lastSyncTime,
      lastSyncAge: this.lastSyncTime ? Date.now() - this.lastSyncTime : null,
      recentErrors: this.syncErrors.slice(-5)
    };
  }

  /**
   * Force immediate sync (bypasses queue)
   * @param {Object} data - Data to sync
   */
  async forceSync(data) {
    this.isSyncing = true;
    try {
      await syncAllMarketData(data);
      this.lastSyncTime = Date.now();
      console.log('Force sync completed');
      return true;
    } catch (error) {
      this.syncErrors.push({
        timestamp: Date.now(),
        error: error.message
      });
      console.error('Force sync failed:', error);
      throw error;
    } finally {
      this.isSyncing = false;
    }
  }
}

/**
 * Global sync manager instance
 */
export const syncManager = new SyncManager();

/**
 * Data restoration with fallback strategies
 */
export const restoreWithFallback = async (fallbackData = null) => {
  try {
    console.log('Attempting to restore data from IndexedDB...');
    const restoredData = await restoreAllData();

    // Check if any data was restored
    const hasData = Object.values(restoredData).some(arr => arr && arr.length > 0);

    if (hasData) {
      console.log('Data restored successfully from IndexedDB');
      return {
        success: true,
        data: restoredData,
        source: 'indexeddb'
      };
    } else if (fallbackData) {
      console.log('No cached data found, using fallback data');
      return {
        success: true,
        data: fallbackData,
        source: 'fallback'
      };
    } else {
      console.log('No data available (cache empty, no fallback provided)');
      return {
        success: false,
        data: null,
        source: 'none'
      };
    }
  } catch (error) {
    console.error('Failed to restore data:', error);

    if (fallbackData) {
      console.log('Using fallback data due to restore error');
      return {
        success: true,
        data: fallbackData,
        source: 'fallback',
        error: error.message
      };
    }

    return {
      success: false,
      data: null,
      source: 'none',
      error: error.message
    };
  }
};

/**
 * Get comprehensive cache statistics
 */
export const getCacheStats = async () => {
  try {
    const dbStats = await getDatabaseStats();
    const dbSize = await getDatabaseSize();

    return {
      itemCounts: dbStats,
      storage: dbSize,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Failed to get cache stats:', error);
    return null;
  }
};

/**
 * Periodic cache cleanup (removes old data)
 * Call this periodically to prevent database bloat
 */
export const performCacheCleanup = async (options = {}) => {
  const { dryRun = false, maxAgeMs = 7 * 24 * 60 * 60 * 1000 } = options; // Default: 7 days

  console.log(`Cache cleanup ${dryRun ? '(dry run)' : 'started'}...`);

  // This is a placeholder - implement specific cleanup logic based on your needs
  // For example, remove news older than 7 days, etc.

  const stats = await getCacheStats();
  console.log('Current cache stats:', stats);

  if (!dryRun) {
    // Implement cleanup logic here
    // Example: Remove news older than maxAgeMs
    // This would require custom queries based on timestamp indexes
  }

  return stats;
};

export default {
  CACHE_CONFIG,
  isCacheValid,
  needsRefresh,
  invalidateCache,
  invalidateAllCaches,
  DataRefreshStrategy,
  refreshStrategy,
  SyncManager,
  syncManager,
  restoreWithFallback,
  getCacheStats,
  performCacheCleanup
};
