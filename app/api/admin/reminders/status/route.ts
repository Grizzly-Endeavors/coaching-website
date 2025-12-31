/**
 * Admin API - Reminder Service Status
 *
 * GET /api/admin/reminders/status
 * Returns the current status of the reminder service
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { isReminderServiceRunning } from '@/lib/reminder-service';

export async function GET(request: NextRequest) {
  // Require admin authentication
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const isRunning = isReminderServiceRunning();

    return NextResponse.json({
      success: true,
      data: {
        isRunning,
        checkInterval: '5 minutes',
        reminderWindows: {
          '24hours': '24 hours ± 5 minutes before session',
          '30minutes': '30 minutes ± 5 minutes before session',
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check reminder service status',
      },
      { status: 500 }
    );
  }
}
