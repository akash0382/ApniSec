import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";
import { RateLimitMiddleware } from "@/lib/middleware/rate-limit.middleware";
import { AuthMiddleware } from "@/lib/middleware/auth.middleware";
import { ErrorHandler } from "@/lib/errors/error-handler";

class AuthRegisterHandler {
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

      const body = await request.json();
      const result = await this.authService.register(body);

      const response = NextResponse.json(result, { status: 201 });

      // Set cookies for tokens
      if (result.data?.accessToken) {
        response.cookies.set("accessToken", result.data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60, // 1 hour
        });
      }

      if (result.data?.refreshToken) {
        response.cookies.set("refreshToken", result.data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }

      return response;
    } catch (error: any) {
      return ErrorHandler.handle(error);
    }
  }
}

export async function POST(request: NextRequest) {
  const handler = new AuthRegisterHandler();
  return handler.handle(request);
}

