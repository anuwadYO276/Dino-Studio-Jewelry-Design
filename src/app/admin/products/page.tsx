"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  category: string;
  status: string;
  isActive: boolean;
  variants: { id: string; price: string }[];
  images: { id: string; url: string; isPrimary: boolean }[];
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch("/api/products?limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.products);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-light text-stone-800 tracking-wide">
          Products
        </h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
        >
          + Add Product
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-16" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-100">
          <p className="text-stone-400">No products yet</p>
          <Link
            href="/admin/products/new"
            className="text-stone-600 text-sm underline mt-2 inline-block"
          >
            Create your first product
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100">
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Variants
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-stone-800">
                      {product.name}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-stone-600 capitalize">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-stone-100 text-stone-600 capitalize">
                      {product.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-stone-600">
                      {product.variants.length}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-sm text-stone-600 hover:text-stone-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
