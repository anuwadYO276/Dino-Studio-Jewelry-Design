"use client";

import { useEffect, useState, use, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Variant {
  id: string;
  sku: string;
  color: string | null;
  size: string | null;
  material: string | null;
  price: string;
  minOrder: number;
  isActive: boolean;
}

interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  collection: string | null;
  status: string;
  isActive: boolean;
  variants: Variant[];
  images: ProductImage[];
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "variants" | "images">("details");

  // Product form
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "ring",
    collection: "",
    status: "new_arrival",
  });

  // Variant form (for add/edit)
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [variantForm, setVariantForm] = useState({
    sku: "",
    color: "",
    size: "",
    material: "",
    price: "",
    minOrder: "1",
  });

  const [uploading, setUploading] = useState(false);

  const getToken = () => localStorage.getItem("access_token") || "";

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        setProduct(data.data);
        setForm({
          name: data.data.name,
          description: data.data.description || "",
          category: data.data.category,
          collection: data.data.collection || "",
          status: data.data.status,
        });
      }
    } catch (err) {
      console.error("Failed to fetch product:", err);
    } finally {
      setLoading(false);
    }
  };

  // ========== Product Details ==========
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          ...form,
          description: form.description || undefined,
          collection: form.collection || undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error.message);
      } else {
        setProduct(data.data);
        setError("");
        alert("บันทึกสำเร็จ");
      }
    } catch {
      setError("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  // ========== Variants ==========
  const openAddVariant = () => {
    setEditingVariant(null);
    setVariantForm({ sku: "", color: "", size: "", material: "", price: "", minOrder: "1" });
    setShowVariantForm(true);
  };

  const openEditVariant = (v: Variant) => {
    setEditingVariant(v);
    setVariantForm({
      sku: v.sku,
      color: v.color || "",
      size: v.size || "",
      material: v.material || "",
      price: String(v.price),
      minOrder: String(v.minOrder),
    });
    setShowVariantForm(true);
  };

  const handleSaveVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const body = {
      sku: variantForm.sku,
      color: variantForm.color || undefined,
      size: variantForm.size || undefined,
      material: variantForm.material || undefined,
      price: Number(variantForm.price),
      minOrder: Number(variantForm.minOrder) || 1,
    };

    try {
      let res;
      if (editingVariant) {
        res = await fetch(`/api/variants/${editingVariant.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(`/api/products/${id}/variants`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify(body),
        });
      }
      const data = await res.json();
      if (data.success) {
        setShowVariantForm(false);
        fetchProduct();
      } else {
        alert(data.error.message);
      }
    } catch {
      alert("Failed to save variant");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm("ลบ variant นี้?")) return;
    try {
      const res = await fetch(`/api/variants/${variantId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) fetchProduct();
    } catch {
      alert("Failed to delete variant");
    }
  };

  // ========== Images ==========
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("productId", id);
    formData.append("isPrimary", product?.images.length === 0 ? "true" : "false");

    try {
      const res = await fetch("/api/images/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        fetchProduct();
      } else {
        alert(data.error.message);
      }
    } catch {
      alert("Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("ลบรูปนี้?")) return;
    try {
      const res = await fetch(`/api/images/${imageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) fetchProduct();
    } catch {
      alert("Failed to delete image");
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    try {
      // Unset all then set this one via reorder + manual primary update
      // For now we'll re-upload logic handles this, but let's use a simple approach
      const res = await fetch(`/api/images/${imageId}/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ sortOrder: 0 }),
      });
      if (res.ok) fetchProduct();
    } catch {
      alert("Failed to update");
    }
  };

  const categories = ["earring", "bracelet", "necklace", "ring", "pendant", "set"];
  const statuses = ["new_arrival", "seasonal", "sale", "discontinued"];
  const sizes = ["small", "medium", "large", "free_size"];

  if (loading) {
    return (
      <div className="max-w-4xl animate-pulse space-y-4">
        <div className="h-8 bg-stone-200 rounded w-1/3" />
        <div className="h-64 bg-stone-100 rounded-xl" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <p className="text-stone-400">Product not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-light text-stone-800 tracking-wide">
          แก้ไขสินค้า
        </h1>
        <button
          onClick={() => router.push("/admin/products")}
          className="text-sm text-stone-500 hover:text-stone-700"
        >
          ← กลับ
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-stone-100 rounded-xl p-1">
        {(["details", "variants", "images"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            {tab === "details" && "รายละเอียด"}
            {tab === "variants" && `Variants (${product.variants.length})`}
            {tab === "images" && `รูปภาพ (${product.images.length})`}
          </button>
        ))}
      </div>

      {/* Details Tab */}
      {activeTab === "details" && (
        <form onSubmit={handleSaveProduct} className="space-y-5 bg-white rounded-xl p-6 border border-stone-100">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">ชื่อสินค้า *</label>
            <input id="name" type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-200 outline-none text-stone-800" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-stone-700 mb-1">คำอธิบาย</label>
            <textarea id="description" rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-200 outline-none text-stone-800 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-stone-700 mb-1">ประเภท *</label>
              <select id="category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none text-stone-800 bg-white">
                {categories.map((c) => (<option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-stone-700 mb-1">สถานะ</label>
              <select id="status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none text-stone-800 bg-white">
                {statuses.map((s) => (<option key={s} value={s}>{s.replace("_", " ")}</option>))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="collection" className="block text-sm font-medium text-stone-700 mb-1">Collection</label>
            <input id="collection" type="text" value={form.collection} onChange={(e) => setForm((f) => ({ ...f, collection: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-200 outline-none text-stone-800" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={saving} className="px-6 py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors disabled:opacity-50">
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </form>
      )}

      {/* Variants Tab */}
      {activeTab === "variants" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={openAddVariant} className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors">
              + เพิ่ม Variant
            </button>
          </div>

          {product.variants.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-stone-100">
              <p className="text-stone-400">ยังไม่มี variant</p>
            </div>
          ) : (
            <div className="space-y-3">
              {product.variants.map((v) => (
                <div key={v.id} className="bg-white rounded-xl p-4 border border-stone-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-stone-800">
                      {[v.color, v.size, v.material].filter(Boolean).join(" · ") || v.sku}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">SKU: {v.sku} · Min: {v.minOrder} ชิ้น</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-semibold text-stone-800">฿{Number(v.price).toLocaleString()}</p>
                    <button onClick={() => openEditVariant(v)} className="text-sm text-stone-600 hover:text-stone-900">แก้ไข</button>
                    <button onClick={() => handleDeleteVariant(v.id)} className="text-sm text-red-500 hover:text-red-700">ลบ</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Variant Form Modal */}
          {showVariantForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                <h3 className="text-lg font-medium text-stone-800 mb-4">
                  {editingVariant ? "แก้ไข Variant" : "เพิ่ม Variant"}
                </h3>
                <form onSubmit={handleSaveVariant} className="space-y-4">
                  <div>
                    <label htmlFor="sku" className="block text-sm font-medium text-stone-700 mb-1">SKU *</label>
                    <input id="sku" required value={variantForm.sku} onChange={(e) => setVariantForm((f) => ({ ...f, sku: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="v-color" className="block text-sm font-medium text-stone-700 mb-1">สี</label>
                      <input id="v-color" value={variantForm.color} onChange={(e) => setVariantForm((f) => ({ ...f, color: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm outline-none" />
                    </div>
                    <div>
                      <label htmlFor="v-size" className="block text-sm font-medium text-stone-700 mb-1">ขนาด</label>
                      <select id="v-size" value={variantForm.size} onChange={(e) => setVariantForm((f) => ({ ...f, size: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm outline-none bg-white">
                        <option value="">-- ไม่ระบุ --</option>
                        {sizes.map((s) => (<option key={s} value={s}>{s}</option>))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="v-material" className="block text-sm font-medium text-stone-700 mb-1">วัสดุ</label>
                    <input id="v-material" value={variantForm.material} onChange={(e) => setVariantForm((f) => ({ ...f, material: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="v-price" className="block text-sm font-medium text-stone-700 mb-1">ราคา (฿) *</label>
                      <input id="v-price" type="number" required min="0" step="0.01" value={variantForm.price} onChange={(e) => setVariantForm((f) => ({ ...f, price: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm outline-none" />
                    </div>
                    <div>
                      <label htmlFor="v-minorder" className="block text-sm font-medium text-stone-700 mb-1">สั่งขั้นต่ำ</label>
                      <input id="v-minorder" type="number" min="1" value={variantForm.minOrder} onChange={(e) => setVariantForm((f) => ({ ...f, minOrder: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm outline-none" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={saving} className="flex-1 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 disabled:opacity-50">
                      {saving ? "กำลังบันทึก..." : "บันทึก"}
                    </button>
                    <button type="button" onClick={() => setShowVariantForm(false)} className="flex-1 py-2 border border-stone-200 text-stone-600 rounded-lg text-sm font-medium hover:bg-stone-50">
                      ยกเลิก
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Images Tab */}
      {activeTab === "images" && (
        <div className="space-y-4">
          {/* Upload button */}
          <div className="flex justify-end">
            <label className={`px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors cursor-pointer ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
              {uploading ? "กำลังอัพโหลด..." : "+ อัพโหลดรูป"}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleUploadImage}
                disabled={uploading}
              />
            </label>
          </div>

          {product.images.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-stone-100">
              <p className="text-stone-400">ยังไม่มีรูปภาพ</p>
              <p className="text-stone-300 text-sm mt-1">อัพโหลดรูปเพื่อแสดงใน catalog</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {product.images.map((img) => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden border border-stone-100 bg-stone-50">
                  <div className="aspect-square relative">
                    <Image src={img.url} alt={img.altText || "Product image"} fill className="object-cover" sizes="200px" />
                  </div>
                  {img.isPrimary && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-stone-900 text-white text-xs rounded-md">
                      หลัก
                    </span>
                  )}
                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!img.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(img.id)}
                        className="px-2 py-1 bg-white text-stone-800 rounded text-xs font-medium"
                      >
                        ตั้งเป็นหลัก
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs font-medium"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-stone-400">รองรับ JPEG, PNG, WebP, GIF (สูงสุด 5MB)</p>
        </div>
      )}
    </div>
  );
}
