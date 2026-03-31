import { FormEvent, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Moon, ShieldCheck, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthPageProps {
  mode: 'login' | 'register';
  onSwitchMode: () => void;
  onSuccess: () => void;
}

export function AuthPage({ mode, onSwitchMode, onSuccess }: AuthPageProps) {
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const title = useMemo(() => (mode === 'login' ? 'Welcome Back' : 'Create Account'), [mode]);
  const subtitle = useMemo(
    () =>
      mode === 'login'
        ? 'Continue your spiritual journey with Imanify.'
        : 'Start tracking your worship streak and achievements.',
    [mode]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const action = mode === 'login' ? login : register;
    const result = await action(email.trim(), password);

    setLoading(false);

    if (!result.success) {
      setError(result.error ?? 'Authentication failed');
      return;
    }

    onSuccess();
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-islamic-green-950 text-white">
      <div className="absolute inset-0 bg-linear-to-b from-[#0F3D2E] via-[#0A2B21] to-[#071A13]" />
      <div className="stars-layer">
        {[...Array(80)].map((_, i) => (
          <span
            key={i}
            className="star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              '--duration': `${2 + Math.random() * 6}s`
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="w-full max-w-md rounded-[2.5rem] border border-gold-500/20 bg-islamic-green-900/55 backdrop-blur-2xl shadow-2xl p-8"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
              <Moon size={30} fill="currentColor" />
            </div>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-center">{title}</h1>
          <p className="mt-2 text-sm text-white/70 text-center">{subtitle}</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.2em] text-gold-400/80 font-bold">Email</span>
              <div className="mt-2 flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 focus-within:border-gold-500/40">
                <Mail size={18} className="text-white/55" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent outline-none text-sm placeholder-white/30"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.2em] text-gold-400/80 font-bold">Password</span>
              <div className="mt-2 flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 focus-within:border-gold-500/40">
                <Lock size={18} className="text-white/55" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-sm placeholder-white/30"
                />
              </div>
            </label>

            {error && (
              <div className="rounded-2xl border border-red-500/40 bg-red-500/15 px-4 py-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-2xl bg-gold-500 text-islamic-green-950 font-bold py-3.5 hover:bg-gold-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
            </button>
          </form>

          <button
            onClick={onSwitchMode}
            className="mt-5 w-full text-sm text-white/70 hover:text-gold-400 transition-colors"
          >
            {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>

          <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-3 gap-3 text-center text-[10px] uppercase tracking-[0.12em]">
            <div className="space-y-1 text-white/70">
              <ShieldCheck size={14} className="mx-auto text-gold-400" />
              <p>Secure</p>
            </div>
            <div className="space-y-1 text-white/70">
              <Star size={14} className="mx-auto text-gold-400" />
              <p>Streaks</p>
            </div>
            <div className="space-y-1 text-white/70">
              <Moon size={14} className="mx-auto text-gold-400" />
              <p>Faith</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
