import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";

const reorderSchema = z.object({
  sortOrder: z.number().int().min(0),
});

// PUT /api/images/:id/reorder - Reorder image (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireRole(request, "admin");
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const body = await request.json();
    const parsed = reorderSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid sort order", parsed.error.issues);
    }

    const image = await prisma.image.findUnique({ where: { id } });
    if (!image) {
      return errorResponse("NOT_FOUND", "Image not found");
    }

    const updated = await prisma.image.update({
      where: { id },
      data: { sortOrder: parsed.data.sortOrder },
    });

    return successResponse(updated);
  } catch (error) {
    console.error("Reorder image error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to reorder image");
  }
}
