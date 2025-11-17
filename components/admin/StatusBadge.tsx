/**
 * StatusBadge Component
 *
 * Displays a colored badge for different submission and booking statuses
 * with appropriate styling for each status type.
 */

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
  // Normalize status to lowercase for consistent variant matching
  const normalizedStatus = status.toLowerCase().replace('_', '');

  const getVariantStyles = () => {
    switch (normalizedStatus) {
      case 'pending':
        return 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20';
      case 'inprogress':
        return 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20';
      case 'completed':
        return 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20';
      case 'archived':
        return 'bg-[#6b7280]/10 text-[#6b7280] border-[#6b7280]/20';
      case 'scheduled':
        return 'bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20';
      case 'cancelled':
        return 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20';
      case 'noshow':
        return 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20';
      default:
        return 'bg-[#2a2a40] text-[#9ca3af] border-[#2a2a40]';
    }
  };

  // Format status text for display (e.g., "IN_PROGRESS" -> "In Progress")
  const formatStatus = (str: string) => {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getVariantStyles()} ${className}`}
    >
      {formatStatus(status)}
    </span>
  );
}
