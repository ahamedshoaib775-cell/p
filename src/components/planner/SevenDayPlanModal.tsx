import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Sparkles, X, Clock, Check, Edit } from 'lucide-react';

interface SevenDayPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export const SevenDayPlanModal: React.FC<SevenDayPlanModalProps> = ({ isOpen, onClose }) => {
  const { posts, approvePost, approveFull7DayPlan, setEditingPost, socialAccounts } = useApp();
  
  const igAccount = socialAccounts.find(a => a.platform === 'instagram');
  const connectedHandle = igAccount?.account_handle || '@artisanbloom_cafe';

  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'all'>('all');

  if (!isOpen) return null;

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getFormatBadge = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'behind the scenes':
      case 'reel':
        return { label: 'Instagram Reel 🎬', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'educational':
      case 'carousel':
        return { label: 'Carousel 📸', bg: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'customer story':
      case 'engagement':
      case 'story':
        return { label: 'Story / Reel 📱', bg: 'bg-rose-100 text-rose-800 border-rose-200' };
      default:
        return { label: 'Photo Post 🖼️', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
    }
  };

  const handleApproveAll = () => {
    approveFull7DayPlan();
    onClose();
  };

  const displayedPosts = selectedDayFilter === 'all' 
    ? posts.slice(0, 7)
    : posts.filter(p => p.day_number === selectedDayFilter);

  const approvedCount = posts.slice(0, 7).filter(p => p.status === 'Approved' || p.status === 'Scheduled' || p.status === 'Published').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-md p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden relative">
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 flex items-center justify-between border-b border-slate-800 relative">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-lg">
              <InstagramIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">7-Day Instagram Content Calendar</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-extrabold text-[11px]">
                  {connectedHandle}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Generated tailored posts for Monday through Sunday. Review, approve, and launch automatic publishing!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter Bar & Quick Stats */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          {/* Days Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedDayFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedDayFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              All 7 Days (Mon - Sun)
            </button>
            {daysOfWeek.map((day, idx) => (
              <button
                key={day}
                onClick={() => setSelectedDayFilter(idx + 1)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedDayFilter === idx + 1
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="font-bold text-slate-700">
              Approved: <span className="text-emerald-600">{approvedCount} / 7</span>
            </span>
          </div>
        </div>

        {/* Posts List Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50/50">
          {displayedPosts.map((post, idx) => {
            const dayName = daysOfWeek[(post.day_number - 1) % 7];
            const badge = getFormatBadge(post.content_type);
            const isApproved = post.status === 'Approved' || post.status === 'Scheduled' || post.status === 'Published';

            return (
              <div
                key={post.id || idx}
                className={`bg-white border rounded-2xl p-5 shadow-xs transition-all ${
                  isApproved ? 'border-emerald-300 ring-1 ring-emerald-500/20' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left Column: Image Preview + Day info */}
                  <div className="flex gap-4 items-start flex-1">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 relative group">
                      <img
                        src={post.media_url || 'https://images.unsplash.com/photo-1542744094-3a31b272c490?auto=format&fit=crop&w=400&q=80'}
                        alt={post.headline}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-white font-mono text-[9px]">
                        Day {post.day_number}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Day Header Tags */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-black text-xs">
                          {dayName} ({post.scheduled_date})
                        </span>
                        <span className={`px-2.5 py-1 rounded-lg border text-xs font-extrabold ${badge.bg}`}>
                          {badge.label}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3 text-indigo-600" />
                          {post.scheduled_time || '09:00 AM'}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                        {post.headline}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {post.caption}
                      </p>

                      <div className="flex flex-wrap items-center gap-1 text-[11px] font-mono text-indigo-600">
                        {(post.hashtags || []).slice(0, 5).join(' ')}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Approval Action Toggles */}
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                        post.status === 'Published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : post.status === 'Publishing'
                          ? 'bg-amber-100 text-amber-800 animate-pulse border border-amber-300'
                          : post.status === 'Failed'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isApproved
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {post.status === 'Published' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        {post.status}
                      </span>
                      {post.instagram_media_id && (
                        <span className="block text-[10px] font-mono font-bold text-slate-400 mt-1">
                          Media ID: {post.instagram_media_id}
                        </span>
                      )}
                      {post.error_message && (
                        <span className="block text-[10px] font-semibold text-rose-600 mt-1 max-w-xs truncate">
                          {post.error_message}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingPost(post)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </button>

                      {!isApproved && (
                        <button
                          onClick={() => approvePost(post.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <p className="font-bold text-slate-800">Ready to automate Instagram posting for the next 7 days?</p>
            <p>Once approved, SocialPilot AI will automatically post each picture/reel on its scheduled day.</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
            >
              Close Calendar
            </button>

            <button
              onClick={handleApproveAll}
              className="w-1/2 sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-black text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Approve 7-Day Plan & Start Auto-Posting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
