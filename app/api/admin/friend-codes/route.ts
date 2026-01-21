import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { requireAuth } from '@/lib/auth';

/**
 * GET /api/admin/friend-codes
 * List all friend codes
 */
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const friendCodes = await prisma.friendCode.findMany({
      where: {
        deletedAt: null, // Exclude soft-deleted codes
      },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    });

    return NextResponse.json({ friendCodes });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/admin/friend-codes
 * Create a new friend code
 *
 * Request body:
 * {
 *   code: string,
 *   description?: string,
 *   maxUses?: number | null,
 *   expiresAt?: string | null
 * }
 */
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const { code, description, maxUses, expiresAt } = body;

    // Validate required fields
    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return NextResponse.json(
        { error: 'Code is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Check if code already exists (exclude soft-deleted codes)
    const existing = await prisma.friendCode.findFirst({
      where: {
        code: {
          equals: code.trim(),
          mode: 'insensitive',
        },
        deletedAt: null,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A friend code with this value already exists' },
        { status: 409 }
      );
    }

    // Create friend code
    const friendCode = await prisma.friendCode.create({
      data: {
        code: code.trim().toUpperCase(),
        description: description || null,
        maxUses: maxUses ? parseInt(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    logger.info('Friend code created', {
      id: friendCode.id,
      code: friendCode.code,
    });

    return NextResponse.json({ friendCode }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
