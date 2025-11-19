import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/admin/friend-codes/[id]
 * Get a specific friend code
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const friendCode = await prisma.friendCode.findUnique({
      where: { id },
      include: {
        submissions: {
          select: {
            id: true,
            email: true,
            submittedAt: true,
            coachingType: true,
          },
          orderBy: { submittedAt: 'desc' },
        },
      },
    });

    if (!friendCode) {
      return NextResponse.json(
        { error: 'Friend code not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ friendCode });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/admin/friend-codes/[id]
 * Update a friend code
 *
 * Request body:
 * {
 *   description?: string,
 *   maxUses?: number | null,
 *   expiresAt?: string | null,
 *   isActive?: boolean
 * }
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { description, maxUses, expiresAt, isActive } = body;

    // Build update data
    const updateData: any = {};

    if (description !== undefined) {
      updateData.description = description || null;
    }

    if (maxUses !== undefined) {
      updateData.maxUses = maxUses ? parseInt(maxUses) : null;
    }

    if (expiresAt !== undefined) {
      updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }

    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }

    const friendCode = await prisma.friendCode.update({
      where: { id },
      data: updateData,
    });

    logger.info('Friend code updated', {
      id: friendCode.id,
      code: friendCode.code,
    });

    return NextResponse.json({ friendCode });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Friend code not found' },
        { status: 404 }
      );
    }
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/friend-codes/[id]
 * Delete a friend code
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if code has been used
    const friendCode = await prisma.friendCode.findUnique({
      where: { id },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    });

    if (!friendCode) {
      return NextResponse.json(
        { error: 'Friend code not found' },
        { status: 404 }
      );
    }

    // If code has been used, we might want to keep it for historical tracking
    // Instead of deleting, we could just deactivate it
    if (friendCode._count.submissions > 0) {
      await prisma.friendCode.update({
        where: { id },
        data: { isActive: false },
      });

      logger.info('Friend code deactivated (had usage history)', {
        id: friendCode.id,
        code: friendCode.code,
        usageCount: friendCode._count.submissions,
      });

      return NextResponse.json({
        message: 'Friend code has been deactivated (preserved for historical tracking)',
        friendCode: { ...friendCode, isActive: false },
      });
    }

    // If never used, safe to delete
    await prisma.friendCode.delete({
      where: { id },
    });

    logger.info('Friend code deleted', {
      id: friendCode.id,
      code: friendCode.code,
    });

    return NextResponse.json({
      message: 'Friend code deleted successfully',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
