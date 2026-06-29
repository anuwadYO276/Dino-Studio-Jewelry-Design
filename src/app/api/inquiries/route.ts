import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole, getTokenPayload } from "@/lib/auth-guard";
import { createInquirySchema } from "@/lib/validators";
import { successResponse, errorResponse } from "@/lib/api-response";

// GET /api/inquiries - List inquiries (admin only)
export async function GET(request: NextRequest) {
  try {
    const auth = requireRole(request, "admin");
    if ("error" in auth) return auth.error;

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    const where = status ? { status: status as never } : {};

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, company: true } },
          product: { select: { id: true, name: true, category: true } },
          variant: { select: { id: true, sku: true, color: true, material: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.inquiry.count({ where }),
    ]);

    return successResponse({
      inquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("List inquiries error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to fetch inquiries");
  }
}

// POST /api/inquiries - Submit inquiry (buyer)
export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const payload = getTokenPayload(request);
    const body = await request.json();
    const parsed = createInquirySchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid inquiry data", parsed.error.issues);
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        ...parsed.data,
        userId: payload?.userId,
      },
      include: {
        product: { select: { id: true, name: true } },
        variant: { select: { id: true, sku: true } },
      },
    });

    return successResponse(inquiry, 201);
  } catch (error) {
    console.error("Create inquiry error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to create inquiry");
  }
}
