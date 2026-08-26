import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Check, CreditCard, MapPin, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/contexts/StoreContext";
import { Header } from "@/components/StoreChrome";
import orderService from "@/services/orderService";
import paymentService from "@/services/paymentService";
import userService from "@/services/userService";
import { toast } from "sonner";

export default function Checkout() {
  const { isAuthenticated, loading } = useAuth();
  const { cart, cartTotal, refreshCart } = useStore();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate("/login");
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      userService.getAddresses().then((res) => {
        setAddresses(res.data.addresses);
        const defaultAddr = res.data.addresses.find((a: any) => a.isDefault);
        if (defaultAddr) setSelectedAddress(defaultAddr._id);
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  const shippingFee = cartTotal >= 5000 ? 0 : 199;
  const total = cartTotal + shippingFee;

  const handlePlaceOrder = async () => {
    setProcessing(true);
    try {
      const addr = addresses.find((a) => a._id === selectedAddress);
      if (!addr) {
        toast.error("Please select a shipping address");
        setProcessing(false);
        return;
      }

      const shippingAddress = {
        fullName: addr.fullName,
        phone: addr.phone,
        addressLine1: addr.addressLine1,
        addressLine2: addr.addressLine2 || "",
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        country: addr.country,
      };

      // Create order
      const orderRes = await orderService.createOrder({ shippingAddress });
      const orderId = orderRes.data.order._id;

      // Process payment (test mode)
      const payRes = await paymentService.createOrder(orderId);
      await paymentService.verifyPayment({
        orderId,
        paymentId: `pay_${Date.now()}`,
        signature: "test_signature",
      });

      await refreshCart();
      toast.success("Order placed successfully");
      navigate(`/order-confirmation/${orderId}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#EAE8E1] text-[#111211]">
      <Header onCart={() => {}} />
      <main className="px-5 pb-24 pt-32 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Link href="/shop" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.17em] text-[#111211]/50 hover:text-[#111211]">
            <ArrowLeft size={13} /> Continue shopping
          </Link>
          <h1 className="mt-6 font-display text-5xl font-semibold tracking-[-0.06em] sm:text-7xl">
            Checkout
          </h1>

          {/* Steps */}
          <div className="mt-8 flex items-center gap-6 border-b border-[#111211]/15 pb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`grid h-7 w-7 place-items-center border text-[9px] font-mono ${step >= s ? "border-[#111211] bg-[#111211] text-[#EAE8E1]" : "border-[#111211]/20 text-[#111211]/40"}`}>
                  {step > s ? <Check size={12} /> : s}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111211]/50 hidden sm:inline">
                  {s === 1 ? "Address" : s === 2 ? "Review" : "Payment"}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
            <div>
              {/* Step 1: Address */}
              {step === 1 && (
                <div>
                  <h2 className="font-display text-2xl">Shipping Address</h2>
                  {addresses.length === 0 ? (
                    <div className="mt-6 border border-dashed border-[#111211]/20 py-12 text-center">
                      <MapPin className="mx-auto text-[#111211]/30" size={24} />
                      <p className="mt-3 text-sm text-[#111211]/50">No addresses saved.</p>
                      <Link href="/profile" className="mt-4 inline-flex items-center gap-2 border-b border-[#111211] pb-1 font-mono text-[10px] uppercase tracking-[0.16em]">
                        Add an address <ArrowRight size={12} />
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-5 space-y-3">
                      {addresses.map((addr) => (
                        <button key={addr._id} onClick={() => setSelectedAddress(addr._id)} className={`w-full text-left border p-5 transition ${selectedAddress === addr._id ? "border-[#111211] bg-[#111211]/[0.03]" : "border-[#111211]/15 hover:border-[#111211]/40"}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-display text-sm font-semibold">{addr.fullName}</p>
                              <p className="mt-1 text-sm text-[#111211]/60">{addr.addressLine1}</p>
                              <p className="text-sm text-[#111211]/60">{addr.city}, {addr.state} {addr.postalCode}</p>
                              <p className="text-sm text-[#111211]/50">{addr.phone}</p>
                            </div>
                            {selectedAddress === addr._id && <div className="grid h-6 w-6 place-items-center bg-[#111211] text-[#EAE8E1]"><Check size={12} /></div>}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  <button disabled={!selectedAddress} onClick={() => setStep(2)} className="mt-6 flex items-center gap-3 bg-[#111211] px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#EAE8E1] transition hover:bg-[#D7F54A] hover:text-[#111211] disabled:opacity-30">
                    Continue to review <ArrowRight size={13} />
                  </button>
                </div>
              )}

              {/* Step 2: Review */}
              {step === 2 && (
                <div>
                  <h2 className="font-display text-2xl">Order Review</h2>
                  <div className="mt-5 divide-y divide-[#111211]/10 border border-[#111211]/15">
                    {cart.map((item) => (
                      <div key={item._id} className="flex gap-4 p-5">
                        <div className="h-20 w-20 shrink-0 bg-[#D8D6CE]">
                          <div className="h-full w-full grid place-items-center">
                            <div className="h-8 w-12 -rotate-12 rounded-[45%] bg-[#1B1E1B]" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-display text-sm font-semibold">{item.product?.name}</p>
                          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#111211]/45">Size {item.size} &middot; Qty {item.quantity}</p>
                        </div>
                        <p className="font-mono text-xs">₹{((item.product?.price || 0) * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <button onClick={() => setStep(1)} className="flex items-center gap-2 border border-[#111211]/20 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em]">
                      <ArrowLeft size={12} /> Back
                    </button>
                    <button onClick={() => setStep(3)} className="flex items-center gap-3 bg-[#111211] px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#EAE8E1] transition hover:bg-[#D7F54A] hover:text-[#111211]">
                      Continue to payment <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div>
                  <h2 className="font-display text-2xl">Payment</h2>
                  <div className="mt-5 border border-[#111211]/15 p-6">
                    <div className="flex items-center gap-3">
                      <CreditCard size={18} strokeWidth={1.5} />
                      <div>
                        <p className="font-display text-sm font-semibold">Test Payment</p>
                        <p className="mt-1 text-sm text-[#111211]/50">This is a simulated payment flow. No real charges will be made.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <button onClick={() => setStep(2)} className="flex items-center gap-2 border border-[#111211]/20 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em]">
                      <ArrowLeft size={12} /> Back
                    </button>
                    <button disabled={processing} onClick={handlePlaceOrder} className="flex items-center gap-3 bg-[#111211] px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#EAE8E1] transition hover:bg-[#D7F54A] hover:text-[#111211] disabled:opacity-50">
                      <Package size={13} /> {processing ? "Placing order..." : "Place order"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-32 lg:self-start">
              <div className="border border-[#111211]/15 p-6">
                <h3 className="font-display text-lg">Order Summary</h3>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-[#111211]/55">Subtotal ({cart.length} items)</span><span>₹{cartTotal.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-[#111211]/55">Shipping</span><span>{shippingFee === 0 ? "Free" : `₹${shippingFee}`}</span></div>
                </div>
                <div className="mt-4 border-t border-[#111211]/10 pt-4 flex justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em]">Total</span>
                  <span className="font-display text-2xl">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
