import { prisma } from "../db/prisma";
import type { Issue } from "../types";

export class IssueRepository {
  async findById(id: string): Promise<Issue | null> {
    return prisma.issue.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string, type?: string) {
    const where: any = { userId };
    if (type) {
      where.type = type;
    }
    return prisma.issue.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: {
    type: "CLOUD_SECURITY" | "RETEAM_ASSESSMENT" | "VAPT";
    title: string;
    description: string;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    status?: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
    userId: string;
  }): Promise<Issue> {
    return prisma.issue.create({
      data: {
        type: data.type,
        title: data.title,
        description: data.description,
        priority: data.priority || "MEDIUM",
        status: data.status || "OPEN",
        userId: data.userId,
      },
    });
  }

  async update(
    id: string,
    data: {
      type?: "CLOUD_SECURITY" | "RETEAM_ASSESSMENT" | "VAPT";
      title?: string;
      description?: string;
      priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
      status?: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
    }
  ): Promise<Issue> {
    return prisma.issue.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.issue.delete({
      where: { id },
    });
  }

  async checkOwnership(id: string, userId: string): Promise<boolean> {
    const issue = await prisma.issue.findUnique({
      where: { id },
      select: { userId: true },
    });
    return issue?.userId === userId;
  }
}

