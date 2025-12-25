import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";
import { RateLimitMiddleware } from "@/lib/middleware/rate-limit.middleware";
import { AuthMiddleware } from "@/lib/middleware/auth.middleware";
import { ErrorHandler } from "@/lib/errors/error-handler";

class AuthMeHandler {
  private authService: AuthService;
  private rateLimitMiddleware: RateLimitMiddleware;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.authService = new AuthService();
    this.rateLimitMiddleware = new RateLimitMiddleware();
    this.authMiddleware = new AuthMiddleware();
  }

  async handle(request: NextRequest): Promise<NextResponse> {
    try {
      // Check rate limit
      const rateLimitResponse = await this.rateLimitMiddleware.checkRateLimit(request);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }

      // Only allow GET
      if (request.method !== "GET") {
        return NextResponse.json(
          { success: false, error: "Method not allowed" },
          { status: 405 }
        );
      }

      // Check authentication
      const authResult = await this.authMiddleware.requireAuth(request);

      const result = await this.authService.getCurrentUser(authResult.payload.userId);

      return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
      return ErrorHandler.handle(error);
    }
  }
}

export async function GET(request: NextRequest) {
  const handler = new AuthMeHandler();
  return handler.handle(request);
}

