"use client";

import { useEffect, useState } from "react";

interface Inquiry {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  country: string | null;
  message: string;
  status: string;
  createdAt: string;
  product: { id: string; name: string; category: string } | null;
  user: { id: string; name: string; email: string } | null;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const fetchInquiries = async () => {
    const token = localStorage.getItem("access_token");
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);

    try {
      const res = await fetch(`/api/inquiries?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(data.data.inquiries);
      }
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
        );
      }
    } catch (error) {
      console.error("Failed to update inquiry:", error);
    }
  };

  const statusColors: Record<string, string> = {
    new_inquiry: "bg-blue-100 text-blue-700",
    read: "bg-yellow-100 text-yellow-700",
    responded: "bg-green-100 text-green-700",
    closed: "bg-stone-100 text-stone-500",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-light text-stone-800 tracking-wide">
          Inquiries
        </h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-stone-200 text-sm text-stone-700 bg-white"
          aria-label="Filter by status"
        >
          <option value="">All Status</option>
          <option value="new_inquiry">New</option>
          <option value="read">Read</option>
          <option value="responded">Responded</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-20" />
          ))}
        </div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-100">
          <p className="text-stone-400">No inquiries yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="bg-white rounded-xl p-5 border border-stone-100"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-medium text-stone-800">
                      {inquiry.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${
                        statusColors[inquiry.status] || ""
                      }`}
                    >
                      {inquiry.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    {inquiry.email}
                    {inquiry.company && ` · ${inquiry.company}`}
                    {inquiry.country && ` · ${inquiry.country}`}
                  </p>
                  {inquiry.product && (
                    <p className="text-xs text-stone-500 mt-1">
                      Re: {inquiry.product.name}
                    </p>
                  )}
                  <p className="text-sm text-stone-600 mt-2 line-clamp-2">
                    {inquiry.message}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <select
                    value={inquiry.status}
                    onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                    className="px-2 py-1 text-xs border border-stone-200 rounded-lg bg-white"
                    aria-label={`Update status for ${inquiry.name}`}
                  >
                    <option value="new_inquiry">New</option>
                    <option value="read">Read</option>
                    <option value="responded">Responded</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-stone-300 mt-3">
                {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
