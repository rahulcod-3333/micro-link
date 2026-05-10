import { startTransition, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { fetchFeedPosts, fetchConnections, fetchRecommendations, fetchReceivedRequest } from '../lib/api';
import { clearAuthTokens, getCurrentUser } from '../lib/auth';
import { formatRelativeTime, getAvatarGradient } from '../lib/format';
import CreatePostBox from './CreatePostBox';
import PostCards from './PostCards';

const STORIES = [
  { id: 1, name: 'Add Story', isAdd: true },
  
];

const SUGGESTIONS = [];

const REQUESTS = [];

// async function requests(){
//   const data = await send
// }

const NAV_ITEMS = [
  { icon: HomeIcon,      label: 'Feed',        href: '/',        active: true  },
  { icon: NetworkIcon,   label: 'Network',     href: '/network', active: false },
  { icon: CommunityIcon, label: 'Community',   href: '#',        active: false },
  { icon: ChatIcon,      label: 'Messages',    href: '#',        active: false },
  { icon: ExploreIcon,   label: 'Explore',     href: '/',        active: false },
];

function HomeIcon()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>; }
function NetworkIcon()   { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>; }
function CommunityIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>; }
function ExploreIcon()   { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>; }
function ChatIcon()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/></svg>; }
function SettingsIcon()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>; }
function LogoutIcon()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>; }
function RefreshIcon()   { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>; }

function Avatar({ name, color, size = 'md' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-black text-white flex-shrink-0`}
      style={{ background: `linear-gradient(135deg, ${color[0]}, ${color[1]})` }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function LiveFeed() {
  const [posts, setPosts] = useState([]);
  const [connections, setConnections] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [request, setRequestes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [tab, setTab]         = useState('popular');
  const rootRef               = useRef(null);

  const currentUser           = getCurrentUser();
  const gradient              = getAvatarGradient(currentUser?.userId);
  const emailInitial          = currentUser?.email?.charAt(0)?.toUpperCase() ?? 'U';


  function handleLogout() {
    clearAuthTokens();
    window.location.href = '/login';
  }

  async function loadPosts() {
    setLoading(true); 
    setError('');
    try {
      const data = await fetchFeedPosts(); 
      console.log("Feed Data:", data); 
      startTransition(() => {
        setPosts([...(data ?? [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      });
    } catch (e) {
      setError(e.message || 'Could not load posts.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
    loadConnections();
    loadSidebarData();
  }, []);

  async function loadConnections() {
    try {
      const data = await fetchConnections();
      console.log(data);
      setConnections(data || []);
    }
    catch (error) {
      console.error("Failed to load connections:", error);
    }
  }

  async function loadSidebarData() {
    try {
      const [recommendationData, requestData] = await Promise.all([
        fetchRecommendations(),
        fetchReceivedRequest()
      ]);
      setSuggestions(recommendationData || []);
      setRequestes(requestData || []);
    }
    catch (err) {
      console.error("Failed to fetch Suggestions", err);
    }
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.feed-motion',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06 }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [posts.length]);

  return (
    <div ref={rootRef} className="feed-layout">


      <aside className="feed-sidebar">
        

        <div className="feed-motion sidebar-logo">
          <div className="logo-orb" />
          <span>micro-link</span>
        </div>
        

        <div className="feed-motion sidebar-profile">
          <div
            className="sidebar-avatar"
            style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
          >
            {emailInitial}
          </div>
        
        </div>


        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ icon: Icon, label, active, href }) => (
            <a href={href} key={label} className={`feed-motion sidebar-nav-item ${active ? 'active' : ''}`}>
              <Icon />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-divider" />


        <button className="feed-motion sidebar-nav-item text-slate-400">
          <SettingsIcon />
          <span>Settings</span>
        </button>
        
        <button onClick={handleLogout} className="feed-motion sidebar-nav-item text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition">
          <LogoutIcon />
          <span>Sign Out</span>
        </button>
      </aside>


      <main className="feed-main">


        <div className="feed-motion feed-searchbar">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
          </svg>
          <input type="text" placeholder="Search…" className="search-input" />
        </div>


        <section className="feed-motion feed-stories-section">
          <h3 className="feed-section-label">Connections</h3>
          <div className="stories-row">
            

            <div className="story-item">
              <div className="story-add-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-[#6d28d9]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                </svg>
              </div>
              <span className="story-name">Add story</span>
            </div>


            {connections.map((friend) => {
              // Generate a dynamic gradient based on their ID or Name length so everyone looks unique
              const colorId = (friend.userId || friend.id || 0) % 5;
              const gradients = [
                ['#f43f5e', '#fb7185'], // Rose
                ['#8b5cf6', '#a78bfa'], // Purple
                ['#0ea5e9', '#38bdf8'], // Blue
                ['#f59e0b', '#fcd34d'], // Amber
                ['#10b981', '#34d399'], // Emerald
              ];
              const bgColors = gradients[colorId];


              const friendName = friend.name || friend.username || friend.email?.split('@')[0] || 'User';

              return (
                <div key={friend.userId || friend.id} className="story-item">
                  <div className="story-ring">
                    <div
                      className="story-avatar"
                      style={{ background: `linear-gradient(135deg, ${bgColors[0]}, ${bgColors[1]})` }}
                    >
                      {friendName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <span className="story-name">{friendName}</span>
                </div>
              );
            })}

          </div>
        </section>


        <div className="feed-motion">
          <CreatePostBox onPostCreated={loadPosts} />
        </div>


        <div className="feed-motion feed-header-row">
          <h2 className="feed-title">Feeds</h2>
          <div className="feed-tabs">
            <button className={`feed-tab ${tab === 'popular' ? 'active' : ''}`} onClick={() => setTab('popular')}>Popular</button>
            <button className={`feed-tab ${tab === 'latest'  ? 'active' : ''}`} onClick={() => setTab('latest')}>Latest</button>
            <button className="feed-refresh-btn" onClick={loadPosts} title="Refresh">
              <RefreshIcon />
            </button>
          </div>
        </div>


        {error && (
          <div className="feed-motion feed-error">{error}</div>
        )}


        {loading && (
          <div className="feed-motion feed-loading">
            <div className="feed-spinner" />
            <p>Loading posts…</p>
          </div>
        )}


        {!loading && posts.length === 0 && !error && (
          <div className="feed-motion feed-empty">
            <div className="feed-empty-icon">📝</div>
            <h3>No posts yet</h3>
            <p>Publish your first update to bring this stream to life.</p>
          </div>
        )}


        {!loading && posts.map((post) => (
          <div key={post.id} className="feed-motion">
            <PostCards post={post} />
          </div>
        ))}
      </main>


      <aside className="feed-right">


        <div className="feed-motion right-active-card">
          <div className="right-active-avatars">
            {['#f43f5e','#8b5cf6','#0ea5e9','#10b981','#f59e0b'].map((c, i) => (
              <div key={i} className="right-mini-avatar" style={{ background: c, zIndex: 5 - i, marginLeft: i === 0 ? 0 : '-8px' }} />
            ))}
          </div>
          <div>
            <p className="right-active-num">184.3K</p>
            <p className="right-active-label">Active now on your profile</p>
          </div>
        </div>


        <div className="feed-motion right-section">
          <div className="right-section-header">
            <h4>Requests <span className="right-badge">{request.length}</span></h4>
          </div>
          
          {request.length === 0 && (
             <p className="text-xs text-slate-400">No pending requests.</p>
          )}

          {request.map((req) => {
            const friendName = req.name || req.username || `User ${req.userId}`;
            const colors = getAvatarGradient(req.userId); // Reusing your format.js function!

            return (
              <div key={req.userId} className="right-request-item">
                <Avatar name={friendName} color={[colors.from, colors.to]} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="right-item-name">{friendName}</p>
                  <p className="right-item-sub truncate">wants to connect</p>
                  <div className="right-request-actions">
                    <button 
                      onClick={() => {/* Add your accept logic here */}} 
                      className="btn-accept"
                    >Accept</button>
                    <button 
                      onClick={() => {/* Add your decline logic here */}} 
                      className="btn-decline"
                    >Decline</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>


        <div className="feed-motion right-section">
          <div className="right-section-header">
            <h4>Suggestions for you</h4>
            <button className="right-view-all">View All</button>
          </div>

          {suggestions.length === 0 && (
             <p className="text-xs text-slate-400">Check back later for more!</p>
          )}

          {suggestions.map((sug) => {
            const friendName = sug.name || sug.username || `User ${sug.userId}`;
            const colors = getAvatarGradient(sug.userId);

            return (
              <div key={sug.userId} className="right-suggestion-item">
                <Avatar name={friendName} color={[colors.from, colors.to]} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="right-item-name">{friendName}</p>
                  <p className="right-item-sub">Suggested</p>
                </div>
                <button className="btn-follow" title="Connect">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"/>
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

      </aside>

      <style>{`
        .feed-layout {
          display: grid;
          grid-template-columns: 220px 1fr 260px;
          gap: 0;
          min-height: 100vh;
          background: #f4f6fb;
          font-family: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
        }

        /* ── Left Sidebar ── */
        .feed-sidebar {
          background: white;
          border-right: 1px solid #f0f2f8;
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0 0.5rem;
          margin-bottom: 1.25rem;
          font-size: 0.9rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }
        .logo-orb {
          width: 22px; height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6d28d9, #c026d3);
          flex-shrink: 0;
        }
        .sidebar-profile {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.625rem 0.75rem;
          border-radius: 1rem;
          background: #f8fafc;
          margin-bottom: 1rem;
        }
        .sidebar-avatar {
          width: 36px; height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 0.85rem;
          color: white;
          flex-shrink: 0;
        }
        .sidebar-profile-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: #0f172a;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .sidebar-profile-posts {
          font-size: 0.68rem;
          color: #94a3b8;
          margin-top: 1px;
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
          flex: 1;
        }
        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.625rem 0.75rem;
          border-radius: 0.875rem;
          font-size: 0.82rem;
          font-weight: 600;
          color: #64748b;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.18s ease;
          width: 100%;
          text-align: left;
          text-decoration: none;
        }
        .sidebar-nav-item:hover { background: #f8fafc; color: #0f172a; }
        .sidebar-nav-item.active { background: #f3f0ff; color: #6d28d9; }
        .sidebar-nav-item.active svg { stroke: #6d28d9; }
        .sidebar-divider { height: 1px; background: #f0f2f8; margin: 0.75rem 0.5rem; }

        /* ── Center Main ── */
        .feed-main {
          padding: 1.5rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          max-width: 680px;
          width: 100%;
          margin: 0 auto;
        }
        .feed-searchbar {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 1rem;
          width: 16px; height: 16px;
          color: #94a3b8;
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          padding: 0.7rem 1rem 0.7rem 2.5rem;
          background: white;
          border: 1.5px solid #f0f2f8;
          border-radius: 999px;
          font-size: 0.85rem;
          color: #0f172a;
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .search-input:focus { border-color: #6d28d9; }
        .search-input::placeholder { color: #cbd5e1; }

        /* Stories */
        .feed-stories-section { background: white; border-radius: 1.25rem; padding: 1.25rem 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
        .feed-section-label { font-size: 1rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem; letter-spacing: -0.02em; }
        .stories-row { display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 0.25rem; scrollbar-width: none; }
        .stories-row::-webkit-scrollbar { display: none; }
        .story-item { display: flex; flex-direction: column; align-items: center; gap: 0.4rem; flex-shrink: 0; cursor: pointer; }
        .story-add-btn {
          width: 56px; height: 56px;
          border-radius: 50%;
          border: 2px dashed #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #faf5ff;
          transition: border-color 0.2s;
        }
        .story-add-btn:hover { border-color: #6d28d9; }
        .story-ring {
          width: 60px; height: 60px;
          border-radius: 50%;
          padding: 2.5px;
          background: linear-gradient(135deg, #6d28d9, #c026d3, #0ea5e9);
        }
        .story-avatar {
          width: 100%; height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1.1rem;
          color: white;
          border: 2.5px solid white;
        }
        .story-name { font-size: 0.68rem; font-weight: 600; color: #64748b; max-width: 56px; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        /* Feed header */
        .feed-header-row { display: flex; align-items: center; justify-content: space-between; }
        .feed-title { font-size: 1.35rem; font-weight: 900; color: #0f172a; letter-spacing: -0.03em; }
        .feed-tabs { display: flex; align-items: center; gap: 0.375rem; }
        .feed-tab {
          padding: 0.35rem 0.875rem;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.18s ease;
          background: transparent;
          color: #94a3b8;
        }
        .feed-tab.active { background: #6d28d9; color: white; box-shadow: 0 2px 8px rgba(109,40,217,0.3); }
        .feed-tab:not(.active):hover { background: #f3f0ff; color: #6d28d9; }
        .feed-refresh-btn {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: none;
          background: white;
          color: #94a3b8;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          transition: all 0.18s ease;
          margin-left: 0.25rem;
        }
        .feed-refresh-btn:hover { color: #6d28d9; transform: rotate(180deg); }

        /* States */
        .feed-error { background: #fff1f2; border: 1px solid #fecdd3; color: #e11d48; border-radius: 1rem; padding: 1rem 1.25rem; font-size: 0.85rem; font-weight: 500; }
        .feed-loading { background: white; border-radius: 1.25rem; padding: 3rem; text-align: center; box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
        .feed-spinner { width: 36px; height: 36px; border-radius: 50%; border: 2.5px solid #e2e8f0; border-top-color: #6d28d9; animation: spin 0.7s linear infinite; margin: 0 auto 1rem; }
        .feed-loading p { color: #94a3b8; font-size: 0.85rem; }
        .feed-empty { background: white; border-radius: 1.25rem; padding: 3rem; text-align: center; box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
        .feed-empty-icon { font-size: 2.5rem; margin-bottom: 1rem; }
        .feed-empty h3 { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; }
        .feed-empty p { color: #94a3b8; font-size: 0.85rem; line-height: 1.6; }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Right Sidebar ── */
        .feed-right {
          background: white;
          border-left: 1px solid #f0f2f8;
          padding: 1.5rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }

        .right-active-card {
          background: linear-gradient(135deg, #1e1b4b, #4c1d95);
          border-radius: 1.25rem;
          padding: 1rem 1.125rem;
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }
        .right-active-avatars { display: flex; align-items: center; }
        .right-mini-avatar { width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; flex-shrink: 0; }
        .right-active-num { font-size: 1rem; font-weight: 900; color: white; letter-spacing: -0.03em; }
        .right-active-label { font-size: 0.68rem; color: rgba(255,255,255,0.6); margin-top: 1px; line-height: 1.4; }

        .right-section { display: flex; flex-direction: column; gap: 0.75rem; }
        .right-section-header { display: flex; align-items: center; justify-content: space-between; }
        .right-section-header h4 { font-size: 0.85rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 0.4rem; letter-spacing: -0.01em; }
        .right-badge { background: #6d28d9; color: white; font-size: 0.6rem; font-weight: 800; padding: 0.1rem 0.4rem; border-radius: 999px; }
        .right-view-all { font-size: 0.72rem; font-weight: 700; color: #6d28d9; background: none; border: none; cursor: pointer; }
        .right-view-all:hover { text-decoration: underline; }

        .right-item-name { font-size: 0.78rem; font-weight: 700; color: #0f172a; }
        .right-item-sub  { font-size: 0.68rem; color: #94a3b8; margin-top: 1px; line-height: 1.4; }

        .right-request-item { display: flex; align-items: flex-start; gap: 0.625rem; }
        .right-request-actions { display: flex; gap: 0.375rem; margin-top: 0.375rem; }
        .btn-accept  { font-size: 0.65rem; font-weight: 700; color: #6d28d9; background: #f3f0ff; border: none; border-radius: 999px; padding: 0.25rem 0.625rem; cursor: pointer; transition: all 0.18s; }
        .btn-accept:hover { background: #6d28d9; color: white; }
        .btn-decline { font-size: 0.65rem; font-weight: 700; color: #94a3b8; background: #f8fafc; border: none; border-radius: 999px; padding: 0.25rem 0.625rem; cursor: pointer; transition: all 0.18s; }
        .btn-decline:hover { background: #fee2e2; color: #e11d48; }

        .right-suggestion-item { display: flex; align-items: center; gap: 0.625rem; }
        .btn-follow {
          width: 28px; height: 28px;
          border-radius: 50%;
          border: 1.5px solid #e2e8f0;
          background: white;
          color: #6d28d9;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.18s;
        }
        .btn-follow:hover { background: #6d28d9; color: white; border-color: #6d28d9; }

        /* Responsive */
        @media (max-width: 1100px) {
          .feed-layout { grid-template-columns: 60px 1fr 220px; }
          .sidebar-logo span, .sidebar-profile-info, .sidebar-nav-item span { display: none; }
          .sidebar-nav-item { justify-content: center; padding: 0.75rem; }
          .sidebar-profile { justify-content: center; padding: 0.625rem; }
        }
        @media (max-width: 768px) {
          .feed-layout { grid-template-columns: 1fr; }
          .feed-sidebar, .feed-right { display: none; }
          .feed-main { padding: 1rem; max-width: 100%; }
        }
      `}</style>
    </div>
  );
}
