import { ButtonHTMLAttributes } from 'react';

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function AdminButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}: AdminButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-[#8b5cf6] text-white hover:bg-[#a78bfa] shadow-lg shadow-[rgba(139,92,246,0.3)] hover:shadow-[rgba(139,92,246,0.5)]',
    secondary: 'bg-[#2a2a40] text-[#e5e7eb] hover:bg-[#3a3a50] border border-[#2a2a40]',
    danger: 'bg-[#ef4444] text-white hover:bg-[#dc2626]',
    ghost: 'bg-transparent text-[#9ca3af] hover:text-[#e5e7eb] hover:bg-[#2a2a40]'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
