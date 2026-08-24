import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }
    addToast('Account created successfully!', 'success');
    navigate('/account');
  };

  return (
    <div className="min-h-screen pt-16 lg:pt-24 pb-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-10">
          <Link to="/" className="text-2xl font-black tracking-[0.3em] text-white">LYWARO</Link>
          <h1 className="text-xl font-bold tracking-wider text-white mt-8 mb-2">JOIN LYWARO</h1>
          <p className="text-sm text-lywaro-gray">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name" required value={form.name} onChange={e => update('name', e.target.value)}
            className="w-full bg-lywaro-charcoal border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors" />
          <input type="email" placeholder="Email" required value={form.email} onChange={e => update('email', e.target.value)}
            className="w-full bg-lywaro-charcoal border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors" />
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" required value={form.password} onChange={e => update('password', e.target.value)}
              className="w-full bg-lywaro-charcoal border border-white/10 px-4 py-3.5 pr-12 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors" />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-lywaro-gray hover:text-white transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <input type="password" placeholder="Confirm Password" required value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
            className="w-full bg-lywaro-charcoal border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors" />
          <label className="flex items-start gap-2 text-xs text-lywaro-gray">
            <input type="checkbox" required className="w-3.5 h-3.5 mt-0.5 accent-lywaro-crimson" />
            <span>I agree to the Terms of Service and Privacy Policy</span>
          </label>
          <button type="submit" className="w-full bg-white text-black py-3.5 text-xs font-bold tracking-[0.15em] hover:bg-lywaro-crimson hover:text-white transition-all duration-300">
            CREATE ACCOUNT
          </button>
        </form>

        <p className="text-center text-sm text-lywaro-gray mt-8">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-white hover:text-lywaro-crimson transition-colors">
            SIGN IN
          </Link>
        </p>
      </div>
    </div>
  );
}
