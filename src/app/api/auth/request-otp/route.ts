import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOtp } from "@/lib/auth";
import { sendOtpEmail } from "@/lib/email";
import { sendOtpSms } from "@/lib/sms";
import { requestOtpSchema } from "@/lib/validators";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = requestOtpSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Invalid input",
        parsed.error.issues
      );
    }

    const { identifier, type } = parsed.data;

    // Find user by email or phone
    const user = await prisma.user.findFirst({
      where:
        type === "email" ? { email: identifier } : { phone: identifier },
    });

    if (!user) {
      return errorResponse("NOT_FOUND", "User not found with this identifier");
    }

    if (user.status !== "active") {
      return errorResponse("FORBIDDEN", "Account is inactive");
    }

    // Rate limiting: check recent OTP requests (3 per 10 min)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recentOtps = await prisma.otpToken.count({
      where: {
        userId: user.id,
        createdAt: { gte: tenMinutesAgo },
      },
    });

    if (recentOtps >= 3) {
      return errorResponse(
        "RATE_LIMITED",
        "Too many OTP requests. Please try again later."
      );
    }

    // Generate OTP
    const otpLength = Number(process.env.OTP_LENGTH) || 6;
    const otpExpiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES) || 5;
    const otp = generateOtp(otpLength);

    // Store OTP
    await prisma.otpToken.create({
      data: {
        userId: user.id,
        code: otp,
        type,
        expiresAt: new Date(Date.now() + otpExpiryMinutes * 60 * 1000),
      },
    });

    // Send OTP
    if (type === "email") {
      await sendOtpEmail({ to: identifier, otp });
    } else {
      await sendOtpSms({ to: identifier, otp });
    }

    return successResponse({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Request OTP error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to send OTP");
  }
}
