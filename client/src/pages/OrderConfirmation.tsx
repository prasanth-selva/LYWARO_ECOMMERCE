import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowRight, Check, Package } from "lucide-react";
import { Header } from "@/components/StoreChrome";
import orderService from "@/services/orderService";

export default function OrderConfirmation() {
  const [, params] = useRoute("/order-confirmation/:id");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (params?.id) {
      orderService.getOrderById(params.id).then((res) => setOrder(res.data.order)).catch(() => {});
    }
  }, [params?.id]);

  return (
    <div className="min-h-screen bg-[#111211] text-[#EAE8E1]">
      <Header onCart={() => {}} />
      <main className="flex min-h-screen items-center justify-center px-5 pt-20">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center border border-[#D7F54A] bg-[#D7F54A]/10">
            <Check size={24} className="text-[#D7F54A]" />
          </div>
          <h1 className="mt-8 font-display text-5xl font-semibold tracking-[-0.06em]">
            Order confirmed
          </h1>
          {order && (
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              #{order._id.slice(-8).toUpperCase()}
            </p>
          )}
          <p className="mt-5 text-sm text-white/55">
            Your LYWARO journey starts now. We'll send you updates as your order is processed.
          </p>

          {order && (
            <div className="mt-8 border border-white/10 p-5 text-left">
              <div className="flex items-center gap-3">
                <Package size={16} strokeWidth={1.5} />
                <p className="font-display text-sm">Order Summary</p>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-white/55">{item.name} &times; {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-white/10 pt-3 flex justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em]">Total</span>
                <span className="font-display text-xl">₹{order.total?.toLocaleString()}</span>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/orders" className="flex items-center justify-center gap-2 border border-white/20 px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] transition hover:border-[#D7F54A] hover:text-[#D7F54A]">
              Track order
            </Link>
            <Link href="/shop" className="flex items-center justify-center gap-2 bg-[#EAE8E1] px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#111211] transition hover:bg-[#D7F54A]">
              Continue shopping <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
