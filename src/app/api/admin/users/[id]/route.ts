import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  company: z.string().optional(),
  country: z.string().optional(),
  role: z.enum(["admin", "buyer"]).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

// PUT /api/admin/users/:id - Update user (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireRole(request, "admin");
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const body = await request.json();
    const parsed = updateUserSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid user data", parsed.error.issues);
    }

    const user = await prisma.user.update({
      where: { id },
      data: parsed.data,
    });

    return successResponse(user);
  } catch (error) {
    console.error("Update user error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to update user");
  }
}

// DELETE /api/admin/users/:id - Deactivate user (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireRole(request, "admin");
    if ("error" in auth) return auth.error;

    const { id } = await params;

    await prisma.user.update({
      where: { id },
      data: { status: "inactive" },
    });

    return successResponse({ message: "User deactivated successfully" });
  } catch (error) {
    console.error("Deactivate user error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to deactivate user");
  }
}
