/**
 * IndexedDB Database Configuration for Eurizon Investment Portal
 * This file sets up the database schema for mirroring all application data
 */

const DB_NAME = 'EurizonInvestmentDB';
const DB_VERSION = 1;

/**
 * Database Store Names
 */
export const STORES = {
  STOCKS: 'stocks',
  CRYPTO: 'crypto',
  FOREX: 'forex',
  COMMODITIES: 'commodities',
  PORTFOLIO: 'portfolio',
  TRANSACTIONS: 'transactions',
  USER_PROFILE: 'userProfile',
  NEWS: 'news',
  SETTINGS: 'settings',
  MARKET_DATA: 'marketData'
};

/**
 * Initialize IndexedDB Database
 * Creates all object stores with appropriate indexes
 */
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB: Failed to open database', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      console.log('IndexedDB: Database opened successfully');
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      console.log('IndexedDB: Upgrading database schema...');

      // STOCKS Store
      if (!db.objectStoreNames.contains(STORES.STOCKS)) {
        const stocksStore = db.createObjectStore(STORES.STOCKS, { keyPath: 'symbol' });
        stocksStore.createIndex('sector', 'sector', { unique: false });
        stocksStore.createIndex('marketCap', 'marketCap', { unique: false });
        stocksStore.createIndex('timestamp', 'timestamp', { unique: false });
        console.log('IndexedDB: Created stocks store');
      }

      // CRYPTO Store
      if (!db.objectStoreNames.contains(STORES.CRYPTO)) {
        const cryptoStore = db.createObjectStore(STORES.CRYPTO, { keyPath: 'symbol' });
        cryptoStore.createIndex('sector', 'sector', { unique: false });
        cryptoStore.createIndex('timestamp', 'timestamp', { unique: false });
        console.log('IndexedDB: Created crypto store');
      }

      // FOREX Store
      if (!db.objectStoreNames.contains(STORES.FOREX)) {
        const forexStore = db.createObjectStore(STORES.FOREX, { keyPath: 'symbol' });
        cryptoStore.createIndex('timestamp', 'timestamp', { unique: false });
        console.log('IndexedDB: Created forex store');
      }

      // COMMODITIES Store
      if (!db.objectStoreNames.contains(STORES.COMMODITIES)) {
        const commoditiesStore = db.createObjectStore(STORES.COMMODITIES, { keyPath: 'symbol' });
        commoditiesStore.createIndex('timestamp', 'timestamp', { unique: false });
        console.log('IndexedDB: Created commodities store');
      }

      // PORTFOLIO Store
      if (!db.objectStoreNames.contains(STORES.PORTFOLIO)) {
        const portfolioStore = db.createObjectStore(STORES.PORTFOLIO, { keyPath: 'id', autoIncrement: true });
        portfolioStore.createIndex('symbol', 'symbol', { unique: false });
        portfolioStore.createIndex('type', 'type', { unique: false });
        portfolioStore.createIndex('timestamp', 'timestamp', { unique: false });
        console.log('IndexedDB: Created portfolio store');
      }

      // TRANSACTIONS Store
      if (!db.objectStoreNames.contains(STORES.TRANSACTIONS)) {
        const transactionsStore = db.createObjectStore(STORES.TRANSACTIONS, { keyPath: 'id', autoIncrement: true });
        transactionsStore.createIndex('symbol', 'symbol', { unique: false });
        transactionsStore.createIndex('type', 'type', { unique: false });
        transactionsStore.createIndex('date', 'date', { unique: false });
        transactionsStore.createIndex('timestamp', 'timestamp', { unique: false });
        console.log('IndexedDB: Created transactions store');
      }

      // USER_PROFILE Store
      if (!db.objectStoreNames.contains(STORES.USER_PROFILE)) {
        const userProfileStore = db.createObjectStore(STORES.USER_PROFILE, { keyPath: 'id' });
        userProfileStore.createIndex('email', 'email', { unique: true });
        userProfileStore.createIndex('timestamp', 'timestamp', { unique: false });
        console.log('IndexedDB: Created user profile store');
      }

      // NEWS Store
      if (!db.objectStoreNames.contains(STORES.NEWS)) {
        const newsStore = db.createObjectStore(STORES.NEWS, { keyPath: 'id', autoIncrement: true });
        newsStore.createIndex('category', 'category', { unique: false });
        newsStore.createIndex('timestamp', 'timestamp', { unique: false });
        newsStore.createIndex('impact', 'impact', { unique: false });
        console.log('IndexedDB: Created news store');
      }

      // SETTINGS Store
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        const settingsStore = db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
        console.log('IndexedDB: Created settings store');
      }

      // MARKET_DATA Store (for general market information)
      if (!db.objectStoreNames.contains(STORES.MARKET_DATA)) {
        const marketDataStore = db.createObjectStore(STORES.MARKET_DATA, { keyPath: 'key' });
        marketDataStore.createIndex('timestamp', 'timestamp', { unique: false });
        console.log('IndexedDB: Created market data store');
      }

      console.log('IndexedDB: Database schema upgrade complete');
    };
  });
};

/**
 * Get database connection
 */
export const getDB = async () => {
  return await initDB();
};

/**
 * Clear all data from a specific store
 */
export const clearStore = async (storeName) => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = () => {
      console.log(`IndexedDB: Cleared ${storeName} store`);
      resolve();
    };

    request.onerror = () => {
      console.error(`IndexedDB: Failed to clear ${storeName}`, request.error);
      reject(request.error);
    };
  });
};

/**
 * Clear all data from all stores
 */
export const clearAllStores = async () => {
  const storeNames = Object.values(STORES);
  for (const storeName of storeNames) {
    await clearStore(storeName);
  }
  console.log('IndexedDB: Cleared all stores');
};

/**
 * Delete the entire database
 */
export const deleteDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);

    request.onsuccess = () => {
      console.log('IndexedDB: Database deleted successfully');
      resolve();
    };

    request.onerror = () => {
      console.error('IndexedDB: Failed to delete database', request.error);
      reject(request.error);
    };
  });
};

/**
 * Get database size (approximate)
 */
export const getDatabaseSize = async () => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage,
      quota: estimate.quota,
      usageInMB: (estimate.usage / (1024 * 1024)).toFixed(2),
      quotaInMB: (estimate.quota / (1024 * 1024)).toFixed(2),
      percentUsed: ((estimate.usage / estimate.quota) * 100).toFixed(2)
    };
  }
  return null;
};

export default {
  initDB,
  getDB,
  clearStore,
  clearAllStores,
  deleteDatabase,
  getDatabaseSize,
  STORES,
  DB_NAME,
  DB_VERSION
};
