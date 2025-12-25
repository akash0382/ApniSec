import { NextResponse } from "next/server";
import { AppError } from "./app-error";

export class ErrorHandler {
  public static handle(error: any): NextResponse {
    console.error("Error caught by ErrorHandler:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: error.statusCode }
      );
    }

    // Handle Zod validation errors if they bubble up
    if (error.name === "ZodError" || error.constructor.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.errors || error.message,
        },
        { status: 400 }
      );
    }

    // Default error
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
