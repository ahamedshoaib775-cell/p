import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Sparkles, X, ArrowRight, ShieldCheck, RefreshCw, AlertCircle, Key } from 'lucide-react';
import { fetchInstagramProfile, saveMetaCredentials, getMetaCredentials } from '../../services/metaApi';
import type { InstagramProfileData } from '../../services/metaApi';

interface InstagramConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export const InstagramConnectModal: React.FC<InstagramConnectModalProps> = ({ isOpen, onClose }) => {
  const { socialAccounts, updateSocialAccount, addToast, open7DayPlanModal } = useApp();
  
  const savedCreds = getMetaCredentials();
  const existingIg = socialAccounts.find(a => a.platform === 'instagram');

  const [accessTokenInput, setAccessTokenInput] = useState(savedCreds.userAccessToken || '');
  const [igAccountIdInput, setIgAccountIdInput] = useState(savedCreds.instagramBusinessAccountId || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verifiedProfile, setVerifiedProfile] = useState<InstagramProfileData | null>(null);

  if (!isOpen) return null;

  // Trigger Meta OAuth Login Popup
  const handleOAuthConnect = () => {
    const appId = savedCreds.appId || import.meta.env.VITE_META_APP_ID || '';
    if (!appId || appId === '1029384756' || appId.length < 5) {
      setErrorMessage('Invalid Meta App ID. Please configure a valid Meta App ID in .env (VITE_META_APP_ID) or enter your Access Token directly below.');
      addToast('error', 'Invalid Meta App ID for OAuth connection.');
      return;
    }
    const redirectUri = window.location.origin;
    const scope = import.meta.env.VITE_META_SCOPE || 'public_profile';
    const oauthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=token`;

    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      oauthUrl,
      'Meta OAuth Login',
      `width=${width},height=${height},top=${top},left=${left}`
    );

    addToast('info', 'Opening Meta Facebook OAuth Login popup window...');
  };

  // Perform strict Meta Graph API profile verification
  const handleVerifyAndConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const token = accessTokenInput.trim();
    const accountId = igAccountIdInput.trim();

    if (!token) {
      setErrorMessage('Meta Access Token is required for Instagram Graph API authentication.');
      return;
    }

    if (!accountId) {
      setErrorMessage('Instagram Professional Account ID is required.');
      return;
    }

    setIsVerifying(true);

    const res = await fetchInstagramProfile(token, accountId);

    setIsVerifying(false);

    if (!res.success || !res.profile) {
      setErrorMessage(res.error || 'Meta API verification failed. Invalid Access Token or Account ID.');
      addToast('error', 'Instagram Connection Failed: Invalid API Credentials.');
      return;
    }

    // Successfully verified real Instagram profile via Meta API!
    const profile = res.profile;
    setVerifiedProfile(profile);

    // Save to local storage credentials
    saveMetaCredentials({
      ...savedCreds,
      userAccessToken: token,
      instagramBusinessAccountId: accountId,
      isConnected: true
    });

    // Update social account in AppContext
    if (existingIg) {
      updateSocialAccount(existingIg.id, {
        is_connected: true,
        account_handle: `@${profile.username}`,
        account_name: profile.name || profile.username,
        meta_account_id: accountId,
        access_token: token,
        profile_picture_url: profile.profile_picture_url,
        biography: profile.biography,
        followers_count: profile.followers_count,
        media_count: profile.media_count
      });
    }

    addToast('success', `Verified & Connected Instagram account @${profile.username}!`);
  };

  const handleConfirmAndProceed = () => {
    onClose();
    open7DayPlanModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gradient Header */}
        <div className="bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white mb-4 border border-white/30 shadow-lg">
            <InstagramIcon className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black tracking-tight">Meta Instagram Authentication</h3>
          <p className="text-xs text-white/90 mt-1.5 max-w-xs mx-auto">
            Authenticate via Meta Graph API to verify your Instagram Professional profile & enable automatic publishing.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {verifiedProfile ? (
            /* Verified Connected Profile Card UI */
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 text-center relative overflow-hidden">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-1 mx-auto mb-3 shadow-md">
                  <img
                    src={verifiedProfile.profile_picture_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={verifiedProfile.username}
                    className="w-full h-full object-cover rounded-full bg-white"
                  />
                </div>

                <h4 className="text-xl font-extrabold text-slate-900">{verifiedProfile.name || verifiedProfile.username}</h4>
                <p className="text-xs font-mono font-bold text-rose-600">@{verifiedProfile.username}</p>

                {verifiedProfile.biography && (
                  <p className="text-xs text-slate-600 mt-2 italic max-w-sm mx-auto line-clamp-2">
                    "{verifiedProfile.biography}"
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-slate-200/80 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-slate-400 block">Followers</span>
                    <span className="text-lg font-black text-slate-900">{verifiedProfile.followers_count?.toLocaleString() || '0'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase text-slate-400 block">Media Posts</span>
                    <span className="text-lg font-black text-slate-900">{verifiedProfile.media_count?.toLocaleString() || '0'}</span>
                  </div>
                </div>

                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 border border-emerald-200 rounded-full text-xs font-extrabold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Meta Graph API Verified & Connected
                </div>
              </div>

              <button
                onClick={handleConfirmAndProceed}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Proceed to 7-Day Content Calendar
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleVerifyAndConnect} className="space-y-5">
              {/* OAuth Popup Trigger Button */}
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl text-center space-y-3">
                <p className="text-xs font-bold text-slate-800">Connect via Official Meta OAuth Dialog</p>
                <button
                  type="button"
                  onClick={handleOAuthConnect}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <InstagramIcon className="w-4 h-4" />
                  Connect Instagram via Meta OAuth
                </button>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-[11px] font-bold uppercase text-slate-400">Or Enter API Credentials</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-900">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">API Verification Failed</strong>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Meta Graph API User Access Token *
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="EAAB..."
                    value={accessTokenInput}
                    onChange={(e) => setAccessTokenInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Requires <code className="font-mono text-slate-600">instagram_basic</code> and <code className="font-mono text-slate-600">instagram_content_publish</code> scopes.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Instagram Professional Account ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="17841400000000000"
                  value={igAccountIdInput}
                  onChange={(e) => setIgAccountIdInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
                />
              </div>

              {/* Status Note */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-2.5 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  SocialPilot AI verifies your access token against Meta Graph API endpoints before enabling publishing.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-extrabold text-xs shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      Verifying API...
                    </>
                  ) : (
                    <>
                      Verify & Connect Instagram API
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
