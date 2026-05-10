import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { getCurrentUser } from '../lib/auth';
import { getAvatarGradient } from '../lib/format';
import { 
  fetchConnections, 
  fetchRecommendations, 
  fetchReceivedRequest, 
  fetchSentRequest,
  sendConnectionRequest,
  acceptConnectionRequest 
} from '../lib/api';

async function apiGet(path) {
  const token = localStorage.getItem('micro_link_token');
  const res = await fetch(`http://localhost:8081${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
async function apiPost(path, body = {}) {
  const token = localStorage.getItem('micro_link_token');
  const res = await fetch(`http://localhost:8081${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

const Icons = {
  Grid:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Lock:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>,
  Close:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
  Users:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>,
  Heart:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>,
  Comment: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"/></svg>,
  UserAdd: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"/></svg>,
  Check:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>,
  Back:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>,
};

function Avatar({ name, userId, size = 'md', className = '' }) {
  const g = getAvatarGradient(userId);
  const sz = { xs:'w-8 h-8 text-xs', sm:'w-10 h-10 text-sm', md:'w-12 h-12 text-base', lg:'w-16 h-16 text-xl', xl:'w-24 h-24 text-3xl' }[size];
  return (
    <div className={`${sz} ${className} rounded-full flex items-center justify-center font-black text-white flex-shrink-0`}
      style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}>
      {(name || 'U').charAt(0).toUpperCase()}
    </div>
  );
}

function UserProfileModal({ user, isConnected, onConnect, onClose , isRequested }) {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [localRequested, setLocalRequested] = useState(isRequested);
  const modalRef = useRef(null);
  const displayName = user.name || user.email?.split('@')[0] || `User ${user.userId ?? user.id}`;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    gsap.fromTo(modalRef.current,
      { opacity: 0, scale: 0.96, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out' }
    );
  if (isConnected) fetchPosts();    
  return () => { document.body.style.overflow = ''; };
  }, [isConnected]);

  async function fetchPosts() {
    setLoading(true);
    try {
      const data = await apiGet(`/api/v1/posts/core/users/${user.userId ?? user.id}/allPosts`);
      setPosts(Array.isArray(data) ? data : []);
    } catch { setPosts([]); }
    finally { setLoading(false); }
  }

  async function handleConnect() {
    setConnecting(true);
    try {
      await onConnect(user);
      setLocalRequested(true);
    } catch {}
    finally { setConnecting(false); }
  }

  const g = getAvatarGradient(user.userId ?? user.id);

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={modalRef} className="modal-sheet">

        <div className="modal-header">
          <button className="modal-back-btn" onClick={onClose}><Icons.Back /></button>
          <span className="modal-header-name">{displayName}</span>
          <div className="w-8" />
        </div>

        <div className="modal-profile-section">
          <div className="modal-cover" style={{ background: `linear-gradient(135deg, ${g.from}33, ${g.to}22)` }} />

          <div className="modal-profile-body">
            <div className="modal-avatar-row">
                <Avatar name={displayName} userId={user.userId ?? user.id} size="xl" className="modal-avatar-ring" /> 
                {isConnected ? (
                    <span className="modal-connected-badge"><Icons.Check /> Connected</span>
                  ) : localRequested ? (
                    <span className="modal-connected-badge text-slate-500 bg-slate-100 border-slate-200"><Icons.Check /> Request Sent</span>
                  ) : (
                    <button className="modal-connect-btn" onClick={handleConnect} disabled={connecting}>
                      {connecting ? <div className="btn-spinner" /> : <><Icons.UserAdd /> Connect</>}
                    </button>
                  )}
            </div>

            <p className="modal-useremail">{user.name}</p>
            <p>Connect with {user.name ?? 'this user'} to see their posts.</p>

            <div className="modal-stats-row">
              <div className="modal-stat">
                <span className="modal-stat-num">{posts.length}</span>
                <span className="modal-stat-label">Posts</span>
              </div>
              <div className="modal-stat-divider" />
              <div className="modal-stat">
                <span className="modal-stat-num">{isConnected ? '1st' : '—'}</span>
                <span className="modal-stat-label">Degree</span>
              </div>
              <div className="modal-stat-divider" />
              <div className="modal-stat">
                <span className="modal-stat-num">Active</span>
                <span className="modal-stat-label">Status</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-tab-bar">
          <div className="modal-tab active"><Icons.Grid /> <span>Posts</span></div>
        </div>

        <div className="modal-posts-area">
          {!isConnected ? ( 
            <div className="private-wall">
              <div className="private-icon"><Icons.Lock /></div>
              <h3>This account is private</h3>
              <p>Connect with {displayName} to see their posts.</p>
              {!localRequested && (
                <button className="private-connect-btn" onClick={handleConnect} disabled={connecting}>
                  {connecting ? 'Sending…' : 'Send Connection Request'}
                </button>
              )}
            </div>

          
          ) : loading ? (
            <div className="modal-loading"><div className="feed-spinner" /></div>
          ) : posts.length === 0 ? (
            <div className="modal-empty">
              <p className="text-4xl mb-3">📸</p>
              <p className="font-bold text-slate-900">No posts yet</p>
              <p className="text-sm text-slate-400 mt-1">When they share posts, they'll appear here.</p>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <div key={post.id} className="post-tile" onClick={() => setSelectedPost(post)}>
                  {post.imageUrl ? (
                    <img src={post.imageUrl} alt="" className="post-tile-img" />
                  ) : (
                    <div className="post-tile-text" style={{ background: `linear-gradient(135deg, ${g.from}22, ${g.to}33)` }}>
                      <p>{post.content?.slice(0, 60)}{post.content?.length > 60 ? '…' : ''}</p>
                    </div>
                  )}
                  <div className="post-tile-overlay">
                    <span><Icons.Heart /> {post.likes ?? 0}</span>
                    <span><Icons.Comment /> {post.comments ?? 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedPost && (
          <div className="lightbox" onClick={() => setSelectedPost(null)}>
            <div className="lightbox-card" onClick={e => e.stopPropagation()}>
              <button className="lightbox-close" onClick={() => setSelectedPost(null)}><Icons.Close /></button>
              <div className="lightbox-header">
                <Avatar name={user.email} userId={user.userId ?? user.id} size="sm" />
                <div>
                  <p className="font-bold text-sm text-slate-900">{user.email?.split('@')[0]}</p>
                  <p className="text-xs text-slate-400">{selectedPost.createdAt ? new Date(selectedPost.createdAt).toLocaleDateString() : ''}</p>
                </div>
              </div>
              {selectedPost.imageUrl && <img src={selectedPost.imageUrl} alt="" className="lightbox-img" />}
              <p className="lightbox-content">{selectedPost.content}</p>
              <div className="lightbox-actions">
                <button className="lightbox-action-btn"><Icons.Heart /> <span>{selectedPost.likes ?? 0}</span></button>
                <button className="lightbox-action-btn"><Icons.Comment /> <span>{selectedPost.comments ?? 0}</span></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UserCard({ user, isConnected, isRequested, onOpen }) { 
  const g = getAvatarGradient(user.userId ?? user.id);
  const displayName = user.name || user.email?.split('@')[0] || `User ${user.userId ?? user.id}`;
  
  return (
    <div className="user-card" onClick={() => onOpen(user)}>
      <div className="user-card-cover" style={{ background: `linear-gradient(135deg, ${g.from}30, ${g.to}20)` }} />
      <div className="user-card-body">
        <div className="user-card-avatar-wrap">
          <div className={`user-card-avatar-ring ${isConnected ? 'connected' : ''}`}>
            <Avatar name={displayName} userId={user.userId ?? user.id} size="md" />
          </div>
          {isConnected && <div className="user-card-connected-dot" />}
        </div>
        <p className="user-card-name">{displayName}</p>
        <p className="user-card-email">{user.email || 'Connection'}</p>
        
        <span className={`user-card-badge ${isConnected ? 'connected' : isRequested ? 'requested' : 'suggest'}`}>
          {isConnected ? <><Icons.Check /> Connected</> : 
           isRequested ? <><Icons.Check /> Request Sent</> : 
           <><Icons.UserAdd /> Suggested</>}
        </span>
      </div>
    </div>
  );
}

export default function NetworkPage() {
  const [connections,     setConnections]     = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [requests,        setRequests]        = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [activeTab,       setActiveTab]       = useState('connections');
  const [search,          setSearch]          = useState('');
  const [selectedUser,    setSelectedUser]    = useState(null);
  const [connectedIds,    setConnectedIds]    = useState(new Set());
  const [sentRequestIds,  setSentRequestIds]  = useState(new Set());  


  const rootRef = useRef(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.net-motion',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.05 }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [connections.length, activeTab]);

  async function loadAll() {
    setLoading(true);
    try {
      const [conn, recs, reqs] = await Promise.allSettled([
        fetchConnections(),
        fetchRecommendations(),
        fetchReceivedRequest(),
        fetchSentRequest(),
      ]);
      const connList = conn.status === 'fulfilled' ? (conn.value ?? []) : [];
      console.log('connections raw:', connList);
      console.log('recommendations raw:', recs.value);
      setConnections(connList);
      setConnectedIds(new Set(connList.map(u => u.userId ?? u.id)));
      if (recs.status === 'fulfilled') setRecommendations(recs.value ?? []);
      if (reqs.status === 'fulfilled') setRequests(reqs.value ?? []);

      if (sentReqs.status === 'fulfilled') {
        const sentList = sentReqs.value ?? [];
        setSentRequestIds(new Set(sentList.map(u => u.userId ?? u.id)));
      }

    } catch {}
    finally { setLoading(false); }
  }

  async function handleConnect(user) {
    try {
      await sendConnectionRequest(user.userId ?? user.id);
      
      setSentRequestIds(prev => new Set([...prev, user.userId ?? user.id]));
    } catch (error) {
      console.error("Failed to send request", error);
    }
  }

  async function handleAccept(req) {
    try {
      await acceptConnectionRequest(req.userId ?? req.id);
      setRequests(prev => prev.filter(r => (r.userId ?? r.id) !== (req.userId ?? req.id)));
      setConnections(prev => [...prev, req]);
      setConnectedIds(prev => new Set([...prev, req.userId ?? req.id]));
    } catch (error) {
      console.error("Failed to accept request", error);
    }
  }

  const match = (u) => !search || (u.name ?? '').toLowerCase().includes(search.toLowerCase());

  const displayList = activeTab === 'connections'
    ? connections.filter(match)
    : activeTab === 'discover'
    ? recommendations.filter(match)
    : requests;

  return (
    <div ref={rootRef} className="net-root">

      <div className="net-motion net-banner">
        <div className="net-banner-bg" />
        <div className="net-banner-content">
          <Avatar name={currentUser?.email} userId={currentUser?.userId} size="lg" className="net-banner-avatar" />
          <div>
            <h1 className="net-banner-name">{currentUser?.email?.split('@')[0] ?? 'Your Network'}</h1>
            <p className="net-banner-sub">{currentUser?.email}</p>
          </div>
          <div className="net-banner-stats">
            <div className="net-stat"><span className="net-stat-num">{connections.length}</span><span className="net-stat-label">Connections</span></div>
            <div className="net-stat-div" />
            <div className="net-stat"><span className="net-stat-num">{recommendations.length}</span><span className="net-stat-label">Suggestions</span></div>
            <div className="net-stat-div" />
            <div className="net-stat"><span className="net-stat-num">{requests.length}</span><span className="net-stat-label">Requests</span></div>
          </div>
        </div>
      </div>

      <div className="net-motion net-controls">
        <div className="net-tabs">
          {[
            { key: 'connections', label: 'Connections', count: connections.length },
            { key: 'discover',    label: 'Discover',    count: recommendations.length },
            { key: 'requests',    label: 'Requests',    count: requests.length },
          ].map(t => (
            <button key={t.key} className={`net-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
              {t.label}
              {t.count > 0 && <span className="net-tab-badge">{t.count}</span>}
            </button>
          ))}
        </div>
        <div className="net-search-wrap">
          <svg className="net-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
          <input className="net-search" placeholder="Search people…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {activeTab === 'requests' && (
        <div className="net-motion requests-list">
          {requests.length === 0 && <div className="net-empty"><p>🤝</p><p>No pending requests</p></div>}
          {requests.map(req => (
            <div key={req.userId ?? req.id} className="request-row">
              <Avatar name={req.email} userId={req.userId ?? req.id} size="md" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-slate-900">{req.name ?? `User ${req.userId}`}</p>
                <p className="text-xs text-slate-400">{req.name}</p>
              </div>
              <div className="request-actions">
                <button className="req-accept-btn" onClick={() => handleAccept(req)}>Accept</button>
                <button className="req-decline-btn" onClick={() => setRequests(prev => prev.filter(r => (r.userId??r.id) !== (req.userId??req.id)))}>Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab !== 'requests' && (
        loading ? (
          <div className="net-loading"><div className="feed-spinner" /></div>
        ) : displayList.length === 0 ? (
          <div className="net-empty">
            <p className="text-4xl mb-2">{activeTab === 'connections' ? '👥' : '🔍'}</p>
            <p className="font-bold text-slate-900">{activeTab === 'connections' ? 'No connections yet' : 'No suggestions'}</p>
            <p className="text-sm text-slate-400 mt-1">{activeTab === 'connections' ? 'Start connecting with people.' : 'Check back later for recommendations.'}</p>
          </div>
        ) : ( 
          <div className="net-grid">
            {displayList.map((user, i) => (
              <div key={user.userId ?? user.id} className="net-motion" style={{ animationDelay: `${i * 0.04}s` }}>
                <UserCard
                  user={user}
                  isConnected={connectedIds.has(user.userId ?? user.id)}
                  isRequested={sentRequestIds.has(user.userId ?? user.id)} 
                  onOpen={setSelectedUser}
                />
              </div>
            ))}
          </div>
        )
      )}

      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          isConnected={connectedIds.has(selectedUser.userId ?? selectedUser.id)}
          isRequested={sentRequestIds.has(selectedUser.userId ?? selectedUser.id)}
          onConnect={handleConnect}
          onClose={() => setSelectedUser(null)}
        />
      )}

      <style>{`
        .net-root {
          font-family: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
          background: #f4f6fb;
          min-height: 100vh;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        /* Banner */
        .net-banner {
          position: relative;
          background: white;
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
        }
        .net-banner-bg {
          height: 100px;
          background: linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #f97316 100%);
        }
        .net-banner-content {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 0 1.75rem 1.5rem;
          flex-wrap: wrap;
        }
        .net-banner-avatar {
          margin-top: -2.5rem;
          ring: 4px solid white;
          box-shadow: 0 0 0 4px white;
          flex-shrink: 0;
        }
        .net-banner-name {
          font-size: 1.25rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.03em;
          margin-top: 0.5rem;
        }
        .net-banner-sub { font-size: 0.8rem; color: #94a3b8; }
        .net-banner-stats {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-left: auto;
          background: #f8fafc;
          border-radius: 1rem;
          padding: 0.75rem 1.25rem;
        }
        .net-stat { text-align: center; }
        .net-stat-num { display: block; font-size: 1.1rem; font-weight: 900; color: #0f172a; letter-spacing: -0.03em; }
        .net-stat-label { display: block; font-size: 0.65rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; }
        .net-stat-div { width: 1px; height: 28px; background: #e2e8f0; }

        /* Controls */
        .net-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .net-tabs { display: flex; gap: 0.375rem; background: white; border-radius: 999px; padding: 0.3rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .net-tab {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 1rem;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 700;
          border: none;
          background: transparent;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .net-tab.active { background: #0284c7; color: white; box-shadow: 0 2px 10px rgba(2,132,199,0.3); }
        .net-tab:not(.active):hover { background: #e0f2fe; color: #0284c7; }
        .net-tab-badge {
          background: #f97316;
          color: white;
          font-size: 0.6rem;
          font-weight: 800;
          padding: 0.1rem 0.4rem;
          border-radius: 999px;
          line-height: 1.4;
        }
        .net-tab.active .net-tab-badge { background: rgba(255,255,255,0.3); }
        .net-search-wrap { position: relative; }
        .net-search-icon { position: absolute; left: 0.875rem; top: 50%; transform: translateY(-50%); width: 15px; height: 15px; color: #94a3b8; pointer-events: none; }
        .net-search {
          padding: 0.6rem 1rem 0.6rem 2.4rem;
          border: 1.5px solid #f0f2f8;
          border-radius: 999px;
          background: white;
          font-size: 0.83rem;
          color: #0f172a;
          outline: none;
          font-family: inherit;
          width: 220px;
          transition: border-color 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .net-search:focus { border-color: #0284c7; }
        .net-search::placeholder { color: #cbd5e1; }

        /* Grid */
        .net-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1rem;
        }

        /* User Card */
        .user-card {
          background: white;
          border-radius: 1.25rem;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          border: 1.5px solid transparent;
        }
        .user-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(2,132,199,0.15); border-color: #bae6fd; }
        .user-card-cover { height: 56px; }
        .user-card-body { padding: 0 1rem 1rem; display: flex; flex-direction: column; align-items: center; text-align: center; }
        .user-card-avatar-wrap { position: relative; margin-top: -1.5rem; }
        .user-card-avatar-ring { border-radius: 50%; padding: 2px; background: white; }
        .user-card-avatar-ring.connected { background: linear-gradient(135deg, #0284c7, #10b981); padding: 2.5px; }
        .user-card-connected-dot {
          position: absolute;
          bottom: 2px; right: 2px;
          width: 12px; height: 12px;
          background: #10b981;
          border-radius: 50%;
          border: 2px solid white;
        }
        .user-card-name { font-size: 0.85rem; font-weight: 800; color: #0f172a; margin-top: 0.6rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
        .user-card-email { font-size: 0.68rem; color: #94a3b8; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
        .user-card-badge {
          margin-top: 0.625rem;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
          font-size: 0.68rem;
          font-weight: 700;
        }
        .user-card-badge.connected { background: #f0fdf4; color: #16a34a; }
        .user-card-badge.suggest  { background: #fff7ed; color: #f97316; }

        /* Requests */
        .requests-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .request-row {
          background: white;
          border-radius: 1.125rem;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .request-actions { display: flex; gap: 0.5rem; }
        .req-accept-btn  { padding: 0.4rem 0.875rem; background: #0284c7; color: white; border: none; border-radius: 999px; font-size: 0.75rem; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.18s; }
        .req-accept-btn:hover  { background: #0369a1; }
        .req-decline-btn { padding: 0.4rem 0.875rem; background: #f8fafc; color: #94a3b8; border: none; border-radius: 999px; font-size: 0.75rem; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.18s; }
        .req-decline-btn:hover { background: #fee2e2; color: #e11d48; }

        /* States */
        .net-loading { display: flex; justify-content: center; align-items: center; padding: 4rem; }
        .net-empty { text-align: center; padding: 4rem 2rem; background: white; border-radius: 1.5rem; }
        .feed-spinner { width: 36px; height: 36px; border-radius: 50%; border: 2.5px solid #e2e8f0; border-top-color: #0284c7; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Modal ── */
        .modal-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(6px);
          z-index: 1000;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        @media (min-width: 640px) {
          .modal-backdrop { align-items: center; }
        }
        .modal-sheet {
          background: white;
          border-radius: 1.5rem 1.5rem 0 0;
          width: 100%;
          max-width: 520px;
          max-height: 92vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 640px) {
          .modal-sheet { border-radius: 1.5rem; max-height: 88vh; }
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #f0f2f8;
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
          border-radius: 1.5rem 1.5rem 0 0;
        }
        .modal-back-btn { width: 32px; height: 32px; border-radius: 50%; border: none; background: #f8fafc; color: #64748b; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.18s; }
        .modal-back-btn:hover { background: #e0f2fe; color: #0284c7; }
        .modal-header-name { font-size: 0.95rem; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }

        .modal-profile-section { position: relative; }
        .modal-cover { height: 90px; }
        .modal-profile-body { padding: 0 1.5rem 1.25rem; }
        .modal-avatar-row { display: flex; align-items: flex-end; justify-content: space-between; margin-top: -2rem; margin-bottom: 0.75rem; }
        .modal-avatar-ring { box-shadow: 0 0 0 4px white; }
        .modal-connected-badge { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.45rem 1rem; background: #f0fdf4; color: #16a34a; border-radius: 999px; font-size: 0.78rem; font-weight: 700; }
        .modal-connect-btn {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.5rem 1.25rem;
          background: #0284c7; color: white;
          border: none; border-radius: 999px;
          font-size: 0.82rem; font-weight: 700;
          cursor: pointer; font-family: inherit;
          box-shadow: 0 4px 14px rgba(2,132,199,0.35);
          transition: all 0.2s;
        }
        .modal-connect-btn:hover { background: #0369a1; transform: translateY(-1px); }
        .modal-connect-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-spinner { width: 14px; height: 14px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; animation: spin 0.6s linear infinite; }

        .modal-username { font-size: 1.2rem; font-weight: 900; color: #0f172a; letter-spacing: -0.03em; }
        .modal-useremail { font-size: 0.78rem; color: #94a3b8; margin-top: 2px; }
        .modal-stats-row { display: flex; align-items: center; gap: 1.5rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #f0f2f8; }
        .modal-stat { text-align: center; }
        .modal-stat-num { display: block; font-size: 1.05rem; font-weight: 900; color: #0f172a; }
        .modal-stat-label { display: block; font-size: 0.65rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; margin-top: 1px; }
        .modal-stat-divider { width: 1px; height: 28px; background: #f0f2f8; }

        .modal-tab-bar { display: flex; border-top: 1px solid #f0f2f8; border-bottom: 1px solid #f0f2f8; }
        .modal-tab { display: flex; align-items: center; gap: 0.4rem; padding: 0.75rem 1.5rem; font-size: 0.82rem; font-weight: 700; color: #0284c7; border-bottom: 2px solid #0284c7; cursor: pointer; }

        .modal-posts-area { padding: 1rem; flex: 1; }
        .modal-loading, .modal-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; gap: 0.5rem; }

        /* Private wall */
        .private-wall {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 3rem 2rem; text-align: center; gap: 0.75rem;
        }
        .private-icon {
          width: 64px; height: 64px;
          border-radius: 50%;
          background: #e0f2fe;
          display: flex; align-items: center; justify-content: center;
          color: #0284c7;
          margin-bottom: 0.5rem;
        }
        .private-wall h3 { font-size: 1.05rem; font-weight: 800; color: #0f172a; }
        .private-wall p  { font-size: 0.85rem; color: #64748b; max-width: 260px; line-height: 1.6; }
        .private-connect-btn {
          margin-top: 0.5rem;
          padding: 0.65rem 1.5rem;
          background: #0284c7; color: white;
          border: none; border-radius: 999px;
          font-size: 0.85rem; font-weight: 700;
          cursor: pointer; font-family: inherit;
          box-shadow: 0 4px 14px rgba(2,132,199,0.3);
          transition: all 0.2s;
        }
        .private-connect-btn:hover { background: #0369a1; }

        /* Instagram post grid */
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3px;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        .post-tile {
          aspect-ratio: 1;
          position: relative;
          cursor: pointer;
          overflow: hidden;
          background: #f8fafc;
        }
        .post-tile:hover .post-tile-overlay { opacity: 1; }
        .post-tile-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .post-tile:hover .post-tile-img { transform: scale(1.05); }
        .post-tile-text {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          padding: 0.75rem;
          font-size: 0.72rem;
          color: #475569;
          line-height: 1.5;
          text-align: center;
        }
        .post-tile-overlay {
          position: absolute; inset: 0;
          background: rgba(2,132,199,0.75);
          display: flex; align-items: center; justify-content: center;
          gap: 1.25rem;
          opacity: 0;
          transition: opacity 0.2s;
          color: white;
          font-size: 0.82rem;
          font-weight: 700;
        }
        .post-tile-overlay span { display: flex; align-items: center; gap: 0.3rem; }

        /* Lightbox */
        .lightbox {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.8);
          z-index: 2000;
          display: flex; align-items: center; justify-content: center;
          padding: 1.5rem;
        }
        .lightbox-card {
          background: white;
          border-radius: 1.25rem;
          max-width: 420px;
          width: 100%;
          overflow: hidden;
          position: relative;
          max-height: 90vh;
          overflow-y: auto;
        }
        .lightbox-close {
          position: absolute; top: 0.75rem; right: 0.75rem;
          width: 30px; height: 30px;
          border-radius: 50%;
          background: rgba(0,0,0,0.06);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #64748b; z-index: 10;
          transition: background 0.18s;
        }
        .lightbox-close:hover { background: #fee2e2; color: #e11d48; }
        .lightbox-header { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.25rem; }
        .lightbox-img { width: 100%; max-height: 360px; object-fit: cover; }
        .lightbox-content { padding: 1rem 1.25rem; font-size: 0.875rem; color: #334155; line-height: 1.6; }
        .lightbox-actions {
          display: flex; gap: 1rem; padding: 0.75rem 1.25rem;
          border-top: 1px solid #f0f2f8;
        }
        .lightbox-action-btn {
          display: flex; align-items: center; gap: 0.375rem;
          background: none; border: none; cursor: pointer;
          color: #64748b; font-size: 0.82rem; font-weight: 600;
          transition: color 0.18s; font-family: inherit;
        }
        .lightbox-action-btn:hover { color: #0284c7; }

        @media (max-width: 640px) {
          .net-root { padding: 1rem; }
          .net-banner-stats { display: none; }
          .net-controls { flex-direction: column; align-items: stretch; }
          .net-search { width: 100%; }
          .net-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
        }
      `}</style>
    </div>
  );
}