import { useState } from 'react';
import { likePost, unlikePost } from '../lib/api';
import { formatRelativeTime, getInitials, getAvatarGradient } from '../lib/format';

export default function PostCards({ post, initiallyLiked = false }) {
  const [isLiked, setIsLiked] = useState(post.likedByMe || initiallyLiked);
  
  const [localLikeCount, setLocalLikeCount] = useState(post.likeCount || 0);
  
  const [busy, setBusy] = useState(false);

  async function handleLikeToggle() {
    if (busy) return;
    setBusy(true);

    try {
      if (isLiked) {
        await unlikePost(post.id);
        setIsLiked(false);
        setLocalLikeCount((prev) => Math.max(0, prev - 1));
      } else {
        await likePost(post.id);
        setIsLiked(true);
        setLocalLikeCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setBusy(false);
    }
  }

  const displayName = post.authorName || `User ${post.userId}`;
  
  const gradient = getAvatarGradient(post.userId);
  const initials = getInitials(displayName); 

  return (
    <article className="feed-card glass-card post-accent rounded-[1.75rem] p-5 sm:p-6 group">
      <div className="flex items-start gap-3.5">
        <div
          className="flex-shrink-0 h-11 w-11 rounded-2xl flex items-center justify-center text-sm font-black text-white shadow-md"
          style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div>
            
              <p className="text-sm font-bold text-slate-800" style={{ fontFamily: 'var(--font-display)' }}>
                {displayName}
              </p>
              <p className="text-xs font-medium text-slate-400 mt-0.5">{formatRelativeTime(post.createdAt)}</p>
            </div>
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest flex-shrink-0">
              #{post.id.toString().slice(0, 5)} 
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700 pl-[3.625rem]">
        {post.content}
      </p>

      <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-100 pt-4 pl-[3.625rem]">
        
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
          <span className={localLikeCount > 0 ? "text-rose-400" : ""}>
            {localLikeCount} {localLikeCount === 1 ? 'Like' : 'Likes'}
          </span>
          <span className="text-slate-200">•</span>
          <span className="text-slate-300 tracking-[0.14em]">
             {isLiked ? 'You liked this' : 'React to engage'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleLikeToggle}
          disabled={busy}
          className={`
            flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200
            ${isLiked
              ? 'bg-rose-50 border border-rose-200 text-rose-500 hover:bg-rose-100'
              : 'bg-white border border-slate-200 text-slate-500 hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50'
            }
            ${busy ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
          `}
        >
          <svg className="w-3.5 h-3.5" fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {isLiked ? 'Liked' : 'Like'}
        </button>
      </div>
    </article>
  );
}