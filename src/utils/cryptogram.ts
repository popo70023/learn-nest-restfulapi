import * as crypto from 'crypto';

export function makeSalt(): string {
    return crypto.randomBytes(3).toString('base64');
  }