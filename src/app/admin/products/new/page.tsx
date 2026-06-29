"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "ring" as string,
    collection: "",
    status: "new_arrival" as string,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
        return;
      }

      router.push(`/admin/products/${data.data.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["earring", "bracelet", "necklace", "ring", "pendant", "set"];
  const statuses = ["new_arrival", "seasonal", "sale", "discontinued"];

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-light text-stone-800 tracking-wide mb-8">
        New Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl p-6 border border-stone-100">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">
            Product Name *
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-200 outline-none text-stone-800"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-stone-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-200 outline-none text-stone-800 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-stone-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-400 outline-none text-stone-800 bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-stone-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-400 outline-none text-stone-800 bg-white"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ").charAt(0).toUpperCase() + s.replace("_", " ").slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="collection" className="block text-sm font-medium text-stone-700 mb-1">
            Collection
          </label>
          <input
            id="collection"
            type="text"
            value={form.collection}
            onChange={(e) => setForm((f) => ({ ...f, collection: e.target.value }))}
            placeholder="e.g., Summer 2024"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-200 outline-none text-stone-800"
          />
        </div>

        {error && <p className="text-red-500 text-sm" role="alert">{error}</p>}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-stone-200 text-stone-600 rounded-xl font-medium hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
