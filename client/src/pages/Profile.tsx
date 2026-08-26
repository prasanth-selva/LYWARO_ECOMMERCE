import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/StoreChrome";
import authService from "@/services/authService";
import userService from "@/services/userService";
import { toast } from "sonner";

export default function Profile() {
  const { user, isAuthenticated, loading, logout, updateUser } = useAuth();
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate("/login");
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      userService.getAddresses().then((res) => setAddresses(res.data.addresses)).catch(() => {});
    }
  }, [isAuthenticated]);

  const handleProfileUpdate = async () => {
    try {
      const res = await authService.updateProfile({ name, phone });
      updateUser(res.data.user);
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update");
    }
  };

  const handleAddAddress = async () => {
    try {
      const res = await userService.addAddress(addressForm);
      setAddresses(res.data.addresses);
      setShowAddressForm(false);
      setAddressForm({ fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", country: "India" });
      toast.success("Address added");
    } catch (err: any) {
      toast.error(err.message || "Failed to add address");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const res = await userService.deleteAddress(id);
      setAddresses(res.data.addresses);
      toast.success("Address removed");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove address");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-[#EAE8E1] text-[#111211]">
      <Header onCart={() => {}} />
      <main className="px-5 pb-24 pt-32 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Link href="/shop" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.17em] text-[#111211]/50 hover:text-[#111211]">
            <ArrowLeft size={13} /> Back
          </Link>
          <h1 className="mt-6 font-display text-5xl font-semibold tracking-[-0.06em] sm:text-7xl">
            Account
          </h1>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_2fr]">
            {/* Sidebar */}
            <div className="space-y-6 border-r border-[#111211]/10 pr-8">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#111211]/45">Name</p>
                <p className="mt-1 font-display text-lg">{user.name}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#111211]/45">Email</p>
                <p className="mt-1 text-sm">{user.email}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#111211]/45">Role</p>
                <p className="mt-1 text-sm capitalize">{user.role}</p>
              </div>
              <nav className="space-y-3 border-t border-[#111211]/10 pt-5">
                <Link href="/orders" className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] hover:text-[#111211]/60">Orders <ArrowRight size={12} /></Link>
                <Link href="/wishlist" className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] hover:text-[#111211]/60">Wishlist <ArrowRight size={12} /></Link>
                {user.role === "admin" && (
                  <Link href="/admin" className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-[#D7F54A] hover:text-[#111211]/60">Admin Dashboard <ArrowRight size={12} /></Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-red-600 hover:text-red-800">
                  <LogOut size={13} /> Sign out
                </button>
              </nav>
            </div>

            {/* Main content */}
            <div className="space-y-12">
              {/* Edit profile */}
              <section>
                <h2 className="font-display text-2xl">Edit Profile</h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#111211]/50">Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full border border-[#111211]/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#111211]" />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#111211]/50">Phone</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 w-full border border-[#111211]/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#111211]" />
                  </div>
                </div>
                <button onClick={handleProfileUpdate} className="mt-5 bg-[#111211] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#EAE8E1] transition hover:bg-[#D7F54A] hover:text-[#111211]">
                  Save changes
                </button>
              </section>

              {/* Addresses */}
              <section>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl">Addresses</h2>
                  <button onClick={() => setShowAddressForm(!showAddressForm)} className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#111211]/50 hover:text-[#111211]">
                    {showAddressForm ? "Cancel" : "+ Add address"}
                  </button>
                </div>

                {showAddressForm && (
                  <div className="mt-5 grid gap-4 border border-[#111211]/15 p-5 sm:grid-cols-2">
                    <input placeholder="Full name" value={addressForm.fullName} onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })} className="border border-[#111211]/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#111211]" />
                    <input placeholder="Phone" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} className="border border-[#111211]/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#111211]" />
                    <input placeholder="Address line 1" value={addressForm.addressLine1} onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })} className="border border-[#111211]/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#111211] sm:col-span-2" />
                    <input placeholder="Address line 2 (optional)" value={addressForm.addressLine2} onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })} className="border border-[#111211]/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#111211] sm:col-span-2" />
                    <input placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="border border-[#111211]/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#111211]" />
                    <input placeholder="State" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="border border-[#111211]/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#111211]" />
                    <input placeholder="Postal code" value={addressForm.postalCode} onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })} className="border border-[#111211]/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#111211]" />
                    <button onClick={handleAddAddress} className="bg-[#111211] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#EAE8E1] transition hover:bg-[#D7F54A] hover:text-[#111211]">
                      Save address
                    </button>
                  </div>
                )}

                <div className="mt-5 space-y-4">
                  {addresses.map((addr) => (
                    <div key={addr._id} className="flex items-start justify-between border border-[#111211]/15 p-5">
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="font-display text-sm font-semibold">{addr.fullName}</p>
                          {addr.isDefault && <span className="font-mono text-[8px] uppercase tracking-[0.12em] bg-[#111211] px-2 py-1 text-[#EAE8E1]">Default</span>}
                        </div>
                        <p className="mt-2 text-sm text-[#111211]/60">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}</p>
                        <p className="text-sm text-[#111211]/60">{addr.city}, {addr.state} {addr.postalCode}</p>
                        <p className="text-sm text-[#111211]/60">{addr.country}</p>
                        <p className="mt-1 text-sm text-[#111211]/50">{addr.phone}</p>
                      </div>
                      <button onClick={() => handleDeleteAddress(addr._id)} className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#111211]/40 hover:text-red-600">
                        Remove
                      </button>
                    </div>
                  ))}
                  {addresses.length === 0 && (
                    <p className="py-8 text-center text-sm text-[#111211]/45">No addresses saved yet.</p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
