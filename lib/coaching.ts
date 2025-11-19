/**
 * Coaching-related utility functions
 *
 * This module contains shared utilities for coaching functionality,
 * including type names and other coaching-related helpers.
 */

/**
 * Get human-readable coaching type name
 * Converts internal coaching type slugs to display names
 *
 * @param type - The coaching type slug (e.g., 'vod-review', 'review-async')
 * @returns Human-readable coaching type name
 */
export function getCoachingTypeName(type: string): string {
  switch (type) {
    case 'review-async':
      return 'Review on My Time';
    case 'vod-review':
      return 'VOD Review';
    case 'live-coaching':
      return 'Live Coaching';
    default:
      return type;
  }
}
