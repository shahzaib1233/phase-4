import React from 'react';
import { NetworkErrorState } from '@/components/ui/error-state';

interface NetworkErrorBoundaryProps {
  children: React.ReactNode;
  onRetry?: () => void;
}

interface NetworkErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class NetworkErrorBoundary extends React.Component<
  NetworkErrorBoundaryProps,
  NetworkErrorBoundaryState
> {
  constructor(props: NetworkErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): NetworkErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Network error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <NetworkErrorState onRetry={this.props.onRetry} />
      );
    }

    return this.props.children;
  }
}

export { NetworkErrorBoundary };