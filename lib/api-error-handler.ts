import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { logger } from './logger';

/**
 * Centralized API error handler with context logging
 * Handles common error types: Unauthorized, Zod validation, Prisma, and generic errors
 *
 * @param error - The caught error
 * @param context - Optional context string for logging (e.g., "updating booking", "fetching users")
 * @returns NextResponse with appropriate status code and error message
 */
export function handleApiError(error: unknown, context?: string): NextResponse {
  const errorMessage = context ? `Error in ${context}` : 'API error occurred';
  logger.error(errorMessage, error instanceof Error ? error : new Error(String(error)));

  // Handle authentication/authorization errors
  if (error instanceof Error && error.message === 'Unauthorized') {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation error',
        details: error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      },
      { status: 400 }
    );
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Duplicate entry', message: 'This record already exists' },
        { status: 409 }
      );
    }
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Not found', message: 'Record not found' },
        { status: 404 }
      );
    }
  }

  // Database/connection errors
  if (error instanceof Error) {
    if (error.message.includes('database') || error.message.includes('connection')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          message: 'Unable to process request. Please try again later.',
        },
        { status: 503 }
      );
    }
  }

  // Generic error
  return NextResponse.json(
    {
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred. Please try again later.',
    },
    { status: 500 }
  );
}
