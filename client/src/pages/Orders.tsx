import { useEffect, useState } from "react";
import { Link, useRoute, useLocation } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/StoreChrome";
import orderService from "@/services/orderService";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-700",
  confirmed: "bg-blue-500/20 text-blue-700",
  processing: "bg-blue-500/20 text-blue-700",
  shipped: "bg-purple-500/20 text-purple-700",
  out_for_delivery: "bg-orange-500/20 text-orange-700",
  delivered: "bg-green-500/20 text-green-700",
  cancelled: "bg-red-500/20 text-red-700",
};

export default function Orders() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate("/login");
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      orderService.getUserOrders().then((res) => {
        setOrders(res.data.orders);
        setLoadingOrders(false);
      }).catch(() => setLoadingOrders(false));
    }
  }, [isAuthenticated]);

  if (loading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#EAE8E1] text-[#111211]">
      <Header onCart={() => {}} />
      <main className="px-5 pb-24 pt-32 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Link href="/profile" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.17em] text-[#111211]/50 hover:text-[#111211]">
            <ArrowLeft size={13} /> Account
          </Link>
          <h1 className="mt-6 font-display text-5xl font-semibold tracking-[-0.06em] sm:text-7xl">
            Orders
          </h1>

          {loadingOrders ? (
            <div className="mt-12 text-center text-sm text-[#111211]/45">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="mt-12 border border-dashed border-[#111211]/20 py-24 text-center">
              <p className="font-display text-2xl">No orders yet</p>
              <p className="mt-3 text-sm text-[#111211]/50">Start shopping to see your orders here.</p>
              <Link href="/shop" className="mt-6 inline-flex items-center gap-2 border-b border-[#111211] pb-1 font-mono text-[10px] uppercase tracking-[0.18em]">
                Shop now <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border border-[#111211]/15">
                  <button onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)} className="flex w-full items-center justify-between p-5 text-left">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#111211]/45">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="mt-1 font-display text-sm">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-700"}`}>
                        {order.orderStatus.replace(/_/g, " ")}
                      </span>
                      <p className="mt-2 font-mono text-xs">₹{order.total.toLocaleString()}</p>
                    </div>
                  </button>
                  {selectedOrder === order._id && (
                    <div className="border-t border-[#111211]/10 px-5 py-5">
                      <div className="space-y-3">
                        {order.items.map((item: any, i: number) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <div>
                              <p>{item.name}</p>
                              <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#111211]/45">Size {item.size} &middot; Qty {item.quantity}</p>
                            </div>
                            <p className="font-mono text-xs">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 border-t border-[#111211]/10 pt-3 text-sm">
                        <p className="text-[#111211]/50">Payment: <span className="capitalize">{order.paymentStatus}</span></p>
                        {order.shippingAddress && (
                          <p className="mt-1 text-[#111211]/50">
                            Ships to: {order.shippingAddress.city}, {order.shippingAddress.state}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
