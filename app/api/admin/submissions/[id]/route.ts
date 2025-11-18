import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { sendReviewReadyNotification } from '@/lib/discord';
import { SubmissionStatus } from '@prisma/client';

// Validation schema for PATCH request body
const updateSchema = z.object({
  status: z.nativeEnum(SubmissionStatus).optional(),
  reviewNotes: z.string().optional(),
  reviewUrl: z.string().url().optional().or(z.literal('')),
  sendDiscordNotification: z.boolean().optional().default(false),
});

/**
 * GET /api/admin/submissions/[id]
 *
 * Fetch a single replay submission by ID
 *
 * Requires authentication
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    await requireAuth();

    const { id } = params;

    // Fetch submission from database
    const submission = await prisma.replaySubmission.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        discordTag: true,
        coachingType: true,
        rank: true,
        role: true,
        hero: true,
        status: true,
        reviewNotes: true,
        reviewUrl: true,
        submittedAt: true,
        reviewedAt: true,
        replays: {
          select: {
            id: true,
            code: true,
            mapName: true,
            notes: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { success: false, error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Transform the data to include replayCode and notes for backward compatibility
    const transformedSubmission = {
      ...submission,
      replayCode: submission.replays[0]?.code || '',
      notes: submission.replays[0]?.notes || '',
    };

    return NextResponse.json({
      success: true,
      submission: transformedSubmission,
    });
  } catch (error) {
    console.error('Error fetching submission:', error);

    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/submissions/[id]
 *
 * Update a replay submission
 *
 * Request body:
 * - status: SubmissionStatus (optional)
 * - reviewNotes: string (optional)
 * - reviewUrl: string (optional)
 * - sendDiscordNotification: boolean (optional, default: false) - Send Discord DM to user when review is ready
 *
 * Requires authentication
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    await requireAuth();

    const { id } = params;

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateSchema.parse(body);

    // Check if submission exists
    const existingSubmission = await prisma.replaySubmission.findUnique({
      where: { id },
    });

    if (!existingSubmission) {
      return NextResponse.json(
        { success: false, error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: {
      status?: SubmissionStatus;
      reviewNotes?: string | null;
      reviewUrl?: string | null;
      reviewedAt?: Date;
    } = {};

    if (validatedData.status) {
      updateData.status = validatedData.status;
      // Set reviewedAt when status changes to COMPLETED
      if (validatedData.status === SubmissionStatus.COMPLETED) {
        updateData.reviewedAt = new Date();
      }
    }

    if (validatedData.reviewNotes !== undefined) {
      updateData.reviewNotes = validatedData.reviewNotes || null;
    }

    if (validatedData.reviewUrl !== undefined) {
      updateData.reviewUrl = validatedData.reviewUrl || null;
    }

    // Update submission in database
    const updatedSubmission = await prisma.replaySubmission.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        discordTag: true,
        discordId: true,
        discordUsername: true,
        discordAccessToken: true,
        discordRefreshToken: true,
        discordTokenExpiry: true,
        coachingType: true,
        rank: true,
        role: true,
        hero: true,
        status: true,
        reviewNotes: true,
        reviewUrl: true,
        submittedAt: true,
        reviewedAt: true,
        replays: {
          select: {
            id: true,
            code: true,
            mapName: true,
            notes: true,
          },
        },
      },
    });

    // Transform the data to include replayCode and notes for backward compatibility
    const transformedSubmission = {
      ...updatedSubmission,
      replayCode: updatedSubmission.replays[0]?.code || '',
      notes: updatedSubmission.replays[0]?.notes || '',
    };

    // Send Discord notification if requested and status is COMPLETED
    let notificationSent = false;
    if (
      validatedData.sendDiscordNotification &&
      transformedSubmission.status === SubmissionStatus.COMPLETED
    ) {
      const notificationResult = await sendReviewReadyNotification({
        id: transformedSubmission.id,
        email: transformedSubmission.email,
        discordTag: transformedSubmission.discordTag,
        discordId: transformedSubmission.discordId,
        discordUsername: transformedSubmission.discordUsername,
        discordAccessToken: transformedSubmission.discordAccessToken,
        discordRefreshToken: transformedSubmission.discordRefreshToken,
        discordTokenExpiry: transformedSubmission.discordTokenExpiry,
        replayCode: transformedSubmission.replayCode,
        rank: transformedSubmission.rank,
        role: transformedSubmission.role,
        hero: transformedSubmission.hero,
        reviewNotes: transformedSubmission.reviewNotes,
        reviewUrl: transformedSubmission.reviewUrl,
        reviewedAt: transformedSubmission.reviewedAt,
      });

      notificationSent = notificationResult.success;

      if (!notificationResult.success) {
        console.error('Failed to send Discord notification:', notificationResult.error);
      }
    }

    return NextResponse.json({
      success: true,
      submission: transformedSubmission,
      notificationSent,
    });
  } catch (error) {
    console.error('Error updating submission:', error);

    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/submissions/[id]
 *
 * Delete or archive a replay submission
 *
 * Requires authentication
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    await requireAuth();

    const { id } = params;

    // Check if submission exists
    const existingSubmission = await prisma.replaySubmission.findUnique({
      where: { id },
    });

    if (!existingSubmission) {
      return NextResponse.json(
        { success: false, error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Archive instead of hard delete (safer approach)
    // You can change this to prisma.replaySubmission.delete({ where: { id } })
    // if you prefer hard delete
    await prisma.replaySubmission.update({
      where: { id },
      data: {
        status: SubmissionStatus.ARCHIVED,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Submission archived successfully',
    });
  } catch (error) {
    console.error('Error deleting submission:', error);

    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
