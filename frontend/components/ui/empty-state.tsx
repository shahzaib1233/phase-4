import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({
  title,
  description,
  icon,
  action,
  secondaryAction
}: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto flex justify-center">
        {icon || (
          <div className="bg-secondary p-4 rounded-full">
            <span className="text-3xl">📋</span>
          </div>
        )}
      </div>
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
        {description}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
};