import React from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Keep this log for production monitoring integration.
    console.error("Route error boundary caught:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-3xl font-heading font-bold text-foreground">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground">
          An unexpected error occurred while loading this page.
        </p>
        {import.meta.env.DEV && this.state.error ? (
          <pre className="mt-4 overflow-auto rounded-lg bg-muted p-3 text-left text-xs text-destructive">
            {String(this.state.error?.message || this.state.error)}
          </pre>
        ) : null}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={this.handleRetry}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Retry
          </button>
          <Link to="/" className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground">
            Go Home
          </Link>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
