import React from 'react';

export interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * FormField - A wrapper component for form inputs that provides consistent spacing
 * and layout. Use this to wrap input elements, labels, and error messages together.
 */
export const FormField: React.FC<FormFieldProps> = ({ children, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {children}
    </div>
  );
};

export interface FormFieldsetProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend?: string;
  legendClassName?: string;
  children: React.ReactNode;
}

/**
 * FormFieldset - A semantic fieldset wrapper for grouping related form fields
 */
export const FormFieldset: React.FC<FormFieldsetProps> = ({
  legend,
  legendClassName = '',
  children,
  className = '',
  ...props
}) => {
  return (
    <fieldset className={`border border-[#2a2a40] rounded-lg p-6 ${className}`} {...props}>
      {legend && (
        <legend className={`text-lg font-semibold text-gray-100 px-2 -ml-2 ${legendClassName}`}>
          {legend}
        </legend>
      )}
      <div className="space-y-4 mt-4">
        {children}
      </div>
    </fieldset>
  );
};

export interface FormGroupProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

/**
 * FormGroup - A layout component for organizing multiple form fields in a grid
 */
export const FormGroup: React.FC<FormGroupProps> = ({ children, columns = 1, className = '' }) => {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <div className={`grid ${columnClasses[columns]} gap-4 ${className}`}>
      {children}
    </div>
  );
};
