// Rate limiting implementation
import { NextRequest } from 'next/server';
import { AppError, ErrorCode } from './error-handler';

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (req: NextRequest) => string;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class MemoryStore {
  private store: RateLimitStore = {};
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      Object.keys(this.store).forEach(key => {
        if (this.store[key].resetTime < now) {
          delete this.store[key];
        }
      });
    }, 60000);
  }

  increment(key: string, windowMs: number): number {
    const now = Date.now();
    const resetTime = now + windowMs;

    if (!this.store[key] || this.store[key].resetTime < now) {
      this.store[key] = { count: 1, resetTime };
      return 1;
    }

    this.store[key].count++;
    return this.store[key].count;
  }

  getRemainingTime(key: string): number {
    if (!this.store[key]) return 0;
    return Math.max(0, this.store[key].resetTime - Date.now());
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
  }
}

// Global store instance
const globalStore = new MemoryStore();

// Default key generator - uses IP address
function defaultKeyGenerator(req: NextRequest): string {
  return req.headers.get('x-forwarded-for') || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

// Rate limiter middleware factory
export function createRateLimiter(config: RateLimitConfig) {
  const {
    windowMs = 60 * 1000, // 1 minute default
    max = 100, // 100 requests per window default
    message = 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.',
    keyGenerator = defaultKeyGenerator
  } = config;

  return async function rateLimiter(req: NextRequest): Promise<void> {
    const key = keyGenerator(req);
    const count = globalStore.increment(key, windowMs);

    if (count > max) {
      const retryAfter = Math.ceil(globalStore.getRemainingTime(key) / 1000);
      throw new AppError(
        ErrorCode.RATE_LIMIT_ERROR,
        message,
        429,
        { retryAfter }
      );
    }
  };
}

// Pre-configured rate limiters for different endpoints
export const rateLimiters = {
  // Strict limit for auth endpoints
  auth: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: 'Zu viele Anmeldeversuche. Bitte warten Sie 15 Minuten.'
  }),

  // Moderate limit for API endpoints
  api: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
  }),

  // Relaxed limit for public endpoints
  public: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 200, // 200 requests per minute
  }),

  // Strict limit for payment endpoints
  payment: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 payment attempts per hour
    message: 'Zu viele Zahlungsversuche. Bitte warten Sie eine Stunde.'
  }),

  // File upload limit
  upload: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 uploads per hour
    message: 'Upload-Limit erreicht. Bitte warten Sie eine Stunde.'
  })
};

// Helper to apply rate limiting in API routes
export async function applyRateLimit(
  req: NextRequest,
  limiter: ReturnType<typeof createRateLimiter>
): Promise<void> {
  await limiter(req);
} 