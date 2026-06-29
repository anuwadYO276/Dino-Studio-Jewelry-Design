"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  company: string | null;
  country: string | null;
  role: string;
  status: string;
  lastLogin: string | null;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    role: "buyer",
  });
  const [saving, setSaving] = useState(false);

  const getToken = () => localStorage.getItem("access_token") || "";

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const fetchUsers = async () => {
    const params = new URLSearchParams();
    if (roleFilter) params.set("role", roleFilter);
    if (statusFilter) params.set("status", statusFilter);
    if (search) params.set("search", search);

    try {
      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    if (!confirm(`${newStatus === "inactive" ? "ปิดการใช้งาน" : "เปิดการใช้งาน"} ${user.name || user.email}?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
        );
      }
    } catch {
      alert("Failed to update user");
    }
  };

  const handleChangeRole = async (user: User, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
        );
      }
    } catch {
      alert("Failed to update role");
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({
          name: addForm.name,
          email: addForm.email || undefined,
          phone: addForm.phone || undefined,
          company: addForm.company || undefined,
          country: addForm.country || undefined,
          role: addForm.role,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddForm(false);
        setAddForm({ name: "", email: "", phone: "", company: "", country: "", role: "buyer" });
        fetchUsers();
      } else {
        alert(data.error.message);
      }
    } catch {
      alert("Failed to add user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-light text-stone-800 tracking-wide">Users</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
        >
          + เพิ่ม User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="ค้นหาชื่อ, email, บริษัท..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-4 pr-10 py-2 rounded-xl border border-stone-200 text-sm text-stone-700 focus:border-stone-400 outline-none w-56"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-stone-200 text-sm text-stone-700 bg-white outline-none"
          aria-label="Filter by role"
        >
          <option value="">ทุก Role</option>
          <option value="admin">Admin</option>
          <option value="buyer">Buyer</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-stone-200 text-sm text-stone-700 bg-white outline-none"
          aria-label="Filter by status"
        >
          <option value="">ทุกสถานะ</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-16" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-100">
          <p className="text-stone-400">ไม่พบ user</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100">
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Contact</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Last Login</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-stone-800">{user.name || "-"}</p>
                    <p className="text-xs text-stone-400">{user.company || ""}{user.country ? ` · ${user.country}` : ""}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-stone-600">{user.email || "-"}</p>
                    {user.phone && <p className="text-xs text-stone-400">{user.phone}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleChangeRole(user, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                      aria-label={`Change role for ${user.name}`}
                    >
                      <option value="admin">Admin</option>
                      <option value="buyer">Buyer</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {user.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-stone-500">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString("th-TH", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "ยังไม่เคยเข้าสู่ระบบ"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(user)}
                      className={`text-sm ${
                        user.status === "active"
                          ? "text-red-500 hover:text-red-700"
                          : "text-green-600 hover:text-green-800"
                      }`}
                    >
                      {user.status === "active" ? "ปิดการใช้งาน" : "เปิดการใช้งาน"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add User Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-medium text-stone-800 mb-4">เพิ่ม User ใหม่</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label htmlFor="u-name" className="block text-sm font-medium text-stone-700 mb-1">ชื่อ *</label>
                <input id="u-name" required value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="u-email" className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                  <input id="u-email" type="email" value={addForm.email} onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm outline-none" />
                </div>
                <div>
                  <label htmlFor="u-phone" className="block text-sm font-medium text-stone-700 mb-1">เบอร์โทร</label>
                  <input id="u-phone" type="tel" value={addForm.phone} onChange={(e) => setAddForm((f) => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="u-company" className="block text-sm font-medium text-stone-700 mb-1">บริษัท</label>
                  <input id="u-company" value={addForm.company} onChange={(e) => setAddForm((f) => ({ ...f, company: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm outline-none" />
                </div>
                <div>
                  <label htmlFor="u-country" className="block text-sm font-medium text-stone-700 mb-1">ประเทศ</label>
                  <input id="u-country" value={addForm.country} onChange={(e) => setAddForm((f) => ({ ...f, country: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label htmlFor="u-role" className="block text-sm font-medium text-stone-700 mb-1">Role</label>
                <select id="u-role" value={addForm.role} onChange={(e) => setAddForm((f) => ({ ...f, role: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm outline-none bg-white">
                  <option value="buyer">Buyer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 disabled:opacity-50">
                  {saving ? "กำลังบันทึก..." : "เพิ่ม User"}
                </button>
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-2 border border-stone-200 text-stone-600 rounded-lg text-sm font-medium hover:bg-stone-50">
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
