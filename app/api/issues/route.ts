import { NextRequest, NextResponse } from "next/server";
import { IssueService } from "@/lib/services/issue.service";
import { RateLimitMiddleware } from "@/lib/middleware/rate-limit.middleware";
import { AuthMiddleware } from "@/lib/middleware/auth.middleware";
import { ErrorHandler } from "@/lib/errors/error-handler";

class IssueHandler {
  private issueService: IssueService;
  private rateLimitMiddleware: RateLimitMiddleware;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.issueService = new IssueService();
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

      const { searchParams } = new URL(request.url);
      const type = searchParams.get("type") || undefined;

      const result = await this.issueService.getIssues(authResult.payload.userId, type || undefined);

      return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
      return ErrorHandler.handle(error);
    }
  }

  async handlePost(request: NextRequest): Promise<NextResponse> {
    try {
      // Check rate limit
      const rateLimitResponse = await this.rateLimitMiddleware.checkRateLimit(request);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }

      // Check authentication
      const authResult = await this.authMiddleware.requireAuth(request);

      const body = await request.json();
      const result = await this.issueService.createIssue(authResult.payload.userId, body);

      return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
      return ErrorHandler.handle(error);
    }
  }
}

export async function GET(request: NextRequest) {
  const handler = new IssueHandler();
  return handler.handleGet(request);
}

export async function POST(request: NextRequest) {
  const handler = new IssueHandler();
  return handler.handlePost(request);
}

