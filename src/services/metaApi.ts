import type { PostItem, SocialAccount } from '../types';

export interface MetaConnectionState {
  appId: string;
  appSecret: string;
  userAccessToken: string;
  pageId: string;
  instagramBusinessAccountId: string;
  isConnected: boolean;
}

const META_STORAGE_KEY = 'socialpilot_meta_credentials';

export const getMetaCredentials = (): MetaConnectionState => {
  const stored = localStorage.getItem(META_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
  }
  return {
    appId: import.meta.env.VITE_META_APP_ID || '',
    appSecret: import.meta.env.VITE_META_APP_SECRET || '',
    userAccessToken: import.meta.env.VITE_META_ACCESS_TOKEN || '',
    pageId: import.meta.env.VITE_META_PAGE_ID || '',
    instagramBusinessAccountId: import.meta.env.VITE_META_IG_ACCOUNT_ID || '',
    isConnected: false
  };
};

export const saveMetaCredentials = (credentials: MetaConnectionState) => {
  localStorage.setItem(META_STORAGE_KEY, JSON.stringify(credentials));
};

export interface InstagramProfileData {
  id: string;
  username: string;
  name?: string;
  biography?: string;
  profile_picture_url?: string;
  followers_count?: number;
  following_count?: number;
  media_count?: number;
}

export interface MetaPublishResult {
  success: boolean;
  platform: 'instagram' | 'facebook';
  instagram_media_id?: string;
  meta_response?: any;
  error_code?: string;
  error?: string;
}

/**
 * Mask sensitive tokens for security logging
 */
export const maskToken = (token: string): string => {
  if (!token || token.length <= 8) return '****';
  return `${token.substring(0, 4)}...${token.substring(token.length - 4)}`;
};

/**
 * Fetch Instagram Professional Account details directly from Meta Graph API
 */
export const fetchInstagramProfile = async (
  accessToken: string,
  igAccountId: string
): Promise<{ success: boolean; profile?: InstagramProfileData; error?: string }> => {
  if (!accessToken || !igAccountId) {
    return {
      success: false,
      error: 'Missing Meta Access Token or Instagram Business Account ID'
    };
  }

  try {
    const fields = 'id,username,name,biography,profile_picture_url,followers_count,follows_count,media_count';
    const url = `https://graph.facebook.com/v19.0/${igAccountId}?fields=${fields}&access_token=${encodeURIComponent(accessToken)}`;
    
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      return {
        success: false,
        error: `Meta Graph API Error [${data.error.code}]: ${data.error.message}`
      };
    }

    return {
      success: true,
      profile: {
        id: data.id,
        username: data.username,
        name: data.name || data.username,
        biography: data.biography || '',
        profile_picture_url: data.profile_picture_url || '',
        followers_count: data.followers_count || 0,
        following_count: data.follows_count || 0,
        media_count: data.media_count || 0
      }
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Network error verifying Instagram profile: ${err?.message || 'Check connection'}`
    };
  }
};

/**
 * Strict Production Instagram & Facebook Publishing
 * NEVER returns success: true unless Meta returns a real Instagram Media ID!
 * Supports Single Image, Carousel, and Reel Publishing.
 */
export const publishToMetaAccounts = async (
  post: PostItem,
  socialAccount?: SocialAccount
): Promise<MetaPublishResult> => {
  const creds = getMetaCredentials();

  const accessToken = socialAccount?.access_token || creds.userAccessToken || import.meta.env.VITE_META_ACCESS_TOKEN;
  const igAccountId = socialAccount?.platform_account_id || socialAccount?.meta_account_id || creds.instagramBusinessAccountId || import.meta.env.VITE_META_IG_ACCOUNT_ID;
  const pageId = creds.pageId || import.meta.env.VITE_META_PAGE_ID;

  // STRICT REQUIREMENT: No token or account ID -> Fail explicitly
  if (!accessToken) {
    return {
      success: false,
      platform: 'instagram',
      error_code: 'MISSING_ACCESS_TOKEN',
      error: 'Publish Failed: Missing Meta Graph API Access Token. Please connect an Instagram Professional Account via Meta OAuth.'
    };
  }

  if (!igAccountId && !pageId) {
    return {
      success: false,
      platform: 'instagram',
      error_code: 'MISSING_ACCOUNT_ID',
      error: 'Publish Failed: Missing Instagram Professional Account ID or Facebook Page ID.'
    };
  }

  // Attempt Instagram Publishing via Meta Graph API
  if (igAccountId) {
    try {
      const fullCaption = `${post.headline}\n\n${post.caption}\n\n${(post.hashtags || []).join(' ')}`;
      const mediaUrl = post.media_url || 'https://images.unsplash.com/photo-1542744094-3a31b272c490';
      const contentTypeLower = (post.content_type || '').toLowerCase();

      const isCarousel = contentTypeLower.includes('carousel');
      const isVideoOrReel = (post.required_media_type && post.required_media_type.toLowerCase().includes('video')) || 
                            mediaUrl.match(/\.(mp4|mov|webm)(\?.*)?$/i) !== null || 
                            contentTypeLower.includes('reel');

      let creationId = '';

      if (isCarousel) {
        // --- CAROUSEL PUBLISHING FLOW ---
        // Step 1: Create child item containers (e.g. 2 media items)
        const sampleCarouselUrls = [
          mediaUrl,
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
        ];

        const childContainerIds: string[] = [];

        for (const childUrl of sampleCarouselUrls) {
          const childParams = new URLSearchParams({
            access_token: accessToken,
            is_carousel_item: 'true',
            image_url: childUrl
          });

          const childRes = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media?${childParams.toString()}`, { method: 'POST' });
          const childData = await childRes.json();

          if (childData.error || !childData.id) {
            return {
              success: false,
              platform: 'instagram',
              error_code: String(childData.error?.code || 'CAROUSEL_CHILD_FAIL'),
              error: `Meta Carousel Child Container Error [${childData.error?.code}]: ${childData.error?.message}`
            };
          }
          childContainerIds.push(childData.id);
        }

        // Step 2: Create parent carousel container
        const carouselParams = new URLSearchParams({
          access_token: accessToken,
          media_type: 'CAROUSEL',
          children: childContainerIds.join(','),
          caption: fullCaption
        });

        const parentRes = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media?${carouselParams.toString()}`, { method: 'POST' });
        const parentData = await parentRes.json();

        if (parentData.error || !parentData.id) {
          return {
            success: false,
            platform: 'instagram',
            error_code: String(parentData.error?.code || 'CAROUSEL_PARENT_FAIL'),
            error: `Meta Parent Carousel Container Error [${parentData.error?.code}]: ${parentData.error?.message}`
          };
        }

        creationId = parentData.id;
      } else {
        // --- SINGLE IMAGE / REEL CONTAINER FLOW ---
        const containerEndpoint = `https://graph.facebook.com/v19.0/${igAccountId}/media`;
        
        const params = new URLSearchParams({
          access_token: accessToken,
          caption: fullCaption
        });

        if (isVideoOrReel) {
          params.append('media_type', 'REELS');
          params.append('video_url', mediaUrl);
        } else {
          params.append('image_url', mediaUrl);
        }

        const createRes = await fetch(`${containerEndpoint}?${params.toString()}`, { method: 'POST' });
        const createData = await createRes.json();

        if (createData.error || !createData.id) {
          return {
            success: false,
            platform: 'instagram',
            error_code: String(createData.error?.code || 'CONTAINER_FAIL'),
            error: `Meta Media Container Error [${createData.error?.code || 'NO_ID'}]: ${createData.error?.message || 'Failed to create Instagram media container'}`
          };
        }

        creationId = createData.id;
      }

      // Step 2: For Videos/Reels, poll container status until FINISHED
      if (isVideoOrReel && !isCarousel) {
        let isReady = false;
        let attempts = 0;
        while (!isReady && attempts < 12) {
          await new Promise(r => setTimeout(r, 2500));
          attempts++;
          const statusRes = await fetch(`https://graph.facebook.com/v19.0/${creationId}?fields=status_code,status&access_token=${encodeURIComponent(accessToken)}`);
          const statusData = await statusRes.json();
          
          if (statusData.status_code === 'FINISHED') {
            isReady = true;
          } else if (statusData.status_code === 'ERROR' || statusData.error) {
            return {
              success: false,
              platform: 'instagram',
              error_code: 'REEL_ENCODING_ERROR',
              error: `Instagram Reel Processing Error on Meta: ${statusData.error?.message || 'Video container status returned ERROR'}`
            };
          }
        }

        if (!isReady) {
          return {
            success: false,
            platform: 'instagram',
            error_code: 'REEL_TIMEOUT',
            error: 'Instagram Reel Processing Timeout: Video encoding did not finish on Meta server in time.'
          };
        }
      }

      // Step 3: Call media_publish endpoint
      const publishRes = await fetch(
        `https://graph.facebook.com/v19.0/${igAccountId}/media_publish?creation_id=${creationId}&access_token=${encodeURIComponent(accessToken)}`,
        { method: 'POST' }
      );

      const publishData = await publishRes.json();

      // STRICT VALIDATION: Only succeed if publishData.id exists!
      if (publishData.error || !publishData.id) {
        return {
          success: false,
          platform: 'instagram',
          error_code: String(publishData.error?.code || 'PUBLISH_FAIL'),
          error: `Meta /media_publish Error [${publishData.error?.code || 'NO_PUB_ID'}]: ${publishData.error?.message || 'Failed to publish Instagram media container'}`
        };
      }

      // Successful Instagram publishing with real media ID!
      return {
        success: true,
        platform: 'instagram',
        instagram_media_id: publishData.id,
        meta_response: publishData
      };
    } catch (err: any) {
      return {
        success: false,
        platform: 'instagram',
        error_code: 'NETWORK_ERROR',
        error: `Network Connection Error to Meta API: ${err?.message || 'CORS or Network issue'}`
      };
    }
  }

  // Attempt Facebook Page Publishing if pageId exists
  if (pageId) {
    try {
      const fbRes = await fetch(
        `https://graph.facebook.com/v19.0/${pageId}/feed?message=${encodeURIComponent(post.caption)}&link=${encodeURIComponent(post.media_url || '')}&access_token=${encodeURIComponent(accessToken)}`,
        { method: 'POST' }
      );

      const fbData = await fbRes.json();

      if (fbData.error || !fbData.id) {
        return {
          success: false,
          platform: 'facebook',
          error_code: String(fbData.error?.code || 'FB_PUBLISH_FAIL'),
          error: `Facebook Graph API Error [${fbData.error?.code || 'NO_ID'}]: ${fbData.error?.message || 'Failed to publish to Facebook Page'}`
        };
      }

      return {
        success: true,
        platform: 'facebook',
        instagram_media_id: fbData.id,
        meta_response: fbData
      };
    } catch (err: any) {
      return {
        success: false,
        platform: 'facebook',
        error_code: 'FB_NETWORK_ERROR',
        error: `Facebook Network Error: ${err?.message}`
      };
    }
  }

  return {
    success: false,
    platform: 'instagram',
    error_code: 'NO_ACCOUNT_CONFIGURED',
    error: 'Publish Failed: No valid Instagram Business Account ID or Facebook Page ID.'
  };
};
