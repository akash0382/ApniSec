import { NextRequest, NextResponse } from "next/server";
import { IssueService } from "@/lib/services/issue.service";
import { RateLimitMiddleware } from "@/lib/middleware/rate-limit.middleware";
import { AuthMiddleware } from "@/lib/middleware/auth.middleware";
import { ErrorHandler } from "@/lib/errors/error-handler";

class IssueDetailHandler {
  private issueService: IssueService;
  private rateLimitMiddleware: RateLimitMiddleware;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.issueService = new IssueService();
    this.rateLimitMiddleware = new RateLimitMiddleware();
    this.authMiddleware = new AuthMiddleware();
  }

  async handleGet(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      // Check rate limit
      const rateLimitResponse = await this.rateLimitMiddleware.checkRateLimit(request);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }

      // Check authentication
      const authResult = await this.authMiddleware.requireAuth(request);

      const result = await this.issueService.getIssueById(params.id, authResult.payload.userId);

      return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
      return ErrorHandler.handle(error);
    }
  }

  async handlePut(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      // Check rate limit
      const rateLimitResponse = await this.rateLimitMiddleware.checkRateLimit(request);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }

      // Check authentication
      const authResult = await this.authMiddleware.requireAuth(request);

      const body = await request.json();
      const result = await this.issueService.updateIssue(params.id, authResult.payload.userId, body);

      return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
      return ErrorHandler.handle(error);
    }
  }

  async handleDelete(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      // Check rate limit
      const rateLimitResponse = await this.rateLimitMiddleware.checkRateLimit(request);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }

      // Check authentication
      const authResult = await this.authMiddleware.requireAuth(request);

      const result = await this.issueService.deleteIssue(params.id, authResult.payload.userId);

      return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
      return ErrorHandler.handle(error);
    }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const handler = new IssueDetailHandler();
  return handler.handleGet(request, { params: resolvedParams });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const handler = new IssueDetailHandler();
  return handler.handlePut(request, { params: resolvedParams });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const handler = new IssueDetailHandler();
  return handler.handleDelete(request, { params: resolvedParams });
}

