import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm focus-visible:ring-teal-600',
        destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm focus-visible:ring-red-600',
        outline: 'border border-teal-300 bg-white text-teal-700 hover:bg-teal-50 shadow-sm focus-visible:ring-teal-600',
        secondary: 'bg-teal-100 text-teal-900 hover:bg-teal-200 shadow-sm focus-visible:ring-teal-400',
        ghost: 'hover:bg-teal-100 hover:text-teal-900 focus-visible:ring-teal-400',
        link: 'text-teal-700 underline-offset-4 hover:underline',
        success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm focus-visible:ring-emerald-600',
        warning: 'bg-amber-600 text-white hover:bg-amber-700 shadow-sm focus-visible:ring-amber-600',
        premium: 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm focus-visible:ring-teal-600',
        glass: 'bg-white/90 backdrop-blur-sm border border-teal-200 text-teal-900 hover:bg-white shadow-sm focus-visible:ring-teal-400',
      },
      size: {
        default: 'h-11 px-4 py-2 min-h-[44px] min-w-[44px] text-base md:text-sm',
        sm: 'h-10 rounded-md px-3 text-sm min-h-[44px] min-w-[44px]',
        lg: 'h-12 rounded-lg px-6 text-base min-h-[48px]',
        xl: 'h-14 rounded-lg px-8 text-lg min-h-[56px]',
        icon: 'h-11 w-11 min-h-[44px] min-w-[44px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };




