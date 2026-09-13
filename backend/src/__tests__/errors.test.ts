import { describe, it, expect } from 'vitest';
import {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  InternalServerError
} from '../utils/errors.js';

describe('Custom Error Classes', () => {
  it('AppError initializes with message, status code, and operational flag', () => {
    const err = new AppError('Something went wrong', 418, true);
    expect(err.message).toBe('Something went wrong');
    expect(err.statusCode).toBe(418);
    expect(err.isOperational).toBe(true);
    expect(err).toBeInstanceOf(Error);
  });

  it('ValidationError defaults to 400 Bad Request', () => {
    const err = new ValidationError('Invalid email format');
    expect(err.message).toBe('Invalid email format');
    expect(err.statusCode).toBe(400);
    expect(err).toBeInstanceOf(AppError);
  });

  it('NotFoundError sets status code 404 with formatted message', () => {
    const err = new NotFoundError('Surah');
    expect(err.message).toBe('Surah not found');
    expect(err.statusCode).toBe(404);
  });

  it('UnauthorizedError defaults to 401 Unauthorized', () => {
    const err = new UnauthorizedError();
    expect(err.message).toBe('Unauthorized');
    expect(err.statusCode).toBe(401);
  });

  it('ForbiddenError defaults to 403 Forbidden', () => {
    const err = new ForbiddenError();
    expect(err.message).toBe('Forbidden');
    expect(err.statusCode).toBe(403);
  });

  it('ConflictError sets status code 409', () => {
    const err = new ConflictError('User already exists');
    expect(err.message).toBe('User already exists');
    expect(err.statusCode).toBe(409);
  });

  it('InternalServerError sets status code 500', () => {
    const err = new InternalServerError();
    expect(err.message).toBe('Internal Server Error');
    expect(err.statusCode).toBe(500);
  });
});
