import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { toApiProduct } from "@/lib/catalogue-adapter";
import { pageMetadata } from "@/lib/site-metadata";
import { ProductDetail } from "../../_components/product-detail";

interface Props {
  params: Promise<{ id: string }>;
}

const productInclude = {
  variants: { where: { isActive: true }, orderBy: { createdAt: "asc" as const } },
  images: { orderBy: { sortOrder: "asc" as const } },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    select: { name: true, description: true },
  });
  if (!product) return pageMetadata("Product");
  return pageMetadata(
    product.name,
    product.description?.slice(0, 160) ?? "Wholesale artisan silver jewelry piece.",
  );
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  const row = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });

  if (!row) {
    return <ProductDetail product={null} related={[]} />;
  }

  const product = toApiProduct(row);

  let related: ReturnType<typeof toApiProduct>[] = [];
  if (row.collection) {
    const relatedRows = await prisma.product.findMany({
      where: {
        isActive: true,
        collection: row.collection,
        id: { not: id },
      },
      include: productInclude,
      take: 4,
      orderBy: { createdAt: "desc" },
    });
    related = relatedRows.map(toApiProduct);
  }

  return <ProductDetail product={product} related={related} />;
}
