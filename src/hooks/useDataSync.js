/**
 * React Hooks for Data Synchronization with IndexedDB
 * Auto-mirrors data between React state and IndexedDB
 */

import { useEffect, useRef, useCallback } from 'react';
import {
  saveStocks,
  saveCrypto,
  saveForex,
  saveCommodities,
  savePortfolioItem,
  saveTransaction,
  saveNews,
  saveSetting,
  syncAllMarketData,
  restoreAllData,
  getStocks,
  getCrypto,
  getForex,
  getCommodities,
  getPortfolio,
  getTransactions,
  getNews
} from '../db/dbService.js';

/**
 * Hook to sync market data (stocks, crypto, forex, commodities) to IndexedDB
 * Automatically saves data whenever it changes
 *
 * @param {Object} marketData - Object containing stocks, crypto, forex, commodities arrays
 * @param {Object} options - Configuration options
 * @param {number} options.debounceMs - Debounce delay in milliseconds (default: 500)
 * @param {boolean} options.enabled - Enable/disable sync (default: true)
 */
export const useMarketDataSync = (marketData, options = {}) => {
  const { debounceMs = 500, enabled = true } = options;
  const timeoutRef = useRef(null);
  const previousDataRef = useRef(null);

  useEffect(() => {
    if (!enabled || !marketData) return;

    // Check if data actually changed
    const dataChanged = JSON.stringify(marketData) !== JSON.stringify(previousDataRef.current);
    if (!dataChanged) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the sync operation
    timeoutRef.current = setTimeout(async () => {
      try {
        await syncAllMarketData(marketData);
        previousDataRef.current = marketData;
        console.log('Market data synced to IndexedDB');
      } catch (error) {
        console.error('Failed to sync market data:', error);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [marketData, debounceMs, enabled]);
};

/**
 * Hook to sync stocks data to IndexedDB
 */
export const useStocksSync = (stocks, options = {}) => {
  const { debounceMs = 500, enabled = true } = options;
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!enabled || !stocks || stocks.length === 0) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        await saveStocks(stocks);
        console.log(`Synced ${stocks.length} stocks to IndexedDB`);
      } catch (error) {
        console.error('Failed to sync stocks:', error);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [stocks, debounceMs, enabled]);
};

/**
 * Hook to sync crypto data to IndexedDB
 */
export const useCryptoSync = (crypto, options = {}) => {
  const { debounceMs = 500, enabled = true } = options;
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!enabled || !crypto || crypto.length === 0) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        await saveCrypto(crypto);
        console.log(`Synced ${crypto.length} cryptocurrencies to IndexedDB`);
      } catch (error) {
        console.error('Failed to sync crypto:', error);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [crypto, debounceMs, enabled]);
};

/**
 * Hook to sync forex data to IndexedDB
 */
export const useForexSync = (forex, options = {}) => {
  const { debounceMs = 500, enabled = true } = options;
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!enabled || !forex || forex.length === 0) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        await saveForex(forex);
        console.log(`Synced ${forex.length} forex pairs to IndexedDB`);
      } catch (error) {
        console.error('Failed to sync forex:', error);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [forex, debounceMs, enabled]);
};

/**
 * Hook to sync commodities data to IndexedDB
 */
export const useCommoditiesSync = (commodities, options = {}) => {
  const { debounceMs = 500, enabled = true } = options;
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!enabled || !commodities || commodities.length === 0) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        await saveCommodities(commodities);
        console.log(`Synced ${commodities.length} commodities to IndexedDB`);
      } catch (error) {
        console.error('Failed to sync commodities:', error);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [commodities, debounceMs, enabled]);
};

/**
 * Hook to sync portfolio data to IndexedDB
 */
export const usePortfolioSync = (portfolio, options = {}) => {
  const { debounceMs = 500, enabled = true } = options;
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!enabled || !portfolio || portfolio.length === 0) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        for (const item of portfolio) {
          await savePortfolioItem(item);
        }
        console.log(`Synced ${portfolio.length} portfolio items to IndexedDB`);
      } catch (error) {
        console.error('Failed to sync portfolio:', error);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [portfolio, debounceMs, enabled]);
};

/**
 * Hook to sync transactions to IndexedDB
 */
export const useTransactionsSync = (transactions, options = {}) => {
  const { debounceMs = 500, enabled = true } = options;
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!enabled || !transactions || transactions.length === 0) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        for (const transaction of transactions) {
          await saveTransaction(transaction);
        }
        console.log(`Synced ${transactions.length} transactions to IndexedDB`);
      } catch (error) {
        console.error('Failed to sync transactions:', error);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [transactions, debounceMs, enabled]);
};

/**
 * Hook to restore all data from IndexedDB on mount
 * Returns loading state and restored data
 */
export const useDataRestore = (options = {}) => {
  const { onRestoreComplete } = options;

  const restoreData = useCallback(async () => {
    try {
      console.log('Restoring data from IndexedDB...');
      const data = await restoreAllData();

      if (onRestoreComplete) {
        onRestoreComplete(data);
      }

      return data;
    } catch (error) {
      console.error('Failed to restore data from IndexedDB:', error);
      throw error;
    }
  }, [onRestoreComplete]);

  return restoreData;
};

/**
 * Hook to initialize database and restore data on app startup
 * Use this in your App.jsx or main component
 */
export const useInitializeDatabase = (options = {}) => {
  const { autoRestore = true, onInitComplete } = options;

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('Initializing IndexedDB...');

        // Import initDB dynamically to avoid circular dependencies
        const { initDB } = await import('../db/indexedDB.js');
        await initDB();

        if (autoRestore) {
          const data = await restoreAllData();
          console.log('Database initialized and data restored');

          if (onInitComplete) {
            onInitComplete(data);
          }

          return data;
        } else {
          console.log('Database initialized (auto-restore disabled)');

          if (onInitComplete) {
            onInitComplete(null);
          }
        }
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initialize();
  }, [autoRestore, onInitComplete]);
};

/**
 * Hook to save a single setting to IndexedDB
 */
export const useSaveSetting = () => {
  return useCallback(async (key, value) => {
    try {
      await saveSetting(key, value);
      console.log(`Setting saved: ${key}`);
    } catch (error) {
      console.error(`Failed to save setting ${key}:`, error);
    }
  }, []);
};

/**
 * Hook for manual sync trigger
 * Returns a function that can be called to sync specific data
 */
export const useManualSync = () => {
  const syncStocks = useCallback(async (stocks) => {
    try {
      await saveStocks(stocks);
      console.log('Stocks synced manually');
    } catch (error) {
      console.error('Manual stocks sync failed:', error);
      throw error;
    }
  }, []);

  const syncCrypto = useCallback(async (crypto) => {
    try {
      await saveCrypto(crypto);
      console.log('Crypto synced manually');
    } catch (error) {
      console.error('Manual crypto sync failed:', error);
      throw error;
    }
  }, []);

  const syncPortfolio = useCallback(async (portfolio) => {
    try {
      for (const item of portfolio) {
        await savePortfolioItem(item);
      }
      console.log('Portfolio synced manually');
    } catch (error) {
      console.error('Manual portfolio sync failed:', error);
      throw error;
    }
  }, []);

  const syncAll = useCallback(async (allData) => {
    try {
      await syncAllMarketData(allData);
      console.log('All data synced manually');
    } catch (error) {
      console.error('Manual sync all failed:', error);
      throw error;
    }
  }, []);

  return {
    syncStocks,
    syncCrypto,
    syncPortfolio,
    syncAll
  };
};

export default {
  useMarketDataSync,
  useStocksSync,
  useCryptoSync,
  useForexSync,
  useCommoditiesSync,
  usePortfolioSync,
  useTransactionsSync,
  useDataRestore,
  useInitializeDatabase,
  useSaveSetting,
  useManualSync
};
