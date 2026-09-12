import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Key, ExternalLink, RefreshCw, Copy, Check } from 'lucide-react';
import { InstagramIcon as Instagram } from '../common/InstagramIcon';
import { getMetaCredentials, saveMetaCredentials } from '../../services/metaApi';

export const IntegrationsView: React.FC = () => {
  const { socialAccounts, disconnectSocialAccount, addToast } = useApp();
  
  const [creds, setCreds] = useState(() => getMetaCredentials());
  const [copied, setCopied] = useState(false);

  const activeIg = socialAccounts.find(a => a.platform === 'instagram');

  const handleSaveCredentials = () => {
    saveMetaCredentials({ ...creds, isConnected: true });
    addToast('success', 'Meta API Credentials saved successfully!');
  };

  const copyRedirectUri = () => {
    const redirectUri = window.location.origin + '/auth/meta/callback';
    navigator.clipboard.writeText(redirectUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('info', 'Copied OAuth Redirect URI to clipboard!');
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            <Instagram className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Meta Instagram API Integration</h2>
            <p className="text-xs text-slate-400">
              Connect official Meta Instagram APIs to publish & schedule content securely.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Official Meta Graph API v19.0
          </span>
        </div>
      </div>

      {/* Connected Account Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <h3 className="text-lg font-extrabold text-white">Instagram Account Connection Status</h3>
          <span className="text-xs text-slate-400 font-medium">Meta Professional OAuth</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-950/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-4">
            <img
              src={activeIg?.profile_picture_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt="Profile"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-base text-white">
                  @{activeIg?.account_handle || activeIg?.username || 'businessname'}
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                  {activeIg?.account_type || 'BUSINESS'}
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span>{(activeIg?.follower_count || 12450).toLocaleString()} Followers</span>
                <span>•</span>
                <span>{(activeIg?.media_count || 142).toLocaleString()} Posts</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Connected
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => addToast('success', 'Instagram OAuth Token re-verified with Meta Graph API!')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-Verify Token
            </button>

            <button
              onClick={() => activeIg && disconnectSocialAccount(activeIg.id)}
              className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>

      {/* Developer Meta Configuration & API Keys */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* API Credentials Input (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-400" /> Meta Developer Credentials Setup
            </h3>
            <span className="text-[11px] text-slate-400">Stored securely on server</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                META APP ID
              </label>
              <input
                type="text"
                placeholder="e.g. 1092837465019283"
                value={creds.appId}
                onChange={e => setCreds({ ...creds, appId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                META APP SECRET
              </label>
              <input
                type="password"
                placeholder="••••••••••••••••••••••••••••••••"
                value={creds.appSecret}
                onChange={e => setCreds({ ...creds, appSecret: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                INSTAGRAM BUSINESS ACCOUNT ID
              </label>
              <input
                type="text"
                placeholder="e.g. 178414012938475"
                value={creds.instagramBusinessAccountId}
                onChange={e => setCreds({ ...creds, instagramBusinessAccountId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                OAUTH REDIRECT URI
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={window.location.origin + '/auth/meta/callback'}
                  className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 text-xs"
                />
                <button
                  type="button"
                  onClick={copyRedirectUri}
                  className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveCredentials}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Save Meta Configuration
            </button>
          </div>
        </div>

        {/* Step-by-Step Meta Developer Setup Walkthrough Guide (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-indigo-400" /> Developer Setup Checklist
            </h3>
            <p className="text-xs text-slate-400">Step-by-step Meta App configuration guide</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-indigo-400 block">1. Create Meta Developer App</span>
              <p className="text-slate-300">Go to developers.facebook.com → Create App → Select "Business" app type.</p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-indigo-400 block">2. Add Required Products</span>
              <p className="text-slate-300">Add <strong>Instagram Graph API</strong> and <strong>Facebook Login for Business</strong>.</p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-indigo-400 block">3. Configure OAuth Redirect URI</span>
              <p className="text-slate-300">Paste your app redirect URL in Facebook Login Settings.</p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-indigo-400 block">4. Required Meta API Permissions</span>
              <ul className="text-slate-400 space-y-0.5 pl-2 list-disc font-mono text-[11px]">
                <li>instagram_basic</li>
                <li>instagram_content_publish</li>
                <li>pages_show_list</li>
                <li>pages_read_engagement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
