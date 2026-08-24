import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronDown, Eye, Package, Truck, CheckCircle } from 'lucide-react';
import { mockOrders } from '../../data/products';
import { Order, OrderStatus } from '../../types';
import { formatPrice, formatDate } from '../../utils/format';
import { useToast } from '../../context/ToastContext';

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  placed: { label: 'PLACED', color: 'text-lywaro-gray', bg: 'bg-lywaro-gray/10' },
  confirmed: { label: 'CONFIRMED', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  packed: { label: 'PACKED', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  shipped: { label: 'SHIPPED', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  out_for_delivery: { label: 'OUT FOR DELIVERY', color: 'text-orange-400', bg: 'bg-orange-400/10' },
  delivered: { label: 'DELIVERED', color: 'text-green-400', bg: 'bg-green-400/10' },
};

const statusFlow: OrderStatus[] = ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { addToast } = useToast();

  const filtered = orders.filter(o => {
    const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const advanceStatus = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const currentIdx = statusFlow.indexOf(o.status);
      if (currentIdx < statusFlow.length - 1) {
        const nextStatus = statusFlow[currentIdx + 1];
        addToast(`Order #${o.orderNumber} → ${statusConfig[nextStatus].label}`, 'success');
        return { ...o, status: nextStatus };
      }
      return o;
    }));
  };

  const inputClass = "w-full bg-lywaro-charcoal border border-white/5 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-white/20 transition-colors";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">ORDERS</h1>
        <p className="text-sm text-lywaro-gray mt-1">{orders.length} orders total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-sm flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-lywaro-gray" />
          <input
            type="text"
            placeholder="Search by order number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none bg-lywaro-charcoal border border-white/5 text-xs font-bold tracking-wider text-lywaro-gray pl-4 pr-8 py-2.5 focus:outline-none focus:border-white/20 transition-colors cursor-pointer"
          >
            <option value="all">ALL STATUS</option>
            {statusFlow.map(s => (
              <option key={s} value={s}>{statusConfig[s].label}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-lywaro-gray pointer-events-none" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-lywaro-charcoal border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-4">ORDER</th>
                <th className="text-left text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-4">CUSTOMER</th>
                <th className="text-left text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-4 hidden md:table-cell">PRODUCTS</th>
                <th className="text-left text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-4 hidden lg:table-cell">DATE</th>
                <th className="text-left text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-4">STATUS</th>
                <th className="text-right text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-4">TOTAL</th>
                <th className="text-right text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-4">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => {
                const sc = statusConfig[order.status];
                return (
                  <tr key={order.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <Link to={`/track-order/${order.id}`} className="text-xs font-bold text-white hover:text-lywaro-crimson transition-colors">
                        #{order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-xs text-lywaro-gray">Arjun K.</td>
                    <td className="py-3 px-4 text-xs text-lywaro-gray truncate max-w-[150px] hidden md:table-cell">
                      {order.items.map(i => i.product.name).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-xs text-lywaro-gray hidden lg:table-cell">{formatDate(order.createdAt)}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold tracking-wider px-2 py-1 ${sc.color} ${sc.bg}`}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-bold text-white text-right">{formatPrice(order.total)}</td>
                    <td className="py-3 px-4 text-right">
                      {order.status !== 'delivered' && (
                        <button
                          onClick={() => advanceStatus(order.id)}
                          className="text-[10px] font-bold tracking-wider text-lywaro-crimson hover:text-white transition-colors"
                        >
                          ADVANCE →
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm font-bold text-white/30">NO ORDERS FOUND</p>
          </div>
        )}
      </div>

      {/* Status Legend */}
      <div className="flex flex-wrap gap-2">
        {statusFlow.map(s => {
          const sc = statusConfig[s];
          return (
            <span key={s} className={`text-[10px] font-bold tracking-wider px-2.5 py-1 ${sc.color} ${sc.bg}`}>
              {sc.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
