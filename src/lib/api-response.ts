import { NextResponse } from "next/server";

type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "OTP_EXPIRED"
  | "OTP_INVALID"
  | "INTERNAL_ERROR";

const STATUS_MAP: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  OTP_EXPIRED: 400,
  OTP_INVALID: 400,
  INTERNAL_ERROR: 500,
};

export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(
  code: ErrorCode,
  message: string,
  details: unknown[] = []
) {
  return NextResponse.json(
    {
      success: false,
      error: { code, message, details },
    },
    { status: STATUS_MAP[code] }
  );
}
