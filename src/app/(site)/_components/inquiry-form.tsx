"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getCollection } from "@/lib/mock-catalogue-data";

export function InquiryForm() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product") ?? "";
  const variantId = searchParams.get("variant") ?? "";
  const collectionSlug = searchParams.get("collection") ?? "";

  const [productName, setProductName] = useState<string | null>(null);
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

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProductName(data.data.name);
          setForm((f) =>
            f.message
              ? f
              : {
                  ...f,
                  message: `I would like a wholesale quote for ${data.data.name}.`,
                }
          );
        }
      })
      .catch(() => {});
  }, [productId]);

  useEffect(() => {
    if (!collectionSlug || productId) return;
    const meta = getCollection(collectionSlug);
    if (!meta) return;
    setForm((f) =>
      f.message
        ? f
        : {
            ...f,
            message: `I would like a wholesale quote for pieces from the ${meta.name} collection.`,
          }
    );
  }, [collectionSlug, productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("access_token");

    try {
      // API: POST /api/inquiries
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email || undefined,
          company: form.company || undefined,
          country: form.country || undefined,
          message: form.message,
          productId: productId || undefined,
          variantId: variantId || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error?.message ?? "Something went wrong.");
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
      <div className="py-8 text-center">
        <p className="heading-display text-xl">
          Inquiry received
        </p>
        <p className="mt-2 text-sm text-neutral-500">
          Thank you. Our team will respond within 24 hours.
        </p>
        <Link href="/pieces" className="text-link mt-6 inline-block">
          Back to catalogue
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {productName && (
        <p className="border-l-2 border-neutral-900 pl-3 text-sm text-neutral-600">
          Regarding: <span className="text-neutral-900">{productName}</span>
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="inquiry-name"
          label="Name"
          required
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
        />
        <Field
          id="inquiry-email"
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(v) => setForm((f) => ({ ...f, email: v }))}
        />
        <Field
          id="inquiry-company"
          label="Company"
          value={form.company}
          onChange={(v) => setForm((f) => ({ ...f, company: v }))}
        />
        <Field
          id="inquiry-country"
          label="Country"
          value={form.country}
          onChange={(v) => setForm((f) => ({ ...f, country: v }))}
        />
      </div>

      <div>
        <label htmlFor="inquiry-message" className="form-label">
          Message *
        </label>
        <textarea
          id="inquiry-message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className="mt-2 w-full border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
          placeholder="Tell us about your order requirements…"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-catalogue btn-catalogue-solid w-full disabled:opacity-50 sm:w-auto"
      >
        {loading ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="form-label">
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
      />
    </div>
  );
}
