import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary caught an error', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="container py-5 my-5 text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="text-primary mb-4">Something went wrong</h2>
              <p className="mb-4">We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.</p>
              <button 
                className="btn btn-primary py-2 px-4" 
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 text-start bg-light p-3 rounded">
                  <h5 className="text-danger">Error Details (Development Only):</h5>
                  <p>{this.state.error && this.state.error.toString()}</p>
                  <pre className="text-muted">
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;