import { z } from "zod";

export class AuthValidator {
  static registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(1, "Name is required").optional(),
  });

  static loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  });

  static validateRegister(data: unknown) {
    return this.registerSchema.parse(data);
  }

  static validateLogin(data: unknown) {
    return this.loginSchema.parse(data);
  }

  static requestResetSchema = z.object({
    email: z.string().email("Invalid email address"),
  });

  static resetPasswordSchema = z.object({
    token: z.string().min(1, "Reset token is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  static validateRequestReset(data: unknown) {
    return this.requestResetSchema.parse(data);
  }

  static validateResetPassword(data: unknown) {
    return this.resetPasswordSchema.parse(data);
  }
}

