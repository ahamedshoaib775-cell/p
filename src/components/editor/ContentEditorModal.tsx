import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { PostItem } from '../../types';
import { X, Sparkles, Save, CheckCircle2, XCircle, Clock, Calendar, Hash, Send, Heart, MessageCircle, Bookmark, RefreshCw } from 'lucide-react';

export const ContentEditorModal: React.FC = () => {
  const { editingPost, setEditingPost, updatePost, approvePost, rejectPost, regenerateSinglePost, business } = useApp();

  if (!editingPost) return null;

  const [formData, setFormData] = useState<PostItem>({ ...editingPost });
  const [customInstruction, setCustomInstruction] = useState<string>('');
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

  const handleSave = () => {
    updatePost(editingPost.id, formData);
    setEditingPost(null);
  };

  const handleApprove = () => {
    updatePost(editingPost.id, formData);
    approvePost(editingPost.id);
    setEditingPost(null);
  };

  const handleReject = () => {
    rejectPost(editingPost.id);
    setEditingPost(null);
  };

  const handleRegenerate = async () => {
    if (!customInstruction.trim()) return;
    setIsRegenerating(true);
    try {
      await regenerateSinglePost(editingPost.id, customInstruction);
      setCustomInstruction('');
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in text-slate-100">
      <div className="relative w-full max-w-5xl bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-slate-900 border-b border-slate-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
              formData.content_type?.toLowerCase().includes('reel')
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : formData.content_type?.toLowerCase().includes('carousel')
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
            }`}>
              {formData.content_type || 'POST'}
            </span>
            <h3 className="font-extrabold text-lg text-white truncate max-w-md">
              Edit Content Item: Day #{formData.day_number}
            </h3>
          </div>

          <button
            onClick={() => setEditingPost(null)}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - 2 Columns */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto grow">
          {/* Left Column: Live Visual Social Post Mockup (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Post Preview</h4>
            
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              {/* Instagram Header */}
              <div className="p-3.5 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-0.5">
                    <img 
                      src={business?.logo_url || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=200&q=80'} 
                      alt="Logo" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white block">
                      @{business?.instagram_username || 'businessname'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formData.suggested_posting_time || `${formData.scheduled_time || '09:00'} recommended`}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-bold">•••</span>
              </div>

              {/* Media Thumbnail */}
              <div className="relative aspect-square bg-slate-900 overflow-hidden group">
                <img
                  src={formData.media_url || 'https://images.unsplash.com/photo-1542744094-3a31b272c490?auto=format&fit=crop&w=800&q=80'}
                  alt={formData.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-4">
                  <span className="inline-block px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-md text-[11px] font-bold text-white mb-1">
                    {formData.headline || formData.title}
                  </span>
                </div>
              </div>

              {/* Instagram Action Bar */}
              <div className="p-3 flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <MessageCircle className="w-5 h-5 hover:text-white cursor-pointer" />
                  <Send className="w-5 h-5 hover:text-white cursor-pointer" />
                </div>
                <Bookmark className="w-5 h-5 hover:text-white cursor-pointer" />
              </div>

              {/* Caption & Hashtags Preview */}
              <div className="px-3.5 pb-4 space-y-2 text-xs">
                <p className="text-slate-200 whitespace-pre-line leading-relaxed">
                  <span className="font-bold text-white mr-1">@{business?.instagram_username || 'businessname'}</span>
                  {formData.caption}
                </p>

                {formData.cta && (
                  <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-300 font-semibold text-[11px]">
                    👉 {formData.cta}
                  </div>
                )}

                <div className="flex flex-wrap gap-1 pt-1">
                  {(formData.hashtags || []).map((ht, idx) => (
                    <span key={idx} className="text-[11px] text-indigo-400 font-medium">
                      {ht.startsWith('#') ? ht : `#${ht}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editable Fields & AI Single Item Regenerate (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* AI Custom Single-Item Regeneration Bar */}
            <div className="p-4 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                AI Single-Item Prompt Regeneration
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder='e.g. "Make it more premium", "Make it shorter", "Make the CTA punchy"'
                  value={customInstruction}
                  onChange={e => setCustomInstruction(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={isRegenerating || !customInstruction.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                  Regenerate
                </button>
              </div>
            </div>

            {/* Editable Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Post Title / Headline
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value, headline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Caption Text
                </label>
                <textarea
                  rows={5}
                  value={formData.caption}
                  onChange={e => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5" /> Hashtags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={(formData.hashtags || []).join(', ')}
                    onChange={e => setFormData({ ...formData, hashtags: e.target.value.split(',').map(s => s.trim()) })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Call To Action (CTA)
                  </label>
                  <input
                    type="text"
                    value={formData.cta}
                    onChange={e => setFormData({ ...formData, cta: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={formData.scheduled_date}
                    onChange={e => setFormData({ ...formData, scheduled_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Scheduled Time
                  </label>
                  <input
                    type="time"
                    value={formData.scheduled_time}
                    onChange={e => setFormData({ ...formData, scheduled_time: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReject}
            className="px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            Reject Item
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Edits
            </button>

            <button
              type="button"
              onClick={handleApprove}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
