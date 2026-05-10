import { useState } from 'react';
import { createPost } from '../lib/api';

const MAX_CHARS = 280;

export default function CreatePostBox({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const charCount = content.trim().length;
  const charPct = Math.min(charCount / MAX_CHARS, 1);
  const charColor = charPct > 0.9 ? '#ef4444' : charPct > 0.75 ? '#f97316' : '#0f766e';

  async function handleSubmit(event) {
    event.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError('');

    try {
      await createPost(content.trim());
      setContent('');
      onPostCreated?.();
    } catch (submitError) {
      console.error(submitError);
      setError(submitError.message || 'Unable to publish post.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="glass-panel rounded-[2rem] p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700" style={{ fontFamily: 'var(--font-body)' }}>Compose</p>
          <h2 className="mt-1.5 text-2xl font-black tracking-tight text-slate-950" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.04em' }}>
            Share a sharp update
          </h2>
        </div>

        {/* Circular char counter */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-0.5">
          <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
            <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(34,39,54,0.08)" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="14" fill="none"
              stroke={charColor}
              strokeWidth="3"
              strokeDasharray={`${charPct * 88} 88`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.2s ease, stroke 0.2s ease' }}
            />
          </svg>
          <span className="text-[0.65rem] font-semibold text-slate-400 tabular-nums">
            {MAX_CHARS - charCount}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <textarea
          rows="4"
          maxLength={MAX_CHARS}
          value={content}
          disabled={loading}
          onChange={(event) => setContent(event.target.value)}
          placeholder="What did you ship, learn, or notice today?"
          className="w-full resize-none rounded-[1.5rem] border border-slate-200 bg-white/90 px-4 py-4 text-sm leading-7 text-slate-900 outline-none transition-all duration-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-100 placeholder:text-slate-400"
          style={{ fontFamily: 'var(--font-body)' }}
        />

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-400 leading-5 hidden sm:block">
            Posts are tied to your user ID from the JWT.
          </p>
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="btn-primary ml-auto"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Publishing…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Publish post
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}