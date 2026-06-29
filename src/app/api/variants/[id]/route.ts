import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { updateVariantSchema } from "@/lib/validators";
import { successResponse, errorResponse } from "@/lib/api-response";

// PUT /api/variants/:id - Update variant (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireRole(request, "admin");
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const body = await request.json();
    const parsed = updateVariantSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid variant data", parsed.error.issues);
    }

    const variant = await prisma.variant.update({
      where: { id },
      data: parsed.data,
      include: { images: true },
    });

    return successResponse(variant);
  } catch (error) {
    console.error("Update variant error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to update variant");
  }
}

// DELETE /api/variants/:id - Soft delete variant (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireRole(request, "admin");
    if ("error" in auth) return auth.error;

    const { id } = await params;

    await prisma.variant.update({
      where: { id },
      data: { isActive: false },
    });

    return successResponse({ message: "Variant deleted successfully" });
  } catch (error) {
    console.error("Delete variant error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to delete variant");
  }
}
