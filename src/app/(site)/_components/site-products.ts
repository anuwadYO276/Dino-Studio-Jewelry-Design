import type {
  ApiProduct,
  ApiProductResponse,
  ApiProductsResponse,
} from "@/lib/types/product";

export type ProductListParams = {
  category?: string;
  material?: string;
  search?: string;
  sort?: string;
  collection?: string;
  page?: number;
  limit?: number;
};

/** Shared client fetch for GET /api/products — one place for list callers. */
export async function fetchProducts(
  params: ProductListParams = {},
): Promise<ApiProductsResponse> {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.material) qs.set("material", params.material);
  if (params.search) qs.set("search", params.search);
  if (params.sort) qs.set("sort", params.sort);
  if (params.collection) qs.set("collection", params.collection);
  if (params.page != null) qs.set("page", String(params.page));
  if (params.limit != null) qs.set("limit", String(params.limit));

  const res = await fetch(`/api/products?${qs.toString()}`);
  return res.json();
}

/** Shared client fetch for GET /api/products/:id */
export async function fetchProduct(
  id: string,
): Promise<ApiProductResponse> {
  const res = await fetch(`/api/products/${id}`);
  return res.json();
}

export type ProductListResult = {
  products: ApiProduct[];
  total: number;
  totalPages: number;
};

/** Unwrap a successful list response; returns null on failure. */
export function productsFromResponse(
  data: ApiProductsResponse,
): ProductListResult | null {
  if (!data.success) return null;
  return {
    products: data.data.products,
    total: data.data.pagination.total,
    totalPages: data.data.pagination.totalPages,
  };
}
