/**
 * Supabase Database Service
 * Handles all database operations for stocks, portfolios, transactions, etc.
 */

import supabase from '../lib/supabase.js';

/**
 * STOCKS OPERATIONS
 */

// Get all active stocks
export const getAllStocks = async () => {
  try {
    const { data, error } = await supabase
      .from('stocks')
      .select('*')
      .eq('is_active', true)
      .order('symbol');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching stocks:', error.message);
    return { data: null, error };
  }
};

// Get stock by symbol
export const getStockBySymbol = async (symbol) => {
  try {
    const { data, error} = await supabase
      .from('stocks')
      .select('*')
      .eq('symbol', symbol)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching stock ${symbol}:`, error.message);
    return { data: null, error };
  }
};

// Get stocks by asset type (stock, crypto, forex, commodity)
export const getStocksByType = async (assetType) => {
  try {
    const { data, error } = await supabase
      .from('stocks')
      .select('*')
      .eq('asset_type', assetType)
      .eq('is_active', true)
      .order('symbol');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching ${assetType}:`, error.message);
    return { data: null, error };
  }
};

// Update stock price
export const updateStockPrice = async (symbol, priceData) => {
  try {
    const { data, error } = await supabase
      .from('stocks')
      .update({
        price: priceData.price,
        previous_close: priceData.previousClose,
        change_amount: priceData.changeAmount,
        change_percent: priceData.changePercent,
        volume: priceData.volume,
        last_updated: new Date().toISOString()
      })
      .eq('symbol', symbol)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error(`Error updating stock ${symbol}:`, error.message);
    return { data: null, error };
  }
};

/**
 * PORTFOLIO OPERATIONS
 */

// Get user's portfolio
export const getUserPortfolio = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select(`
        *,
        stocks (symbol, name, price, asset_type, sector)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching portfolio:', error.message);
    return { data: null, error };
  }
};

// Add stock to portfolio
export const addToPortfolio = async (userId, stockData) => {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .insert({
        user_id: userId,
        stock_id: stockData.stockId,
        shares: stockData.shares,
        average_price: stockData.averagePrice,
        total_cost: stockData.totalCost,
        is_demo: stockData.isDemo || false
      })
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding to portfolio:', error.message);
    return { data: null, error };
  }
};

// Update portfolio position
export const updatePortfolioPosition = async (positionId, updateData) => {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .update({
        shares: updateData.shares,
        average_price: updateData.averagePrice,
        total_cost: updateData.totalCost
      })
      .eq('id', positionId)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating portfolio position:', error.message);
    return { data: null, error };
  }
};

// Remove from portfolio
export const removeFromPortfolio = async (positionId) => {
  try {
    const { error } = await supabase
      .from('portfolios')
      .delete()
      .eq('id', positionId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error removing from portfolio:', error.message);
    return { error };
  }
};

/**
 * TRANSACTION OPERATIONS
 */

// Get user's transactions
export const getUserTransactions = async (userId, limit = 100) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        stocks (symbol, name, asset_type)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    return { data: null, error };
  }
};

// Create a new transaction
export const createTransaction = async (userId, transactionData) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        stock_id: transactionData.stockId,
        transaction_type: transactionData.type, // 'buy' or 'sell'
        shares: transactionData.shares,
        price_per_share: transactionData.pricePerShare,
        total_amount: transactionData.totalAmount,
        fees: transactionData.fees || 0,
        status: transactionData.status || 'completed',
        is_demo: transactionData.isDemo || false
      })
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating transaction:', error.message);
    return { data: null, error };
  }
};

/**
 * USER OPERATIONS
 */

// Get user profile from database
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    return { data: null, error };
  }
};

// Update user cash balance
export const updateUserBalance = async (userId, newBalance) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ cash_balance: newBalance })
      .eq('id', userId)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating user balance:', error.message);
    return { data: null, error };
  }
};

// Create user profile (called after Supabase auth signup)
export const createUserProfile = async (authUserId, profileData) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: authUserId, // Use Supabase auth user ID
        username: profileData.username,
        email: profileData.email,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        user_role: profileData.userRole || 'client',
        cash_balance: profileData.cashBalance || 100000.00 // Default demo balance
      })
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating user profile:', error.message);
    return { data: null, error };
  }
};

/**
 * NEWS OPERATIONS
 */

// Get latest news
export const getNews = async (limit = 20) => {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching news:', error.message);
    return { data: null, error };
  }
};

// Get news by category
export const getNewsByCategory = async (category, limit = 20) => {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('category', category)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching ${category} news:`, error.message);
    return { data: null, error };
  }
};

/**
 * WATCHLIST OPERATIONS
 */

// Get user's watchlists
export const getUserWatchlists = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('watchlists')
      .select(`
        *,
        watchlist_items (
          *,
          stocks (symbol, name, price, change_percent)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching watchlists:', error.message);
    return { data: null, error };
  }
};

// Create a new watchlist
export const createWatchlist = async (userId, name) => {
  try {
    const { data, error } = await supabase
      .from('watchlists')
      .insert({
        user_id: userId,
        name: name
      })
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating watchlist:', error.message);
    return { data: null, error };
  }
};

// Add stock to watchlist
export const addToWatchlist = async (watchlistId, stockId) => {
  try {
    const { data, error } = await supabase
      .from('watchlist_items')
      .insert({
        watchlist_id: watchlistId,
        stock_id: stockId
      })
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding to watchlist:', error.message);
    return { data: null, error };
  }
};

export default {
  // Stocks
  getAllStocks,
  getStockBySymbol,
  getStocksByType,
  updateStockPrice,

  // Portfolio
  getUserPortfolio,
  addToPortfolio,
  updatePortfolioPosition,
  removeFromPortfolio,

  // Transactions
  getUserTransactions,
  createTransaction,

  // Users
  getUserProfile,
  updateUserBalance,
  createUserProfile,

  // News
  getNews,
  getNewsByCategory,

  // Watchlists
  getUserWatchlists,
  createWatchlist,
  addToWatchlist
};
