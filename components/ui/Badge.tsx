import React from 'react';

/**
 * Badge component props interface
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Badge color variant */
  variant?: 'purple' | 'cyan' | 'teal' | 'success' | 'warning' | 'error' | 'pending' | 'in_progress' | 'completed';
  /** Badge size */
  size?: 'sm' | 'md' | 'lg';
  /** Badge content */
  children: React.ReactNode;
}

/**
 * Badge component for tags and status indicators
 *
 * @example
 * <Badge variant="success">Completed</Badge>
 * <Badge variant="purple">DPS</Badge>
 * <Badge variant="teal">Active</Badge>
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'purple',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full border';

  const variantClasses = {
    purple: 'bg-purple-600/10 text-purple-400 border-purple-600/30',
    cyan: 'bg-cyan-600/10 text-cyan-400 border-cyan-600/30',
    teal: 'bg-teal-600/10 text-teal-400 border-teal-600/30',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    error: 'bg-red-500/10 text-red-400 border-red-500/30',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    in_progress: 'bg-teal-600/10 text-teal-400 border-teal-600/30',
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// Helper function to get badge variant from status
export const getStatusBadgeVariant = (status: string): BadgeProps['variant'] => {
  const statusMap: Record<string, BadgeProps['variant']> = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    SCHEDULED: 'cyan',
    CANCELLED: 'error',
    NO_SHOW: 'warning',
    ARCHIVED: 'teal',
  };

  return statusMap[status] || 'cyan';
};
