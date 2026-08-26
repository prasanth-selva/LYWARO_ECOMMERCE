import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowUpRight, Package, ShoppingCart, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/StoreChrome";
import api from "@/services/api";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-700",
  confirmed: "bg-blue-500/20 text-blue-700",
  processing: "bg-blue-500/20 text-blue-700",
  shipped: "bg-purple-500/20 text-purple-700",
  delivered: "bg-green-500/20 text-green-700",
  cancelled: "bg-red-500/20 text-red-700",
};

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [, navigate] = useLocation();
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) navigate("/login");
  }, [loading, isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) loadDashboard();
  }, [isAdmin]);

  const loadDashboard = async () => {
    setLoadingStats(true);
    setError("");
    try {
      const res = await api.get("/admin/dashboard");
      // api client returns the full JSON: { success: true, data: { totalRevenue, ... } }
      setStats(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading) return null;
  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#EAE8E1] text-[#111211]">
      <Header onCart={() => {}} />
      <main className="px-5 pb-24 pt-32 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          {/* Header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.17em] text-[#111211]/50 hover:text-[#111211]">
                <ArrowLeft size={13} /> Back to Store
              </Link>
              <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">
                Admin Dashboard
              </h1>
            </div>
            <nav className="flex flex-wrap gap-2 sm:gap-3">
              {[
                { href: "/admin", label: "Overview" },
                { href: "/admin/products", label: "Products" },
                { href: "/admin/orders", label: "Orders" },
                { href: "/admin/users", label: "Users" },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="border border-[#111211]/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] transition hover:bg-[#111211] hover:text-[#EAE8E1]">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {loadingStats ? (
            <div className="mt-10 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 animate-pulse border border-[#111211]/10 bg-[#111211]/[0.02]" />
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse border border-[#111211]/10 bg-[#111211]/[0.02]" />
                ))}
              </div>
              <div className="h-64 animate-pulse border border-[#111211]/10 bg-[#111211]/[0.02]" />
            </div>
          ) : error ? (
            <div className="mt-24 flex flex-col items-center gap-4 text-center">
              <AlertTriangle size={32} className="text-red-400" />
              <p className="text-sm text-red-500">{error}</p>
              <button onClick={loadDashboard} className="border border-[#111211]/20 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.16em] transition hover:bg-[#111211] hover:text-[#EAE8E1]">
                Try again
              </button>
            </div>
          ) : stats ? (
            <>
              {/* Stats cards */}
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Revenue", value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, accent: true },
                  { label: "Orders", value: stats.totalOrders || 0, icon: ShoppingCart, accent: false },
                  { label: "Products", value: stats.totalProducts || 0, icon: Package, accent: false },
                  { label: "Customers", value: stats.totalUsers || 0, icon: Users, accent: false },
                ].map((stat) => (
                  <div key={stat.label} className={`border p-6 transition hover:shadow-sm ${stat.accent ? "border-[#D7F54A]/30 bg-[#D7F54A]/[0.04]" : "border-[#111211]/15 hover:border-[#111211]/25"}`}>
                    <div className="flex items-center justify-between">
                      <span className="grid h-10 w-10 place-items-center border border-[#111211]/10 bg-[#111211]/[0.02]">
                        <stat.icon size={16} strokeWidth={1.5} className="text-[#111211]/50" />
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#111211]/40">{stat.label}</span>
                    </div>
                    <p className="mt-5 font-display text-3xl font-semibold tracking-[-0.04em]">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Secondary stats */}
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Pending Orders", value: stats.pendingOrders || 0, color: "text-yellow-600", bg: "bg-yellow-500/10" },
                  { label: "Low Stock Items", value: stats.lowStockProducts || 0, color: "text-orange-600", bg: "bg-orange-500/10" },
                  { label: "Revenue (MTD)", value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, color: "text-green-600", bg: "bg-green-500/10" },
                ].map((s) => (
                  <div key={s.label} className={`flex items-center justify-between border border-[#111211]/10 p-4 ${s.bg}`}>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111211]/50">{s.label}</span>
                    <span className={`font-display text-lg font-semibold ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>

              {/* Two-column layout: Recent Orders + Top Products */}
              <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px]">
                {/* Recent orders */}
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-2xl">Recent Orders</h2>
                    <Link href="/admin/orders" className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#111211]/50 hover:text-[#111211]">
                      View all <ArrowUpRight size={11} className="inline" />
                    </Link>
                  </div>
                  <div className="mt-5 overflow-x-auto border border-[#111211]/15">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-[#111211]/10 bg-[#111211]/[0.03]">
                          <th className="px-4 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[#111211]/45">Order</th>
                          <th className="px-4 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[#111211]/45">Customer</th>
                          <th className="px-4 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[#111211]/45">Items</th>
                          <th className="px-4 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[#111211]/45">Total</th>
                          <th className="px-4 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[#111211]/45">Status</th>
                          <th className="px-4 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[#111211]/45">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentOrders?.map((order: any) => (
                          <tr key={order._id} className="border-b border-[#111211]/5 hover:bg-[#111211]/[0.015] transition">
                            <td className="px-4 py-3.5 font-mono text-[10px] font-medium">#{order._id.slice(-6).toUpperCase()}</td>
                            <td className="px-4 py-3.5 text-sm">{order.user?.name || "—"}</td>
                            <td className="px-4 py-3.5 text-sm">{order.items?.length || 0}</td>
                            <td className="px-4 py-3.5 font-mono text-xs font-medium">₹{order.total?.toLocaleString()}</td>
                            <td className="px-4 py-3.5">
                              <span className={`inline-block px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.12em] ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
                                {order.orderStatus?.replace(/_/g, " ") || "—"}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-xs text-[#111211]/50">
                              {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </td>
                          </tr>
                        ))}
                        {(!stats.recentOrders || stats.recentOrders.length === 0) && (
                          <tr>
                            <td colSpan={6} className="px-4 py-16 text-center">
                              <ShoppingCart size={24} className="mx-auto text-[#111211]/15 mb-3" />
                              <p className="text-sm text-[#111211]/40">No orders yet</p>
                              <p className="mt-1 text-xs text-[#111211]/25">Orders will appear here once customers start purchasing</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Top products sidebar */}
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-2xl">Top Products</h2>
                    <Link href="/admin/products" className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#111211]/50 hover:text-[#111211]">
                      View all <ArrowUpRight size={11} className="inline" />
                    </Link>
                  </div>
                  <div className="mt-5 space-y-2">
                    {stats.topProducts?.length > 0 ? (
                      stats.topProducts.map((tp: any, i: number) => (
                        <div key={i} className="flex items-center gap-4 border border-[#111211]/10 p-4 transition hover:bg-[#111211]/[0.015]">
                          <span className="grid h-9 w-9 shrink-0 place-items-center border border-[#111211]/10 bg-[#111211]/[0.02] font-mono text-[11px] font-semibold">
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{tp.product?.name || "Unknown"}</p>
                            <p className="mt-0.5 font-mono text-[9px] text-[#111211]/40">{tp.totalSold} sold</p>
                          </div>
                          <p className="font-mono text-xs font-medium shrink-0">₹{tp.revenue?.toLocaleString()}</p>
                        </div>
                      ))
                    ) : (
                      <div className="border border-dashed border-[#111211]/15 py-12 text-center">
                        <Package size={20} className="mx-auto text-[#111211]/15 mb-2" />
                        <p className="text-xs text-[#111211]/35">No sales data yet</p>
                      </div>
                    )}
                  </div>

                  {/* Quick actions */}
                  <div className="mt-8 border border-[#111211]/15 p-5">
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#111211]/50 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <Link href="/admin/products" className="flex items-center justify-between border border-[#111211]/10 p-3 text-sm transition hover:bg-[#111211]/[0.02]">
                        <span>Manage Products</span>
                        <ArrowUpRight size={13} className="text-[#111211]/30" />
                      </Link>
                      <Link href="/admin/orders" className="flex items-center justify-between border border-[#111211]/10 p-3 text-sm transition hover:bg-[#111211]/[0.02]">
                        <span>View Orders</span>
                        <ArrowUpRight size={13} className="text-[#111211]/30" />
                      </Link>
                      <Link href="/admin/users" className="flex items-center justify-between border border-[#111211]/10 p-3 text-sm transition hover:bg-[#111211]/[0.02]">
                        <span>Manage Users</span>
                        <ArrowUpRight size={13} className="text-[#111211]/30" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly revenue bar chart */}
              {stats.monthlyRevenue?.length > 0 && (
                <div className="mt-12 border border-[#111211]/15 p-6">
                  <h2 className="font-display text-2xl">Monthly Revenue</h2>
                  <div className="mt-6 flex items-end gap-3 h-40">
                    {stats.monthlyRevenue.map((m: any, i: number) => {
                      const maxRev = Math.max(...stats.monthlyRevenue.map((x: any) => x.revenue || 0), 1);
                      const height = Math.max(4, ((m.revenue || 0) / maxRev) * 100);
                      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                          <div className="relative w-full flex justify-center">
                            <div className="absolute -top-8 hidden group-hover:block bg-[#111211] text-[#EAE8E1] px-2 py-1 font-mono text-[9px] whitespace-nowrap">
                              ₹{(m.revenue || 0).toLocaleString()}
                            </div>
                          </div>
                          <div className="w-full bg-[#111211]/[0.06] relative" style={{ height: `${height}%` }}>
                            <div className="absolute inset-0 bg-[#D7F54A]/60 transition-colors group-hover:bg-[#D7F54A]" />
                          </div>
                          <span className="font-mono text-[8px] uppercase text-[#111211]/40">
                            {monthNames[(m._id?.month || 1) - 1]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}
