import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings as SettingsIcon, Building2, Cpu, Shield, Save, Sparkles, Users, Video, DollarSign, Eye } from 'lucide-react';
import type { AIProviderType } from '../../types';

export const SettingsView: React.FC = () => {
  const { business, updateBusiness, aiSettings, updateAISettings, logout, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'business' | 'ai' | 'visuals' | 'team' | 'competitors' | 'security'>('business');

  // Business form state
  const [bizData, setBizData] = useState({
    business_name: business?.business_name || '',
    business_category: business?.business_category || '',
    business_description: business?.business_description || '',
    location: business?.location || '',
    target_audience: business?.target_audience || '',
    products_services: business?.products_services || '',
    brand_tone: business?.brand_tone || 'Professional & Friendly',
    posting_frequency: business?.posting_frequency || 'Once daily (7 posts / week)'
  });

  // AI settings state
  const [aiData, setAiData] = useState({
    provider: aiSettings?.provider || 'mock',
    openaiKey: aiSettings?.openaiKey || '',
    geminiKey: aiSettings?.geminiKey || '',
    imageProvider: aiSettings?.imageProvider || 'dalle3',
    videoProvider: aiSettings?.videoProvider || 'runway',
    monthlyBudgetUSD: aiSettings?.monthlyBudgetUSD || 50
  });

  // Team & Competitor settings states
  const [requireManagerApproval, setRequireManagerApproval] = useState(true);
  const [notifyOnReviewSubmitted, setNotifyOnReviewSubmitted] = useState(true);
  const [competitorSyncFreq, setCompetitorSyncFreq] = useState('Daily');

  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusiness(bizData);
  };

  const handleSaveAI = (e: React.FormEvent) => {
    e.preventDefault();
    updateAISettings({
      provider: aiData.provider as AIProviderType,
      openaiKey: aiData.openaiKey,
      geminiKey: aiData.geminiKey,
      imageProvider: aiData.imageProvider as any,
      videoProvider: aiData.videoProvider as any,
      monthlyBudgetUSD: Number(aiData.monthlyBudgetUSD)
    });
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Application & SaaS Settings</h2>
            <p className="text-xs text-slate-400">
              Configure team collaboration workflows, AI generation providers, visual budgets, and competitor intelligence.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'business', label: 'Business Profile', icon: Building2 },
          { id: 'ai', label: 'AI Copywriting Provider', icon: Cpu },
          { id: 'visuals', label: 'AI Visuals & Budget', icon: Video },
          { id: 'team', label: 'Team Collaboration Rules', icon: Users },
          { id: 'competitors', label: 'Competitor Monitoring', icon: Eye },
          { id: 'security', label: 'Security & Account', icon: Shield }
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Business Profile */}
      {activeTab === 'business' && (
        <form onSubmit={handleSaveBusiness} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl text-xs">
          <h3 className="text-base font-extrabold text-white mb-2">Business Parameters</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">Business Name</label>
              <input
                type="text"
                value={bizData.business_name}
                onChange={e => setBizData({ ...bizData, business_name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">Business Category</label>
              <input
                type="text"
                value={bizData.business_category}
                onChange={e => setBizData({ ...bizData, business_category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">Business Description</label>
            <textarea
              rows={3}
              value={bizData.business_description}
              onChange={e => setBizData({ ...bizData, business_description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Business Profile
          </button>
        </form>
      )}

      {/* TAB 2: AI Provider Settings */}
      {activeTab === 'ai' && (
        <form onSubmit={handleSaveAI} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl text-xs">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Replaceable AIProvider Architecture
            </h3>
            <p className="text-slate-400 mt-1">Select your preferred LLM copywriting engine:</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'mock', name: 'Smart Local Engine', desc: 'Built-in smart engine with zero API cost.' },
              { id: 'openai', name: 'OpenAI GPT-4o', desc: 'Connect OpenAI API Key for high-converting copy.' },
              { id: 'gemini', name: 'Google Gemini 2.0', desc: 'Connect Google Gemini API for fast reasoning.' }
            ].map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setAiData({ ...aiData, provider: p.id as any })}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  aiData.provider === p.id
                    ? 'border-indigo-500 bg-indigo-600/20 text-white shadow-md'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <div>
                  <span className="font-extrabold text-sm block text-white mb-1">{p.name}</span>
                  <p className="text-[11px] leading-relaxed opacity-80">{p.desc}</p>
                </div>
                {aiData.provider === p.id && (
                  <span className="mt-3 text-[10px] font-extrabold text-indigo-400 uppercase">● Active Provider</span>
                )}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save AI Provider Configuration
          </button>
        </form>
      )}

      {/* TAB 3: AI Visuals & Budget */}
      {activeTab === 'visuals' && (
        <form onSubmit={handleSaveAI} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl text-xs">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-indigo-400" /> AI Visual Generation & Budget Controls
            </h3>
            <p className="text-slate-400 mt-1">Configure Image & Short-Form Video generation engines and monthly cost limits.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Provider */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <span className="font-bold text-white block">Image Generation Engine</span>
              <select
                value={aiData.imageProvider}
                onChange={e => setAiData({ ...aiData, imageProvider: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="dalle3">OpenAI DALL-E 3 ($0.04 / img)</option>
                <option value="stability">Stability AI SDXL ($0.02 / img)</option>
                <option value="midjourney">Midjourney API ($0.05 / img)</option>
              </select>
            </div>

            {/* Video Provider */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <span className="font-bold text-white block">Reel Video Generation Engine</span>
              <select
                value={aiData.videoProvider}
                onChange={e => setAiData({ ...aiData, videoProvider: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="runway">Runway ML Gen-2 ($0.12 / reel)</option>
                <option value="heygen">HeyGen Avatar ($0.15 / reel)</option>
                <option value="synthesia">Synthesia Presenter ($0.20 / reel)</option>
              </select>
            </div>
          </div>

          {/* Budget Guardrail */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" /> Monthly Generation Budget Limit
              </span>
              <span className="font-mono text-emerald-400 font-bold">${aiData.monthlyBudgetUSD} / month</span>
            </div>
            <input
              type="range"
              min={10}
              max={500}
              step={10}
              value={aiData.monthlyBudgetUSD}
              onChange={e => setAiData({ ...aiData, monthlyBudgetUSD: Number(e.target.value) })}
              className="w-full"
            />
            <p className="text-[11px] text-slate-400">Current Usage This Month: $5.08 / ${aiData.monthlyBudgetUSD} limit (10% used)</p>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Visual Engine & Budget Settings
          </button>
        </form>
      )}

      {/* TAB 4: Team Collaboration Rules */}
      {activeTab === 'team' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl text-xs">
          <h3 className="text-base font-extrabold text-white">Team Approval Rules & Notifications</h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={requireManagerApproval}
                onChange={e => setRequireManagerApproval(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <div>
                <span className="font-bold text-white block">Require Manager or Owner Approval</span>
                <span className="text-slate-400">Editors cannot publish content directly to Meta APIs without approval.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={notifyOnReviewSubmitted}
                onChange={e => setNotifyOnReviewSubmitted(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <div>
                <span className="font-bold text-white block">Notify Approvers on Review Submission</span>
                <span className="text-slate-400">Send instant in-app and email notifications when content is submitted.</span>
              </div>
            </label>
          </div>

          <button
            onClick={() => addToast('success', 'Saved team collaboration rules.')}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg cursor-pointer"
          >
            Save Collaboration Rules
          </button>
        </div>
      )}

      {/* TAB 5: Competitor Monitoring */}
      {activeTab === 'competitors' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl text-xs">
          <h3 className="text-base font-extrabold text-white">Competitor Sync & Privacy Settings</h3>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Competitor Data Sync Frequency</label>
            <select
              value={competitorSyncFreq}
              onChange={e => setCompetitorSyncFreq(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
            >
              <option value="Daily">Daily Sync (Recommended)</option>
              <option value="3x Daily">3x Daily Sync</option>
              <option value="Weekly">Weekly Sync</option>
            </select>
          </div>

          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-300 text-xs">
            <strong>Privacy Note:</strong> All competitor benchmarking strictly uses publicly available Instagram Meta Graph API data in compliance with Instagram ToS.
          </div>
        </div>
      )}

      {/* TAB 6: Security & Account */}
      {activeTab === 'security' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl text-xs">
          <h3 className="text-base font-extrabold text-white">Account Security & Actions</h3>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Sign Out of Social AI</span>
              <span className="text-slate-400">Clear current session state.</span>
            </div>
            <button onClick={logout} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl cursor-pointer">
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
