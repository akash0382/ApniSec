import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/user.service";
import { RateLimitMiddleware } from "@/lib/middleware/rate-limit.middleware";
import { AuthMiddleware } from "@/lib/middleware/auth.middleware";
import { ErrorHandler } from "@/lib/errors/error-handler";

class UserProfileHandler {
  private userService: UserService;
  private rateLimitMiddleware: RateLimitMiddleware;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.userService = new UserService();
    this.rateLimitMiddleware = new RateLimitMiddleware();
    this.authMiddleware = new AuthMiddleware();
  }

  async handleGet(request: NextRequest): Promise<NextResponse> {
    try {
      // Check rate limit
      const rateLimitResponse = await this.rateLimitMiddleware.checkRateLimit(request);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }

      // Check authentication
      const authResult = await this.authMiddleware.requireAuth(request);

      const result = await this.userService.getProfile(authResult.payload.userId);

      return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
      return ErrorHandler.handle(error);
    }
  }

  async handlePut(request: NextRequest): Promise<NextResponse> {
    try {
      // Check rate limit
      const rateLimitResponse = await this.rateLimitMiddleware.checkRateLimit(request);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }

      // Check authentication
      const authResult = await this.authMiddleware.requireAuth(request);

      const body = await request.json();
      const result = await this.userService.updateProfile(authResult.payload.userId, body);

      return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
      return ErrorHandler.handle(error);
    }
  }
}

export async function GET(request: NextRequest) {
  const handler = new UserProfileHandler();
  return handler.handleGet(request);
}

export async function PUT(request: NextRequest) {
  const handler = new UserProfileHandler();
  return handler.handlePut(request);
}

