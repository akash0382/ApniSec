import { UserRepository } from "../repositories/user.repository";
import { UserValidator } from "../validators/user.validator";
import { EmailService } from "../utils/email";
import { NotFoundError, ConflictError } from "../errors/app-error";
import type { ApiResponse } from "../types";

export class UserService {
  private userRepository: UserRepository;
  private emailService: EmailService;

  constructor() {
    this.userRepository = new UserRepository();
    this.emailService = new EmailService();
  }

  async getProfile(userId: string): Promise<ApiResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async updateProfile(userId: string, data: { name?: string; email?: string }): Promise<ApiResponse> {
    const validatedData = UserValidator.validateUpdateProfile(data);

    // Check if email is being changed and if it's already taken
    if (validatedData.email) {
      const existingUser = await this.userRepository.findByEmail(validatedData.email);
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictError("Email already in use");
      }
    }

    const user = await this.userRepository.update(userId, validatedData);

    // Send notification email
    await this.emailService.sendProfileUpdatedEmail(user.email, user.name || user.email);

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        updatedAt: user.updatedAt,
      },
      message: "Profile updated successfully",
    };
  }
}

