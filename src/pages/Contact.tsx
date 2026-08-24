import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const { addToast } = useToast();

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      addToast('Message sent successfully!', 'success');
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-16 lg:pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-px bg-lywaro-crimson" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-lywaro-crimson">CONTACT</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black tracking-tight text-white mb-8 md:mb-10">GET IN TOUCH</h1>

        <div className="grid lg:grid-cols-[1fr_300px] gap-8 lg:gap-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Name" required value={form.name} onChange={e => update('name', e.target.value)}
                className="bg-lywaro-charcoal border border-white/10 px-4 py-3 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors" />
              <input type="email" placeholder="Email" required value={form.email} onChange={e => update('email', e.target.value)}
                className="bg-lywaro-charcoal border border-white/10 px-4 py-3 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors" />
            </div>
            <input type="text" placeholder="Subject" required value={form.subject} onChange={e => update('subject', e.target.value)}
              className="w-full bg-lywaro-charcoal border border-white/10 px-4 py-3 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors" />
            <textarea placeholder="Message" required value={form.message} onChange={e => update('message', e.target.value)} rows={6}
              className="w-full bg-lywaro-charcoal border border-white/10 px-4 py-3 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors resize-none" />
            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-2 bg-white text-black px-8 py-4 text-xs font-bold tracking-[0.15em] hover:bg-lywaro-crimson hover:text-white transition-all duration-300 disabled:opacity-50"
            >
              <Send size={14} />
              {sending ? 'SENDING...' : 'SEND MESSAGE'}
            </button>
          </form>

          <div className="space-y-6 pt-4 lg:pt-0">
            {[
              { icon: Mail, label: 'EMAIL', value: 'hello@lywaro.com' },
              { icon: Phone, label: 'PHONE', value: '+91 1800-LYWARO' },
              { icon: MapPin, label: 'ADDRESS', value: 'LYWARO HQ, Sector 62, Noida, UP, India' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-3">
                  <Icon size={16} className="text-lywaro-crimson mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-lywaro-gray mb-1">{item.label}</p>
                    <p className="text-sm text-white">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
