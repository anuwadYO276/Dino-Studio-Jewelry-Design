import { prisma } from "@/lib/prisma";
import { toApiProduct } from "@/lib/catalogue-adapter";
import type { ApiProduct } from "@/lib/types/product";

const productInclude = {
  variants: { where: { isActive: true } },
  images: { orderBy: { sortOrder: "asc" as const } },
};

/**
 * Newest products for home rows.
 * ponytail: no featured flag yet — pull a window and slice (ceiling: needs real curated set)
 */
export async function loadNewestProducts(
  offset: number,
  limit: number,
): Promise<ApiProduct[]> {
  const rows = await prisma.product.findMany({
    where: { isActive: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: offset + limit,
  });
  const products = rows.map(toApiProduct);
  const slice = products.slice(offset, offset + limit);
  return slice.length > 0 ? slice : products.slice(0, limit);
}
