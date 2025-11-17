import React from 'react';

/**
 * TextArea component props interface
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** TextArea label */
  label?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
}

/**
 * Multi-line text input component with label and error state
 *
 * @example
 * <Textarea
 *   label="Additional Notes"
 *   placeholder="Tell us more..."
 *   rows={5}
 *   error={errors.notes}
 * />
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-text-primary font-medium mb-2">
            {label}
            {props.required && <span className="text-status-error ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full input-field min-h-[120px] resize-vertical ${error ? 'border-status-error' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-status-error">{error}</p>
        )}
        {!error && helperText && (
          <p className="mt-1 text-sm text-text-secondary">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
