import { z } from 'zod';

/**
 * Reusable validation schemas for common fields
 * These primitives can be used across different validation schemas
 * to ensure consistency and reduce duplication
 */

// Email validation
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

// Name validation
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must not exceed 100 characters');

// Phone validation
export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-()]+$/, 'Please enter a valid phone number')
  .optional();

// URL validation
export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .optional();

// Replay code validation for Overwatch
export const replayCodeSchema = z
  .string()
  .min(6, 'Replay code must be at least 6 characters')
  .max(10, 'Replay code is too long')
  .regex(/^[A-Z0-9]+$/, 'Replay code must contain only uppercase letters and numbers');

// Slug validation for URLs
export const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens');

// Rich text content validation
export const richTextSchema = z
  .string()
  .min(10, 'Content must be at least 10 characters')
  .max(50000, 'Content must not exceed 50,000 characters');

// Message/description validation
export const messageSchema = z
  .string()
  .min(10, 'Message must be at least 10 characters')
  .max(2000, 'Message must not exceed 2,000 characters');

// Short text validation
export const shortTextSchema = z
  .string()
  .min(1, 'This field is required')
  .max(500, 'Text must not exceed 500 characters');
