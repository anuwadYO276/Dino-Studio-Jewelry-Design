import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getAccessToken(request: NextRequest): string | undefined {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return request.cookies.get("access_token")?.value;
}

function base64UrlToBytes(input: string): Uint8Array {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function verifyAdminToken(
  token: string
): Promise<{ userId: string; role: string } | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const sigBytes = base64UrlToBytes(signature);
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    sigBytes as unknown as BufferSource,
    new TextEncoder().encode(`${header}.${payload}`)
  );
  if (!valid) return null;

  try {
    const decoded = JSON.parse(
      new TextDecoder().decode(base64UrlToBytes(payload))
    ) as { userId?: string; role?: string; exp?: number };
    if (!decoded.userId || !decoded.role) return null;
    if (decoded.exp != null && decoded.exp * 1000 < Date.now()) return null;
    return { userId: decoded.userId, role: decoded.role };
  } catch {
    return null;
  }
}

function unauthorizedApi() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Admin authentication required",
        details: [],
      },
    },
    { status: 401 }
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin/")) {
    const token = getAccessToken(request);
    if (!token) {
      if (pathname.startsWith("/api/")) return unauthorizedApi();
      const login = new URL("/login", request.url);
      login.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(login);
    }

    const payload = await verifyAdminToken(token);
    if (!payload || payload.role !== "admin") {
      if (pathname.startsWith("/api/")) return unauthorizedApi();
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
