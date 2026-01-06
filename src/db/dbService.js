/**
 * Database Service Layer for Eurizon Investment Portal
 * Provides CRUD operations for all data stores with automatic mirroring
 */

import { getDB, STORES } from './indexedDB.js';

/**
 * Generic CRUD Operations
 */

/**
 * Add or update a single item in a store
 */
export const putItem = async (storeName, item) => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    // Add timestamp if not present
    if (!item.timestamp) {
      item.timestamp = Date.now();
    }

    const request = store.put(item);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      console.error(`DB Error: Failed to put item in ${storeName}`, request.error);
      reject(request.error);
    };
  });
};

/**
 * Add or update multiple items in a store (bulk operation)
 */
export const putItems = async (storeName, items) => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const timestamp = Date.now();

    let completed = 0;
    const errors = [];

    items.forEach((item, index) => {
      // Add timestamp if not present
      if (!item.timestamp) {
        item.timestamp = timestamp;
      }

      const request = store.put(item);

      request.onsuccess = () => {
        completed++;
        if (completed === items.length) {
          if (errors.length > 0) {
            reject({ message: 'Some items failed to save', errors });
          } else {
            resolve({ count: completed });
          }
        }
      };

      request.onerror = () => {
        errors.push({ index, item, error: request.error });
        completed++;
        if (completed === items.length) {
          reject({ message: 'Some items failed to save', errors });
        }
      };
    });

    if (items.length === 0) {
      resolve({ count: 0 });
    }
  });
};

/**
 * Get a single item from a store by key
 */
export const getItem = async (storeName, key) => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      console.error(`DB Error: Failed to get item from ${storeName}`, request.error);
      reject(request.error);
    };
  });
};

/**
 * Get all items from a store
 */
export const getAllItems = async (storeName) => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result || []);
    };

    request.onerror = () => {
      console.error(`DB Error: Failed to get all items from ${storeName}`, request.error);
      reject(request.error);
    };
  });
};

/**
 * Delete an item from a store by key
 */
export const deleteItem = async (storeName, key) => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      console.error(`DB Error: Failed to delete item from ${storeName}`, request.error);
      reject(request.error);
    };
  });
};

/**
 * Query items by index
 */
export const getItemsByIndex = async (storeName, indexName, indexValue) => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(indexValue);

    request.onsuccess = () => {
      resolve(request.result || []);
    };

    request.onerror = () => {
      console.error(`DB Error: Failed to query ${storeName} by ${indexName}`, request.error);
      reject(request.error);
    };
  });
};

/**
 * Count items in a store
 */
export const countItems = async (storeName) => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.count();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      console.error(`DB Error: Failed to count items in ${storeName}`, request.error);
      reject(request.error);
    };
  });
};

/**
 * Specific Data Type Operations
 */

// STOCKS Operations
export const saveStocks = (stocks) => putItems(STORES.STOCKS, stocks);
export const getStocks = () => getAllItems(STORES.STOCKS);
export const getStockBySymbol = (symbol) => getItem(STORES.STOCKS, symbol);
export const getStocksBySector = (sector) => getItemsByIndex(STORES.STOCKS, 'sector', sector);

// CRYPTO Operations
export const saveCrypto = (crypto) => putItems(STORES.CRYPTO, crypto);
export const getCrypto = () => getAllItems(STORES.CRYPTO);
export const getCryptoBySymbol = (symbol) => getItem(STORES.CRYPTO, symbol);

// FOREX Operations
export const saveForex = (forex) => putItems(STORES.FOREX, forex);
export const getForex = () => getAllItems(STORES.FOREX);
export const getForexBySymbol = (symbol) => getItem(STORES.FOREX, symbol);

// COMMODITIES Operations
export const saveCommodities = (commodities) => putItems(STORES.COMMODITIES, commodities);
export const getCommodities = () => getAllItems(STORES.COMMODITIES);
export const getCommodityBySymbol = (symbol) => getItem(STORES.COMMODITIES, symbol);

// PORTFOLIO Operations
export const savePortfolioItem = (item) => putItem(STORES.PORTFOLIO, item);
export const getPortfolio = () => getAllItems(STORES.PORTFOLIO);
export const getPortfolioBySymbol = (symbol) => getItemsByIndex(STORES.PORTFOLIO, 'symbol', symbol);
export const deletePortfolioItem = (id) => deleteItem(STORES.PORTFOLIO, id);

// TRANSACTIONS Operations
export const saveTransaction = (transaction) => putItem(STORES.TRANSACTIONS, transaction);
export const saveTransactions = (transactions) => putItems(STORES.TRANSACTIONS, transactions);
export const getTransactions = () => getAllItems(STORES.TRANSACTIONS);
export const getTransactionsBySymbol = (symbol) => getItemsByIndex(STORES.TRANSACTIONS, 'symbol', symbol);
export const getTransactionsByType = (type) => getItemsByIndex(STORES.TRANSACTIONS, 'type', type);

// USER PROFILE Operations
export const saveUserProfile = (profile) => putItem(STORES.USER_PROFILE, profile);
export const getUserProfile = (id = 'current') => getItem(STORES.USER_PROFILE, id);

// NEWS Operations
export const saveNews = (news) => putItems(STORES.NEWS, news);
export const getNews = () => getAllItems(STORES.NEWS);
export const getNewsByCategory = (category) => getItemsByIndex(STORES.NEWS, 'category', category);

// SETTINGS Operations
export const saveSetting = (key, value) => putItem(STORES.SETTINGS, { key, value, timestamp: Date.now() });
export const getSetting = (key) => getItem(STORES.SETTINGS, key);
export const getAllSettings = () => getAllItems(STORES.SETTINGS);

// MARKET DATA Operations
export const saveMarketData = (key, data) => putItem(STORES.MARKET_DATA, { key, data, timestamp: Date.now() });
export const getMarketData = (key) => getItem(STORES.MARKET_DATA, key);

/**
 * Sync all market data at once
 */
export const syncAllMarketData = async (marketData) => {
  const results = {};

  if (marketData.stocks) {
    results.stocks = await saveStocks(marketData.stocks);
  }

  if (marketData.crypto) {
    results.crypto = await saveCrypto(marketData.crypto);
  }

  if (marketData.forex) {
    results.forex = await saveForex(marketData.forex);
  }

  if (marketData.commodities) {
    results.commodities = await saveCommodities(marketData.commodities);
  }

  if (marketData.news) {
    results.news = await saveNews(marketData.news);
  }

  console.log('DB Sync: All market data synced successfully', results);
  return results;
};

/**
 * Restore all data from IndexedDB
 */
export const restoreAllData = async () => {
  const data = {
    stocks: await getStocks(),
    crypto: await getCrypto(),
    forex: await getForex(),
    commodities: await getCommodities(),
    portfolio: await getPortfolio(),
    transactions: await getTransactions(),
    news: await getNews(),
    settings: await getAllSettings()
  };

  console.log('DB Restore: All data restored from IndexedDB', {
    stocks: data.stocks.length,
    crypto: data.crypto.length,
    forex: data.forex.length,
    commodities: data.commodities.length,
    portfolio: data.portfolio.length,
    transactions: data.transactions.length,
    news: data.news.length,
    settings: data.settings.length
  });

  return data;
};

/**
 * Get database statistics
 */
export const getDatabaseStats = async () => {
  const stats = {
    stocks: await countItems(STORES.STOCKS),
    crypto: await countItems(STORES.CRYPTO),
    forex: await countItems(STORES.FOREX),
    commodities: await countItems(STORES.COMMODITIES),
    portfolio: await countItems(STORES.PORTFOLIO),
    transactions: await countItems(STORES.TRANSACTIONS),
    news: await countItems(STORES.NEWS),
    settings: await countItems(STORES.SETTINGS)
  };

  stats.total = Object.values(stats).reduce((sum, count) => sum + count, 0);

  return stats;
};

export default {
  // Generic operations
  putItem,
  putItems,
  getItem,
  getAllItems,
  deleteItem,
  getItemsByIndex,
  countItems,

  // Stocks
  saveStocks,
  getStocks,
  getStockBySymbol,
  getStocksBySector,

  // Crypto
  saveCrypto,
  getCrypto,
  getCryptoBySymbol,

  // Forex
  saveForex,
  getForex,
  getForexBySymbol,

  // Commodities
  saveCommodities,
  getCommodities,
  getCommodityBySymbol,

  // Portfolio
  savePortfolioItem,
  getPortfolio,
  getPortfolioBySymbol,
  deletePortfolioItem,

  // Transactions
  saveTransaction,
  saveTransactions,
  getTransactions,
  getTransactionsBySymbol,
  getTransactionsByType,

  // User Profile
  saveUserProfile,
  getUserProfile,

  // News
  saveNews,
  getNews,
  getNewsByCategory,

  // Settings
  saveSetting,
  getSetting,
  getAllSettings,

  // Market Data
  saveMarketData,
  getMarketData,

  // Bulk operations
  syncAllMarketData,
  restoreAllData,
  getDatabaseStats
};
