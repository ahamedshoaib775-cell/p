import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { PostItem } from '../../types';
import { Calendar as CalendarIcon, CheckCircle2, Clock, Play, Edit3, Trash2, AlertTriangle, Sparkles, Filter } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { posts, approveFull7DayPlan, setEditingPost, deletePost, publishPostNow, generateNew7DayPlan, business } = useApp();

  const [isApproveAllModalOpen, setIsApproveAllModalOpen] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>('ALL');

  // Days of week mapping
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getStatusBadge = (status: PostItem['status']) => {
    const s = String(status).toUpperCase();
    switch (s) {
      case 'PUBLISHED':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Published</span>;
      case 'PUBLISHING':
      case 'PROCESSING':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse">Publishing...</span>;
      case 'SCHEDULED':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30">Scheduled</span>;
      case 'APPROVED':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">Approved</span>;
      case 'FAILED':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30">Failed</span>;
      case 'DRAFT':
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-800 text-slate-400 border border-slate-700">Draft</span>;
    }
  };

  const filteredPosts = posts.filter(p => {
    if (filterType === 'ALL') return true;
    return (p.content_type || p.type || '').toUpperCase().includes(filterType);
  });

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">7-Day Content Calendar</h2>
            <p className="text-xs text-slate-400">
              Personalized Instagram marketing schedule for <span className="text-white font-semibold">{business?.business_name}</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => generateNew7DayPlan()}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Regenerate Week
          </button>

          <button
            onClick={() => setIsApproveAllModalOpen(true)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve All & Schedule
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['ALL', 'REEL', 'CAROUSEL', 'POST', 'STORY'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                filterType === type 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400">
          Showing <span className="font-bold text-white">{filteredPosts.length}</span> items
        </span>
      </div>

      {/* 7-Day Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {daysOfWeek.map((dayName, index) => {
          const post = filteredPosts.find(p => p.day_number === index + 1) || filteredPosts[index];

          return (
            <div 
              key={index}
              className="bg-slate-900 border border-slate-800/90 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-lg transition-all"
            >
              {/* Day Header */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-400">
                    Day #{index + 1}
                  </span>
                  <h4 className="font-extrabold text-sm text-white">{dayName}</h4>
                </div>

                {post && getStatusBadge(post.status)}
              </div>

              {post ? (
                <>
                  {/* Card Content */}
                  <div className="space-y-2">
                    {/* Media Thumbnail */}
                    <div className="relative aspect-video rounded-xl bg-slate-950 overflow-hidden border border-slate-800 group">
                      <img 
                        src={post.media_url || 'https://images.unsplash.com/photo-1542744094-3a31b272c490?auto=format&fit=crop&w=400&q=80'} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-black/70 backdrop-blur-md text-white uppercase">
                        {post.content_type || 'POST'}
                      </span>
                    </div>

                    <h5 className="font-bold text-xs text-white line-clamp-2 leading-snug">
                      {post.title || post.headline}
                    </h5>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {post.caption}
                    </p>

                    <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                      <Clock className="w-3 h-3 text-indigo-400" />
                      {post.scheduled_time || '09:00'} ({post.suggested_posting_time || 'Best time'})
                    </div>

                    {/* Failed Warning Notice */}
                    {String(post.status).toUpperCase() === 'FAILED' && (
                      <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-[10px] text-rose-300 space-y-1">
                        <div className="flex items-center gap-1 font-bold">
                          <AlertTriangle className="w-3 h-3" /> Publishing Failed
                        </div>
                        <p className="line-clamp-1">{post.error_message || 'Check Meta token status'}</p>
                        <button
                          onClick={() => publishPostNow(post.id)}
                          className="w-full py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded cursor-pointer transition-colors"
                        >
                          Retry Publishing
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                    <button
                      onClick={() => setEditingPost(post)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Edit Post"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => publishPostNow(post.id)}
                      className="px-2 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      title="Publish Now"
                    >
                      <Play className="w-3 h-3" /> Publish
                    </button>

                    <button
                      onClick={() => deletePost(post.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center border-2 border-dashed border-slate-800 rounded-xl">
                  <span className="text-xs text-slate-500 block mb-2">No post scheduled</span>
                  <button
                    onClick={() => generateNew7DayPlan()}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    + Generate
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* APPROVE ALL CONFIRMATION MODAL */}
      {isApproveAllModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-white">Approve 7-Day Instagram Plan?</h3>
              <p className="text-xs text-slate-400 mt-1">
                You are about to schedule <span className="text-white font-bold">7 pieces of content</span> for automatic publishing via Meta Instagram APIs.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl text-xs space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span>Account:</span>
                <span className="font-bold text-indigo-400">@{business?.instagram_username || 'businessname'}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Posts:</span>
                <span className="font-bold text-white">7 Instagram Items</span>
              </div>
              <div className="flex justify-between">
                <span>Background Auto-Scheduler:</span>
                <span className="font-bold text-emerald-400">ACTIVE (30s Interval)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsApproveAllModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  approveFull7DayPlan();
                  setIsApproveAllModalOpen(false);
                }}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/30 cursor-pointer transition-all"
              >
                Approve & Schedule All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
