import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Logged in successfully!', 'success');
    navigate('/account');
  };

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-20 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center mb-10">
          <Link to="/" className="text-2xl font-black tracking-[0.3em] text-white">LYWARO</Link>
          <h1 className="text-xl font-bold tracking-wider text-white mt-8 mb-2">WELCOME BACK</h1>
          <p className="text-sm text-lywaro-gray">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-lywaro-charcoal border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors" />
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-lywaro-charcoal border border-white/10 px-4 py-3.5 pr-12 text-sm text-white placeholder:text-lywaro-gray/50 focus:outline-none focus:border-lywaro-crimson/50 transition-colors" />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-lywaro-gray hover:text-white transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-lywaro-gray">
              <input type="checkbox" className="w-3.5 h-3.5 accent-lywaro-crimson" />
              Remember me
            </label>
            <span className="text-lywaro-gray hover:text-white transition-colors cursor-pointer">Forgot password?</span>
          </div>
          <button type="submit" className="w-full bg-white text-black py-3.5 text-xs font-bold tracking-[0.15em] hover:bg-lywaro-crimson hover:text-white transition-all duration-300">
            SIGN IN
          </button>
        </form>

        <p className="text-center text-sm text-lywaro-gray mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-white hover:text-lywaro-crimson transition-colors">
            CREATE ACCOUNT
          </Link>
        </p>
      </div>
    </div>
  );
}
