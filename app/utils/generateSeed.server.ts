import crypto from 'crypto';

export function generateSeed(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}