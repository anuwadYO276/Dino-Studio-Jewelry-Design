import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { updateInquiryStatusSchema } from "@/lib/validators";
import { successResponse, errorResponse } from "@/lib/api-response";

// GET /api/inquiries/:id - Get inquiry detail (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireRole(request, "admin");
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, company: true, country: true } },
        product: { select: { id: true, name: true, category: true } },
        variant: { select: { id: true, sku: true, color: true, size: true, material: true } },
      },
    });

    if (!inquiry) {
      return errorResponse("NOT_FOUND", "Inquiry not found");
    }

    return successResponse(inquiry);
  } catch (error) {
    console.error("Get inquiry error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to fetch inquiry");
  }
}

// PUT /api/inquiries/:id/status - Update inquiry status (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireRole(request, "admin");
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const body = await request.json();
    const parsed = updateInquiryStatusSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid status data", parsed.error.issues);
    }

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: parsed.data,
    });

    return successResponse(inquiry);
  } catch (error) {
    console.error("Update inquiry status error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to update inquiry");
  }
}
