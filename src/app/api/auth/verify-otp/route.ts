import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth";
import { verifyOtpSchema } from "@/lib/validators";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = verifyOtpSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Invalid input",
        parsed.error.issues
      );
    }

    const { identifier, code, type } = parsed.data;

    // Find user
    const user = await prisma.user.findFirst({
      where:
        type === "email" ? { email: identifier } : { phone: identifier },
    });

    if (!user) {
      return errorResponse("NOT_FOUND", "User not found");
    }

    // Find valid OTP
    const otpToken = await prisma.otpToken.findFirst({
      where: {
        userId: user.id,
        type,
        isUsed: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpToken) {
      return errorResponse("OTP_EXPIRED", "OTP has expired or not found");
    }

    // Check max attempts
    const maxAttempts = Number(process.env.OTP_MAX_ATTEMPTS) || 3;
    if (otpToken.attempts >= maxAttempts) {
      return errorResponse(
        "OTP_INVALID",
        "Maximum verification attempts exceeded"
      );
    }

    // Increment attempts
    await prisma.otpToken.update({
      where: { id: otpToken.id },
      data: { attempts: { increment: 1 } },
    });

    // Verify code
    if (otpToken.code !== code) {
      return errorResponse("OTP_INVALID", "Invalid OTP code");
    }

    // Mark OTP as used
    await prisma.otpToken.update({
      where: { id: otpToken.id },
      data: { isUsed: true },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate tokens
    const tokenPayload = { userId: user.id, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store session
    const userAgent = request.headers.get("user-agent") || undefined;
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      undefined;

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        userAgent,
        ipAddress,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return successResponse({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to verify OTP");
  }
}
