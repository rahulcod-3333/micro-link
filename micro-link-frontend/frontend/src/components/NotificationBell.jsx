import { startTransition, useEffect, useRef, useState } from 'react';
import { fetchNotifications } from '../lib/api';
import { hasToken } from '../lib/auth';
import { formatRelativeTime } from '../lib/format';

export default function NotificationBell() {
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const rootRef = useRef(null);

  useEffect(() => {
    if (!hasToken()) { setLoading(false); return; }

    async function loadNotifications() {
      setLoading(true);
      setError('');
      try {
        const data = await fetchNotifications();
        startTransition(() => {
          setNotifications(data ?? []);
        });
      } catch (error) {
        console.error(error);
        setError(error.message || 'Could not load notifications.');
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

if (!isMounted || !hasToken()) return null;
  const unread = notifications.length;

  return (
    <div ref={rootRef} className="relative">
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setOpen((c) => !c)}
        className={`
          relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200
          border bg-white/80 backdrop-blur-sm
          ${open
            ? 'border-teal-300 text-teal-700 bg-teal-50 shadow-sm'
            : 'border-slate-200 text-slate-600 hover:border-teal-200 hover:text-teal-700 hover:bg-teal-50/60'
          }
        `}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 h-[1.125rem] w-[1.125rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.4-1.4A2 2 0 0118 14.17V11a6 6 0 10-12 0v3.17c0 .53-.21 1.04-.59 1.41L4 17h5m6 0a3 3 0 11-6 0" />
        </svg>
        {unread > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-black text-white shadow-sm">
            {unread > 9 ? '9+' : unread}
          </span>
        ) : null}
      </button>

      {/* Dropdown */}
      {open ? (
        <div className="absolute right-0 mt-2.5 w-[21rem] overflow-hidden rounded-[1.5rem] border border-white/60 bg-white/97 shadow-2xl backdrop-blur-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-400">Notifications</p>
              <h3 className="mt-0.5 text-base font-black tracking-tight text-slate-950" style={{ fontFamily: 'var(--font-display)' }}>
                Activity inbox
              </h3>
            </div>
            {unread > 0 && (
              <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-600">
                {unread} new
              </span>
            )}
          </div>

          {/* Content */}
          <div className="max-h-[22rem] overflow-y-auto">
            {loading ? (
              <div className="flex items-center gap-3 px-5 py-6 text-sm text-slate-500">
                <div className="h-4 w-4 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
                Loading…
              </div>
            ) : null}

            {!loading && error ? (
              <div className="px-5 py-5 text-sm leading-6 text-rose-600">
                {error}
              </div>
            ) : null}

            {!loading && !error && notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-5 py-8 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
                  <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-sm text-slate-500">No notifications yet.</p>
              </div>
            ) : null}

            {!loading && notifications.map((notification, index) => (
              <div key={notification.id ?? index} className="group border-b border-slate-50 px-5 py-4 last:border-b-0 hover:bg-teal-50/40 transition-colors">
                <p className="text-sm leading-6 text-slate-700">{notification.message}</p>
                <p className="mt-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {formatRelativeTime(notification.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
