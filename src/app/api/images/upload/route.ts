import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { successResponse, errorResponse } from "@/lib/api-response";
import { uploadToS3 } from "@/lib/s3";

// POST /api/images/upload - Upload image to S3 (admin only)
export async function POST(request: NextRequest) {
  try {
    const auth = requireRole(request, "admin");
    if ("error" in auth) return auth.error;

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const productId = formData.get("productId") as string | null;
    const variantId = formData.get("variantId") as string | null;
    const altText = formData.get("altText") as string | null;
    const isPrimary = formData.get("isPrimary") === "true";

    if (!file) {
      return errorResponse("VALIDATION_ERROR", "File is required");
    }

    if (!productId) {
      return errorResponse("VALIDATION_ERROR", "productId is required");
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Invalid file type. Allowed: JPEG, PNG, WebP, GIF"
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return errorResponse(
        "VALIDATION_ERROR",
        "File too large. Maximum size is 5MB"
      );
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return errorResponse("NOT_FOUND", "Product not found");
    }

    // Upload to S3
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const url = await uploadToS3(buffer, file.name, file.type);

    // If set as primary, unset other primary images for this product
    if (isPrimary) {
      await prisma.image.updateMany({
        where: { productId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    // Get next sort order
    const lastImage = await prisma.image.findFirst({
      where: { productId },
      orderBy: { sortOrder: "desc" },
    });
    const sortOrder = (lastImage?.sortOrder ?? -1) + 1;

    // Save to database
    const image = await prisma.image.create({
      data: {
        productId,
        variantId: variantId || null,
        url,
        altText: altText || null,
        isPrimary,
        sortOrder,
      },
    });

    return successResponse(image, 201);
  } catch (error) {
    console.error("Image upload error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to upload image");
  }
}
