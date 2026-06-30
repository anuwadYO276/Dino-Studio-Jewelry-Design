import { notFound } from "next/navigation";
import { ProductDetail } from "@/app/showcase/_components/product-detail";
import {
  getCollection,
  getProduct,
  getProductsByCollection,
} from "@/lib/mock-catalogue-data";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  // API: GET /api/public/products/:id
  const product = getProduct(id);
  if (!product) notFound();

  const collection = getCollection(product.collectionSlug);
  const related = getProductsByCollection(product.collectionSlug).filter(
    (p) => p.id !== product.id
  );

  return (
    <ProductDetail product={product} collection={collection} related={related} />
  );
}
