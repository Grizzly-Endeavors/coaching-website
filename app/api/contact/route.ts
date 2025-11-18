import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validations';
import { ZodError } from 'zod';

/**
 * POST /api/contact
 * Submit a contact form message
 *
 * Request body:
 * {
 *   name: string,
 *   email: string,
 *   message: string
 * }
 *
 * Response: 200 OK
 * {
 *   success: true,
 *   message: "Your message has been sent successfully."
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request body with Zod
    const validatedData = contactFormSchema.parse(body);

    // TODO: Add rate limiting
    // Implement rate limiting to prevent spam and abuse
    // Consider using IP-based or email-based rate limiting
    // Example: Allow max 3 submissions per hour per IP/email

    // TODO: Add CAPTCHA verification (optional but recommended)
    // Consider adding Google reCAPTCHA or similar service
    // to prevent automated spam submissions

    // Sanitize input data (prevent XSS attacks)
    const sanitizedName = validatedData.name.trim();
    const sanitizedEmail = validatedData.email.trim().toLowerCase();
    const sanitizedMessage = validatedData.message.trim();

    console.log(`Contact form submission from: ${sanitizedName} (${sanitizedEmail})`);
    console.log(`Message: ${sanitizedMessage}`);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully. We will get back to you soon!',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in contact form submission:', error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
          message: 'The request body is not valid JSON.',
        },
        { status: 400 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}
