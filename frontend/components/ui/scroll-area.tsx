'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// Create a simple scroll area component without Radix UI dependency
const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> & { orientation?: 'vertical' | 'horizontal' }
>(({ className, children, orientation = 'vertical', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'relative overflow-auto',
        orientation === 'vertical' && 'overflow-y-auto',
        orientation === 'horizontal' && 'overflow-x-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
ScrollArea.displayName = 'ScrollArea';

// Simple scrollbar component
const ScrollBar = ({ orientation = 'vertical', className, ...props }: { orientation?: 'vertical' | 'horizontal'; className?: string; [key: string]: any }) => {
  return (
    <div
      className={cn(
        'absolute inset-y-0 right-0 top-0 w-2.5 opacity-0 transition-opacity duration-200 hover:opacity-100',
        orientation === 'vertical' && 'w-2.5',
        orientation === 'horizontal' && 'h-2.5 bottom-0 left-0 right-0',
        className
      )}
      {...props}
    >
      <div className="rounded-full bg-border w-full h-full" />
    </div>
  );
};
ScrollBar.displayName = 'ScrollBar';

export { ScrollArea, ScrollBar };