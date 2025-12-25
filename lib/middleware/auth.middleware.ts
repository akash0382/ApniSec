import { NextRequest } from "next/server";
import { JWTService } from "../utils/jwt";
import { AuthenticationError } from "../errors/app-error";
import type { JWTPayload } from "../types";

export class AuthMiddleware {
  private jwtService: JWTService;

  constructor() {
    this.jwtService = new JWTService();
  }

  getTokenFromRequest(request: NextRequest): string | null {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }

    // Also check cookies
    const cookieToken = request.cookies.get("accessToken")?.value;
    if (cookieToken) {
      return cookieToken;
    }

    return null;
  }

  async verifyToken(request: NextRequest): Promise<JWTPayload | null> {
    try {
      const token = this.getTokenFromRequest(request);
      if (!token) {
        return null;
      }

      const payload = this.jwtService.verifyAccessToken(token);
      return payload;
    } catch (error) {
      return null;
    }
  }

  async requireAuth(request: NextRequest): Promise<{ payload: JWTPayload }> {
    const payload = await this.verifyToken(request);
    if (!payload) {
      throw new AuthenticationError("Unauthorized - Invalid or missing token");
    }
    return { payload };
  }
}

