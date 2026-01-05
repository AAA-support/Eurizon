import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './LoginPage.css';

const LoginPage = () => {
  const { handleLogin, loading } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await handleLogin(email, password);

      if (!result.success) {
        setError(result.error || 'Invalid credentials! Please check your email and password.');
        setPassword('');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="login-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <img
            src="/eurizon-logo.png"
            alt="Eurizon Logo"
            className="logo-image"
            onError={(e) => {
              e.target.src = '/logo.png';
            }}
          />
        </div>
        <h1>Investment Portal</h1>
        <p>Professional Investment Management</p>

        <div className="login-section">
          <h2>Sign In</h2>
          <p className="login-subtitle">Enter your credentials to access your account</p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁' : '👁‍🗨'}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="sign-in-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="button-loader">
                  <div className="spinner-small"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-help">
            <p className="demo-info">
              <strong>Demo Account:</strong><br/>
              This portal uses Supabase authentication. Please create an account or contact your administrator for access.
            </p>
          </div>
        </div>

        <div className="login-footer">
          © 2025 Eurizon Investment. All Rights Reserved.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
