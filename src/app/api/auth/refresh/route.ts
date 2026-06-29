import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, generateAccessToken } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return errorResponse("VALIDATION_ERROR", "Refresh token is required");
    }

    // Verify the refresh token
    const payload = verifyToken(refreshToken);
    if (!payload) {
      return errorResponse("UNAUTHORIZED", "Invalid or expired refresh token");
    }

    // Check session exists
    const session = await prisma.session.findFirst({
      where: {
        userId: payload.userId,
        refreshToken,
        expiresAt: { gte: new Date() },
      },
    });

    if (!session) {
      return errorResponse("UNAUTHORIZED", "Session not found or expired");
    }

    // Generate new access token
    const accessToken = generateAccessToken({
      userId: payload.userId,
      role: payload.role,
    });

    return successResponse({ accessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to refresh token");
  }
}
