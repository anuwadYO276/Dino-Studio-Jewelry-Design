"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function InquiryForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("product") || "";
  const variantId = searchParams.get("variant") || "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    country: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          productId: productId || undefined,
          variantId: variantId || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error.message);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-medium text-stone-800">
          Inquiry Submitted
        </h2>
        <p className="mt-2 text-stone-500">
          Thank you! Our team will get back to you within 24 hours.
        </p>
        <button
          onClick={() => router.push("/catalog")}
          className="mt-6 px-6 py-2 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-light text-stone-800 tracking-wide mb-2">
        Send Inquiry
      </h1>
      <p className="text-sm text-stone-500 mb-8">
        Fill in the form below and our team will respond within 24 hours.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">
            Name *
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
          <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-200 outline-none text-stone-800"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-stone-700 mb-1">
              Company
            </label>
            <input
              id="company"
              type="text"
              value={form.company}
              onChange={(e) =>
                setForm((f) => ({ ...f, company: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-200 outline-none text-stone-800"
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-stone-700 mb-1">
              Country
            </label>
            <input
              id="country"
              type="text"
              value={form.country}
              onChange={(e) =>
                setForm((f) => ({ ...f, country: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-200 outline-none text-stone-800"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1">
            Message *
          </label>
          <textarea
            id="message"
            required
            rows={5}
            value={form.message}
            onChange={(e) =>
              setForm((f) => ({ ...f, message: e.target.value }))
            }
            placeholder="Tell us about your requirements, quantities, or any questions..."
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-200 outline-none text-stone-800 resize-none"
          />
        </div>

        {error && <p className="text-red-500 text-sm" role="alert">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Submit Inquiry"}
        </button>
      </form>
    </div>
  );
}

export default function InquiryPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto animate-pulse space-y-4">
          <div className="h-8 bg-stone-200 rounded w-1/3" />
          <div className="h-4 bg-stone-100 rounded w-2/3" />
          <div className="h-12 bg-stone-100 rounded" />
          <div className="h-12 bg-stone-100 rounded" />
          <div className="h-32 bg-stone-100 rounded" />
        </div>
      }
    >
      <InquiryForm />
    </Suspense>
  );
}
