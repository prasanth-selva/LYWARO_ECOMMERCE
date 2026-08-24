import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Heart, MapPin, CreditCard, Bell, User, LogOut, ChevronRight } from 'lucide-react';
import { mockUser, mockOrders } from '../data/products';
import { formatPrice, formatDate } from '../utils/format';
import { OrderStatus } from '../types';

const statusColors: Record<OrderStatus, string> = {
  placed: 'text-lywaro-gray',
  confirmed: 'text-blue-400',
  packed: 'text-yellow-400',
  shipped: 'text-lywaro-crimson',
  out_for_delivery: 'text-orange-400',
  delivered: 'text-green-400',
};

const navItems = [
  { key: 'overview', label: 'Overview', icon: User },
  { key: 'orders', label: 'Orders', icon: Package },
  { key: 'wishlist', label: 'Wishlist', icon: Heart, href: '/wishlist' },
  { key: 'addresses', label: 'Addresses', icon: MapPin },
  { key: 'notifications', label: 'Notifications', icon: Bell },
];

export default function Account() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const user = mockUser;

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-px bg-lywaro-crimson" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-lywaro-crimson">ACCOUNT</span>
        </div>
        <h1 className="text-3xl lg:text-5xl font-black tracking-tight text-white mb-10">MY ACCOUNT</h1>

        <div className="grid lg:grid-cols-[220px_1fr] gap-8 lg:gap-12">
          {/* Sidebar */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => item.href ? navigate(item.href) : setActiveTab(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold tracking-wider transition-colors ${
                    isActive ? 'text-white bg-white/5 border-l-2 border-lywaro-crimson' : 'text-lywaro-gray hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  <Icon size={14} />
                  {item.label.toUpperCase()}
                </button>
              );
            })}
            <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold tracking-wider text-lywaro-gray hover:text-lywaro-crimson transition-colors mt-4">
              <LogOut size={14} />
              LOGOUT
            </button>
          </nav>

          {/* Content */}
          <div>
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="p-6 bg-lywaro-charcoal border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-lywaro-dark rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-white">{user.name[0]}</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">{user.name}</h2>
                      <p className="text-sm text-lywaro-gray">{user.email}</p>
                      <p className="text-xs text-lywaro-gray/60 mt-1">Member since {formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-6 bg-lywaro-charcoal border border-white/5">
                    <p className="text-2xl font-black text-white">{mockOrders.length}</p>
                    <p className="text-xs text-lywaro-gray mt-1 tracking-wider">TOTAL ORDERS</p>
                  </div>
                  <div className="p-6 bg-lywaro-charcoal border border-white/5">
                    <p className="text-2xl font-black text-white">{formatPrice(mockOrders.reduce((s, o) => s + o.total, 0))}</p>
                    <p className="text-xs text-lywaro-gray mt-1 tracking-wider">TOTAL SPENT</p>
                  </div>
                  <div className="p-6 bg-lywaro-charcoal border border-white/5">
                    <p className="text-2xl font-black text-lywaro-crimson">{user.addresses.length}</p>
                    <p className="text-xs text-lywaro-gray mt-1 tracking-wider">ADDRESSES</p>
                  </div>
                </div>

                {/* Recent Orders */}
                <div>
                  <h3 className="text-sm font-bold tracking-[0.15em] text-white mb-4">RECENT ORDERS</h3>
                  {mockOrders.slice(0, 2).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-lywaro-charcoal border border-white/5 mb-2">
                      <div>
                        <p className="text-sm font-bold text-white">#{order.orderNumber}</p>
                        <p className="text-xs text-lywaro-gray">{formatDate(order.createdAt)} · {order.items.length} item(s)</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">{formatPrice(order.total)}</p>
                        <p className={`text-[10px] font-bold tracking-wider uppercase ${statusColors[order.status]}`}>
                          {order.status.replace(/_/g, ' ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                {mockOrders.map(order => (
                  <Link
                    key={order.id}
                    to={`/track-order/${order.id}`}
                    className="flex items-center justify-between p-6 bg-lywaro-charcoal border border-white/5 hover:border-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-lywaro-dark flex items-center justify-center">
                        <Package size={20} className="text-lywaro-gray" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-lywaro-crimson transition-colors">#{order.orderNumber}</p>
                        <p className="text-xs text-lywaro-gray">{formatDate(order.createdAt)}</p>
                        <div className="flex gap-2 mt-1">
                          {order.items.map((item, i) => (
                            <span key={i} className="text-[10px] text-lywaro-gray">{item.product.name}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">{formatPrice(order.total)}</p>
                        <p className={`text-[10px] font-bold tracking-wider uppercase ${statusColors[order.status]}`}>
                          {order.status.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <ChevronRight size={14} className="text-lywaro-gray" />
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-4">
                {user.addresses.map(addr => (
                  <div key={addr.id} className="p-6 bg-lywaro-charcoal border border-white/5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold tracking-wider text-white">{addr.label.toUpperCase()}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold tracking-wider text-lywaro-crimson bg-lywaro-crimson/10 px-2 py-0.5">DEFAULT</span>
                          )}
                        </div>
                        <p className="text-sm text-white">{addr.firstName} {addr.lastName}</p>
                        <p className="text-sm text-lywaro-gray">{addr.address1}</p>
                        {addr.address2 && <p className="text-sm text-lywaro-gray">{addr.address2}</p>}
                        <p className="text-sm text-lywaro-gray">{addr.city}, {addr.state} {addr.pincode}</p>
                        <p className="text-sm text-lywaro-gray mt-1">{addr.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="text-center py-12">
                <Bell size={32} className="text-lywaro-gray/30 mx-auto mb-4" />
                <p className="text-sm font-bold tracking-wider text-white/30">NO NOTIFICATIONS</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
