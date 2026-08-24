import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

const steps = ['INFORMATION', 'SHIPPING', 'PAYMENT', 'REVIEW'];

export default function Checkout() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address1: '', address2: '', city: '', state: '', pincode: '',
    shippingMethod: 'standard',
    cardNumber: '', cardExpiry: '', cardCvc: '', cardName: '',
  });
  const { items, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const shipping = form.shippingMethod === 'express' ? 999 : (getCartTotal() >= 5000 ? 0 : 499);

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const next = () => {
    if (step === 3) {
      clearCart();
      navigate('/order-confirmation');
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-20 bg-lywaro-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Steps */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <button
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] whitespace-nowrap transition-colors ${
                  i === step ? 'text-white' : i < step ? 'text-lywaro-crimson' : 'text-lywaro-gray/40'
                }`}
              >
                <span className={`w-6 h-6 flex items-center justify-center border text-[10px] ${
                  i === step ? 'border-white text-white' : i < step ? 'border-lywaro-crimson bg-lywaro-crimson text-white' : 'border-white/10 text-lywaro-gray/40'
                }`}>
                  {i < step ? '✓' : i + 1}
                </span>
                {s}
              </button>
              {i < steps.length - 1 && <ChevronRight size={12} className="text-lywaro-gray/20 flex-shrink-0" />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-8 lg:gap-12">
          {/* Form Area */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {step === 0 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold tracking-wider text-white">CONTACT INFORMATION</h2>
                    <input type="email" placeholder="Email" value={form.email} onChange={e => update('email', e.target.value)}
                      className="w-full bg-lywaro-charcoal border border-white/10 px-4 py-3 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors" />
                    <input type="tel" placeholder="Phone" value={form.phone} onChange={e => update('phone', e.target.value)}
                      className="w-full bg-lywaro-charcoal border border-white/10 px-4 py-3 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors" />
                    <h2 className="text-xl font-bold tracking-wider text-white pt-4">SHIPPING ADDRESS</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="First Name" value={form.firstName} onChange={e => update('firstName', e.target.value)}
                        className="bg-lywaro-charcoal border border-white/10 px-4 py-3 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors" />
                      <input type="text" placeholder="Last Name" value={form.lastName} onChange={e => update('lastName', e.target.value)}
                        className="bg-lywaro-charcoal border border-white/10 px-4 py-3 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors" />
                    </div>
                    <input type="text" placeholder="Address Line 1" value={form.address1} onChange={e => update('address1', e.target.value)}
                      className="w-full bg-lywaro-charcoal border border-white/10 px-4 py-3 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors" />
                    <input type="text" placeholder="Address Line 2 (Optional)" value={form.address2} onChange={e => update('address2', e.target.value)}
                      className="w-full bg-lywaro-charcoal border border-white/10 px-4 py-3 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors" />
                    <div className="grid grid-cols-3 gap-4">
                      <input type="text" placeholder="City" value={form.city} onChange={e => update('city', e.target.value)}
                        className="bg-lywaro-charcoal border border-white/10 px-4 py-3 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors" />
                      <input type="text" placeholder="State" value={form.state} onChange={e => update('state', e.target.value)}
                        className="bg-lywaro-charcoal border border-white/10 px-4 py-3 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors" />
                      <input type="text" placeholder="Pincode" value={form.pincode} onChange={e => update('pincode', e.target.value)}
                        className="bg-lywaro-charcoal border border-white/10 px-4 py-3 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors" />
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold tracking-wider text-white mb-6">SHIPPING METHOD</h2>
                    {[
                      { value: 'standard', label: 'STANDARD', desc: '5-7 business days', price: getCartTotal() >= 5000 ? 0 : 499 },
                      { value: 'express', label: 'EXPRESS', desc: '2-3 business days', price: 999 },
                    ].map(opt => (
                      <label key={opt.value} className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                        form.shippingMethod === opt.value ? 'border-white bg-white/5' : 'border-white/10 hover:border-white/30'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            form.shippingMethod === opt.value ? 'border-lywaro-crimson' : 'border-white/30'
                          }`}>
                            {form.shippingMethod === opt.value && <div className="w-2 h-2 rounded-full bg-lywaro-crimson" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{opt.label}</p>
                            <p className="text-xs text-lywaro-gray">{opt.desc}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-white">{opt.price === 0 ? 'FREE' : formatPrice(opt.price)}</span>
                        <input type="radio" name="shipping" value={opt.value} checked={form.shippingMethod === opt.value}
                          onChange={e => update('shippingMethod', e.target.value)} className="sr-only" />
                      </label>
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold tracking-wider text-white">PAYMENT</h2>
                    <p className="text-xs text-lywaro-gray">This is a mock payment. No real payment is processed.</p>
                    <input type="text" placeholder="Cardholder Name" value={form.cardName} onChange={e => update('cardName', e.target.value)}
                      className="w-full bg-lywaro-charcoal border border-white/10 px-4 py-3 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors" />
                    <input type="text" placeholder="Card Number" value={form.cardNumber} onChange={e => update('cardNumber', e.target.value)}
                      className="w-full bg-lywaro-charcoal border border-white/10 px-4 py-3 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="MM/YY" value={form.cardExpiry} onChange={e => update('cardExpiry', e.target.value)}
                        className="bg-lywaro-charcoal border border-white/10 px-4 py-3 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors" />
                      <input type="text" placeholder="CVC" value={form.cardCvc} onChange={e => update('cardCvc', e.target.value)}
                        className="bg-lywaro-charcoal border border-white/10 px-4 py-3 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors" />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold tracking-wider text-white">REVIEW ORDER</h2>
                    <div className="p-4 bg-lywaro-charcoal border border-white/5 space-y-2">
                      <p className="text-xs text-lywaro-gray">SHIPPING TO</p>
                      <p className="text-sm text-white">{form.firstName} {form.lastName}</p>
                      <p className="text-sm text-lywaro-gray">{form.address1}, {form.city}, {form.state} {form.pincode}</p>
                      <p className="text-sm text-lywaro-gray">{form.email}</p>
                    </div>
                    <div className="space-y-3">
                      {items.map(item => (
                        <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex items-center justify-between p-3 bg-lywaro-charcoal border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-lywaro-dark flex items-center justify-center">
                              <span className="text-sm font-bold text-white/10">{item.product.name[0]}</span>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{item.product.name}</p>
                              <p className="text-xs text-lywaro-gray">{item.color} / {item.size} × {item.quantity}</p>
                            </div>
                          </div>
                          <p className="text-sm font-bold text-white">{formatPrice(item.product.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Nav Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
              {step > 0 ? (
                <button onClick={() => setStep(step - 1)} className="text-xs font-bold tracking-wider text-lywaro-gray hover:text-white transition-colors">
                  ← BACK
                </button>
              ) : <div />}
              <button
                onClick={next}
                className="bg-white text-black px-8 py-3 text-xs font-bold tracking-[0.15em] hover:bg-lywaro-crimson hover:text-white transition-all duration-300"
              >
                {step === 3 ? 'PLACE ORDER' : 'CONTINUE'}
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-lywaro-charcoal border border-white/5 p-6 h-fit sticky top-24">
            <h3 className="text-xs font-bold tracking-[0.2em] text-white mb-6">ORDER SUMMARY</h3>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-lywaro-dark flex items-center justify-center flex-shrink-0 relative">
                    <span className="text-sm font-bold text-white/10">{item.product.name[0]}</span>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-lywaro-gray text-[9px] font-bold text-black rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{item.product.name}</p>
                    <p className="text-[10px] text-lywaro-gray">{item.size}</p>
                  </div>
                  <p className="text-xs font-bold text-white">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2 py-4 border-t border-white/5">
              <div className="flex justify-between text-sm">
                <span className="text-lywaro-gray">Subtotal</span>
                <span className="text-white font-bold">{formatPrice(getCartTotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-lywaro-gray">Shipping</span>
                <span className={`font-bold ${shipping === 0 ? 'text-green-400' : 'text-white'}`}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
            </div>
            <div className="flex justify-between py-4 border-t border-white/5">
              <span className="text-sm font-bold tracking-wider text-white">TOTAL</span>
              <span className="text-lg font-bold text-white">{formatPrice(getCartTotal() + shipping)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
