interface AdminCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export function AdminCard({ title, value, icon, subtitle, className = '' }: AdminCardProps) {
  return (
    <div className={`bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6 hover:border-[#8b5cf6] transition-colors ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[#9ca3af] text-sm font-medium mb-1">{title}</p>
          <p className="text-[#e5e7eb] text-3xl font-bold mb-1">{value}</p>
          {subtitle && <p className="text-[#6b7280] text-xs">{subtitle}</p>}
        </div>
        {icon && (
          <div className="text-[#8b5cf6] ml-4">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
