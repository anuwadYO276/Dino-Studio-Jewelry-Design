import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { pageMetadata } from "@/lib/site-metadata";
import { ProductDetail } from "../../_components/product-detail";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    select: { name: true, description: true },
  });
  if (!product) return pageMetadata("Product");
  return pageMetadata(
    product.name,
    product.description?.slice(0, 160) ?? "Wholesale artisan silver jewelry piece."
  );
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  return <ProductDetail productId={id} />;
}
