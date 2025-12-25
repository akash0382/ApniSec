import { z } from "zod";

export class IssueValidator {
  static createSchema = z.object({
    type: z.enum(["CLOUD_SECURITY", "RETEAM_ASSESSMENT", "VAPT"], {
      errorMap: () => ({ message: "Invalid issue type" }),
    }),
    title: z.string().min(1, "Title is required").max(200, "Title too long"),
    description: z.string().min(1, "Description is required").max(5000, "Description too long"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
    status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
  });

  static updateSchema = z.object({
    type: z.enum(["CLOUD_SECURITY", "RETEAM_ASSESSMENT", "VAPT"]).optional(),
    title: z.string().min(1).max(200).optional(),
    description: z.string().min(1).max(5000).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
    status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
  });

  static validateCreate(data: unknown) {
    return this.createSchema.parse(data);
  }

  static validateUpdate(data: unknown) {
    return this.updateSchema.parse(data);
  }
}

