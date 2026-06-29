"use client";

import { useEffect, useState, useCallback } from "react";
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

const CATEGORY_OPTIONS = [
  { value: "earring", label: "ตุ้มหู" },
  { value: "bracelet", label: "กำไล" },
  { value: "necklace", label: "สร้อย" },
  { value: "ring", label: "แหวน" },
  { value: "pendant", label: "จี้" },
  { value: "set", label: "เซ็ต" },
];

const STATUS_OPTIONS = [
  { value: "new_arrival", label: "สินค้าใหม่" },
  { value: "seasonal", label: "เทศกาล" },
  { value: "sale", label: "ลดราคา" },
  { value: "discontinued", label: "ยกเลิก" },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");

  const getToken = () => localStorage.getItem("access_token") || "";

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("limit", "100");
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    if (sort) params.set("sort", sort);

    try {
      const res = await fetch(`/api/products?${params.toString()}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
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
  }, [search, category, status, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm("คุณต้องการลบสินค้านี้?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const getMinPrice = (variants: { price: string }[]) => {
    if (variants.length === 0) return null;
    return Math.min(...variants.map((v) => Number(v.price)));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-light text-stone-800 tracking-wide">
          Products
        </h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
        >
          + เพิ่มสินค้า
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-sm text-stone-700 focus:border-stone-400 outline-none w-56"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 rounded-xl border border-stone-200 text-sm text-stone-700 bg-white outline-none"
          aria-label="กรองประเภท"
        >
          <option value="">ทุกประเภท</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 rounded-xl border border-stone-200 text-sm text-stone-700 bg-white outline-none"
          aria-label="กรองสถานะ"
        >
          <option value="">ทุกสถานะ</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 rounded-xl border border-stone-200 text-sm text-stone-700 bg-white outline-none"
          aria-label="เรียงตาม"
        >
          <option value="newest">ใหม่ล่าสุด</option>
          <option value="name_asc">ชื่อ A-Z</option>
          <option value="price_asc">ราคา: ต่ำ → สูง</option>
          <option value="price_desc">ราคา: สูง → ต่ำ</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-xs text-stone-400 mb-4">{products.length} รายการ</p>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-16" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-100">
          <p className="text-stone-400">ไม่พบสินค้า</p>
          {(search || category || status) && (
            <button
              onClick={() => { setSearch(""); setCategory(""); setStatus(""); }}
              className="mt-2 text-sm text-stone-600 underline"
            >
              ล้างตัวกรอง
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100">
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">สินค้า</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">ประเภท</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">สถานะ</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Variants</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">ราคา</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {products.map((product) => {
                const minPrice = getMinPrice(product.variants);
                return (
                  <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-stone-800">{product.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-stone-600">
                        {CATEGORY_OPTIONS.find((c) => c.value === product.category)?.label || product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        product.status === "new_arrival" ? "bg-green-100 text-green-700" :
                        product.status === "seasonal" ? "bg-amber-100 text-amber-700" :
                        product.status === "sale" ? "bg-red-100 text-red-600" :
                        "bg-stone-100 text-stone-500"
                      }`}>
                        {STATUS_OPTIONS.find((s) => s.value === product.status)?.label || product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-stone-600">{product.variants.length}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-stone-700">
                        {minPrice !== null ? `฿${minPrice.toLocaleString()}` : "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-sm text-stone-600 hover:text-stone-900 mr-4"
                      >
                        แก้ไข
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
