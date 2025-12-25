import { z } from "zod";

export class UserValidator {
  static updateProfileSchema = z.object({
    name: z.string().min(1, "Name cannot be empty").optional(),
    email: z.string().email("Invalid email address").optional(),
  });

  static validateUpdateProfile(data: unknown) {
    return this.updateProfileSchema.parse(data);
  }
}

