// app/utils/rateLimiter.server.ts
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  points: 5, // Number of points
  duration: 60, // Per 60 seconds
});

export async function checkRateLimit(identifier: string) {
  try {
    await rateLimiter.consume(identifier);
    return null; // No error, request can proceed
  } catch (error) {
    if (error instanceof Error) {
      return error; // Rate limit exceeded
    }
    return new Error('Unknown rate limiting error');
  }
}