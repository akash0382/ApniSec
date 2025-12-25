import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import type { JWTPayload } from "../types";

export class JWTService {
  private secret: string;
  private refreshSecret: string;
  private expiresIn: string;
  private refreshExpiresIn: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || "default-secret-change-in-production";
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || "default-refresh-secret-change-in-production";
    this.expiresIn = process.env.JWT_EXPIRES_IN || "1h";
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
  }

  generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    } as SignOptions);
  }

  generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: this.refreshExpiresIn,
    } as SignOptions);
  }

  verifyAccessToken(token: string): JWTPayload {
    try {
      const options: VerifyOptions = {};
      return jwt.verify(token, this.secret, options) as JWTPayload;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  verifyRefreshToken(token: string): JWTPayload {
    try {
      const options: VerifyOptions = {};
      return jwt.verify(token, this.refreshSecret, options) as JWTPayload;
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  }
}

