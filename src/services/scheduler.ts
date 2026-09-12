import type { PostItem, SchedulerLog, SocialAccount, PublisherLog } from '../types';
import { publishToMetaAccounts } from './metaApi';

export class SchedulerEngine {
  private logs: SchedulerLog[] = [];
  private publisherAuditLogs: PublisherLog[] = [];
  private isRunning: boolean = false;
  private timerId: number | null = null;
  private onLogsUpdated?: (logs: SchedulerLog[]) => void;
  private onPublisherLogsUpdated?: (logs: PublisherLog[]) => void;
  private onPostStatusChanged?: (
    postId: string, 
    newStatus: PostItem['status'], 
    err?: string, 
    errCode?: string,
    mediaId?: string, 
    metaResponse?: any
  ) => void;

  constructor() {
    this.addLog('info', 'Production Scheduler engine initialized.');
  }

  public setCallbacks(
    onLogsUpdated: (logs: SchedulerLog[]) => void,
    onPostStatusChanged: (
      postId: string, 
      newStatus: PostItem['status'], 
      err?: string, 
      errCode?: string,
      mediaId?: string, 
      metaResponse?: any
    ) => void,
    onPublisherLogsUpdated?: (logs: PublisherLog[]) => void
  ) {
    this.onLogsUpdated = onLogsUpdated;
    this.onPostStatusChanged = onPostStatusChanged;
    this.onPublisherLogsUpdated = onPublisherLogsUpdated;
  }

  public getLogs(): SchedulerLog[] {
    return [...this.logs];
  }

  public getPublisherLogs(): PublisherLog[] {
    return [...this.publisherAuditLogs];
  }

  private addLog(type: SchedulerLog['type'], message: string, postId?: string) {
    const log: SchedulerLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      post_id: postId
    };
    this.logs = [log, ...this.logs.slice(0, 49)];
    if (this.onLogsUpdated) {
      this.onLogsUpdated(this.logs);
    }
  }

  private addAuditLog(logData: Omit<PublisherLog, 'id' | 'created_at'>) {
    const auditLog: PublisherLog = {
      ...logData,
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString()
    };
    this.publisherAuditLogs = [auditLog, ...this.publisherAuditLogs.slice(0, 99)];
    if (this.onPublisherLogsUpdated) {
      this.onPublisherLogsUpdated(this.publisherAuditLogs);
    }
  }

  public startAutoCheck(
    intervalSeconds: number = 30, 
    postsProvider: () => PostItem[], 
    socialAccountsProvider?: () => SocialAccount[],
    isTestModeProvider?: () => boolean
  ) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.addLog('info', `Automated background scheduler started (Interval: ${intervalSeconds}s).`);

    this.timerId = window.setInterval(() => {
      const socialAccs = socialAccountsProvider ? socialAccountsProvider() : [];
      const testMode = isTestModeProvider ? isTestModeProvider() : false;
      this.processDuePosts(postsProvider(), false, socialAccs, testMode);
    }, intervalSeconds * 1000);
  }

  public stopAutoCheck() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isRunning = false;
    this.addLog('info', 'Automated background scheduler paused.');
  }

  public isAutoRunning(): boolean {
    return this.isRunning;
  }

  public async processDuePosts(
    posts: PostItem[], 
    force: boolean = false, 
    socialAccounts: SocialAccount[] = [],
    isTestMode: boolean = false
  ): Promise<{ processedCount: number; successCount: number }> {
    const scheduledPosts = force 
      ? posts 
      : posts.filter(p => p.status === 'scheduled' || p.status === 'Scheduled' || p.status === 'approved' || p.status === 'Approved');
    const now = new Date();

    let processedCount = 0;
    let successCount = 0;

    const modeLabel = isTestMode ? '🟡 TEST PUBLISHING MODE' : '🟢 LIVE PRODUCTION MODE';
    this.addLog('info', `[${modeLabel}] ${force ? 'Manual Dispatch Triggered' : 'Automated check'}: ${scheduledPosts.length} posts queued...`);

    for (const post of scheduledPosts) {
      const postDateTimeStr = `${post.scheduled_date} ${post.scheduled_time || '09:00'}`;
      const postDate = new Date(postDateTimeStr);

      // Check if arrival date/time has passed or forced
      const isDue = force || isNaN(postDate.getTime()) || postDate <= now;

      if (isDue) {
        processedCount++;
        
        // Find associated social account
        const targetSocialAccount = socialAccounts.find(a => a.id === post.social_account_id) || 
                                     socialAccounts.find(a => a.platform === 'instagram' && a.is_connected);

        // Step 1: Transition status to 'publishing'
        if (this.onPostStatusChanged) {
          this.onPostStatusChanged(post.id, 'publishing');
        }

        if (isTestMode) {
          // --- TEST PUBLISHING MODE (Visually Distinct Test Mode) ---
          this.addLog('info', `[🟡 TEST MODE RUN] Simulating test dispatch for Post #${post.day_number}: "${post.headline}"`, post.id);
          await new Promise(r => setTimeout(r, 800));

          this.addAuditLog({
            user_id: post.user_id,
            business_id: post.business_id,
            post_id: post.id,
            social_account_id: targetSocialAccount?.id,
            action: 'test_mode_simulation',
            endpoint: '/v19.0/test_publishing',
            http_status: 200,
            meta_media_id: `TEST_SIMULATED_MEDIA_${Math.random().toString(36).substring(2, 8).toUpperCase()}`
          });

          this.addLog('warning', `[🟡 TEST MODE] Post #${post.day_number} executed in Test Mode. (Not sent to live Instagram feed).`, post.id);
          continue;
        }

        // --- PRODUCTION MODE: Strict Meta Graph API Publishing ---
        this.addLog('info', `[🟢 LIVE DISPATCH] Creating Instagram media container for Post #${post.day_number}: "${post.headline}" (Account: ${targetSocialAccount?.account_handle || 'Default'})`, post.id);

        this.addAuditLog({
          user_id: post.user_id,
          business_id: post.business_id,
          post_id: post.id,
          social_account_id: targetSocialAccount?.id,
          action: 'media_container_create',
          endpoint: `https://graph.facebook.com/v19.0/${targetSocialAccount?.platform_account_id || 'IG_ID'}/media`,
          http_status: 200
        });

        try {
          // Dispatch call to Meta Graph API
          const publishResult = await publishToMetaAccounts(post, targetSocialAccount);

          this.addAuditLog({
            user_id: post.user_id,
            business_id: post.business_id,
            post_id: post.id,
            social_account_id: targetSocialAccount?.id,
            action: 'media_publish',
            endpoint: `https://graph.facebook.com/v19.0/${targetSocialAccount?.platform_account_id || 'IG_ID'}/media_publish`,
            http_status: publishResult.success ? 200 : 400,
            meta_media_id: publishResult.instagram_media_id,
            error_code: publishResult.error_code,
            error_message: publishResult.error
          });

          // STRICT CHECK: Only mark 'published' if real Instagram media ID is returned!
          if (publishResult.success && publishResult.instagram_media_id) {
            successCount++;
            this.addLog('success', `[🟢 Meta API Verified] Published to ${publishResult.platform.toUpperCase()}! Verified Instagram Media ID: ${publishResult.instagram_media_id}`, post.id);
            if (this.onPostStatusChanged) {
              this.onPostStatusChanged(
                post.id, 
                'published', 
                undefined, 
                undefined,
                publishResult.instagram_media_id, 
                publishResult.meta_response
              );
            }
          } else {
            // STRICT CHECK: Set to 'failed' if Meta rejects or returns error
            const errReason = publishResult.error || 'Meta API returned unsuccessful publishing response';
            const errCode = publishResult.error_code || 'META_API_ERROR';

            this.addLog('error', `[🔴 Meta API Error ${errCode}] Publishing failed: ${errReason}`, post.id);
            if (this.onPostStatusChanged) {
              this.onPostStatusChanged(post.id, 'failed', errReason, errCode);
            }
          }
        } catch (err: any) {
          const errorMsg = err?.message || 'Network exception during Meta API dispatch';
          this.addLog('error', `[🔴 System Error] Exception during post execution: ${errorMsg}`, post.id);
          
          this.addAuditLog({
            user_id: post.user_id,
            business_id: post.business_id,
            post_id: post.id,
            social_account_id: targetSocialAccount?.id,
            action: 'media_publish_exception',
            endpoint: 'https://graph.facebook.com/v19.0/dispatch',
            http_status: 500,
            error_code: 'EXCEPTION',
            error_message: errorMsg
          });

          if (this.onPostStatusChanged) {
            this.onPostStatusChanged(post.id, 'failed', errorMsg, 'EXCEPTION');
          }
        }
      }
    }

    if (processedCount === 0) {
      this.addLog('info', 'No scheduled posts due at this check cycle.');
    }

    return { processedCount, successCount };
  }
}

export const schedulerInstance = new SchedulerEngine();
