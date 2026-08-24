import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: 'LYWARO',
    storeEmail: 'hello@lywaro.com',
    currency: 'INR',
    freeShippingThreshold: '5000',
    taxRate: '18',
    maintenanceMode: false,
  });
  const { addToast } = useToast();

  const inputClass = "w-full bg-lywaro-dark border border-white/10 px-4 py-3 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors";

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">SETTINGS</h1>
        <p className="text-sm text-lywaro-gray mt-1">Configure your store settings.</p>
      </div>

      {/* Store Settings */}
      <div className="p-5 md:p-6 bg-lywaro-charcoal border border-white/5 space-y-5">
        <h3 className="text-xs font-bold tracking-[0.2em] text-white">STORE</h3>
        <div>
          <label className="text-[10px] font-bold tracking-wider text-lywaro-gray mb-1.5 block">STORE NAME</label>
          <input value={settings.storeName} onChange={e => setSettings(s => ({ ...s, storeName: e.target.value }))} className={inputClass} />
        </div>
        <div>
          <label className="text-[10px] font-bold tracking-wider text-lywaro-gray mb-1.5 block">STORE EMAIL</label>
          <input type="email" value={settings.storeEmail} onChange={e => setSettings(s => ({ ...s, storeEmail: e.target.value }))} className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold tracking-wider text-lywaro-gray mb-1.5 block">CURRENCY</label>
            <select value={settings.currency} onChange={e => setSettings(s => ({ ...s, currency: e.target.value }))} className={inputClass}>
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-wider text-lywaro-gray mb-1.5 block">TAX RATE (%)</label>
            <input type="number" value={settings.taxRate} onChange={e => setSettings(s => ({ ...s, taxRate: e.target.value }))} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div className="p-5 md:p-6 bg-lywaro-charcoal border border-white/5 space-y-5">
        <h3 className="text-xs font-bold tracking-[0.2em] text-white">SHIPPING</h3>
        <div>
          <label className="text-[10px] font-bold tracking-wider text-lywaro-gray mb-1.5 block">FREE SHIPPING THRESHOLD (₹)</label>
          <input type="number" value={settings.freeShippingThreshold} onChange={e => setSettings(s => ({ ...s, freeShippingThreshold: e.target.value }))} className={inputClass} />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-5 md:p-6 bg-lywaro-charcoal border border-lywaro-crimson/20 space-y-5">
        <h3 className="text-xs font-bold tracking-[0.2em] text-lywaro-crimson">DANGER ZONE</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-white">Maintenance Mode</p>
            <p className="text-xs text-lywaro-gray">Disable the storefront for maintenance</p>
          </div>
          <button
            onClick={() => setSettings(s => ({ ...s, maintenanceMode: !s.maintenanceMode }))}
            className={`w-12 h-6 rounded-full transition-colors relative ${settings.maintenanceMode ? 'bg-lywaro-crimson' : 'bg-white/10'}`}
            aria-label="Toggle maintenance mode"
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.maintenanceMode ? 'left-[26px]' : 'left-0.5'}`} />
          </button>
        </div>
      </div>

      <button
        onClick={() => addToast('Settings saved!', 'success')}
        className="bg-white text-black px-8 py-3 text-xs font-bold tracking-[0.15em] hover:bg-lywaro-crimson hover:text-white transition-all"
      >
        SAVE SETTINGS
      </button>
    </div>
  );
}
