import { SelectHTMLAttributes, forwardRef } from 'react';

interface AdminSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const AdminSelect = forwardRef<HTMLSelectElement, AdminSelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#e5e7eb] mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full px-4 py-2 bg-[#1a1a2e] border border-[#2a2a40] rounded-lg text-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all appearance-none ${error ? 'border-[#ef4444]' : ''} ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-[#ef4444]">{error}</p>
        )}
      </div>
    );
  }
);

AdminSelect.displayName = 'AdminSelect';
