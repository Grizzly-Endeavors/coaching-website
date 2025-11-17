import React from 'react';

/**
 * Select option interface
 */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Select component props interface
 */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Select label */
  label?: string;
  /** Error message */
  error?: string;
  /** Select options */
  options: SelectOption[];
  /** Placeholder option */
  placeholder?: string;
}

/**
 * Dropdown select component with label and error state
 *
 * @example
 * <Select
 *   label="Rank"
 *   placeholder="Select your rank"
 *   options={[
 *     { value: 'bronze', label: 'Bronze' },
 *     { value: 'silver', label: 'Silver' },
 *   ]}
 *   error={errors.rank}
 * />
 */
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-text-primary font-medium mb-2">
            {label}
            {props.required && <span className="text-status-error ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full input-field ${error ? 'border-status-error' : ''} ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-status-error">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
