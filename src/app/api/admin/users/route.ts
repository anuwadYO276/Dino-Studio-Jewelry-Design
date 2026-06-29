import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";

// GET /api/admin/users - List all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const auth = requireRole(request, "admin");
    if ("error" in auth) return auth.error;

    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { company: { contains: search } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        company: true,
        country: true,
        role: true,
        status: true,
        lastLogin: true,
        createdAt: true,
      },
    });

    return successResponse(users);
  } catch (error) {
    console.error("List users error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to fetch users");
  }
}

const createUserSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  name: z.string().min(1),
  company: z.string().optional(),
  country: z.string().optional(),
  role: z.enum(["admin", "buyer"]).optional(),
});

// POST /api/admin/users - Create user (admin only)
export async function POST(request: NextRequest) {
  try {
    const auth = requireRole(request, "admin");
    if ("error" in auth) return auth.error;

    const body = await request.json();
    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid user data", parsed.error.issues);
    }

    if (!parsed.data.email && !parsed.data.phone) {
      return errorResponse("VALIDATION_ERROR", "Email or phone is required");
    }

    const user = await prisma.user.create({
      data: {
        ...parsed.data,
        role: parsed.data.role || "buyer",
      },
    });

    return successResponse(user, 201);
  } catch (error) {
    console.error("Create user error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to create user");
  }
}
