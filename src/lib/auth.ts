import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || "1h";
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || "7d";

export interface TokenPayload {
  userId: string;
  role: UserRole;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRY as jwt.SignOptions["expiresIn"],
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRY as jwt.SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function generateOtp(length: number = 6): string {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}
