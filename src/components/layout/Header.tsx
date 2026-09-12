import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Menu, Play, ExternalLink } from 'lucide-react';

interface HeaderProps {
  onOpenMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobile }) => {
  const { currentView, setCurrentView, generateNew7DayPlan, runSchedulerManual, business, isTestMode, toggleTestMode } = useApp();

  const viewTitles: Record<string, { title: string; subtitle: string }> = {
    landing: { title: 'SocialPilot AI', subtitle: 'AI Social Media Manager' },
    onboarding: { title: 'Business Onboarding', subtitle: 'Setup your business profile & brand identity' },
    dashboard: { title: 'Dashboard Overview', subtitle: "Monitor today's content and weekly plan performance" },
    calendar: { title: '7-Day Content Calendar', subtitle: 'Manage, edit and approve scheduled social posts' },
    content: { title: 'AI 7-Day Content Generator', subtitle: 'Create automated tailored social posts' },
    generator: { title: 'AI 7-Day Content Generator', subtitle: 'Create automated tailored social posts' },
    brand: { title: 'Brand Intelligence & Memory', subtitle: 'View structured brand profile & learned voice rules' },
    analytics: { title: 'Analytics & Strategy Reports', subtitle: 'Track performance metrics and weekly AI recommendations' },
    integrations: { title: 'Meta Instagram Setup', subtitle: 'Connect Meta Graph API (Instagram Professional OAuth)' },
    social: { title: 'Meta Instagram Setup', subtitle: 'Connect Meta Graph API (Instagram Professional OAuth)' },
    profile: { title: 'Meta Instagram Setup', subtitle: 'Connect Meta Graph API (Instagram Professional OAuth)' },
    settings: { title: 'Application Settings', subtitle: 'Decoupled AI providers, schedule, and security controls' },
    logs: { title: 'Developer Audit Logs', subtitle: 'Real-time Meta Graph API endpoints & error diagnostic logs' }
  };

  const info = viewTitles[currentView] || { title: 'Dashboard', subtitle: '' };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 h-20 flex items-center justify-between text-slate-100">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="md:hidden p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
            {info.title}
          </h2>
          <p className="text-xs text-slate-400 hidden sm:block">
            {info.subtitle}
          </p>
        </div>
      </div>

      {/* Header Quick Actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={toggleTestMode}
          title="Toggle between Test Dispatch and Live Meta Publishing"
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
            isTestMode
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          }`}
        >
          {isTestMode ? '🟡 TEST MODE' : '🟢 LIVE MODE'}
        </button>

        <button
          onClick={runSchedulerManual}
          title="Trigger immediate post queue processing"
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-slate-200" />
          <span className="hidden sm:inline">Run Scheduler</span>
        </button>

        <button
          onClick={() => {
            generateNew7DayPlan();
            setCurrentView('content');
          }}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>7-Day Plan</span>
        </button>

        {business?.website_url && (
          <a
            href={business.website_url}
            target="_blank"
            rel="noreferrer"
            className="hidden lg:flex p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Visit Business Website"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </header>
  );
};
