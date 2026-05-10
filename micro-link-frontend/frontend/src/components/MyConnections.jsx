import { startTransition, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { fetchConnections } from '../lib/api';
import { getInitials, getAvatarGradient } from '../lib/format';

export default function MyConnections() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const rootRef = useRef(null);

  useEffect(() => {
    async function loadConnections() {
      try {
        const data = await fetchConnections();
        startTransition(() => { setConnections(data ?? []); });
      } catch (loadError) {
        console.error(loadError);
        setError(loadError.message || 'Could not load connections.');
      } finally {
        setLoading(false);
      }
    }
    loadConnections();
  }, []);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        '.connection-card',
        { opacity: 0, x: -14 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06 }
      );
    }, rootRef);
    return () => context.revert();
  }, [connections.length]);

  return (
    <section ref={rootRef} className="glass-panel rounded-[2rem] p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-kicker">Connections</p>
          <h2 className="mt-2.5 text-3xl font-black tracking-tight text-slate-950" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.045em' }}>
            First-degree network
          </h2>
        </div>
        {!loading && (
          <div className="flex-shrink-0 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest">
            {connections.length} total
          </div>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="mt-6 flex items-center gap-3 text-sm text-slate-500">
          <div className="h-5 w-5 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
          Loading graph connections…
        </div>
      ) : null}

      {/* Error */}
      {error ? <p className="mt-5 text-sm font-medium text-rose-600">{error}</p> : null}

      {/* Empty */}
      {!loading && !error && connections.length === 0 ? (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-200 bg-white/60 p-7 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50">
            <svg className="h-5 w-5 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-sm text-slate-500">No connections yet. Use recommendations to send your first request.</p>
        </div>
      ) : null}

      {/* Connection List */}
      <div className="mt-5 space-y-3">
        {connections.map((person) => {
          const gradient = getAvatarGradient(person.userId);
          const initials = getInitials(person.name);

          return (
            <article key={person.userId} className="connection-card glass-card flex items-center gap-4 rounded-[1.5rem] p-4 group">
              {/* Avatar */}
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-base font-black text-white shadow-sm transition-transform duration-200 group-hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
              >
                {initials}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-black tracking-tight text-slate-950" style={{ fontFamily: 'var(--font-display)' }}>
                  {person.name || `User ${person.userId}`}
                </h3>
                <p className="mt-0.5 text-xs font-medium text-slate-400">ID #{person.userId}</p>
              </div>

              {/* Badge */}
              <span className="flex-shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-emerald-700">
                1st
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}