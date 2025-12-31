/**
 * StatusBadge Component
 *
 * Displays a colored badge for different submission and booking statuses
 * with appropriate styling for each status type.
 *
 * This component now uses the base Badge component from /components/ui/Badge.tsx
 * and the getStatusBadgeVariant helper function.
 */

import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

/**
 * Status badge component with color-coded variants for different statuses
 * @param status - The status string (PENDING, IN_PROGRESS, COMPLETED, etc.)
 * @param className - Optional additional CSS classes
 */
export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  // Format status text for display (e.g., "IN_PROGRESS" -> "In Progress")
  const formatStatus = (str: string) => {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Get the appropriate badge variant based on the status
  const variant = getStatusBadgeVariant(status);

  return (
    <Badge variant={variant} className={className}>
      {formatStatus(status)}
    </Badge>
  );
}
