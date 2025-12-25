import { prisma } from "../db/prisma";
import type { User } from "../types";

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(data: { email: string; password: string; name?: string }) {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, data: { name?: string; email?: string }) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async createRefreshToken(userId: string, token: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async deleteRefreshToken(token: string) {
    return prisma.refreshToken.delete({
      where: { token },
    });
  }

  async deleteAllRefreshTokens(userId: string) {
    return prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async createPasswordResetToken(userId: string, token: string, expiresAt: Date) {
    const delegate = (prisma as any).passwordResetToken;
    if (!delegate || typeof delegate.create !== "function") {
      throw new Error("PasswordResetToken model is not available. Please run `npm run db:generate` and `npm run db:push`.");
    }
    return delegate.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async findPasswordResetToken(token: string) {
    const delegate = (prisma as any).passwordResetToken;
    if (!delegate || typeof delegate.findUnique !== "function") {
      return null;
    }
    return delegate.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async deletePasswordResetToken(token: string) {
    const delegate = (prisma as any).passwordResetToken;
    if (!delegate || typeof delegate.delete !== "function") {
      return;
    }
    return delegate.delete({
      where: { token },
    });
  }

  async updatePassword(id: string, hashedPassword: string) {
    return prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}

