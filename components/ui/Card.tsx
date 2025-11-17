import React from 'react';

/**
 * Card component props interface
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card variant */
  variant?: 'surface' | 'elevated';
  /** Card padding */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Enable hover effect */
  hover?: boolean;
  /** Enable purple border */
  purpleBorder?: boolean;
  /** Card content */
  children: React.ReactNode;
}

/**
 * Card component with dark surface background and optional hover effects
 *
 * @example
 * <Card hover purpleBorder>
 *   <CardTitle>Card Title</CardTitle>
 *   <p>Card content goes here</p>
 * </Card>
 */
export const Card: React.FC<CardProps> = ({
  variant = 'surface',
  padding = 'md',
  hover = false,
  purpleBorder = false,
  className = '',
  children,
  ...props
}) => {
  const variantClasses = {
    surface: 'bg-[#1a1a2e]',
    elevated: 'bg-[#2a2a40]',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const borderClasses = purpleBorder
    ? 'border-2 border-purple-600'
    : 'border border-[#2a2a40]';

  const hoverClasses = hover
    ? 'hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:border-purple-600/50 transition-all duration-300 cursor-pointer hover:-translate-y-1'
    : '';

  return (
    <div
      className={`${variantClasses[variant]} ${paddingClasses[padding]} rounded-xl ${borderClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Card header component
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Card title component
 */
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({ className = '', children, ...props }) => {
  return (
    <h3 className={`text-xl font-bold text-gray-100 tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
};

/**
 * Card description component
 */
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ className = '', children, ...props }) => {
  return (
    <p className={`text-gray-400 text-sm ${className}`} {...props}>
      {children}
    </p>
  );
};

/**
 * Card content component
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Card footer component
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`mt-6 pt-4 border-t border-[#2a2a40] ${className}`} {...props}>
      {children}
    </div>
  );
};
