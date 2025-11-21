'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { loginSchema } from '@/lib/validations/auth';
import type { LocaleData } from '@/lib/locales/types';

type LoginFormData = z.infer<typeof loginSchema>;

interface AdminLoginFormProps {
  locale: LocaleData;
}

export default function AdminLoginForm({ locale }: AdminLoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [loginError, setLoginError] = useState<string>('');

  // Get redirect URL from query params or default to /admin
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const handleDiscordLogin = async () => {
    setIsLoading(true);
    setLoginError('');
    try {
      await signIn('discord', { callbackUrl });
    } catch (error) {
      logger.error('Discord login error:', error instanceof Error ? error : new Error(String(error)));
      setLoginError('Failed to initiate Discord login.');
      setIsLoading(false);
    }
  };

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
        error.issues.forEach((err) => {
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
        setLoginError(locale.form?.error?.invalid_credentials || 'Invalid email or password. Please try again.');
        setIsLoading(false);
      } else if (result?.ok) {
        // Successful login - redirect to admin dashboard
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      logger.error('Login error:', error instanceof Error ? error : new Error(String(error)));
      setLoginError(locale.form?.error?.unexpected || 'An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23] px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#e5e7eb] mb-2">
            {locale.header?.title || 'Admin Login'}
          </h1>
          <p className="text-[#9ca3af]">
            {locale.header?.subtitle || 'Sign in to access the admin dashboard'}
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
                {locale.form?.fields?.email?.label || 'Email Address'}
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
                placeholder={locale.form?.fields?.email?.placeholder || 'admin@example.com'}
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
                {locale.form?.fields?.password?.label || 'Password'}
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
                placeholder={locale.form?.fields?.password?.placeholder || '••••••••'}
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
                {locale.form?.fields?.remember_me?.label || 'Remember me for 30 days'}
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
                  {locale.form?.submit?.loading || 'Signing in...'}
                </span>
              ) : (
                locale.form?.submit?.default || 'Sign In'
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2a2a40]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#1a1a2e] text-[#6b7280]">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDiscordLogin}
            disabled={isLoading}
            className="
              w-full px-6 py-3 rounded-lg
              bg-[#5865F2] hover:bg-[#4752C4]
              text-white font-medium
              focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:ring-offset-2 focus:ring-offset-[#1a1a2e]
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              shadow-lg shadow-[#5865F2]/20
              flex items-center justify-center
            "
          >
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 2.382 2.382 0 0 0-.332.677 19.791 19.791 0 0 0-6.044 0 2.382 2.382 0 0 0-.332-.677.074.074 0 0 0-.079-.037A19.793 19.793 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .077.01c.121.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.076.076 0 0 0-.04.106c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-2.595-8.413-3.674-12.218a.07.07 0 0 0-.032-.027ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.956 2.419-2.157 2.419Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.956 2.419-2.157 2.419Z" />
            </svg>
            Sign in with Discord
          </button>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[#6b7280]">
              {locale.footer?.restricted_notice || 'This area is restricted to administrators only.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
