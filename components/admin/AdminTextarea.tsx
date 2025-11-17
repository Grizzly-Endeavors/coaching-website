import { TextareaHTMLAttributes, forwardRef } from 'react';

interface AdminTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const AdminTextarea = forwardRef<HTMLTextAreaElement, AdminTextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#e5e7eb] mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full px-4 py-2 bg-[#1a1a2e] border border-[#2a2a40] rounded-lg text-[#e5e7eb] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all resize-vertical min-h-[100px] ${error ? 'border-[#ef4444]' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-[#ef4444]">{error}</p>
        )}
      </div>
    );
  }
);

AdminTextarea.displayName = 'AdminTextarea';
