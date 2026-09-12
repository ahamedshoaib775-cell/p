import React, { useState } from 'react';
import { competitorServiceInstance } from '../../services/competitor/CompetitorAnalysisService';
import { useApp } from '../../context/AppContext';
import { 
  Users, Sparkles, PieChart, Plus, 
  RefreshCw, Award
} from 'lucide-react';

export const CompetitorAnalyticsView: React.FC = () => {
  const { addToast } = useApp();
  const insights = competitorServiceInstance.getAICompetitorRecommendations();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newHandle, setNewHandle] = useState('');

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHandle) return;
    addToast('success', `Added @${newHandle.replace('@', '')} to monitored competitors. Syncing public metrics...`);
    setIsAddOpen(false);
    setNewHandle('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Competitor Intelligence & Benchmarking</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Monitor public Instagram competitor metrics, vector similarity content themes, and hashtag gap opportunities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => addToast('info', 'Triggered full competitor sync cycle...')}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Metrics
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Competitor
          </button>
        </div>
      </div>

      {/* Account Comparison Matrix */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Your Account vs. Competitor Benchmarks
          </h2>
          <span className="text-xs text-slate-400 font-mono">Updated 2 hours ago</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-xs uppercase text-slate-400 tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Metric</th>
                <th className="px-6 py-3.5 text-indigo-400 font-bold bg-indigo-500/10 border-x border-indigo-500/20">
                  Your Account
                </th>
                <th className="px-6 py-3.5">@style_competitor</th>
                <th className="px-6 py-3.5">@fashion_guru</th>
                <th className="px-6 py-3.5">@trend_studio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-xs">
              <tr className="hover:bg-slate-800/30">
                <td className="px-6 py-4 font-semibold text-slate-200">Followers</td>
                <td className="px-6 py-4 font-bold text-indigo-300 bg-indigo-500/5 border-x border-indigo-500/10">5.2K</td>
                <td className="px-6 py-4 text-slate-300">45.2K</td>
                <td className="px-6 py-4 text-slate-300">12.8K</td>
                <td className="px-6 py-4 text-slate-300">98.4K</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="px-6 py-4 font-semibold text-slate-200">Avg Engagement Rate</td>
                <td className="px-6 py-4 font-bold text-emerald-400 bg-indigo-500/5 border-x border-indigo-500/10">
                  4.2% (↑ +22%)
                </td>
                <td className="px-6 py-4 text-slate-300">3.8%</td>
                <td className="px-6 py-4 text-emerald-400 font-semibold">6.1%</td>
                <td className="px-6 py-4 text-slate-300">2.9%</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="px-6 py-4 font-semibold text-slate-200">Reels / Month</td>
                <td className="px-6 py-4 font-bold text-indigo-300 bg-indigo-500/5 border-x border-indigo-500/10">8</td>
                <td className="px-6 py-4 text-slate-300">6</td>
                <td className="px-6 py-4 text-slate-300">12</td>
                <td className="px-6 py-4 text-slate-300">4</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="px-6 py-4 font-semibold text-slate-200">Posts / Month</td>
                <td className="px-6 py-4 font-bold text-indigo-300 bg-indigo-500/5 border-x border-indigo-500/10">12</td>
                <td className="px-6 py-4 text-slate-300">8</td>
                <td className="px-6 py-4 text-slate-300">15</td>
                <td className="px-6 py-4 text-slate-300">10</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="px-6 py-4 font-semibold text-slate-200">Stories / Week</td>
                <td className="px-6 py-4 font-bold text-indigo-300 bg-indigo-500/5 border-x border-indigo-500/10">7</td>
                <td className="px-6 py-4 text-slate-300">3</td>
                <td className="px-6 py-4 text-slate-300">14</td>
                <td className="px-6 py-4 text-slate-300">2</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="px-6 py-4 font-semibold text-slate-200">Optimal Post Window</td>
                <td className="px-6 py-4 font-bold text-amber-400 bg-indigo-500/5 border-x border-indigo-500/10">
                  2:15 PM Tue ⭐
                </td>
                <td className="px-6 py-4 text-slate-400">10:00 AM Mon</td>
                <td className="px-6 py-4 text-slate-400">6:00 PM Wed</td>
                <td className="px-6 py-4 text-slate-400">8:00 PM Thu</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: AI Insights & Content Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Strategic Insights */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-white">AI-Generated Competitive Insights</h3>
          </div>

          <div className="space-y-3">
            {insights.map((insight, idx) => (
              <div key={idx} className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-lg text-xs leading-relaxed text-slate-300">
                {insight}
              </div>
            ))}
          </div>
        </div>

        {/* Content Theme Mix Comparison */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-semibold text-white">Content Theme Mix Breakdown</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>Educational & Tutorials</span>
                <span>@fashion_guru lead (45%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                <div className="bg-indigo-500 h-full" style={{ width: '20%' }} title="Your Account (20%)" />
                <div className="bg-purple-500 h-full" style={{ width: '45%' }} title="Competitor (45%)" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Your Account: 20%</span>
                <span>Competitor Avg: 38%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>Behind-The-Scenes (Your Advantage ⭐)</span>
                <span>Your Account lead (40%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full" style={{ width: '40%' }} title="Your Account (40%)" />
                <div className="bg-slate-600 h-full" style={{ width: '15%' }} title="Competitors (15%)" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Your Account: 40%</span>
                <span>Competitor Avg: 15%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>Promotional & Offers</span>
                <span>Balanced</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                <div className="bg-amber-500 h-full" style={{ width: '15%' }} title="Your Account (15%)" />
                <div className="bg-slate-600 h-full" style={{ width: '30%' }} title="Competitors (30%)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Competitor Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add Monitored Competitor</h3>
            <p className="text-xs text-slate-400">
              Only public Instagram accounts are monitored according to Meta Official API ToS.
            </p>

            <form onSubmit={handleAddCompetitor} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Instagram Handle</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">@</span>
                  <input
                    type="text"
                    required
                    placeholder="competitor_handle"
                    value={newHandle}
                    onChange={(e) => setNewHandle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Sync Competitor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
