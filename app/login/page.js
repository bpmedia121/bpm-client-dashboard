'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const COLORS = {
  navy: '#0A1628',
  cream: '#FAFAF5',
  gold: '#C9A961',
  goldLight: '#E8D5A3',
  muted: '#6B7280',
  border: '#E5E7EB',
  red: '#EF4444',
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600&family=DM+Sans:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Check if already logged in — if yes, redirect to dashboard
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/');
    });
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Success — redirect to dashboard
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: COLORS.cream, fontFamily: 'DM Sans' }}>
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div style={{ fontFamily: 'Fraunces', fontSize: '2.25rem', fontWeight: 500, color: COLORS.navy, letterSpacing: '-0.02em' }}>
            Black Pepper
          </div>
          <div className="text-xs mt-1" style={{ color: COLORS.gold, fontFamily: 'DM Sans', letterSpacing: '0.15em' }}>
            CLIENT OS
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border p-8" style={{ borderColor: COLORS.border }}>
          <h1 className="mb-1" style={{ fontFamily: 'Fraunces', fontSize: '1.5rem', fontWeight: 500, color: COLORS.navy }}>
            Welcome back
          </h1>
          <p className="text-sm mb-6" style={{ color: COLORS.muted }}>
            Sign in to access your dashboard
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: COLORS.navy, fontWeight: 500 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.border }}
              />
            </div>

            <div>
              <label className="text-xs mb-1.5 block" style={{ color: COLORS.navy, fontWeight: 500 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.border }}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: COLORS.red + '15', color: COLORS.red }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-medium transition-opacity"
              style={{
                backgroundColor: COLORS.navy,
                color: 'white',
                fontFamily: 'DM Sans',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: COLORS.muted }}>
          Black Pepper Media · Premium Content System
        </p>
      </div>
    </div>
  );
}