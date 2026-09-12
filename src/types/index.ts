export type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
};

export type TeamRole = 'owner' | 'manager' | 'editor' | 'viewer';
export type MemberStatus = 'pending' | 'active' | 'inactive';

export type Team = {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at?: string;
};

export type TeamMember = {
  id: string;
  team_id: string;
  user_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: TeamRole;
  invited_at: string;
  joined_at?: string;
  status: MemberStatus;
};

export type TeamInvitation = {
  id: string;
  team_id: string;
  email: string;
  role: TeamRole;
  invited_by: string;
  token: string;
  created_at: string;
  expires_at: string;
  accepted_at?: string;
};

export type BusinessProfile = {
  id: string;
  user_id: string;
  business_name: string;
  business_category: string;
  business_description: string;
  location: string;
  target_audience: string;
  products_services: string;
  main_goal?: string;
  brand_personality?: string[];
  content_preferences?: string[];
  brand_tone: string;
  brand_colors: string[];
  website_url?: string;
  instagram_username?: string;
  facebook_page?: string;
  posting_frequency: string;
  logo_url?: string;
  onboarding_completed: boolean;
  created_at?: string;
};

export type BrandProfile = {
  id?: string;
  business_id: string;
  businessName: string;
  industry: string;
  targetAudience: string;
  location: string;
  tone: string;
  personality: string[];
  contentPillars: string[];
  visualStyle: string;
  preferredWords: string[];
  avoidedWords: string[];
  CTAStyle: string;
  hashtagStyle: string;
  postingFrequency: string;
  businessGoals: string;
  created_at?: string;
};

export type BrandPreference = {
  id: string;
  business_id: string;
  original_ai_text: string;
  user_edited_text: string;
  avoided_phrases: string[];
  preferred_phrases: string[];
  category?: 'caption' | 'cta' | 'headline';
  notes?: string;
  created_at: string;
};

export type MediaAsset = {
  id: string;
  user_id?: string;
  business_id: string;
  file_name: string;
  public_url: string;
  asset_type: 'image' | 'video' | 'logo';
  file_size?: number;
  source: 'user_uploaded' | 'ai_generated' | 'licensed_stock';
  tags?: string[];
  created_at: string;
};

export type SocialAccountStatus = 
  | 'pending'
  | 'connected'
  | 'expired'
  | 'revoked'
  | 'error'
  | 'disconnected';

export type SocialAccount = {
  id: string;
  user_id?: string;
  business_id: string;
  platform: 'instagram' | 'facebook';
  platform_account_id?: string;
  meta_account_id?: string;
  instagram_business_account_id?: string;
  account_name: string;
  account_handle?: string;
  username?: string;
  display_name?: string;
  profile_picture_url?: string;
  bio?: string;
  biography?: string;
  follower_count?: number;
  followers_count?: number;
  following_count?: number;
  media_count?: number;
  account_type?: 'BUSINESS' | 'CREATOR';
  access_token?: string;
  access_token_encrypted?: string;
  token_expires_at?: string;
  scopes?: string[];
  is_connected: boolean;
  status: SocialAccountStatus;
  connected_at?: string;
  updated_at?: string;
  created_at: string;
};

export type ContentType = 
  | 'POST'
  | 'REEL'
  | 'STORY'
  | 'CAROUSEL'
  | 'Reel'
  | 'Carousel'
  | 'Educational'
  | 'Promotional'
  | 'Behind the scenes'
  | 'Customer story'
  | 'FAQ'
  | 'Industry insight'
  | 'Engagement'
  | 'Single image';

export type PostStatus = 
  | 'DRAFT'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'PROCESSING'
  | 'PUBLISHED'
  | 'FAILED'
  | 'Draft'
  | 'Approved'
  | 'Scheduled'
  | 'Processing'
  | 'Publishing'
  | 'Published'
  | 'Failed'
  | 'draft' 
  | 'approved' 
  | 'scheduled' 
  | 'publishing' 
  | 'published' 
  | 'failed' 
  | 'cancelled';

export type ApprovalStatus = 'draft' | 'submitted' | 'approved' | 'changes_requested' | 'rejected';

export type ContentComment = {
  id: string;
  content_item_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  comment_text: string;
  created_at: string;
  updated_at?: string;
  resolved_at?: string | null;
  parent_comment_id?: string | null;
  field_link?: string; // caption, hashtags, visualAsset, etc.
};

export type VisualAssetType = 'image' | 'video' | 'carousel';

export type VisualAsset = {
  id: string;
  content_item_id?: string;
  asset_type: VisualAssetType;
  generation_prompt: string;
  style_direction: string;
  storage_url: string;
  thumbnail_url: string;
  carousel_urls?: string[];
  duration?: number; // seconds for video
  aspect_ratio: '1:1' | '16:9' | '9:16' | '4:5';
  generated_at: string;
  user_edited: boolean;
  edit_history?: string[];
  cost_usd: number;
  provider: string; // 'DALL-E 3' | 'Stability AI' | 'Runway' | 'HeyGen'
  model_version?: string;
};

export type MediaLicense = {
  id: string;
  visual_asset_id: string;
  license_type: 'personal_use' | 'commercial' | 'extended';
  expires_at?: string;
  created_at: string;
};

export type GenerationCost = {
  id: string;
  business_id: string;
  content_item_id?: string;
  provider: string;
  asset_type: string;
  cost_usd: number;
  created_at: string;
  month: string;
};

export type PredictionFactor = {
  id?: string;
  name: string;
  impact: number; // -1.0 to 1.0
  description: string;
};

export type PerformancePrediction = {
  id?: string;
  content_item_id?: string;
  predicted_likes: number;
  predicted_comments: number;
  predicted_shares: number;
  predicted_saves: number;
  predicted_engagement_rate: number; // e.g., 3.7 (percent)
  confidence_level: number; // 0.0 to 1.0 (e.g., 0.82)
  factors: PredictionFactor[];
  best_posting_time: string; // e.g. "Tuesday 2:15 PM"
  audience_segments?: string[];
  actual_likes?: number;
  actual_comments?: number;
  actual_shares?: number;
  actual_saves?: number;
  actual_engagement_rate?: number;
  prediction_accuracy_rating?: number;
};

export type CompetitorBenchmark = {
  similarContentType: string;
  averageEngagement: string;
  competitorData: {
    competitor: string;
    engagement: string;
  }[];
  positioning: string;
};

export type CompetitorAccount = {
  id: string;
  business_id: string;
  instagram_handle: string;
  instagram_user_id?: string;
  follower_count: number;
  bio?: string;
  website?: string;
  last_synced_at: string;
  status: 'active' | 'inactive' | 'error';
  sync_error_message?: string;
};

export type CompetitorPost = {
  id: string;
  competitor_account_id: string;
  instagram_post_id: string;
  post_type: 'carousel' | 'reel' | 'story' | 'static';
  caption: string;
  posted_at: string;
  likes: number;
  comments: number;
  engagement_rate: number;
  reach_estimate?: number;
  hashtags: string[];
  visual_embedding?: number[];
  content_pillars: string[];
  cta_type?: string;
  post_sentiment?: string;
  synced_at: string;
};

export type CompetitorInsight = {
  id: string;
  competitor_account_id: string;
  insight_date: string;
  best_performing_content_type: string;
  average_engagement_rate: number;
  posting_frequency: number;
  optimal_posting_times: string[];
  top_hashtags: string[];
  top_content_themes: string[];
  audience_sentiment: string;
  growth_rate_estimate: number;
};

export type AudienceSegment = {
  id: string;
  business_id: string;
  segment_name: string;
  characteristics: Record<string, any>;
  engagement_pattern: Record<string, any>;
  predicted_engagement_rate: number;
};

export type HistoricalContentMetric = {
  id: string;
  business_id: string;
  content_type: string;
  average_likes: number;
  average_comments: number;
  average_engagement_rate: number;
  posting_time: string;
  day_of_week: string;
  sample_size: number;
};

export type PostItem = {
  id: string;
  user_id?: string;
  business_id: string;
  social_account_id?: string;
  content_plan_id?: string;
  day_number: number;
  scheduled_date: string; // YYYY-MM-DD
  scheduled_time: string; // e.g. "09:30"
  content_type: ContentType;
  type?: 'POST' | 'REEL' | 'STORY' | 'CAROUSEL';
  title: string;
  headline?: string;
  concept?: string;
  hook?: string;
  caption: string;
  hashtags: string[];
  suggested_posting_time?: string;
  recommendedTime?: string;
  cta: string;
  visualDirection?: string;
  required_media_type?: string;
  media_id?: string;
  media_url?: string;
  status: PostStatus;

  // New Collaboration & Workflow Fields
  approval_status: ApprovalStatus;
  created_by?: string;
  assigned_approver?: string;
  approval_notes?: string;
  approved_at?: string;
  approved_by?: string;
  comments?: ContentComment[];

  // New AI Visual Asset & Analytics Fields
  visualAsset?: VisualAsset;
  performancePrediction?: PerformancePrediction;
  competitorBenchmark?: CompetitorBenchmark;

  instagram_media_id?: string;
  meta_response?: any;
  error_message?: string;
  error_code?: string;
  published_at?: string;
  failure_reason?: string;
  created_at: string;
};

export type PublisherLog = {
  id: string;
  user_id?: string;
  business_id?: string;
  post_id?: string;
  social_account_id?: string;
  action: string;
  endpoint: string;
  http_status?: number;
  meta_media_id?: string;
  error_code?: string;
  error_message?: string;
  created_at: string;
};

export type ScheduledPostQueue = {
  id: string;
  post_id: string;
  business_id: string;
  scheduled_for: string;
  attempt_count: number;
  execution_status: 'pending' | 'processing' | 'completed' | 'failed';
  error_log?: string;
  created_at: string;
};

export type PostAnalytics = {
  id: string;
  post_id: string;
  business_id: string;
  platform: 'instagram' | 'facebook';
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  engagement_rate: number;
  fetched_at: string;
};

export type SchedulerLog = {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  post_id?: string;
};

export type AIProviderType = 'mock' | 'openai' | 'gemini';

export type AIProviderSettings = {
  provider: AIProviderType;
  openaiKey?: string;
  geminiKey?: string;
  modelName?: string;
  creativityLevel?: number; // 0.0 - 1.0
  imageProvider?: 'dalle3' | 'stability' | 'midjourney';
  videoProvider?: 'runway' | 'heygen' | 'synthesia';
  monthlyBudgetUSD?: number;
};
