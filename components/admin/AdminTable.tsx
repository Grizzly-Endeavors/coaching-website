'use client';

interface AdminTableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

export function AdminTable({ headers, children, className = '' }: AdminTableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#2a2a40]">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-3 text-left text-xs font-medium text-[#9ca3af] uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2a2a40]">
          {children}
        </tbody>
      </table>
    </div>
  );
}

interface AdminTableRowProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function AdminTableRow({ children, onClick, className = '' }: AdminTableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={`hover:bg-[#1a1a2e] transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </tr>
  );
}

interface AdminTableCellProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminTableCell({ children, className = '' }: AdminTableCellProps) {
  return (
    <td className={`px-4 py-4 text-sm text-[#e5e7eb] ${className}`}>
      {children}
    </td>
  );
}
