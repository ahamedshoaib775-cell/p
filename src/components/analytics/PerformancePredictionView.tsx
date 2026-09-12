import React, { useState } from 'react';
import { 
  TrendingUp, Zap, Target, CheckCircle2, 
  BarChart3, Sparkles, ThumbsUp, MessageSquare
} from 'lucide-react';

export const PerformancePredictionView: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<'REEL' | 'CAROUSEL' | 'POST'>('REEL');
  const [includeCta, setIncludeCta] = useState(true);
  const [isOptimalTime, setIsOptimalTime] = useState(true);

  // Dynamic simulation calculations
  const simLikes = selectedFormat === 'REEL' ? (includeCta ? 210 : 175) : (includeCta ? 155 : 120);
  const simComments = includeCta ? 14 : 7;
  const simEngagement = selectedFormat === 'REEL' ? (includeCta ? 4.1 : 3.4) : (includeCta ? 3.2 : 2.5);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Content Performance Prediction Engine</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Machine learning engagement forecasting, factor impact scoring, and post-publishing accuracy tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Engine Model Accuracy: 89% (Excellent)
          </div>
        </div>
      </div>

      {/* Model Performance Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Overall Model Accuracy</p>
          <p className="text-2xl font-bold text-white mt-1">89%</p>
          <p className="text-[11px] text-emerald-400 mt-1">↑ +5% over last 30 days</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Reel Prediction Precision</p>
          <p className="text-2xl font-bold text-indigo-400 mt-1">92%</p>
          <p className="text-[11px] text-slate-400 mt-1">Narrow ±18% variance band</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Optimal Time Impact</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">91%</p>
          <p className="text-[11px] text-slate-400 mt-1">+18% engagement boost verified</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Evaluated Parameters</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">11 Factors</p>
          <p className="text-[11px] text-slate-400 mt-1">Format, CTA, Time, Hashtags & Voice</p>
        </div>
      </div>

      {/* Grid: Accuracy by Format & Factor Ratings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Predictions by Content Format */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            Prediction Accuracy by Content Format
          </h3>

          <div className="space-y-3">
            {[
              { format: 'Instagram Reel (Short-Form Video)', accuracy: 92, sample: 45, status: 'Highly Predictable' },
              { format: 'Single Static Post', accuracy: 84, sample: 28, status: 'Stable' },
              { format: 'Carousel Post (Multi-Slide)', accuracy: 78, sample: 12, status: 'Gathering Data' },
              { format: 'Instagram Story', accuracy: 73, sample: 14, status: 'Moderate' }
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-lg space-y-1 text-xs">
                <div className="flex justify-between font-medium text-slate-200">
                  <span>{item.format}</span>
                  <span className="font-bold text-indigo-400">{item.accuracy}% Accuracy</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full" style={{ width: `${item.accuracy}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>Sample Size: {item.sample} posts</span>
                  <span className="text-slate-300 font-semibold">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prediction Factor Weightings */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Model Factor Weighting & Reliability
          </h3>

          <div className="space-y-3 text-xs">
            {[
              { factor: 'Posting Time Slot', accuracy: 91, level: 'Very High' },
              { factor: 'Content Type (Reel vs Post)', accuracy: 88, level: 'Very High' },
              { factor: 'Brand Voice & Personality Match', accuracy: 84, level: 'High' },
              { factor: 'Hashtag Niche Relevance', accuracy: 79, level: 'High' },
              { factor: 'Caption Character Count & Formatting', accuracy: 71, level: 'Medium' }
            ].map((factor, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-800/30 rounded-lg border border-slate-800">
                <div>
                  <p className="font-medium text-slate-200">{factor.factor}</p>
                  <p className="text-[10px] text-slate-400">Confidence: {factor.level}</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-purple-500/10 text-purple-300 font-bold text-xs border border-purple-500/20">
                  {factor.accuracy}% Reliability
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Live Prediction Sandbox */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Live Post Engagement Prediction Sandbox
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate how different parameters impact forecasted Likes, Comments, and Engagement Rate in real time.
            </p>
          </div>
          <span className="text-xs font-mono bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
            Model v2.4 Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Content Format</label>
              <div className="grid grid-cols-3 gap-2">
                {(['REEL', 'CAROUSEL', 'POST'] as const).map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      selectedFormat === fmt
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <span className="text-slate-200 font-medium">Include Call-To-Action (CTA)</span>
              <input
                type="checkbox"
                checked={includeCta}
                onChange={(e) => setIncludeCta(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <span className="text-slate-200 font-medium">Post at Peak Window (Tue 2:15 PM)</span>
              <input
                type="checkbox"
                checked={isOptimalTime}
                onChange={(e) => setIsOptimalTime(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Results Output */}
          <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Predicted Engagement Output</h4>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                <ThumbsUp className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                <p className="text-xs text-slate-400">Predicted Likes</p>
                <p className="text-xl font-bold text-white mt-0.5">{simLikes - 20} - {simLikes + 25}</p>
                <p className="text-[10px] text-slate-400">(Avg: {simLikes})</p>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                <MessageSquare className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <p className="text-xs text-slate-400">Predicted Comments</p>
                <p className="text-xl font-bold text-white mt-0.5">{simComments - 2} - {simComments + 4}</p>
                <p className="text-[10px] text-slate-400">(Avg: {simComments})</p>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <p className="text-xs text-slate-400">Engagement Rate</p>
                <p className="text-xl font-bold text-emerald-400 mt-0.5">{simEngagement}%</p>
                <p className="text-[10px] text-emerald-400/80">+18% above sector avg</p>
              </div>
            </div>

            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs text-indigo-200">
              💡 <strong>Optimization Tip:</strong> {includeCta ? 'CTA included! You gain +0.3 impact score.' : 'Add a clear CTA ("Link in bio") to boost comment conversions by 45%.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
