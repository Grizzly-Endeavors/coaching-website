import React from 'react';

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}

/**
 * FormLabel - A styled label component for form inputs with support
 * for required/optional indicators
 */
export const FormLabel: React.FC<FormLabelProps> = ({
  required = false,
  optional = false,
  children,
  className = '',
  ...props
}) => {
  return (
    <label
      className={`block text-sm font-medium text-gray-300 mb-2 ${className}`}
      {...props}
    >
      <span>{children}</span>

      {required && (
        <span className="text-red-500 ml-1" aria-label="required">
          *
        </span>
      )}

      {optional && !required && (
        <span className="text-gray-500 ml-1 font-normal text-xs">
          (optional)
        </span>
      )}
    </label>
  );
};

export interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

/**
 * FormDescription - Helper text to provide additional context for form fields
 */
export const FormDescription: React.FC<FormDescriptionProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <p className={`text-sm text-gray-400 ${className}`} {...props}>
      {children}
    </p>
  );
};

export interface FormHintProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

/**
 * FormHint - Informational hint displayed above or below form fields
 */
export const FormHint: React.FC<FormHintProps> = ({
  children,
  icon,
  className = '',
  ...props
}) => {
  return (
    <p
      className={`flex items-start gap-2 text-sm text-gray-400 bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-3 ${className}`}
      {...props}
    >
      {icon ? (
        <span className="flex-shrink-0 w-4 h-4 mt-0.5 text-purple-400">
          {icon}
        </span>
      ) : (
        <svg
          className="flex-shrink-0 w-4 h-4 mt-0.5 text-purple-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
      <span>{children}</span>
    </p>
  );
};
