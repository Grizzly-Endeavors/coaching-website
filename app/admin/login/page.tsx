'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';

/**
 * Zod schema for login form validation
 */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [loginError, setLoginError] = useState<string>('');

  // Get redirect URL from query params or default to /admin
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setLoginError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      rememberMe: formData.get('rememberMe') === 'on',
    };

    // Validate form data
    try {
      loginSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<LoginFormData> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof LoginFormData] = err.message as any;
          }
        });
        setErrors(fieldErrors);
        setIsLoading(false);
        return;
      }
    }

    // Attempt sign in
    try {
      const result = await signIn('credentials', {
        email: data.email.toLowerCase().trim(),
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        // Don't leak information about whether the user exists
        setLoginError('Invalid email or password. Please try again.');
        setIsLoading(false);
      } else if (result?.ok) {
        // Successful login - redirect to admin dashboard
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23] px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#e5e7eb] mb-2">
            Admin Login
          </h1>
          <p className="text-[#9ca3af]">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-[#1a1a2e] rounded-xl shadow-2xl border border-[#2a2a40] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#e5e7eb] mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isLoading}
                className={`
                  w-full px-4 py-3 rounded-lg
                  bg-[#2a2a40] border
                  ${errors.email ? 'border-[#ef4444]' : 'border-[#2a2a40]'}
                  text-[#e5e7eb] placeholder-[#6b7280]
                  focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                `}
                placeholder="admin@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-[#ef4444]">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#e5e7eb] mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isLoading}
                className={`
                  w-full px-4 py-3 rounded-lg
                  bg-[#2a2a40] border
                  ${errors.password ? 'border-[#ef4444]' : 'border-[#2a2a40]'}
                  text-[#e5e7eb] placeholder-[#6b7280]
                  focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                `}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-[#ef4444]">{errors.password}</p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                disabled={isLoading}
                className="h-4 w-4 rounded border-[#2a2a40] bg-[#2a2a40] text-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6] focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-[#9ca3af]"
              >
                Remember me for 30 days
              </label>
            </div>

            {/* Login Error Message */}
            {loginError && (
              <div className="rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/20 p-4">
                <p className="text-sm text-[#ef4444] text-center">
                  {loginError}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full px-6 py-3 rounded-lg
                bg-[#8b5cf6] hover:bg-[#a78bfa]
                text-white font-medium
                focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:ring-offset-2 focus:ring-offset-[#1a1a2e]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
                shadow-lg shadow-[#8b5cf6]/20
              "
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[#6b7280]">
              This area is restricted to administrators only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
