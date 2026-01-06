import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-gray-800 border border-red-500 rounded-lg p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-red-500 rounded-full p-3">
                <AlertTriangle className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white text-center mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-300 text-center mb-6">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-gray-900 border border-gray-700 rounded p-4 mb-4">
                <p className="text-red-400 text-sm font-mono">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
