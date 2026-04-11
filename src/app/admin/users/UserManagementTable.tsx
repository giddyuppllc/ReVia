"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, ShieldOff, KeyRound, Search, Loader2, Check, Ban, Trash2, Star, ShoppingCart } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  suspended: boolean;
  emailVerified: boolean;
  rewardPoints: number;
  lifetimeSpent: number;
  createdAt: string;
  orderCount: number;
}

export default function UserManagementTable({ users: initialUsers }: { users: User[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [rewardAdjust, setRewardAdjust] = useState("");
  const [filter, setFilter] = useState<"all" | "admin" | "customer" | "suspended">("all");

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    if (filter === "suspended") return matchesSearch && u.suspended;
    if (filter !== "all") return matchesSearch && u.role === filter;
    return matchesSearch;
  });

  async function apiCall(body: Record<string, unknown>, method = "PATCH") {
    const res = await fetch("/api/admin/users", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  }

  async function toggleRole(u: User) {
    setLoading(u.id);
    try {
      const data = await apiCall({ userId: u.id, role: u.role === "admin" ? "customer" : "admin" });
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: data.user.role } : x));
      setMessage({ type: "success", text: `${u.name} is now ${data.user.role}` });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed" });
    } finally { setLoading(null); }
  }

  async function toggleSuspend(u: User) {
    setLoading(u.id);
    try {
      await apiCall({ userId: u.id, suspended: !u.suspended });
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, suspended: !x.suspended } : x));
      setMessage({ type: "success", text: u.suspended ? `${u.name} unsuspended` : `${u.name} suspended` });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed" });
    } finally { setLoading(null); }
  }

  async function resetPassword(userId: string) {
    if (!newPassword || newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters" });
      return;
    }
    setLoading(userId);
    try {
      await apiCall({ userId, newPassword });
      setMessage({ type: "success", text: "Password reset" });
      setNewPassword("");
      setExpandedId(null);
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed" });
    } finally { setLoading(null); }
  }

  async function adjustPoints(u: User) {
    const points = parseInt(rewardAdjust);
    if (isNaN(points)) return;
    setLoading(u.id);
    try {
      const data = await apiCall({ userId: u.id, rewardPoints: points });
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, rewardPoints: data.user.rewardPoints } : x));
      setMessage({ type: "success", text: `${u.name} reward points set to ${data.user.rewardPoints}` });
      setRewardAdjust("");
      setExpandedId(null);
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed" });
    } finally { setLoading(null); }
  }

  async function deleteUser(u: User) {
    if (!confirm(`Delete ${u.name} (${u.email})? This cannot be undone. Their orders will remain but be unlinked.`)) return;
    setLoading(u.id);
    try {
      await apiCall({ userId: u.id }, "DELETE");
      setUsers(prev => prev.filter(x => x.id !== u.id));
      setMessage({ type: "success", text: `${u.name} deleted` });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed" });
    } finally { setLoading(null); }
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className={`rounded-lg border px-4 py-3 text-sm ${message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-600"}`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-sky-400" />
        </div>
        <div className="flex gap-1.5">
          {(["all", "admin", "customer", "suspended"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-lg px-3.5 py-2 text-xs font-medium transition ${filter === f ? "bg-sky-500 text-white" : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"}`}>
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && <p className="py-8 text-center text-sm text-neutral-400">No users found.</p>}

        {filtered.map((u) => {
          const isExpanded = expandedId === u.id;

          return (
            <div key={u.id} className={`rounded-2xl border bg-white p-4 transition ${u.suspended ? "border-red-200 bg-red-50/30" : "border-neutral-200"}`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-neutral-900">{u.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${u.role === "admin" ? "bg-sky-100 text-sky-700" : "bg-neutral-100 text-neutral-500"}`}>
                      {u.role}
                    </span>
                    {u.suspended && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600">Suspended</span>}
                    {u.emailVerified && <span className="flex items-center gap-0.5 text-[10px] text-emerald-600"><Check className="h-3 w-3" />Verified</span>}
                  </div>
                  <p className="text-xs text-neutral-400">{u.email}</p>
                  <div className="flex gap-4 mt-1 text-xs text-neutral-400">
                    <span>{u.orderCount} order{u.orderCount !== 1 ? "s" : ""}</span>
                    <span>${(u.lifetimeSpent / 100).toFixed(2)} spent</span>
                    <span><Star className="h-3 w-3 inline text-amber-400" /> {u.rewardPoints} pts</span>
                    <span>Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {u.orderCount > 0 && (
                    <Link href={`/admin/orders?search=${encodeURIComponent(u.email)}`} title="View orders"
                      className="rounded-lg p-2 text-neutral-400 hover:bg-sky-50 hover:text-sky-600 transition">
                      <ShoppingCart className="h-4 w-4" />
                    </Link>
                  )}
                  <button onClick={() => toggleRole(u)} disabled={loading === u.id} title={u.role === "admin" ? "Remove admin" : "Make admin"}
                    className={`rounded-lg p-2 transition ${u.role === "admin" ? "text-red-400 hover:bg-red-50" : "text-sky-500 hover:bg-sky-50"}`}>
                    {loading === u.id ? <Loader2 className="h-4 w-4 animate-spin" /> : u.role === "admin" ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                  </button>
                  <button onClick={() => toggleSuspend(u)} disabled={loading === u.id} title={u.suspended ? "Unsuspend" : "Suspend"}
                    className={`rounded-lg p-2 transition ${u.suspended ? "text-emerald-500 hover:bg-emerald-50" : "text-amber-500 hover:bg-amber-50"}`}>
                    <Ban className="h-4 w-4" />
                  </button>
                  <button onClick={() => { setExpandedId(isExpanded ? null : u.id); setNewPassword(""); setRewardAdjust(""); }} title="More options"
                    className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600 transition">
                    <KeyRound className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteUser(u)} disabled={loading === u.id} title="Delete user"
                    className="rounded-lg p-2 text-neutral-300 hover:bg-red-50 hover:text-red-500 transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-neutral-100 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-neutral-500 mb-1 block">Reset Password</label>
                    <div className="flex gap-2">
                      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password (8+ chars)"
                        className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-sky-400" />
                      <button onClick={() => resetPassword(u.id)} disabled={loading === u.id}
                        className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-400 disabled:opacity-50">
                        Reset
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500 mb-1 block">Reward Points (current: {u.rewardPoints})</label>
                    <div className="flex gap-2">
                      <input type="number" value={rewardAdjust} onChange={(e) => setRewardAdjust(e.target.value)} placeholder={String(u.rewardPoints)}
                        className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-sky-400" />
                      <button onClick={() => adjustPoints(u)} disabled={loading === u.id}
                        className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-400 disabled:opacity-50">
                        Set
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
