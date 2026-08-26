import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/StoreChrome";
import api from "@/services/api";

export default function AdminUsers() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [, navigate] = useLocation();
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) navigate("/login");
  }, [loading, isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      api.get("/admin/users").then((res) => {
        setUsers(res.data.data.users);
        setLoadingUsers(false);
      }).catch(() => setLoadingUsers(false));
    }
  }, [isAdmin]);

  if (loading || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#EAE8E1] text-[#111211]">
      <Header onCart={() => {}} />
      <main className="px-5 pb-24 pt-32 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Link href="/admin" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.17em] text-[#111211]/50 hover:text-[#111211]">
            <ArrowLeft size={13} /> Dashboard
          </Link>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.06em]">Users</h1>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#111211]/15 font-mono text-[9px] uppercase tracking-[0.16em] text-[#111211]/45">
                  <th className="pb-3 pr-6">Name</th>
                  <th className="pb-3 pr-6">Email</th>
                  <th className="pb-3 pr-6">Role</th>
                  <th className="pb-3 pr-6">Orders</th>
                  <th className="pb-3 pr-6">Total spent</th>
                  <th className="pb-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-[#111211]/10">
                    <td className="py-3 pr-6 font-display text-sm font-semibold">{user.name}</td>
                    <td className="py-3 pr-6 text-[#111211]/60">{user.email}</td>
                    <td className="py-3 pr-6">
                      <span className={`inline-block px-2 py-0.5 font-mono text-[9px] uppercase ${user.role === "admin" ? "bg-[#D7F54A]/20 text-[#111211]" : "bg-[#111211]/5"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 pr-6 font-mono text-xs">{user.orderCount || 0}</td>
                    <td className="py-3 pr-6 font-mono text-xs">₹{(user.totalSpent || 0).toLocaleString()}</td>
                    <td className="py-3 text-[#111211]/50">{user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN") : "—"}</td>
                  </tr>
                ))}
                {users.length === 0 && !loadingUsers && (
                  <tr><td colSpan={6} className="py-12 text-center text-[#111211]/45">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
