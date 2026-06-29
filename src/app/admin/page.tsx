"use client";

import { useEffect, useState } from "react";

interface DashboardStats {
  totalProducts: number;
  totalVariants: number;
  totalInquiries: number;
  newInquiries: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalVariants: 0,
    totalInquiries: 0,
    newInquiries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const res = await fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Products", value: stats.totalProducts, icon: "💎" },
    { label: "Total Variants", value: stats.totalVariants, icon: "📦" },
    { label: "Total Inquiries", value: stats.totalInquiries, icon: "📩" },
    { label: "New Inquiries", value: stats.newInquiries, icon: "🔔" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-light text-stone-800 tracking-wide mb-8">
        Dashboard
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-stone-100 rounded w-1/2 mb-2" />
              <div className="h-8 bg-stone-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl p-6 border border-stone-100"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-stone-500">{card.label}</p>
                <span className="text-xl">{card.icon}</span>
              </div>
              <p className="text-3xl font-semibold text-stone-800 mt-2">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
