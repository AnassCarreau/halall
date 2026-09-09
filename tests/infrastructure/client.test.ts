import { describe, it, expect, afterEach } from 'vitest';
import { getDb } from '@/infrastructure/db/client';

describe('db client', () => {
  const originalEnv = process.env.DATABASE_URL;

  afterEach(() => {
    process.env.DATABASE_URL = originalEnv;
  });

  it('returns null when DATABASE_URL is not set', () => {
    delete process.env.DATABASE_URL;
    expect(getDb()).toBeNull();
  });

  it('returns null when DATABASE_URL is empty string', () => {
    process.env.DATABASE_URL = '';
    expect(getDb()).toBeNull();
  });
});
