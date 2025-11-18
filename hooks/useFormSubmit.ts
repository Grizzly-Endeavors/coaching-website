import { useState } from 'react';
import { ZodSchema } from 'zod';

interface UseFormSubmitOptions<T, R> {
  onSubmit: (data: T) => Promise<R>;
  schema?: ZodSchema<T>;
  onSuccess?: (result: R) => void;
  onError?: (error: Error) => void;
}

export function useFormSubmit<T, R = unknown>({
  onSubmit,
  schema,
  onSuccess,
  onError,
}: UseFormSubmitOptions<T, R>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: T) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setError(null);

    try {
      // Validate if schema provided
      if (schema) {
        const validationResult = schema.safeParse(data);
        if (!validationResult.success) {
          throw new Error('Validation failed');
        }
      }

      // Submit data
      const result = await onSubmit(data);

      setSubmitStatus('success');
      onSuccess?.(result);

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setSubmitStatus('error');
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
    submitStatus,
    error,
  };
}
