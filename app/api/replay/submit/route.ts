import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { replaySubmissionSchema } from '@/lib/validations';
import { sendSubmissionConfirmation, sendSubmissionNotification } from '@/lib/email';
import { ZodError } from 'zod';

/**
 * POST /api/replay/submit
 * Submit a replay code for review
 *
 * Request body:
 * {
 *   email: string,
 *   discordTag?: string,
 *   replayCode: string,
 *   rank: string,
 *   role: "Tank" | "DPS" | "Support",
 *   hero?: string,
 *   notes?: string
 * }
 *
 * Response: 201 Created
 * {
 *   success: true,
 *   submissionId: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request body with Zod
    const validatedData = replaySubmissionSchema.parse(body);

    // TODO: Add rate limiting
    // Consider using a rate limiting middleware or service like Upstash Redis
    // to prevent spam submissions from the same IP or email

    // Create replay submission in database
    const submission = await prisma.replaySubmission.create({
      data: {
        email: validatedData.email,
        discordTag: validatedData.discordTag || null,
        replayCode: validatedData.replayCode.toUpperCase(), // Normalize to uppercase
        rank: validatedData.rank,
        role: validatedData.role,
        hero: validatedData.hero || null,
        notes: validatedData.notes || null,
        status: 'PENDING',
      },
    });

    console.log(`New replay submission created: ${submission.id}`);

    // Send confirmation email to submitter (non-blocking)
    sendSubmissionConfirmation(submission.email, {
      id: submission.id,
      email: submission.email,
      discordTag: submission.discordTag,
      replayCode: submission.replayCode,
      rank: submission.rank,
      role: submission.role,
      hero: submission.hero,
      notes: submission.notes,
      submittedAt: submission.submittedAt,
    })
      .then((result) => {
        if (result.success) {
          console.log(`Confirmation email sent to ${submission.email}`);
        } else {
          console.error(`Failed to send confirmation email: ${result.error}`);
        }
      })
      .catch((error) => {
        console.error('Error sending confirmation email:', error);
      });

    // Send notification email to admin (non-blocking)
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      sendSubmissionNotification(adminEmail, {
        id: submission.id,
        email: submission.email,
        discordTag: submission.discordTag,
        replayCode: submission.replayCode,
        rank: submission.rank,
        role: submission.role,
        hero: submission.hero,
        notes: submission.notes,
        submittedAt: submission.submittedAt,
      })
        .then((result) => {
          if (result.success) {
            console.log('Admin notification email sent');
          } else {
            console.error(`Failed to send admin notification: ${result.error}`);
          }
        })
        .catch((error) => {
          console.error('Error sending admin notification:', error);
        });
    } else {
      console.warn('ADMIN_EMAIL not configured, skipping admin notification');
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        submissionId: submission.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in replay submission:', error);

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

    // Handle Prisma errors
    if (error instanceof Error) {
      // Check for database connection errors
      if (error.message.includes('database') || error.message.includes('connection')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Database error',
            message: 'Unable to process submission. Please try again later.',
          },
          { status: 503 }
        );
      }
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
