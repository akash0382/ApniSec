import type { RateLimitInfo } from "../types";

interface RateLimitStore {
  [key: string]: RateLimitInfo;
}

export class RateLimiter {
  private store: RateLimitStore = {};
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 900000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs; // 15 minutes default
  }

  private getKey(identifier: string): string {
    return `rate_limit:${identifier}`;
  }

  private cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach((key) => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }

  checkLimit(identifier: string): {
    allowed: boolean;
    limit: number;
    remaining: number;
    reset: number;
  } {
    this.cleanup();
    const key = this.getKey(identifier);
    const now = Date.now();
    const record = this.store[key];

    if (!record || record.resetTime < now) {
      // Create new record
      const resetTime = now + this.windowMs;
      this.store[key] = {
        count: 1,
        resetTime,
      };
      return {
        allowed: true,
        limit: this.maxRequests,
        remaining: this.maxRequests - 1,
        reset: resetTime,
      };
    }

    if (record.count >= this.maxRequests) {
      return {
        allowed: false,
        limit: this.maxRequests,
        remaining: 0,
        reset: record.resetTime,
      };
    }

    // Increment count
    record.count++;
    return {
      allowed: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - record.count,
      reset: record.resetTime,
    };
  }

  reset(identifier: string): void {
    const key = this.getKey(identifier);
    delete this.store[key];
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter(
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000")
);

