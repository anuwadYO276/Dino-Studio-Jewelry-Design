"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    const token = localStorage.getItem("access_token");
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    document.cookie = "access_token=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/catalog"
              className="text-xl font-light tracking-widest text-stone-800 uppercase"
            >
              Dino Studio
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/catalog"
                className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
              >
                Collection
              </Link>
              <Link
                href="/catalog/inquiry"
                className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
              >
                Inquiry
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
              >
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
