import { startTransition, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { fetchRecommendations, sendConnectionRequest } from '../lib/api';
import { getInitials, getAvatarGradient } from '../lib/format';

export default function NetworkRecommendations() {
  const [users, setUsers] = useState([]);
  const [requestedIds, setRequestedIds] = useState(() => new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const rootRef = useRef(null);

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const data = await fetchRecommendations();
        startTransition(() => { setUsers(data ?? []); });
      } catch (loadError) {
        console.error(loadError);
        setError(loadError.message || 'Could not load recommendations.');
      } finally {
        setLoading(false);
      }
    }
    loadRecommendations();
  }, []);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        '.recommend-card',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.07 }
      );
    }, rootRef);
    return () => context.revert();
  }, [users.length]);

  async function handleConnect(userId) {
    try {
      setError('');
      await sendConnectionRequest(userId);
      setRequestedIds((current) => {
        const next = new Set(current);
        next.add(userId);
        return next;
      });
    } catch (sendError) {
      console.error(sendError);
      setError(sendError.message || 'Unable to send request.');
    }
  }

  return (
    <section ref={rootRef} className="glass-panel rounded-4xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="display-kicker">Recommendations</p>
          <h2 className="mt-2.5 text-3xl font-black tracking-tight text-slate-950" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.045em' }}>
            People you may know
          </h2>
        </div>
        {!loading && (
          <div className="flex-shrink-0 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest">
            {users.length} found
          </div>
        )}
      </div>

      {loading ? (
        <div className="mt-6 flex items-center gap-3 text-sm text-slate-500">
          <div className="h-5 w-5 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
          Finding recommendation candidates…
        </div>
      ) : null}
      {error ? (
        <p className="mt-5 text-sm font-medium text-rose-600">{error}</p>
      ) : null}

      {!loading && !error && users.length === 0 ? (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-200 bg-white/60 p-7 text-center">
          <p className="text-sm text-slate-500">No recommendations available right now from the connection service.</p>
        </div>
      ) : null}

      {/* Cards */}
      <div className="mt-5 grid gap-3.5 md:grid-cols-2">
        {users.map((user) => {
          const requested = requestedIds.has(user.userId);
          const gradient = getAvatarGradient(user.userId);
          const initials = getInitials(user.name);

          return (
            <article key={user.userId} className="recommend-card glass-card rounded-[1.5rem] p-5 group">
              {/* User info */}
              <div className="flex items-center gap-3.5">
                <div
                  className="flex h-13 w-13 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-base font-black text-white shadow-md"
                  style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-base font-black tracking-tight text-slate-950" style={{ fontFamily: 'var(--font-display)' }}>
                    {user.name || `User ${user.userId}`}
                  </h3>
                  <p className="mt-0.5 text-xs font-medium text-slate-400">ID #{user.userId}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleConnect(user.userId)}
                disabled={requested}
                className={`
                  mt-4 w-full rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200
                  ${requested
                    ? 'border border-slate-200 bg-slate-50 text-slate-400 cursor-default'
                    : 'bg-slate-950 text-white hover:bg-gradient-to-r hover:from-teal-700 hover:to-teal-600 hover:scale-[1.02] active:scale-[0.98]'
                  }
                `}
              >
                {requested ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-3.5 h-3.5 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Request sent
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Connect
                  </span>
                )}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}