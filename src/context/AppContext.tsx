import React, { createContext, useContext, useEffect, useState } from 'react';
import type { BusinessProfile, BrandProfile, BrandPreference, MediaAsset, PostItem, SchedulerLog, PublisherLog, SocialAccount, UserProfile, AIProviderSettings } from '../types';
import { getAIProvider } from '../services/ai';
import { generateBrandProfile } from '../services/brandAnalyzer';
import { analyzeUserEditAndLearn } from '../services/brandPreferences';
import { generateInitialPosts, initialSampleBusiness, sampleMediaAssets, sampleSocialAccounts } from '../utils/mockData';
import { schedulerInstance } from '../services/scheduler';
import { getMetaCredentials, saveMetaCredentials } from '../services/metaApi';

export type AppView = 
  | 'landing'
  | 'onboarding'
  | 'dashboard'
  | 'calendar'
  | 'content'
  | 'brand'
  | 'analytics'
  | 'competitors'
  | 'predictions'
  | 'team'
  | 'integrations'
  | 'settings'
  | 'logs'
  // Compatibility aliases
  | 'generator'
  | 'media'
  | 'scheduled'
  | 'profile'
  | 'social';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface AppContextType {
  // Auth
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  signup: (email: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  
  // Auth Modal
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'signup' | 'reset';
  openAuthModal: (tab?: 'login' | 'signup' | 'reset') => void;
  closeAuthModal: () => void;

  // Navigation & Multi-Business
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  // Test Mode Toggle (🟡 TEST vs 🟢 LIVE)
  isTestMode: boolean;
  toggleTestMode: () => void;

  // Business & Brand Profile & Preferences
  business: BusinessProfile | null;
  businesses: BusinessProfile[];
  brandProfile: BrandProfile | null;
  brandPreferences: BrandPreference[];
  updateBusiness: (updated: Partial<BusinessProfile>) => void;
  completeOnboarding: (data: BusinessProfile) => Promise<void>;
  recordBrandPreference: (originalText: string, editedText: string, category?: 'caption' | 'cta' | 'headline') => Promise<void>;

  // AI Settings
  aiSettings: AIProviderSettings;
  updateAISettings: (settings: Partial<AIProviderSettings>) => void;

  // Posts & Calendar
  posts: PostItem[];
  setPosts: React.Dispatch<React.SetStateAction<PostItem[]>>;
  generateNew7DayPlan: (customTopic?: string) => Promise<void>;
  regenerateSinglePost: (postId: string, customInstruction: string) => Promise<void>;
  updatePost: (id: string, updated: Partial<PostItem>) => void;
  deletePost: (id: string) => void;
  duplicatePost: (id: string) => void;
  approvePost: (id: string) => void;
  rejectPost: (id: string) => void;
  approveFull7DayPlan: () => void;
  schedulePost: (id: string, dateStr?: string, timeStr?: string) => void;
  publishPostNow: (id: string) => Promise<void>;

  // Post Editor Modal
  editingPost: PostItem | null;
  setEditingPost: (post: PostItem | null) => void;

  // Instagram Connection & 7-Day Plan Modals
  isInstagramConnectOpen: boolean;
  openInstagramConnectModal: () => void;
  closeInstagramConnectModal: () => void;
  is7DayPlanOpen: boolean;
  open7DayPlanModal: () => void;
  close7DayPlanModal: () => void;

  // Media Assets
  mediaAssets: MediaAsset[];
  addMediaAsset: (asset: MediaAsset) => void;
  deleteMediaAsset: (id: string) => void;

  // Social Accounts
  socialAccounts: SocialAccount[];
  updateSocialAccount: (id: string, updated: Partial<SocialAccount>) => void;
  disconnectSocialAccount: (id: string) => void;

  // Scheduler & Audit Logs
  schedulerLogs: SchedulerLog[];
  publisherLogs: PublisherLog[];
  isSchedulerActive: boolean;
  toggleScheduler: () => void;
  runSchedulerManual: () => Promise<void>;

  // Toast System
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User state
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('socialpilot_user');
    return saved ? JSON.parse(saved) : { id: 'usr_demo_1', email: 'owner@artisanbloom.com', full_name: 'Alex Morgan' };
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('socialpilot_authed') === 'true';
  });

  // Auth modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup' | 'reset'>('login');

  const openAuthModal = (tab: 'login' | 'signup' | 'reset' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Current view
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const isAuthed = localStorage.getItem('socialpilot_authed') === 'true';
    return isAuthed ? 'dashboard' : 'landing';
  });

  // Test Mode toggle (🟡 TEST vs 🟢 LIVE)
  const [isTestMode, setIsTestMode] = useState<boolean>(() => {
    return localStorage.getItem('socialpilot_test_mode') === 'true';
  });

  const toggleTestMode = () => {
    setIsTestMode(prev => {
      const next = !prev;
      localStorage.setItem('socialpilot_test_mode', String(next));
      addToast(next ? 'info' : 'success', next ? 'Switched to Test Publishing Mode (🟡 TEST)' : 'Switched to Live Production Mode (🟢 LIVE)');
      return next;
    });
  };

  // AI Provider settings
  const [aiSettings, setAiSettings] = useState<AIProviderSettings>(() => {
    const saved = localStorage.getItem('socialpilot_ai_settings');
    return saved ? JSON.parse(saved) : { provider: 'mock', modelName: 'Smart Local Engine', creativityLevel: 0.7 };
  });

  const updateAISettings = (settings: Partial<AIProviderSettings>) => {
    setAiSettings(prev => {
      const next = { ...prev, ...settings };
      localStorage.setItem('socialpilot_ai_settings', JSON.stringify(next));
      addToast('success', `AI Provider updated to ${next.provider.toUpperCase()}`);
      return next;
    });
  };

  // Business & Brand Profile & Preferences
  const [business, setBusiness] = useState<BusinessProfile | null>(() => {
    const saved = localStorage.getItem('socialpilot_business');
    return saved ? JSON.parse(saved) : initialSampleBusiness;
  });

  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(() => {
    const saved = localStorage.getItem('socialpilot_brand_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [brandPreferences, setBrandPreferences] = useState<BrandPreference[]>(() => {
    const saved = localStorage.getItem('socialpilot_brand_prefs');
    return saved ? JSON.parse(saved) : [];
  });

  const businesses = business ? [business] : [];

  // Social accounts
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>(() => {
    const saved = localStorage.getItem('socialpilot_social');
    return saved ? JSON.parse(saved) : sampleSocialAccounts;
  });

  // Posts state
  const [posts, setPosts] = useState<PostItem[]>(() => {
    const saved = localStorage.getItem('socialpilot_posts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return generateInitialPosts(initialSampleBusiness);
  });

  // Editing post modal state
  const [editingPost, setEditingPost] = useState<PostItem | null>(null);

  // Instagram Connection & 7-Day Plan modal states
  const [isInstagramConnectOpen, setIsInstagramConnectOpen] = useState<boolean>(false);
  const [is7DayPlanOpen, setIs7DayPlanOpen] = useState<boolean>(false);

  const openInstagramConnectModal = () => setIsInstagramConnectOpen(true);
  const closeInstagramConnectModal = () => setIsInstagramConnectOpen(false);
  const open7DayPlanModal = () => setIs7DayPlanOpen(true);
  const close7DayPlanModal = () => setIs7DayPlanOpen(false);

  // Media assets
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(() => {
    const saved = localStorage.getItem('socialpilot_media');
    return saved ? JSON.parse(saved) : sampleMediaAssets;
  });

  // Scheduler logs & Developer Publisher logs
  const [schedulerLogs, setSchedulerLogs] = useState<SchedulerLog[]>([]);
  const [publisherLogs, setPublisherLogs] = useState<PublisherLog[]>([]);
  const [isSchedulerActive, setIsSchedulerActive] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync states to localStorage
  useEffect(() => {
    if (business) localStorage.setItem('socialpilot_business', JSON.stringify(business));
  }, [business]);

  useEffect(() => {
    if (brandProfile) localStorage.setItem('socialpilot_brand_profile', JSON.stringify(brandProfile));
  }, [brandProfile]);

  useEffect(() => {
    localStorage.setItem('socialpilot_brand_prefs', JSON.stringify(brandPreferences));
  }, [brandPreferences]);

  useEffect(() => {
    localStorage.setItem('socialpilot_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('socialpilot_media', JSON.stringify(mediaAssets));
  }, [mediaAssets]);

  useEffect(() => {
    localStorage.setItem('socialpilot_social', JSON.stringify(socialAccounts));
  }, [socialAccounts]);

  // Setup Scheduler Callbacks
  useEffect(() => {
    schedulerInstance.setCallbacks(
      (logs) => setSchedulerLogs(logs),
      (postId, newStatus, err, errCode, mediaId, metaResp) => {
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              status: newStatus,
              instagram_media_id: mediaId || p.instagram_media_id,
              meta_response: metaResp || p.meta_response,
              error_message: err || ((newStatus === 'failed' || newStatus === 'Failed') ? 'Publishing failed' : undefined),
              error_code: errCode || p.error_code,
              failure_reason: err,
              published_at: (newStatus === 'published' || newStatus === 'Published' || newStatus === 'PUBLISHED') ? new Date().toISOString() : p.published_at
            };
          }
          return p;
        }));
      },
      (auditLogs) => setPublisherLogs(auditLogs)
    );
    setSchedulerLogs(schedulerInstance.getLogs());
    setPublisherLogs(schedulerInstance.getPublisherLogs());
  }, []);

  // Handle OAuth Access Token callback in URL parameters
  useEffect(() => {
    const hash = window.location.hash || window.location.search;
    if (hash.includes('access_token=')) {
      const match = hash.match(/access_token=([^&]+)/);
      if (match && match[1]) {
        const token = match[1];
        addToast('success', 'Meta OAuth Access Token connected successfully!');
        const creds = getMetaCredentials();
        saveMetaCredentials({
          ...creds,
          userAccessToken: token,
          isConnected: true
        });
        window.history.replaceState(null, '', window.location.pathname);
        setIsAuthenticated(true);
        localStorage.setItem('socialpilot_authed', 'true');
        setCurrentView('integrations');
      }
    }
  }, []);

  const addToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auth Methods
  const login = async (email: string) => {
    const cleanEmail = email || 'owner@artisanbloom.com';
    const demoUser = { id: 'usr_demo_1', email: cleanEmail, full_name: cleanEmail.split('@')[0] || 'Alex Morgan' };
    setUser(demoUser);
    setIsAuthenticated(true);
    localStorage.setItem('socialpilot_user', JSON.stringify(demoUser));
    localStorage.setItem('socialpilot_authed', 'true');
    closeAuthModal();
    addToast('success', 'Logged in successfully!');
    
    if (!business?.onboarding_completed) {
      setCurrentView('onboarding');
    } else {
      setCurrentView('dashboard');
    }
  };

  const signup = async (email: string, name: string) => {
    const newUser = { id: `usr_${Date.now()}`, email: email || 'owner@newbusiness.com', full_name: name || 'New Owner' };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('socialpilot_user', JSON.stringify(newUser));
    localStorage.setItem('socialpilot_authed', 'true');
    closeAuthModal();
    addToast('success', 'Account created successfully!');
    setCurrentView('onboarding');
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('socialpilot_authed');
    addToast('info', 'Signed out.');
    setCurrentView('landing');
  };

  const resetPassword = async (email: string) => {
    addToast('success', 'Password reset instructions sent to ' + email);
    closeAuthModal();
  };

  // Business & Brand Profile Actions
  const updateBusiness = (updated: Partial<BusinessProfile>) => {
    setBusiness(prev => prev ? { ...prev, ...updated } : null);
    addToast('success', 'Business profile updated!');
  };

  const completeOnboarding = async (data: BusinessProfile) => {
    const fullData = { ...data, onboarding_completed: true };
    setBusiness(fullData);

    // Generate Brand Profile via AI Provider
    const bProfile = await generateBrandProfile(fullData);
    setBrandProfile(bProfile);

    // Generate Initial 7-Day Plan
    const aiProvider = getAIProvider(aiSettings);
    const rawPlan = await aiProvider.generate7DayPlan(fullData, bProfile, { preferences: brandPreferences });

    const activeIg = socialAccounts.find(a => a.platform === 'instagram' && a.is_connected);
    const taggedPosts: PostItem[] = rawPlan.map((item, idx) => ({
      ...item,
      id: `post_ob_${Date.now()}_${idx}`,
      user_id: fullData.user_id,
      business_id: fullData.id,
      social_account_id: activeIg?.id,
      created_at: new Date().toISOString()
    }));

    setPosts(taggedPosts);
    addToast('success', 'Onboarding complete! Brand Profile & 7-Day Content Plan ready.');
    setCurrentView('dashboard');
  };

  const recordBrandPreference = async (originalText: string, editedText: string, category: 'caption' | 'cta' | 'headline' = 'caption') => {
    if (!business) return;
    const pref = await analyzeUserEditAndLearn(business.id, originalText, editedText, category);
    if (pref) {
      setBrandPreferences(prev => [pref, ...prev]);
      addToast('info', 'Brand Voice Memory updated from your edit!', `System learned to prefer your style for future posts.`);
    }
  };

  // Content Actions
  const generateNew7DayPlan = async (customTopic?: string) => {
    if (!business) return;
    addToast('info', 'AI is crafting your personalized 7-Day Instagram Content Plan...');
    const aiProvider = getAIProvider(aiSettings);
    const rawPlan = await aiProvider.generate7DayPlan(business, brandProfile, { customFocus: customTopic, preferences: brandPreferences });
    
    const activeIg = socialAccounts.find(a => a.platform === 'instagram' && a.is_connected);
    const formatted: PostItem[] = rawPlan.map((item, idx) => ({
      ...item,
      id: `post_gen_${Date.now()}_${idx}`,
      user_id: user?.id || 'usr_demo_1',
      business_id: business.id,
      social_account_id: activeIg?.id,
      created_at: new Date().toISOString()
    }));

    setPosts(formatted);
    addToast('success', 'Generated a fresh 7-Day Instagram Content Plan!');
  };

  const regenerateSinglePost = async (postId: string, customInstruction: string) => {
    const target = posts.find(p => p.id === postId);
    if (!target || !business) return;

    addToast('info', `AI regenerating post: "${customInstruction}"...`);
    const aiProvider = getAIProvider(aiSettings);
    const updatedFields = await aiProvider.regenerateSingleItem({
      customInstruction,
      itemToRegenerate: target,
      business,
      brandProfile,
      preferences: brandPreferences
    });

    updatePost(postId, updatedFields);
    addToast('success', 'Post content regenerated!');
  };

  const updatePost = (id: string, updated: Partial<PostItem>) => {
    const target = posts.find(p => p.id === id);
    if (target && updated.caption && updated.caption !== target.caption) {
      recordBrandPreference(target.caption, updated.caption, 'caption');
    }
    setPosts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    addToast('info', 'Post removed.');
  };

  const duplicatePost = (id: string) => {
    const target = posts.find(p => p.id === id);
    if (!target) return;
    const dup: PostItem = {
      ...target,
      id: `post_dup_${Date.now()}`,
      title: `${target.title} (Copy)`,
      headline: `${target.headline || target.title} (Copy)`,
      status: 'DRAFT',
      created_at: new Date().toISOString()
    };
    setPosts(prev => [dup, ...prev]);
    addToast('success', 'Post duplicated as Draft.');
  };

  const approvePost = (id: string) => {
    updatePost(id, { status: 'APPROVED' });
    addToast('success', 'Post approved!');
  };

  const rejectPost = (id: string) => {
    updatePost(id, { status: 'DRAFT' });
    addToast('info', 'Post rejected back to Draft.');
  };

  const approveFull7DayPlan = () => {
    setPosts(prev => prev.map((p, idx) => idx < 7 ? { ...p, status: 'SCHEDULED' } : p));
    if (!isSchedulerActive) {
      schedulerInstance.startAutoCheck(30, () => posts, () => socialAccounts, () => isTestMode);
      setIsSchedulerActive(true);
    }
    addToast('success', 'Approved 7-Day Instagram Plan & Activated Auto-Posting!');
  };

  const schedulePost = (id: string, dateStr?: string, timeStr?: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: 'SCHEDULED',
          scheduled_date: dateStr || p.scheduled_date,
          scheduled_time: timeStr || p.scheduled_time
        };
      }
      return p;
    }));
    addToast('success', 'Post scheduled for automatic publishing.');
  };

  const publishPostNow = async (id: string) => {
    const target = posts.find(p => p.id === id);
    if (!target) return;

    if (isTestMode) {
      addToast('info', `[🟡 TEST MODE] Executing test dispatch for "${target.title}"...`);
    } else {
      addToast('info', `[🟢 LIVE MODE] Connecting Meta API for "${target.title}"...`);
    }

    const res = await schedulerInstance.processDuePosts(
      [{ ...target, status: 'SCHEDULED' }], 
      true, 
      socialAccounts, 
      isTestMode
    );

    if (isTestMode) {
      addToast('info', 'Test Dispatch Complete (🟡 TEST MODE). Check Audit Logs.');
    } else if (res.successCount > 0) {
      addToast('success', 'Instagram Post published! Real Media ID verified by Meta.');
    } else {
      addToast('error', 'Publishing Failed. Check Meta Graph API error in Developer Logs.');
    }
  };

  // Media Actions
  const addMediaAsset = (asset: MediaAsset) => {
    setMediaAssets(prev => [asset, ...prev]);
    addToast('success', `Added ${asset.file_name} to Media Library.`);
  };

  const deleteMediaAsset = (id: string) => {
    setMediaAssets(prev => prev.filter(m => m.id !== id));
    addToast('info', 'Media asset removed.');
  };

  // Social Account Actions
  const updateSocialAccount = (id: string, updated: Partial<SocialAccount>) => {
    setSocialAccounts(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
    addToast('success', 'Social account connection updated.');
  };

  const disconnectSocialAccount = (id: string) => {
    setSocialAccounts(prev => prev.map(a => a.id === id ? {
      ...a,
      is_connected: false,
      status: 'disconnected',
      access_token: undefined
    } : a));
    addToast('info', 'Instagram Account disconnected.');
  };

  // Scheduler Controls
  const toggleScheduler = () => {
    if (isSchedulerActive) {
      schedulerInstance.stopAutoCheck();
      setIsSchedulerActive(false);
      addToast('info', 'Automated background scheduler paused.');
    } else {
      schedulerInstance.startAutoCheck(30, () => posts, () => socialAccounts, () => isTestMode);
      setIsSchedulerActive(true);
      addToast('success', 'Automated background scheduler active! (Checks every 30s)');
    }
  };

  const runSchedulerManual = async () => {
    const modeLabel = isTestMode ? '🟡 TEST' : '🟢 LIVE';
    addToast('info', `Triggering manual scheduler check cycle (${modeLabel})...`);
    await schedulerInstance.processDuePosts(posts, true, socialAccounts, isTestMode);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        resetPassword,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        currentView,
        setCurrentView,
        isTestMode,
        toggleTestMode,
        business,
        businesses,
        brandProfile,
        brandPreferences,
        updateBusiness,
        completeOnboarding,
        recordBrandPreference,
        aiSettings,
        updateAISettings,
        posts,
        setPosts,
        generateNew7DayPlan,
        regenerateSinglePost,
        updatePost,
        deletePost,
        duplicatePost,
        approvePost,
        rejectPost,
        approveFull7DayPlan,
        schedulePost,
        publishPostNow,
        editingPost,
        setEditingPost,
        isInstagramConnectOpen,
        openInstagramConnectModal,
        closeInstagramConnectModal,
        is7DayPlanOpen,
        open7DayPlanModal,
        close7DayPlanModal,
        mediaAssets,
        addMediaAsset,
        deleteMediaAsset,
        socialAccounts,
        updateSocialAccount,
        disconnectSocialAccount,
        schedulerLogs,
        publisherLogs,
        isSchedulerActive,
        toggleScheduler,
        runSchedulerManual,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
