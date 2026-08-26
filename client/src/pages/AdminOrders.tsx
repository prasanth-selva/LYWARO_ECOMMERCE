import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/StoreChrome";
import orderService from "@/services/orderService";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-700",
  confirmed: "bg-blue-500/20 text-blue-700",
  processing: "bg-blue-500/20 text-blue-700",
  shipped: "bg-purple-500/20 text-purple-700",
  out_for_delivery: "bg-orange-500/20 text-orange-700",
  delivered: "bg-green-500/20 text-green-700",
  cancelled: "bg-red-500/20 text-red-700",
};

const statuses = ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"];

export default function AdminOrders() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [, navigate] = useLocation();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) navigate("/login");
  }, [loading, isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    loadOrders();
  }, [isAdmin, filter]);

  const loadOrders = async () => {
    try {
      const res = await orderService.getAllOrders({ status: filter, limit: 50 });
      setOrders(res.data.orders);
    } catch {} finally {
      setLoadingOrders(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated");
      loadOrders();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  if (loading || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#EAE8E1] text-[#111211]">
      <Header onCart={() => {}} />
      <main className="px-5 pb-24 pt-32 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Link href="/admin" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.17em] text-[#111211]/50 hover:text-[#111211]">
            <ArrowLeft size={13} /> Dashboard
          </Link>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.06em]">Orders</h1>

          {/* Filter */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button onClick={() => setFilter("")} className={`px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] ${!filter ? "bg-[#111211] text-[#EAE8E1]" : "border border-[#111211]/15 hover:border-[#111211]/40"}`}>
              All
            </button>
            {statuses.map((s) => (
              <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] ${filter === s ? "bg-[#111211] text-[#EAE8E1]" : "border border-[#111211]/15 hover:border-[#111211]/40"}`}>
                {s.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          {/* Orders table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#111211]/15 font-mono text-[9px] uppercase tracking-[0.16em] text-[#111211]/45">
                  <th className="pb-3 pr-6">Order</th>
                  <th className="pb-3 pr-6">Customer</th>
                  <th className="pb-3 pr-6">Items</th>
                  <th className="pb-3 pr-6">Total</th>
                  <th className="pb-3 pr-6">Payment</th>
                  <th className="pb-3 pr-6">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-[#111211]/10">
                    <td className="py-3 pr-6 font-mono text-[10px]">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="py-3 pr-6">{order.user?.name || "—"}</td>
                    <td className="py-3 pr-6">{order.items?.length}</td>
                    <td className="py-3 pr-6 font-mono text-xs">₹{order.total?.toLocaleString()}</td>
                    <td className="py-3 pr-6"><span className={`font-mono text-[9px] uppercase ${order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"}`}>{order.paymentStatus}</span></td>
                    <td className="py-3 pr-6"><span className={`inline-block px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] ${statusColors[order.orderStatus] || ""}`}>{order.orderStatus?.replace(/_/g, " ")}</span></td>
                    <td className="py-3">
                      <div className="relative">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="appearance-none border border-[#111211]/15 bg-transparent px-3 py-1.5 pr-7 font-mono text-[9px] uppercase tracking-[0.12em] outline-none"
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                          ))}
                        </select>
                        <ChevronDown size={10} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={7} className="py-12 text-center text-[#111211]/45">No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
