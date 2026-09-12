import { fetchInstagramProfile } from './metaApi';
import type { SocialAccount } from '../types';

export interface MetaOAuthConfig {
  appId: string;
  redirectUri: string;
  scope: string;
}

export const getMetaOAuthConfig = (): MetaOAuthConfig => {
  const appId = import.meta.env.VITE_META_APP_ID || '';
  const redirectUri = window.location.origin;
  const scope = import.meta.env.VITE_META_SCOPE || 'public_profile';

  return { appId, redirectUri, scope };
};

/**
 * Initiates the official Meta / Instagram OAuth authorization redirect flow.
 * Directs user strictly to Meta/Instagram's official authorization page.
 */
export const initiateMetaOAuthRedirect = () => {
  const { appId, redirectUri, scope } = getMetaOAuthConfig();

  if (!appId || appId === '1029384756' || appId.length < 5) {
    alert('Invalid Meta App ID: Please enter a valid Meta App ID in .env (VITE_META_APP_ID) or Developer Settings before connecting via Facebook OAuth.');
    return;
  }

  const oauthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=token`;

  const width = 600;
  const height = 700;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  window.open(
    oauthUrl,
    'Meta Official Instagram OAuth Login',
    `width=${width},height=${height},top=${top},left=${left}`
  );
};

/**
 * Validates and verifies an authorized Meta access token against Graph API,
 * retrieving the user's Instagram Professional Account details.
 */
export const verifyAndConnectInstagramAccount = async (
  accessToken: string,
  igAccountId: string,
  businessId: string,
  userId?: string
): Promise<{ success: boolean; account?: SocialAccount; error?: string }> => {
  if (!accessToken) {
    return {
      success: false,
      error: 'OAuth Authorization Error: Missing access token.'
    };
  }

  if (!igAccountId) {
    return {
      success: false,
      error: 'Instagram Professional Account Error: Missing Account ID.'
    };
  }

  // Fetch real profile details from Meta Graph API
  const profileRes = await fetchInstagramProfile(accessToken, igAccountId);

  if (!profileRes.success || !profileRes.profile) {
    return {
      success: false,
      error: profileRes.error || 'Meta API verification failed: Unable to fetch Instagram Professional Account.'
    };
  }

  const p = profileRes.profile;

  const connectedAccount: SocialAccount = {
    id: `acc_ig_${Date.now()}`,
    user_id: userId || 'usr_demo_1',
    business_id: businessId,
    platform: 'instagram',
    platform_account_id: p.id,
    account_name: p.name || p.username,
    account_handle: `@${p.username}`,
    display_name: p.name || p.username,
    profile_picture_url: p.profile_picture_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: p.biography || '',
    follower_count: p.followers_count || 0,
    following_count: p.following_count || 0,
    media_count: p.media_count || 0,
    account_type: 'BUSINESS',
    access_token: accessToken,
    is_connected: true,
    status: 'connected',
    connected_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    scopes: ['instagram_basic', 'instagram_content_publish']
  };

  return {
    success: true,
    account: connectedAccount
  };
};
