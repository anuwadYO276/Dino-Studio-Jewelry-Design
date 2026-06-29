import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return errorResponse("UNAUTHORIZED", "Missing authorization token");
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload) {
      return errorResponse("UNAUTHORIZED", "Invalid token");
    }

    // Delete all sessions for this user (or just the current one)
    await prisma.session.deleteMany({
      where: { userId: payload.userId },
    });

    return successResponse({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to logout");
  }
}
