/**
 * Authentication Service
 * Handles all Supabase authentication operations
 */

import supabase from '../lib/supabase.js';

/**
 * Sign up a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {Object} metadata - Additional user metadata (firstName, lastName, etc.)
 * @returns {Promise<{user, session, error}>}
 */
export const signUp = async (email, password, metadata = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: metadata.firstName || '',
          last_name: metadata.lastName || '',
          user_role: metadata.userRole || 'client',
          ...metadata
        }
      }
    });

    if (error) throw error;

    console.log('User signed up successfully:', data.user?.email);
    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error('Sign up error:', error.message);
    return { user: null, session: null, error };
  }
};

/**
 * Sign in an existing user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{user, session, error}>}
 */
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    console.log('User signed in successfully:', data.user?.email);
    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error('Sign in error:', error.message);
    return { user: null, session: null, error };
  }
};

/**
 * Sign out the current user
 * @returns {Promise<{error}>}
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    console.log('User signed out successfully');
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error.message);
    return { error };
  }
};

/**
 * Get the current authenticated user
 * @returns {Promise<{user, error}>}
 */
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;

    return { user: data.user, error: null };
  } catch (error) {
    console.error('Get current user error:', error.message);
    return { user: null, error };
  }
};

/**
 * Get the current session
 * @returns {Promise<{session, error}>}
 */
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;

    return { session: data.session, error: null };
  } catch (error) {
    console.error('Get session error:', error.message);
    return { session: null, error };
  }
};

/**
 * Reset password for a user
 * @param {string} email - User email
 * @returns {Promise<{error}>}
 */
export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) throw error;

    console.log('Password reset email sent to:', email);
    return { error: null };
  } catch (error) {
    console.error('Reset password error:', error.message);
    return { error };
  }
};

/**
 * Update user password
 * @param {string} newPassword - New password
 * @returns {Promise<{user, error}>}
 */
export const updatePassword = async (newPassword) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;

    console.log('Password updated successfully');
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Update password error:', error.message);
    return { user: null, error };
  }
};

/**
 * Update user metadata
 * @param {Object} metadata - User metadata to update
 * @returns {Promise<{user, error}>}
 */
export const updateUserMetadata = async (metadata) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata
    });

    if (error) throw error;

    console.log('User metadata updated successfully');
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Update metadata error:', error.message);
    return { user: null, error };
  }
};

/**
 * Listen to auth state changes
 * @param {Function} callback - Callback function to handle auth state changes
 * @returns {Object} - Subscription object with unsubscribe method
 */
export const onAuthStateChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      callback(event, session);
    }
  );

  return subscription;
};

export default {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  getSession,
  resetPassword,
  updatePassword,
  updateUserMetadata,
  onAuthStateChange
};
