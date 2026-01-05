import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log error to console or error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h1>⚠️ Something went wrong</h1>
            <p>We're sorry, but something unexpected happened. Please try refreshing the page.</p>
            {this.state.error && (
              <details className="error-details">
                <summary>Error Details</summary>
                <pre>{this.state.error.toString()}</pre>
                {this.state.errorInfo && (
                  <pre>{this.state.errorInfo.componentStack}</pre>
                )}
              </details>
            )}
            <button 
              onClick={() => window.location.reload()} 
              className="error-reload-btn"
            >
              Reload Page
            </button>
          </div>
          <style>{`
            .error-boundary {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
              padding: 2rem;
            }
            .error-boundary-content {
              background: #334155;
              border-radius: 12px;
              padding: 3rem;
              max-width: 600px;
              text-align: center;
              color: white;
            }
            .error-boundary-content h1 {
              font-size: 2rem;
              margin-bottom: 1rem;
              color: #f87171;
            }
            .error-boundary-content p {
              margin-bottom: 2rem;
              color: #cbd5e1;
            }
            .error-details {
              margin: 2rem 0;
              text-align: left;
              background: #1e293b;
              padding: 1rem;
              border-radius: 6px;
            }
            .error-details summary {
              cursor: pointer;
              margin-bottom: 1rem;
              color: #94a3b8;
            }
            .error-details pre {
              color: #f87171;
              font-size: 0.875rem;
              overflow-x: auto;
            }
            .error-reload-btn {
              background: #3b82f6;
              color: white;
              border: none;
              padding: 0.75rem 2rem;
              border-radius: 6px;
              font-size: 1rem;
              cursor: pointer;
              transition: background 0.2s;
            }
            .error-reload-btn:hover {
              background: #2563eb;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

