import { describe, it, expect } from 'vitest';
import { emailSchema, replayCodeSchema, slugSchema } from '../primitives';

describe('emailSchema', () => {
  it('accepts valid emails', () => {
    expect(() => emailSchema.parse('test@example.com')).not.toThrow();
    expect(() => emailSchema.parse('user.name+tag@domain.co.uk')).not.toThrow();
  });

  it('rejects invalid emails', () => {
    expect(() => emailSchema.parse('invalid')).toThrow();
    expect(() => emailSchema.parse('@nodomain.com')).toThrow();
    expect(() => emailSchema.parse('')).toThrow();
  });
});

describe('replayCodeSchema', () => {
  it('accepts valid replay codes', () => {
    expect(() => replayCodeSchema.parse('ABC123')).not.toThrow();
    expect(() => replayCodeSchema.parse('ABCD1234')).not.toThrow();
  });

  it('rejects codes that are too short or long', () => {
    expect(() => replayCodeSchema.parse('ABC')).toThrow();
    expect(() => replayCodeSchema.parse('ABCDEFGHIJK')).toThrow();
  });
});

describe('slugSchema', () => {
  it('accepts valid slugs', () => {
    expect(() => slugSchema.parse('my-blog-post')).not.toThrow();
    expect(() => slugSchema.parse('post-123')).not.toThrow();
  });

  it('rejects slugs with invalid characters', () => {
    expect(() => slugSchema.parse('My Blog Post')).toThrow();
    expect(() => slugSchema.parse('post_with_underscore')).toThrow();
  });
});
