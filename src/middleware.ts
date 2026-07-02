import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't need auth
const publicRoutes = [
  "/api/auth/request-otp",
  "/api/auth/verify-otp",
  "/api/products",
  "/api/inquiries",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public API routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for auth token on protected API routes
  if (pathname.startsWith("/api/")) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Missing or invalid authorization token",
            details: [],
          },
        },
        { status: 401 }
      );
    }
  }

  // Protected pages - only admin requires login
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*"],
};
