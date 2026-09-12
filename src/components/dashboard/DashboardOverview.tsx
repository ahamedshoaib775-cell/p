import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, Calendar, CheckCircle2, Clock, Play, ArrowRight, RefreshCw, 
  Users
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { business, posts, setCurrentView, approveFull7DayPlan, setEditingPost, publishPostNow, generateNew7DayPlan } = useApp();

  const bName = business?.business_name || 'My Business';
  const scheduledCount = posts.filter(p => String(p.status).toUpperCase() === 'SCHEDULED').length;
  const publishedCount = posts.filter(p => String(p.status).toUpperCase() === 'PUBLISHED').length;

  const nextPost = posts.find(p => String(p.status).toUpperCase() === 'SCHEDULED' || String(p.status).toUpperCase() === 'APPROVED') || posts[0];

  return (
    <div className="space-y-6 animate-fade-in text-slate-100 max-w-7xl mx-auto">
      {/* Top Welcome Command Header */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-purple-900/40 border border-indigo-500/30 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Your AI Marketing Manager & Team Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Good morning, {bName}!
            </h1>
            <p className="text-sm text-slate-300">
              Your marketing is ready. 7-day plan generated with visual AI assets, competitor benchmarks, and engagement predictions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => generateNew7DayPlan()}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-indigo-400" />
              Regenerate Plan
            </button>

            <button
              onClick={approveFull7DayPlan}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve All & Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Team Activity Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white flex items-center gap-2">
              Team Activity & Review Status
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px]">3 Awaiting Approval</span>
            </h4>
            <p className="text-slate-400">Maria submitted 2 items for review • David requested copy changes on "Styling Tips"</p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('team')}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold rounded-lg border border-slate-700 cursor-pointer self-start md:self-auto"
        >
          Manage Team Roles →
        </button>
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 font-medium block">Content This Week</span>
          <span className="text-2xl font-extrabold text-white">{posts.length} Items</span>
          <span className="text-[10px] text-indigo-400 font-semibold block">7-day Instagram Mix</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 font-medium block">Scheduled</span>
          <span className="text-2xl font-extrabold text-amber-400">{scheduledCount}</span>
          <span className="text-[10px] text-slate-500 block">Queue Active</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 font-medium block">Published</span>
          <span className="text-2xl font-extrabold text-emerald-400">{publishedCount}</span>
          <span className="text-[10px] text-slate-500 block">Live on Meta API</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 font-medium block">Avg Predicted Engagement</span>
          <span className="text-2xl font-extrabold text-purple-400">3.7%</span>
          <span className="text-[10px] text-emerald-400 font-semibold block">
            +15% vs Competitor Avg (3.2%)
          </span>
        </div>
      </div>

      {/* Next Post Spotlight Card */}
      {nextPost && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
              <img
                src={nextPost.visualAsset?.storage_url || nextPost.media_url}
                alt={nextPost.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  Next Post Scheduled
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> {nextPost.scheduled_date} at {nextPost.scheduled_time || '14:15 PM'}
                </span>
              </div>
              <h3 className="font-extrabold text-base text-white line-clamp-1">{nextPost.title || nextPost.headline}</h3>
              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{nextPost.caption}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setEditingPost(nextPost)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Edit & Review
            </button>
            <button
              onClick={() => publishPostNow(nextPost.id)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" /> Publish Now
            </button>
          </div>
        </div>
      )}

      {/* Main Section: This Week (7 Content Items Grid) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" /> 7-Day Content Plan & Visual Assets
          </h2>
          <button
            onClick={() => setCurrentView('calendar')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            View Full Calendar <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.slice(0, 7).map((item, idx) => {
            const statusUpper = String(item.status).toUpperCase();
            return (
              <div 
                key={item.id || idx}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 space-y-3 shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-indigo-400 uppercase tracking-wider">
                      Day #{item.day_number || idx + 1} • {item.content_type || 'POST'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.approval_status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      item.approval_status === 'submitted' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {item.approval_status ? item.approval_status.toUpperCase() : statusUpper}
                    </span>
                  </div>

                  <div className="relative aspect-video rounded-xl bg-slate-950 overflow-hidden border border-slate-800">
                    <img
                      src={item.visualAsset?.storage_url || item.media_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-purple-300 border border-purple-500/30">
                      ⚡ Est: {item.performancePrediction?.predicted_engagement_rate || 3.7}%
                    </div>
                  </div>

                  <h4 className="font-extrabold text-sm text-white line-clamp-1">{item.title || item.headline}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{item.caption}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">
                    ⏰ {item.scheduled_time || '14:15 PM'}
                  </span>

                  <button
                    onClick={() => setEditingPost(item)}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                  >
                    Edit & Review →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
