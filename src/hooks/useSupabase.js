/**
 * React Hooks for Supabase Integration
 * Easy-to-use hooks for authentication and data operations
 */

import { useState, useEffect, useCallback } from 'react';
import { signIn, signUp, signOut, getCurrentUser, onAuthStateChange } from '../services/authService.js';
import {
  getAllStocks,
  getUserPortfolio,
  getUserTransactions,
  addToPortfolio,
  createTransaction
} from '../services/supabaseService.js';
import { syncManager } from '../services/syncService.js';

/**
 * Hook for Supabase authentication
 * Manages user authentication state and provides auth functions
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { user: currentUser } = await getCurrentUser();
        setUser(currentUser);
        setLoading(false);
      } catch (err) {
        console.error('Session check failed:', err);
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const subscription = onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Start/stop auto-sync based on auth state
      if (session?.user) {
        syncManager.startAutoSync(session.user.id);
      } else {
        syncManager.stopAutoSync();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleSignIn = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    const { user, session, error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
      return { success: false, error };
    }

    setUser(user);
    setSession(session);
    setLoading(false);

    // Start auto-sync after successful login
    if (user) {
      await syncManager.syncAll(user.id);
    }

    return { success: true, user, session };
  }, []);

  const handleSignUp = useCallback(async (email, password, metadata) => {
    setLoading(true);
    setError(null);

    const { user, session, error } = await signUp(email, password, metadata);

    if (error) {
      setError(error.message);
      setLoading(false);
      return { success: false, error };
    }

    setUser(user);
    setSession(session);
    setLoading(false);

    return { success: true, user, session };
  }, []);

  const handleSignOut = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Stop auto-sync before signing out
    syncManager.stopAutoSync();

    const { error } = await signOut();

    if (error) {
      setError(error.message);
      setLoading(false);
      return { success: false, error };
    }

    setUser(null);
    setSession(null);
    setLoading(false);

    return { success: true };
  }, []);

  return {
    user,
    session,
    loading,
    error,
    isAuthenticated: !!user,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut
  };
};

/**
 * Hook for fetching market data with caching
 */
export const useMarketData = (assetType = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: stocks, error } = await getAllStocks();

      if (error) throw error;

      // Filter by asset type if specified
      const filteredData = assetType
        ? stocks.filter(stock => stock.asset_type === assetType)
        : stocks;

      setData(filteredData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [assetType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

/**
 * Hook for user's portfolio
 */
export const usePortfolio = (userId) => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPortfolio = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await getUserPortfolio(userId);

      if (error) throw error;

      setPortfolio(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const addStock = useCallback(async (stockData) => {
    try {
      const { data, error } = await addToPortfolio(userId, stockData);

      if (error) throw error;

      // Refresh portfolio
      await fetchPortfolio();

      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [userId, fetchPortfolio]);

  return {
    portfolio,
    loading,
    error,
    refetch: fetchPortfolio,
    addStock
  };
};

/**
 * Hook for user's transactions
 */
export const useTransactions = (userId, limit = 100) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await getUserTransactions(userId, limit);

      if (error) throw error;

      setTransactions(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, limit]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = useCallback(async (transactionData) => {
    try {
      const { data, error } = await createTransaction(userId, transactionData);

      if (error) throw error;

      // Refresh transactions
      await fetchTransactions();

      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [userId, fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
    addTransaction
  };
};

/**
 * Hook for data synchronization status
 */
export const useSyncStatus = () => {
  const [status, setStatus] = useState(syncManager.getStatus());
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setStatus(syncManager.getStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const triggerSync = useCallback(async (userId) => {
    const result = await syncManager.syncAll(userId);
    setStatus(syncManager.getStatus());
    return result;
  }, []);

  return {
    status,
    triggerSync,
    enableAutoRefresh: () => setAutoRefresh(true),
    disableAutoRefresh: () => setAutoRefresh(false)
  };
};

export default {
  useAuth,
  useMarketData,
  usePortfolio,
  useTransactions,
  useSyncStatus
};
