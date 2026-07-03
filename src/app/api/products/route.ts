import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { createProductSchema, productFilterSchema } from "@/lib/validators";
import { successResponse, errorResponse } from "@/lib/api-response";
import { Prisma } from "@prisma/client";

// GET /api/products - List products (public)
export async function GET(request: NextRequest) {
  try {

    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = productFilterSchema.safeParse(searchParams);

    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid filter parameters", parsed.error.issues);
    }

    const { category, collection, color, size, material, status, search, sort, page, limit } =
      parsed.data;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (category) {
      const categories = category.split(",") as Prisma.ProductWhereInput["category"][];
      where.category = { in: categories as never };
    }

    if (collection) {
      where.collection = { in: collection.split(",") };
    }

    if (status) {
      const statuses = status.split(",");
      where.status = { in: statuses as never };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // Variant-level filters
    if (color || size || material) {
      const variantWhere: Prisma.VariantWhereInput = { isActive: true };
      if (color) variantWhere.color = { in: color.split(",") };
      if (size) variantWhere.size = { in: size.split(",") as never };
      if (material) variantWhere.material = { in: material.split(",") };
      where.variants = { some: variantWhere };
    }

    // Build order by
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "name_asc") orderBy = { name: "asc" };
    // price sorting handled after query for variant-based price

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          variants: { where: { isActive: true } },
          images: { orderBy: { sortOrder: "asc" } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Sort by price if needed (based on minimum variant price)
    let result = products;
    if (sort === "price_asc" || sort === "price_desc") {
      result = [...products].sort((a, b) => {
        const priceA = a.variants.length > 0
          ? Math.min(...a.variants.map((v) => Number(v.price)))
          : 0;
        const priceB = b.variants.length > 0
          ? Math.min(...b.variants.map((v) => Number(v.price)))
          : 0;
        return sort === "price_asc" ? priceA - priceB : priceB - priceA;
      });
    }

    return successResponse({
      products: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("List products error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to fetch products");
  }
}

// POST /api/products - Create product (admin only)
export async function POST(request: NextRequest) {
  try {
    const auth = requireRole(request, "admin");
    if ("error" in auth) return auth.error;

    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid product data", parsed.error.issues);
    }

    const product = await prisma.product.create({
      data: parsed.data,
      include: {
        variants: true,
        images: true,
      },
    });

    return successResponse(product, 201);
  } catch (error) {
    console.error("Create product error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to create product");
  }
}
