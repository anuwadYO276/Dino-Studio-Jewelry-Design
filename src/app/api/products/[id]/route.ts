import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { updateProductSchema } from "@/lib/validators";
import { successResponse, errorResponse } from "@/lib/api-response";

// GET /api/products/:id - Get product detail (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: { where: { isActive: true }, orderBy: { createdAt: "asc" } },
        images: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!product) {
      return errorResponse("NOT_FOUND", "Product not found");
    }

    return successResponse(product);
  } catch (error) {
    console.error("Get product error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to fetch product");
  }
}

// PUT /api/products/:id - Update product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireRole(request, "admin");
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const body = await request.json();
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid product data", parsed.error.issues);
    }

    const product = await prisma.product.update({
      where: { id },
      data: parsed.data,
      include: {
        variants: true,
        images: true,
      },
    });

    return successResponse(product);
  } catch (error) {
    console.error("Update product error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to update product");
  }
}

// DELETE /api/products/:id - Soft delete product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireRole(request, "admin");
    if ("error" in auth) return auth.error;

    const { id } = await params;

    // Soft delete - set isActive to false
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return successResponse({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to delete product");
  }
}
