import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";
import { RateLimitMiddleware } from "@/lib/middleware/rate-limit.middleware";
import { ErrorHandler } from "@/lib/errors/error-handler";

class AuthRequestResetHandler {
  private authService: AuthService;
  private rateLimitMiddleware: RateLimitMiddleware;

  constructor() {
    this.authService = new AuthService();
    this.rateLimitMiddleware = new RateLimitMiddleware();
  }

  async handle(request: NextRequest): Promise<NextResponse> {
    try {
      const rateLimitResponse = await this.rateLimitMiddleware.checkRateLimit(request);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }
      if (request.method !== "POST") {
        return NextResponse.json({ success: false, error: "Method not allowed" }, { status: 405 });
      }

      const body = await request.json();
      const result = await this.authService.requestPasswordReset(body);
      return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
      return ErrorHandler.handle(error);
    }
  }
}

export async function POST(request: NextRequest) {
  const handler = new AuthRequestResetHandler();
  return handler.handle(request);
}
