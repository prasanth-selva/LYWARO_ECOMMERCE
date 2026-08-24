import React, { useState } from 'react';
import { Search, Mail, Calendar, Shield } from 'lucide-react';
import { formatDate } from '../../utils/format';

const mockUsers = [
  { id: 'u1', name: 'Arjun Kapoor', email: 'arjun@lywaro.com', role: 'admin', orders: 5, spent: 42495, joined: '2025-01-15' },
  { id: 'u2', name: 'Priya Mehta', email: 'priya@gmail.com', role: 'user', orders: 3, spent: 25497, joined: '2025-03-22' },
  { id: 'u3', name: 'Vikram Singh', email: 'vikram@outlook.com', role: 'user', orders: 8, spent: 67992, joined: '2024-11-08' },
  { id: 'u4', name: 'Neha Rathi', email: 'neha@yahoo.com', role: 'user', orders: 2, spent: 16998, joined: '2025-06-01' },
  { id: 'u5', name: 'Rohan Tiwari', email: 'rohan@gmail.com', role: 'user', orders: 12, spent: 101988, joined: '2024-09-15' },
  { id: 'u6', name: 'Ananya Das', email: 'ananya@lywaro.com', role: 'admin', orders: 1, spent: 8499, joined: '2025-07-10' },
  { id: 'u7', name: 'Karan Bajaj', email: 'karan@gmail.com', role: 'user', orders: 6, spent: 50994, joined: '2025-02-28' },
  { id: 'u8', name: 'Shreya Patel', email: 'shreya@outlook.com', role: 'user', orders: 4, spent: 33996, joined: '2025-04-12' },
];

export default function AdminUsers() {
  const [search, setSearch] = useState('');

  const filtered = mockUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const inputClass = "w-full bg-lywaro-charcoal border border-white/5 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-white/20 transition-colors";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">USERS</h1>
        <p className="text-sm text-lywaro-gray mt-1">{mockUsers.length} registered users</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-lywaro-gray" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="bg-lywaro-charcoal border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[550px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-4">USER</th>
                <th className="text-left text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-4 hidden md:table-cell">EMAIL</th>
                <th className="text-left text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-4">ROLE</th>
                <th className="text-right text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-4 hidden sm:table-cell">ORDERS</th>
                <th className="text-right text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-4 hidden lg:table-cell">SPENT</th>
                <th className="text-left text-[10px] font-bold tracking-wider text-lywaro-gray py-3 px-4 hidden lg:table-cell">JOINED</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-lywaro-dark rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">{user.name[0]}</span>
                      </div>
                      <span className="text-sm font-bold text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-lywaro-gray hidden md:table-cell">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold tracking-wider px-2 py-1 ${
                      user.role === 'admin' ? 'bg-lywaro-crimson/10 text-lywaro-crimson' : 'bg-white/5 text-lywaro-gray'
                    }`}>
                      {user.role === 'admin' ? 'ADMIN' : 'USER'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs font-bold text-white text-right hidden sm:table-cell">{user.orders}</td>
                  <td className="py-3 px-4 text-xs font-bold text-white text-right hidden lg:table-cell">₹{user.spent.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-xs text-lywaro-gray hidden lg:table-cell">{formatDate(new Date(user.joined))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm font-bold text-white/30">NO USERS FOUND</p>
          </div>
        )}
      </div>
    </div>
  );
}
