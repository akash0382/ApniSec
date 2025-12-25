import { IssueRepository } from "../repositories/issue.repository";
import { IssueValidator } from "../validators/issue.validator";
import { EmailService } from "../utils/email";
import { UserRepository } from "../repositories/user.repository";
import { NotFoundError, ForbiddenError } from "../errors/app-error";
import type { ApiResponse } from "../types";

export class IssueService {
  private issueRepository: IssueRepository;
  private emailService: EmailService;
  private userRepository: UserRepository;

  constructor() {
    this.issueRepository = new IssueRepository();
    this.emailService = new EmailService();
    this.userRepository = new UserRepository();
  }

  async getIssues(userId: string, type?: string): Promise<ApiResponse> {
    const issues = await this.issueRepository.findByUserId(userId, type);
    return {
      success: true,
      data: issues,
    };
  }

  async getIssueById(id: string, userId: string): Promise<ApiResponse> {
    const issue = await this.issueRepository.findById(id);
    if (!issue) {
      throw new NotFoundError("Issue not found");
    }

    if (issue.userId !== userId) {
      throw new ForbiddenError("Unauthorized access to issue");
    }

    return {
      success: true,
      data: issue,
    };
  }

  async createIssue(
    userId: string,
    data: {
      type: "CLOUD_SECURITY" | "RETEAM_ASSESSMENT" | "VAPT";
      title: string;
      description: string;
      priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
      status?: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
    }
  ): Promise<ApiResponse> {
    const validatedData = IssueValidator.validateCreate(data);

    const issue = await this.issueRepository.create({
      ...validatedData,
      userId,
    });

    // Send notification email
    const user = await this.userRepository.findById(userId);
    if (user) {
      await this.emailService.sendIssueCreatedEmail(
        user.email,
        validatedData.type,
        validatedData.title,
        validatedData.description
      );
    }

    return {
      success: true,
      data: issue,
      message: "Issue created successfully",
    };
  }

  async updateIssue(
    id: string,
    userId: string,
    data: {
      type?: "CLOUD_SECURITY" | "RETEAM_ASSESSMENT" | "VAPT";
      title?: string;
      description?: string;
      priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
      status?: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
    }
  ): Promise<ApiResponse> {
    const validatedData = IssueValidator.validateUpdate(data);

    // Check ownership
    const isOwner = await this.issueRepository.checkOwnership(id, userId);
    if (!isOwner) {
      throw new ForbiddenError("Unauthorized access to issue");
    }

    const issue = await this.issueRepository.update(id, validatedData);

    const user = await this.userRepository.findById(userId);
    if (user) {
      await this.emailService.sendIssueUpdatedEmail(
        user.email,
        issue.type,
        issue.title,
        issue.status
      );
    }

    return {
      success: true,
      data: issue,
      message: "Issue updated successfully",
    };
  }

  async deleteIssue(id: string, userId: string): Promise<ApiResponse> {
    // Check ownership
    const isOwner = await this.issueRepository.checkOwnership(id, userId);
    if (!isOwner) {
      throw new ForbiddenError("Unauthorized access to issue");
    }

    const before = await this.issueRepository.findById(id);
    await this.issueRepository.delete(id);

    const user = await this.userRepository.findById(userId);
    if (user && before) {
      await this.emailService.sendIssueDeletedEmail(user.email, before.title);
    }

    return {
      success: true,
      message: "Issue deleted successfully",
    };
  }
}

