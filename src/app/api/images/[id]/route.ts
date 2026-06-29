import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { successResponse, errorResponse } from "@/lib/api-response";
import { deleteFromS3 } from "@/lib/s3";

// DELETE /api/images/:id - Delete image from S3 (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireRole(request, "admin");
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const image = await prisma.image.findUnique({ where: { id } });
    if (!image) {
      return errorResponse("NOT_FOUND", "Image not found");
    }

    // Delete from S3
    try {
      await deleteFromS3(image.url);
    } catch (err) {
      console.warn("Failed to delete from S3:", err);
      // Continue to delete DB record even if S3 delete fails
    }

    // Delete from database
    await prisma.image.delete({ where: { id } });

    return successResponse({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete image error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to delete image");
  }
}
