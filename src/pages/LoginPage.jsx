import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff } from 'lucide-react';
import EurizonLogo from '../components/EurizonLogo';

const LoginPage = () => {
  const { handleLogin, addNotification } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e, role = 'user') => {
    e.preventDefault();
    
    if (!validateForm()) {
      addNotification('error', 'Please fix the errors in the form');
      return;
    }

    try {
      handleLogin({ email, password, rememberMe }, role);
    } catch (error) {
      addNotification('error', error.message);
      setErrors({ general: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <EurizonLogo variant="light" size="large" />
        </div>

        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-700">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Sign In</h2>
            <p className="text-gray-400 text-sm">Enter your credentials to access your account</p>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={(e) => handleSubmit(e, 'user')} className="space-y-4">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="form-error">{errors.email}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`form-input ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Enter your password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="form-error">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300 font-medium">
                Contact your advisor
              </a>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-center text-xs text-gray-500 mb-3">Demo Access:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={(e) => handleSubmit(e, 'admin')}
                className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded-md transition-colors"
                type="button"
              >
                Admin Demo
              </button>
              <button
                onClick={(e) => handleSubmit(e, 'user')}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-4 rounded-md transition-colors"
                type="button"
              >
                User Demo
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">© 2025 Eurizon Investment. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
