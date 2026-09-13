import { describe, it, expect } from 'vitest';
import { users, tokens, generateToken, verifyToken } from '../utils/authStore.js';

describe('Auth Store Utilities', () => {
  it('generates a unique token string starting with token_', () => {
    const token1 = generateToken();
    const token2 = generateToken();

    expect(token1).toMatch(/^token_/);
    expect(token2).toMatch(/^token_/);
    expect(token1).not.toBe(token2);
  });

  it('verifies stored token correctly and returns associated email', () => {
    const testToken = generateToken();
    const email = 'scholar@imanify.app';

    tokens.set(testToken, email);
    expect(verifyToken(testToken)).toBe(email);
    expect(verifyToken('non_existent_token')).toBeNull();
  });

  it('contains default demo user profile', () => {
    const demoUser = users.get('demo@imanify.app');
    expect(demoUser).toBeDefined();
    expect(demoUser?.email).toBe('demo@imanify.app');
    expect(demoUser?.streak).toBeGreaterThanOrEqual(7);
  });
});
