import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users,
  ArrowUpRight, ChevronRight
} from 'lucide-react';
import { products, mockOrders } from '../../data/products';
import { formatPrice, formatDate } from '../../utils/format';

const stats = [
  { label: 'TOTAL REVENUE', value: '₹1,84,290', change: '+12.5%', up: true, icon: DollarSign, color: 'text-green-400' },
  { label: 'TOTAL ORDERS', value: '156', change: '+8.2%', up: true, icon: ShoppingCart, color: 'text-lywaro-crimson' },
  { label: 'PRODUCTS', value: products.length.toString(), change: '+3', up: true, icon: Package, color: 'text-blue-400' },
  { label: 'ACTIVE USERS', value: '2,847', change: '+18.3%', up: true, icon: Users, color: 'text-yellow-400' },
];

// Mock revenue data for bar chart
const revenueData = [
  { month: 'Jan', value: 45 },
  { month: 'Feb', value: 52 },
  { month: 'Mar', value: 48 },
  { month: 'Apr', value: 61 },
  { month: 'May', value: 55 },
  { month: 'Jun', value: 67 },
  { month: 'Jul', value: 72 },
  { month: 'Aug', value: 85 },
];
const maxRevenue = Math.max(...revenueData.map(d => d.value));

export default function Dashboard() {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">DASHBOARD</h1>
        <p className="text-sm text-lywaro-gray mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 md:p-5 bg-lywaro-charcoal border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon size={18} className="text-lywaro-gray" />
                <span className={`flex items-center gap-1 text-[10px] font-bold ${stat.up ? 'text-green-400' : 'text-lywaro-crimson'}`}>
                  {stat.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {stat.change}
                </span>
              </div>
              <p className="text-xl md:text-2xl font-black text-white">{stat.value}</p>
              <p className="text-[10px] md:text-xs text-lywaro-gray mt-1 tracking-wider">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Revenue Chart */}
        <div className="p-5 md:p-6 bg-lywaro-charcoal border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold tracking-[0.2em] text-white">REVENUE OVERVIEW</h3>
            <select className="bg-lywaro-dark border border-white/10 text-[10px] font-bold tracking-wider text-lywaro-gray px-3 py-1.5 focus:outline-none">
              <option>LAST 8 MONTHS</option>
              <option>LAST 12 MONTHS</option>
            </select>
          </div>
          {/* Bar chart */}
          <div className="flex items-end gap-2 h-48 md:h-56">
            {revenueData.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative group">
                  <div
                    className="w-full bg-gradient-to-t from-lywaro-crimson/80 to-lywaro-crimson/40 hover:from-lywaro-crimson hover:to-lywaro-crimson/60 transition-all rounded-t-sm"
                    style={{ height: `${(d.value / maxRevenue) * 100}%`, minHeight: '4px' }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-lywaro-dark border border-white/10 px-2 py-1 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    ₹{(d.value * 2180).toLocaleString('en-IN')}
                  </div>
                </div>
                <span className="text-[10px] text-lywaro-gray">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="p-5 md:p-6 bg-lywaro-charcoal border border-white/5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xs font-bold tracking-[0.2em] text-white">TOP PRODUCTS</h3>
            <Link to="/admin/products" className="text-[10px] font-bold text-lywaro-gray hover:text-white transition-colors">
              VIEW ALL
            </Link>
          </div>
          <div className="space-y-3">
            {products.slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 py-2">
                <span className="text-xs font-bold text-lywaro-gray/40 w-5">{i + 1}</span>
                <div className="w-10 h-10 bg-lywaro-dark flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-white/20">{p.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{p.name}</p>
                  <p className="text-[10px] text-lywaro-gray">{p.reviewCount} sales</p>
                </div>
                <p className="text-xs font-bold text-white flex-shrink-0">{formatPrice(p.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="p-5 md:p-6 bg-lywaro-charcoal border border-white/5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xs font-bold tracking-[0.2em] text-white">RECENT ORDERS</h3>
          <Link to="/admin/orders" className="flex items-center gap-1 text-[10px] font-bold text-lywaro-gray hover:text-white transition-colors">
            VIEW ALL <ChevronRight size={10} />
          </Link>
        </div>
        <div className="overflow-x-auto -mx-5 md:-mx-6 px-5 md:px-6">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-2">ORDER</th>
                <th className="text-left text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-2">CUSTOMER</th>
                <th className="text-left text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-2">PRODUCT</th>
                <th className="text-left text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-2">DATE</th>
                <th className="text-left text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-2">STATUS</th>
                <th className="text-right text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-2">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map(order => (
                <tr key={order.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-2">
                    <Link to={`/admin/orders`} className="text-xs font-bold text-white hover:text-lywaro-crimson transition-colors">
                      #{order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3 px-2 text-xs text-lywaro-gray">Arjun K.</td>
                  <td className="py-3 px-2 text-xs text-lywaro-gray truncate max-w-[120px]">
                    {order.items.map(i => i.product.name).join(', ')}
                  </td>
                  <td className="py-3 px-2 text-xs text-lywaro-gray">{formatDate(order.createdAt)}</td>
                  <td className="py-3 px-2">
                    <span className={`text-[10px] font-bold tracking-wider px-2 py-1 ${
                      order.status === 'delivered' ? 'bg-green-400/10 text-green-400' :
                      order.status === 'shipped' ? 'bg-lywaro-crimson/10 text-lywaro-crimson' :
                      'bg-yellow-400/10 text-yellow-400'
                    }`}>
                      {order.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-xs font-bold text-white text-right">{formatPrice(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
