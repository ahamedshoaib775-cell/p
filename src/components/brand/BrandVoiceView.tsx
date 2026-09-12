import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Brain, ShieldAlert, CheckCircle2, Award, Zap, Layers } from 'lucide-react';

export const BrandVoiceView: React.FC = () => {
  const { business, brandProfile, brandPreferences, generateNew7DayPlan } = useApp();

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Brand Intelligence & Voice Memory</h2>
            <p className="text-xs text-slate-400">
              Persistent AI Brand Profile & automated memory system for <span className="text-white font-semibold">{business?.business_name}</span>.
            </p>
          </div>
        </div>

        <button
          onClick={() => generateNew7DayPlan()}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          Re-Analyze Brand
        </button>
      </div>

      {/* Brand Profile Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Industry & Audience */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" /> Core Identity
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Industry & Category</span>
            <span className="font-extrabold text-base text-white">{brandProfile?.industry || business?.business_category}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Target Audience</span>
            <span className="font-semibold text-xs text-slate-200">{brandProfile?.targetAudience || business?.target_audience}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Location / Market</span>
            <span className="font-semibold text-xs text-slate-200">{brandProfile?.location || business?.location || 'Global'}</span>
          </div>
        </div>

        {/* Tone & Personality */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4" /> Voice & Personality
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Tone of Voice</span>
            <span className="font-extrabold text-base text-white">{brandProfile?.tone || business?.brand_tone}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1.5">Personality Attributes</span>
            <div className="flex flex-wrap gap-1.5">
              {(brandProfile?.personality || business?.brand_personality || ['Professional', 'Friendly']).map((p, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-bold">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content Pillars */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4" /> Content Pillars
          </div>
          <span className="text-xs text-slate-400 block">AI Strategic Focus Areas</span>
          <div className="space-y-2">
            {(brandProfile?.contentPillars || ['Educational Value', 'Product Highlights', 'Behind the Scenes', 'Client Proof']).map((cp, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl text-xs text-slate-200 font-semibold border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                {cp}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Avoided Buzzwords & Preferred Terminology Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" /> Phrases Avoided by AI Memory
            </div>
            <span className="text-[10px] text-slate-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              Active Protection
            </span>
          </div>

          <p className="text-xs text-slate-400">
            SocialPilot AI automatically filters generic phrases to prevent robotic output.
          </p>

          <div className="flex flex-wrap gap-2">
            {['Elevate your...', 'Unlock your...', 'Unleash your...', 'Step into...', 'Discover the power of...', 'Delve into...', 'Game-changer', 'Beacon of'].map((word, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-rose-500/10 text-rose-300 border border-rose-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <span className="text-rose-400 font-extrabold">✕</span> "{word}"
              </span>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" /> Preferred Copywriting Style
            </div>
            <span className="text-[10px] text-slate-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Authentic Human Tone
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Captions sound like a real business owner wrote them—short, natural, and direct.
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
              <span className="font-bold text-white block mb-0.5">CTA Style:</span>
              {brandProfile?.CTAStyle || 'Direct and conversational with clear value proposition.'}
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
              <span className="font-bold text-white block mb-0.5">Visual Direction:</span>
              {brandProfile?.visualStyle || 'Clean typography, authentic product/people photography.'}
            </div>
          </div>
        </div>
      </div>

      {/* Brand Voice Memory Log (User Edits History) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white">Brand Voice Memory Log</h3>
            <p className="text-xs text-slate-400">
              Recorded preferences extracted whenever you edit AI-generated content.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            {brandPreferences.length} Learned Rules
          </span>
        </div>

        {brandPreferences.length > 0 ? (
          <div className="space-y-3">
            {brandPreferences.map((pref, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-400 text-[11px]">
                  <span className="font-bold text-indigo-400">Rule Learned on {new Date(pref.created_at).toLocaleDateString()}</span>
                  <span className="uppercase text-[10px] bg-slate-800 px-2 py-0.5 rounded font-bold">{pref.category || 'caption'}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-200">
                    <span className="font-bold text-rose-400 block mb-0.5">AI Generated Originally:</span>
                    "{pref.original_ai_text}"
                  </div>

                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-200">
                    <span className="font-bold text-emerald-400 block mb-0.5">You Changed It To:</span>
                    "{pref.user_edited_text}"
                  </div>
                </div>

                {pref.avoided_phrases && pref.avoided_phrases.length > 0 && (
                  <div className="text-[11px] text-slate-400 pt-1">
                    <span className="font-bold text-white">System Learned Rule: </span> 
                    Avoid phrase patterns such as {pref.avoided_phrases.map(p => `"${p}"`).join(', ')}.
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-950/60 border border-slate-800 rounded-2xl text-slate-400 text-xs">
            No custom edits recorded yet. Whenever you edit AI text in the Content Editor, SocialPilot AI will automatically learn your brand preferences!
          </div>
        )}
      </div>
    </div>
  );
};
