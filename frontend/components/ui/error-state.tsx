import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
  showRetryButton?: boolean;
  retryLabel?: string;
}

export const ErrorState = ({
  title,
  description,
  onRetry,
  showRetryButton = true,
  retryLabel = 'Try Again'
}: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-destructive/10 p-4 rounded-full mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-destructive"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      {showRetryButton && onRetry && (
        <Button onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

interface NetworkErrorStateProps {
  onRetry?: () => void;
}

export const NetworkErrorState = ({ onRetry }: NetworkErrorStateProps) => {
  return (
    <ErrorState
      title="Unable to connect"
      description="We couldn't connect to our servers. Please check your internet connection and try again."
      onRetry={onRetry}
      retryLabel="Retry Connection"
    />
  );
};

interface NotFoundErrorStateProps {
  onGoHome?: () => void;
}

export const NotFoundErrorState = ({ onGoHome }: NotFoundErrorStateProps) => {
  return (
    <ErrorState
      title="Page not found"
      description="Sorry, the page you're looking for doesn't exist."
      showRetryButton={!!onGoHome}
      onRetry={onGoHome}
      retryLabel="Go Home"
    />
  );
};