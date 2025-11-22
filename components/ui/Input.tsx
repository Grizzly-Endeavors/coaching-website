import React from 'react';

/**
 * Input component props interface
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  /** Input label */
  label?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Input type */
  inputType?: 'text' | 'email' | 'password' | 'textarea';
  /** Number of rows (for textarea) */
  rows?: number;
}

/**
 * Text input component with label and error state
 * Also supports textarea variant
 *
 * @example
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="your@email.com"
 *   error={errors.email}
 * />
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  inputType = 'text',
  className = '',
  id,
  rows = 4,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = `w-full px-4 py-2.5 bg-background-surface border rounded-lg text-gray-200 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
    error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-border hover:border-cyan-primary/50'
  }`;

  const renderInput = () => {
    if (inputType === 'textarea') {
      return (
        <textarea
          id={inputId}
          rows={rows}
          className={`${baseClasses} resize-y ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      );
    }

    return (
      <input
        id={inputId}
        type={inputType}
        className={`${baseClasses} ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      />
    );
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {renderInput()}

      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
};
