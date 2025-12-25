import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";
import { RateLimitMiddleware } from "@/lib/middleware/rate-limit.middleware";
import { AuthMiddleware } from "@/lib/middleware/auth.middleware";
import { ErrorHandler } from "@/lib/errors/error-handler";

class AuthLogoutHandler {
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

      // Only allow POST
      if (request.method !== "POST") {
        return NextResponse.json(
          { success: false, error: "Method not allowed" },
          { status: 405 }
        );
      }

      const refreshToken = request.cookies.get("refreshToken")?.value;
      
      if (refreshToken) {
        await this.authService.logout(refreshToken);
      }

      const response = NextResponse.json(
        { success: true, message: "Logout successful" },
        { status: 200 }
      );

      // Clear cookies
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");

      return response;
    } catch (error: any) {
      return ErrorHandler.handle(error);
    }
  }
}

export async function POST(request: NextRequest) {
  const handler = new AuthLogoutHandler();
  return handler.handle(request);
}

