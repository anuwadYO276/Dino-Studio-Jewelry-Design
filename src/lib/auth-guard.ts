import { NextRequest } from "next/server";
import { verifyToken, TokenPayload } from "@/lib/auth";
import { errorResponse } from "@/lib/api-response";
import { UserRole } from "@prisma/client";

export function getTokenPayload(request: NextRequest): TokenPayload | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return verifyToken(authHeader.substring(7));
}

export function requireAuth(request: NextRequest) {
  const payload = getTokenPayload(request);
  if (!payload) {
    return { error: errorResponse("UNAUTHORIZED", "Authentication required") };
  }
  return { payload };
}

export function requireRole(request: NextRequest, role: UserRole) {
  const result = requireAuth(request);
  if ("error" in result) return result;

  if (result.payload.role !== role) {
    return { error: errorResponse("FORBIDDEN", "Insufficient permissions") };
  }
  return result;
}
