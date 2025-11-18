import {
  ReplaySubmission,
  Booking,
  BlogPost,
  Admin,
  SubmissionStatus,
  BookingStatus
} from '@prisma/client';

// Re-export Prisma types
export type {
  ReplaySubmission,
  Booking,
  BlogPost,
  Admin,
  SubmissionStatus,
  BookingStatus,
};

// Custom types for API responses
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface ReplaySubmissionForm {
  email: string;
  discordTag?: string;
  replayCode: string;
  rank: string;
  role: string;
  hero?: string;
  notes?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface BlogPostForm {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  tags: string[];
  published: boolean;
}

// Admin update types
export interface UpdateSubmissionData {
  status?: SubmissionStatus;
  reviewNotes?: string;
  reviewUrl?: string;
  sendDiscordNotification?: boolean;
}

export interface UpdateBlogPostData {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  tags?: string[];
  published?: boolean;
}

export interface UpdateBookingData {
  status?: BookingStatus;
  notes?: string;
}
