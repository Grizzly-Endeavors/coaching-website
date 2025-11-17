interface AdminBadgeProps {
  children: React.ReactNode;
  variant?: 'pending' | 'in_progress' | 'completed' | 'archived' | 'scheduled' | 'cancelled' | 'no_show' | 'default';
  className?: string;
}

export function AdminBadge({ children, variant = 'default', className = '' }: AdminBadgeProps) {
  const variantStyles = {
    pending: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20',
    in_progress: 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20',
    completed: 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20',
    archived: 'bg-[#6b7280]/10 text-[#6b7280] border-[#6b7280]/20',
    scheduled: 'bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20',
    cancelled: 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20',
    no_show: 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20',
    default: 'bg-[#2a2a40] text-[#9ca3af] border-[#2a2a40]'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
