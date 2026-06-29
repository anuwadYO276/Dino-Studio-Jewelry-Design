import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const auth = requireRole(request, "admin");
    if ("error" in auth) return auth.error;

    const [totalProducts, totalVariants, totalInquiries, newInquiries] =
      await Promise.all([
        prisma.product.count({ where: { isActive: true } }),
        prisma.variant.count({ where: { isActive: true } }),
        prisma.inquiry.count(),
        prisma.inquiry.count({ where: { status: "new_inquiry" } }),
      ]);

    return successResponse({
      totalProducts,
      totalVariants,
      totalInquiries,
      newInquiries,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to fetch stats");
  }
}
