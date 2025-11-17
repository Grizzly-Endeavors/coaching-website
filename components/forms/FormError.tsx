import React from 'react';

export interface FormErrorProps {
  message?: string | string[];
  className?: string;
  id?: string;
}

/**
 * FormError - Displays error messages for form fields or entire forms
 * Supports both single error strings and arrays of error messages
 */
export const FormError: React.FC<FormErrorProps> = ({ message, className = '', id }) => {
  if (!message) return null;

  const errors = Array.isArray(message) ? message : [message];

  if (errors.length === 0) return null;

  return (
    <div
      id={id}
      role="alert"
      className={`text-sm text-red-400 ${className}`}
      aria-live="polite"
    >
      {errors.length === 1 ? (
        <p className="flex items-start gap-2">
          <svg
            className="w-4 h-4 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{errors[0]}</span>
        </p>
      ) : (
        <ul className="space-y-1">
          {errors.map((error, index) => (
            <li key={index} className="flex items-start gap-2">
              <svg
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export interface FormErrorBannerProps {
  title?: string;
  message: string | string[];
  onDismiss?: () => void;
  className?: string;
}

/**
 * FormErrorBanner - A prominent error banner for displaying form-level errors
 */
export const FormErrorBanner: React.FC<FormErrorBannerProps> = ({
  title = 'Error',
  message,
  onDismiss,
  className = '',
}) => {
  if (!message) return null;

  const errors = Array.isArray(message) ? message : [message];

  if (errors.length === 0) return null;

  return (
    <div
      role="alert"
      className={`bg-red-500/10 border border-red-500/30 rounded-lg p-4 ${className}`}
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-red-400">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-red-400 mb-1">
            {title}
          </h3>

          {errors.length === 1 ? (
            <p className="text-sm text-red-300">
              {errors[0]}
            </p>
          ) : (
            <ul className="space-y-1 text-sm text-red-300 list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-red-400 hover:text-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
            aria-label="Dismiss error"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
