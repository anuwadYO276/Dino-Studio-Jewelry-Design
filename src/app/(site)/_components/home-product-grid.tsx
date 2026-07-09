import type { ApiProduct } from "@/lib/types/product";
import { toProductCard } from "@/lib/catalogue-adapter";
import { ProductCard } from "./product-card";

type HomeProductGridProps = {
  products: ApiProduct[];
  gridClassName: string;
  imageSizes: string;
  showPrice?: boolean;
};

/** Presentational grid — products loaded on the server in page.tsx */
export function HomeProductGrid({
  products,
  gridClassName,
  imageSizes,
  showPrice = true,
}: HomeProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="px-6 py-12 text-center text-sm text-neutral-400">
        Pieces coming soon.
      </p>
    );
  }

  return (
    <div className={gridClassName}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          card={toProductCard(product)}
          showPrice={showPrice}
          imageSizes={imageSizes}
        />
      ))}
    </div>
  );
}
