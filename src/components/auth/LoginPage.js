import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './LoginPage.css';

const LoginPage = () => {
  const { username, password, setUsername, setPassword, handleLogin } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const success = handleLogin();
    if (!success) {
      setError('Invalid credentials!');
      setUsername('');
      setPassword('');
    }
  };

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
              <label>User Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
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
                />
                <span 
                  className="eye-icon" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  👁
                </span>
              </div>
            </div>
            
            <button type="submit" className="sign-in-btn">
              Sign In
            </button>
          </form>
        </div>
        
        <div className="login-footer">
          © 2025 Eurizon Investment. All Rights Reserved.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

