import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't need auth
const publicRoutes = ["/api/auth/request-otp", "/api/auth/verify-otp"];

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

  // Protected pages - check for token cookie
  if (pathname.startsWith("/admin") || pathname.startsWith("/catalog")) {
    const token = request.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/catalog/:path*"],
};
