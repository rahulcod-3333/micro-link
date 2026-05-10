import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { clearAuthTokens } from '../lib/auth';
import { login, signup } from '../lib/api';

const initialForm = { name: '', email: '', password: '' };

export default function LoginForm() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => { clearAuthTokens(); }, []);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        '.auth-motion',
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.07 }
      );
    }, panelRef);
    return () => context.revert();
  }, [mode]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
        window.location.href = '/';
        return;
      }
      await signup(form);
      setMode('login');
      setSuccess('Account created — sign in with the same credentials.');
      setForm({ name: '', email: form.email, password: '' });
    } catch (submitError) {
      console.error(submitError);
      setError(submitError.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={panelRef} className="glass-panel rounded-[2rem] p-6 sm:p-8">

      {/* Mode Toggle + Title */}
      <div className="auth-motion">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700" style={{ fontFamily: 'var(--font-body)' }}>
              {mode === 'login' ? 'Welcome back' : 'Get started'}
            </p>
            <h2 className="mt-1.5 text-2xl font-black tracking-tight text-slate-950" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.04em' }}>
              {mode === 'login' ? 'Sign in' : 'Create your account'}
            </h2>
          </div>

          {/* Toggle Pill */}
          <div className="flex-shrink-0 rounded-full bg-slate-100 p-1 flex">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${mode === 'login' ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${mode === 'signup' ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="auth-motion mt-4 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          <svg className="mt-0.5 h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="auth-motion mt-4 flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <svg className="mt-0.5 h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {success}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {mode === 'signup' ? (
          <label className="auth-motion block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Full name</span>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="field-input"
              placeholder="Aarav Sharma"
            />
          </label>
        ) : null}

        <label className="auth-motion block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="field-input"
            placeholder="name@company.com"
          />
        </label>

        <label className="auth-motion block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Password</span>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => updateField('password', e.target.value)}
            className="field-input"
            placeholder="Enter a secure password"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="auth-motion btn-primary w-full py-3.5 text-sm"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Please wait…
            </>
          ) : (
            mode === 'login' ? 'Enter micro-link →' : 'Create account →'
          )}
        </button>
      </form>
    </div>
  );
}
