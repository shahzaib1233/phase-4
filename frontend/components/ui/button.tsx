import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    className,
    disabled,
    ...props
  }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
          {
            // Primary variant
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
            // Secondary variant
            'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
            // Outline variant
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
            // Ghost variant
            'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
            // Link variant
            'underline-offset-4 hover:underline text-primary': variant === 'link',
          },
          {
            'h-9 px-4 py-2': size === 'md',
            'h-8 px-3 text-xs': size === 'sm',
            'h-11 px-8 text-lg': size === 'lg',
          },
          {
            'w-full': fullWidth,
            'opacity-70 cursor-not-allowed': isLoading || disabled,
          },
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="mr-2 h-4 w-4 animate-spin">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';