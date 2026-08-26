import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/StoreChrome";
import { toast } from "sonner";

export default function Login() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111211] text-[#EAE8E1]">
      <Header onCart={() => {}} />
      <main className="flex min-h-screen items-center justify-center px-5 pt-20">
        <div className="w-full max-w-md">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D7F54A]">
            Account
          </p>
          <h1 className="mt-6 font-display text-5xl font-semibold tracking-[-0.06em]">
            Sign in.
          </h1>
          <p className="mt-4 text-sm text-white/55">
            Access your LYWARO account.
          </p>

          {error && (
            <div className="mt-6 border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none focus:border-[#D7F54A]"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none focus:border-[#D7F54A]"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-between bg-[#EAE8E1] px-5 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[#111211] transition hover:bg-[#D7F54A] disabled:opacity-50"
            >
              <span>{loading ? "Signing in..." : "Sign in"}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-white/45">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-[#D7F54A] underline underline-offset-4 hover:text-white"
            >
              Create one
            </Link>
          </p>

          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/30">
              Test accounts: admin@lywaro.com / admin123 &middot; user@lywaro.com / user123
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
