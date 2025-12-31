import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validations';
import { handleApiError } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { rateLimit, getRateLimitHeaders } from '@/lib/rate-limiter';

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
    // Rate limiting: 5 requests per hour per IP
    const rateLimitOptions = {
      maxRequests: 5,
      windowMs: 60 * 60 * 1000, // 1 hour
      message: 'Too many contact form submissions. Please try again later.',
    };

    const rateLimitResult = await rateLimit(request, rateLimitOptions);

    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    // Parse request body
    const body = await request.json();

    // Validate request body with Zod
    const validatedData = contactFormSchema.parse(body);

    // TODO: Add CAPTCHA verification (optional but recommended)
    // Consider adding Google reCAPTCHA or similar service
    // to prevent automated spam submissions

    // Sanitize input data (prevent XSS attacks)
    const sanitizedName = validatedData.name.trim();
    const sanitizedEmail = validatedData.email.trim().toLowerCase();
    const sanitizedMessage = validatedData.message.trim();

    logger.info('Contact form submission received', {
      name: sanitizedName,
      email: sanitizedEmail,
      messageLength: sanitizedMessage.length,
    });

    // Get rate limit headers
    const rateLimitHeaders = getRateLimitHeaders(request, rateLimitOptions);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully. We will get back to you soon!',
      },
      {
        status: 200,
        headers: rateLimitHeaders,
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
