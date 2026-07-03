/** API shapes from GET /api/products and GET /api/products/:id */

export interface ApiVariant {
  id: string;
  sku: string;
  color: string | null;
  size: string | null;
  material: string | null;
  price: string;
  minOrder: number;
}

export interface ApiProductImage {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ApiProduct {
  id: string;
  name: string;
  description: string | null;
  category: string;
  collection: string | null;
  status: string;
  variants: ApiVariant[];
  images: ApiProductImage[];
}

export interface ApiProductsResponse {
  success: boolean;
  data: {
    products: ApiProduct[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ApiProductResponse {
  success: boolean;
  data: ApiProduct;
}
