import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "../utils/rate-limiter";
import { AuthMiddleware } from "./auth.middleware";

export class RateLimitMiddleware {
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.authMiddleware = new AuthMiddleware();
  }

  async checkRateLimit(request: NextRequest): Promise<NextResponse | null> {
    // Get identifier (user ID if authenticated, otherwise IP)
    let identifier: string;

    const authResult = await this.authMiddleware.verifyToken(request);
    if (authResult) {
      identifier = `user:${authResult.userId}`;
    } else {
      // Use IP address as fallback
      const forwarded = request.headers.get("x-forwarded-for");
      const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown";
      identifier = `ip:${ip}`;
    }

    const result = rateLimiter.checkLimit(identifier);

    if (!result.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": result.limit.toString(),
            "X-RateLimit-Remaining": result.remaining.toString(),
            "X-RateLimit-Reset": result.reset.toString(),
            "Retry-After": Math.ceil((result.reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Return null to indicate rate limit passed
    return null;
  }

  getRateLimitHeaders(identifier: string) {
    // This is a helper to get headers for successful requests
    const result = rateLimiter.checkLimit(identifier);
    return {
      "X-RateLimit-Limit": result.limit.toString(),
      "X-RateLimit-Remaining": result.remaining.toString(),
      "X-RateLimit-Reset": result.reset.toString(),
    };
  }
}

