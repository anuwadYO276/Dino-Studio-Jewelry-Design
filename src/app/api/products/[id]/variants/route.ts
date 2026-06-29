import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth-guard";
import { createVariantSchema } from "@/lib/validators";
import { successResponse, errorResponse } from "@/lib/api-response";

// GET /api/products/:id/variants - List variants
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const variants = await prisma.variant.findMany({
      where: { productId: id, isActive: true },
      include: { images: { orderBy: { sortOrder: "asc" } } },
      orderBy: { createdAt: "asc" },
    });

    return successResponse(variants);
  } catch (error) {
    console.error("List variants error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to fetch variants");
  }
}

// POST /api/products/:id/variants - Create variant (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireRole(request, "admin");
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const body = await request.json();
    const parsed = createVariantSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid variant data", parsed.error.issues);
    }

    // Check product exists
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return errorResponse("NOT_FOUND", "Product not found");
    }

    const variant = await prisma.variant.create({
      data: {
        ...parsed.data,
        productId: id,
      },
      include: { images: true },
    });

    return successResponse(variant, 201);
  } catch (error) {
    console.error("Create variant error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to create variant");
  }
}
