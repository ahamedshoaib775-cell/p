import React from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Pause, RefreshCw, CheckCircle2, Zap, Clock } from 'lucide-react';

export const AutopilotWidget: React.FC = () => {
  const { posts, socialAccounts, isSchedulerActive, toggleScheduler, open7DayPlanModal, isTestMode } = useApp();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const igAccount = socialAccounts.find(a => a.platform === 'instagram');
  const connectedHandle = igAccount?.account_handle || '@artisanbloom_cafe';

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5 relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-md">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">7-DAY AUTOPILOT</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                isSchedulerActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isSchedulerActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                {isSchedulerActive ? '🟢 Active' : '⏸️ Paused'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Target Channel: <strong className="font-mono text-slate-800">{connectedHandle}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={open7DayPlanModal}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 transition-colors cursor-pointer"
          >
            View Calendar
          </button>
          <button
            onClick={toggleScheduler}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              isSchedulerActive
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
            }`}
          >
            {isSchedulerActive ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                Pause Autopilot
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                Resume Autopilot
              </>
            )}
          </button>
        </div>
      </div>

      {/* 7-Day Schedule Indicators Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
        {days.map((day, idx) => {
          const dayPost = posts[idx];
          const status = dayPost?.status;
          const isPublished = status === 'published' || status === 'Published';
          const isScheduled = status === 'scheduled' || status === 'Scheduled' || status === 'approved' || status === 'Approved';
          const isFailed = status === 'failed' || status === 'Failed';
          const isPublishing = status === 'publishing' || status === 'Publishing';

          return (
            <div
              key={day}
              className={`p-3 rounded-xl border text-center transition-all ${
                isPublished
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : isPublishing
                  ? 'bg-amber-50 border-amber-300 text-amber-900 animate-pulse'
                  : isFailed
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : isScheduled
                  ? 'bg-indigo-50/80 border-indigo-200 text-indigo-900'
                  : 'bg-slate-50 border-slate-200/80 text-slate-600'
              }`}
            >
              <span className="text-[11px] font-black uppercase tracking-wider block">{day.substring(0, 3)}</span>
              <div className="mt-1 flex items-center justify-center gap-1 text-[11px] font-extrabold">
                {isPublished && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                {isPublishing && <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />}
                {isScheduled && <Clock className="w-3.5 h-3.5 text-indigo-600" />}
                <span>
                  {isPublished ? 'Published' : isPublishing ? 'Publishing' : isFailed ? 'Failed' : isScheduled ? 'Scheduled' : 'Draft'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Autopilot Status Bar */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-wrap justify-between items-center text-xs text-slate-600">
        <span className="font-semibold">
          Mode: <strong className={isTestMode ? 'text-amber-700 font-mono' : 'text-emerald-700 font-mono'}>{isTestMode ? '🟡 TEST PUBLISHING' : '🟢 LIVE PRODUCTION'}</strong>
        </span>
        <span className="text-slate-400">
          Checks queue every 30s automatically
        </span>
      </div>
    </div>
  );
};
