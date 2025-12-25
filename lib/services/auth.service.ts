import { UserRepository } from "../repositories/user.repository";
import { PasswordService } from "../utils/password";
import { JWTService } from "../utils/jwt";
import { EmailService } from "../utils/email";
import { AuthValidator } from "../validators/auth.validator";
import { ConflictError, AuthenticationError, NotFoundError, ValidationError } from "../errors/app-error";
import type { ApiResponse } from "../types";

export class AuthService {
  private userRepository: UserRepository;
  private passwordService: PasswordService;
  private jwtService: JWTService;
  private emailService: EmailService;

  constructor() {
    this.userRepository = new UserRepository();
    this.passwordService = new PasswordService();
    this.jwtService = new JWTService();
    this.emailService = new EmailService();
  }

  async register(data: { email: string; password: string; name?: string }): Promise<ApiResponse> {
    const validatedData = AuthValidator.validateRegister(data);

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(validatedData.email);
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await this.passwordService.hashPassword(validatedData.password);

    // Create user
    const user = await this.userRepository.create({
      email: validatedData.email,
      password: hashedPassword,
      name: validatedData.name,
    });

    // Send welcome email
    await this.emailService.sendWelcomeEmail(user.email, user.name || user.email);

    // Generate tokens
    const accessToken = this.jwtService.generateAccessToken({
      userId: user.id,
      email: user.email,
    });
    const refreshToken = this.jwtService.generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
    await this.userRepository.createRefreshToken(user.id, refreshToken, expiresAt);

    await this.emailService.sendLoginEmail(user.email, user.name || user.email);

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        accessToken,
        refreshToken,
      },
      message: "User registered successfully",
    };
  }

  async login(data: { email: string; password: string }): Promise<ApiResponse> {
    const validatedData = AuthValidator.validateLogin(data);

    // Find user
    const user = await this.userRepository.findByEmail(validatedData.email);
    if (!user) {
      throw new AuthenticationError("Invalid email or password");
    }

    // Verify password
    const isValidPassword = await this.passwordService.comparePassword(
      validatedData.password,
      user.password
    );
    if (!isValidPassword) {
      await this.emailService.sendFailedLoginEmail(user.email, user.name || user.email);
      throw new AuthenticationError("Invalid email or password");
    }

    // Generate tokens
    const accessToken = this.jwtService.generateAccessToken({
      userId: user.id,
      email: user.email,
    });
    const refreshToken = this.jwtService.generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
    await this.userRepository.createRefreshToken(user.id, refreshToken, expiresAt);

    // Send login notification email
    console.log(`DEBUG: Calling emailService.sendLoginEmail for ${user.email}`);
    await this.emailService.sendLoginEmail(user.email, user.name || user.email);

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        accessToken,
        refreshToken,
      },
      message: "Login successful",
    };
  }

  async logout(refreshToken: string): Promise<ApiResponse> {
    const record = await this.userRepository.findRefreshToken(refreshToken);
    if (record) {
      await this.emailService.sendLogoutEmail(
        record.user.email,
        record.user.name || record.user.email
      );
    }
    await this.userRepository.deleteRefreshToken(refreshToken);
    return {
      success: true,
      message: "Logout successful",
    };
  }

  async getCurrentUser(userId: string): Promise<ApiResponse> {
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
      },
    };
  }

  async requestPasswordReset(data: { email: string }): Promise<ApiResponse> {
    const { email } = AuthValidator.validateRequestReset(data);
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return { success: true, message: "If the email exists, a link was sent" };
    }
    const token = (await import("crypto")).randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);
    await this.userRepository.createPasswordResetToken(user.id, token, expiresAt);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetLink = `${appUrl}/reset/${token}`;
    await this.emailService.sendPasswordResetEmail(user.email, resetLink);
    return { success: true, message: "Password reset link sent" };
  }

  async resetPassword(data: { token: string; password: string }): Promise<ApiResponse> {
    const { token, password } = AuthValidator.validateResetPassword(data);
    const record = await this.userRepository.findPasswordResetToken(token);
    if (!record || record.expiresAt < new Date()) {
      throw new ValidationError("Invalid or expired token");
    }
    const hashed = await this.passwordService.hashPassword(password);
    await this.userRepository.updatePassword(record.userId, hashed);
    await this.userRepository.deletePasswordResetToken(token);
    await this.emailService.sendPasswordResetSuccessEmail(record.user.email);
    return { success: true, message: "Password reset successful" };
  }
}

