import React from 'react';

/**
 * TextArea component props interface
 */
export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** TextArea label */
  label?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Full width textarea */
  fullWidth?: boolean;
}

/**
 * Multi-line text input component with label and error state
 *
 * @example
 * <TextArea
 *   label="Additional Notes"
 *   placeholder="Tell us more..."
 *   rows={5}
 *   error={errors.notes}
 * />
 */
const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, fullWidth = true, className = '', id, rows = 4, ...props }, ref) => {
    // Generate ID if not provided (for accessibility)
    const textareaId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    const textareaClassName = `
      ${fullWidth ? 'w-full' : ''}
      bg-background-elevated
      border ${error ? 'border-status-error' : 'border-border'}
      rounded-lg
      px-4 py-3
      text-text-primary
      placeholder:text-text-muted
      focus:outline-none
      focus:ring-2
      ${error ? 'focus:ring-status-error' : 'focus:ring-cyan-primary'}
      focus:border-transparent
      transition-all
      resize-vertical
      min-h-[120px]
      disabled:opacity-50
      disabled:cursor-not-allowed
      ${className}
    `.trim();

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-text-primary font-medium mb-2"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={textareaClassName}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${textareaId}-error`}
            className="mt-2 text-sm text-status-error"
            role="alert"
          >
            {error}
          </p>
        )}
        {!error && helperText && (
          <p
            id={`${textareaId}-helper`}
            className="mt-2 text-sm text-text-secondary"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
