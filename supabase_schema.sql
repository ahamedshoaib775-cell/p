-- ============================================================================
-- Social AI - Production Supabase PostgreSQL Database Schema
-- Includes Teams, RBAC, RLS, Visual Assets, Vector Competitor Analysis & Predictions
-- ============================================================================

-- Enable Vector Extension for Competitor Content Similarity
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Users Table (Core Auth Extension)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url VARCHAR(512),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Teams & Role-Based Access Control (RBAC)
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'manager', 'editor', 'viewer')),
  invited_at TIMESTAMP DEFAULT NOW(),
  joined_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  UNIQUE(team_id, user_id)
);

CREATE TABLE IF NOT EXISTS team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('manager', 'editor', 'viewer')),
  invited_by UUID NOT NULL REFERENCES users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMP
);

-- 3. Business Profiles
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  business_name VARCHAR(255) NOT NULL,
  business_category VARCHAR(100) NOT NULL,
  business_description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  target_audience TEXT NOT NULL,
  products_services TEXT NOT NULL,
  main_goal VARCHAR(255),
  brand_tone VARCHAR(100) NOT NULL,
  brand_colors TEXT[] DEFAULT ARRAY[]::TEXT[],
  website_url VARCHAR(255),
  instagram_username VARCHAR(100),
  facebook_page VARCHAR(255),
  posting_frequency VARCHAR(50) DEFAULT 'daily',
  logo_url VARCHAR(512),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Content Items & Approval Workflow
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  social_account_id UUID,
  day_number INT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  headline VARCHAR(255),
  concept TEXT,
  hook TEXT,
  caption TEXT NOT NULL,
  hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
  cta TEXT NOT NULL,
  visual_direction TEXT,
  status VARCHAR(50) DEFAULT 'DRAFT',
  
  -- Workflow Approval Fields
  approval_status VARCHAR(50) DEFAULT 'draft' CHECK (approval_status IN ('draft', 'submitted', 'approved', 'changes_requested', 'rejected')),
  created_by UUID REFERENCES users(id),
  assigned_approver UUID REFERENCES users(id),
  approval_notes TEXT,
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES users(id),

  instagram_media_id VARCHAR(255),
  meta_response JSONB,
  error_message TEXT,
  error_code VARCHAR(100),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Threaded Content Comments
CREATE TABLE IF NOT EXISTS content_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  field_link VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  parent_comment_id UUID REFERENCES content_comments(id) ON DELETE CASCADE
);

-- 6. Visual Assets & Cost Tracking
CREATE TABLE IF NOT EXISTS visual_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  asset_type VARCHAR(50) NOT NULL CHECK (asset_type IN ('image', 'video', 'carousel')),
  generation_prompt TEXT NOT NULL,
  style_direction VARCHAR(255),
  storage_url VARCHAR(512) NOT NULL,
  thumbnail_url VARCHAR(512),
  carousel_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  duration INT,
  aspect_ratio VARCHAR(10) DEFAULT '1:1',
  generated_at TIMESTAMP DEFAULT NOW(),
  user_edited BOOLEAN DEFAULT FALSE,
  edit_history TEXT[] DEFAULT ARRAY[]::TEXT[],
  cost_usd DECIMAL(10, 4) DEFAULT 0.0000,
  provider VARCHAR(100) DEFAULT 'DALL-E 3',
  model_version VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visual_asset_id UUID NOT NULL REFERENCES visual_assets(id) ON DELETE CASCADE,
  license_type VARCHAR(50) NOT NULL CHECK (license_type IN ('personal_use', 'commercial', 'extended')),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS generation_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  content_item_id UUID REFERENCES content_items(id) ON DELETE SET NULL,
  provider VARCHAR(100) NOT NULL,
  asset_type VARCHAR(50) NOT NULL,
  cost_usd DECIMAL(10, 4) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  month DATE DEFAULT CURRENT_DATE
);

-- 7. Competitor Intelligence & Vector Similarity
CREATE TABLE IF NOT EXISTS competitor_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  instagram_handle VARCHAR(255) NOT NULL,
  instagram_user_id VARCHAR(255),
  follower_count INT DEFAULT 0,
  bio TEXT,
  website VARCHAR(512),
  last_synced_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
  sync_error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(business_id, instagram_handle)
);

CREATE TABLE IF NOT EXISTS competitor_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_account_id UUID NOT NULL REFERENCES competitor_accounts(id) ON DELETE CASCADE,
  instagram_post_id VARCHAR(255) NOT NULL,
  post_type VARCHAR(50) NOT NULL CHECK (post_type IN ('carousel', 'reel', 'story', 'static')),
  caption TEXT,
  posted_at TIMESTAMP NOT NULL,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  engagement_rate DECIMAL(5, 2) DEFAULT 0.00,
  reach_estimate INT DEFAULT 0,
  hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
  visual_embedding vector(1536), -- pgvector embeddings for similarity search
  content_pillars TEXT[] DEFAULT ARRAY[]::TEXT[],
  cta_type VARCHAR(100),
  post_sentiment VARCHAR(50),
  synced_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS competitor_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_account_id UUID NOT NULL REFERENCES competitor_accounts(id) ON DELETE CASCADE,
  insight_date DATE DEFAULT CURRENT_DATE,
  best_performing_content_type VARCHAR(50),
  average_engagement_rate DECIMAL(5, 2),
  posting_frequency INT,
  optimal_posting_times TEXT[] DEFAULT ARRAY[]::TEXT[],
  top_hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
  top_content_themes TEXT[] DEFAULT ARRAY[]::TEXT[],
  audience_sentiment VARCHAR(50),
  growth_rate_estimate DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 8. Performance Predictions
CREATE TABLE IF NOT EXISTS performance_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  predicted_at TIMESTAMP DEFAULT NOW(),
  predicted_likes INT,
  predicted_comments INT,
  predicted_shares INT,
  predicted_saves INT,
  predicted_engagement_rate DECIMAL(5, 2),
  confidence_level DECIMAL(3, 2),
  prediction_factors JSONB,
  best_posting_time VARCHAR(100),
  actual_likes INT,
  actual_comments INT,
  actual_shares INT,
  actual_saves INT,
  actual_engagement_rate DECIMAL(5, 2),
  prediction_accuracy_rating DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prediction_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id UUID NOT NULL REFERENCES performance_predictions(id) ON DELETE CASCADE,
  factor_name VARCHAR(255) NOT NULL,
  impact_score DECIMAL(4, 2),
  factor_description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audience_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  segment_name VARCHAR(255) NOT NULL,
  characteristics JSONB,
  engagement_pattern JSONB,
  predicted_engagement_rate DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS historical_content_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  content_type VARCHAR(50),
  average_likes INT,
  average_comments INT,
  average_engagement_rate DECIMAL(5, 2),
  posting_time TIME,
  day_of_week VARCHAR(10),
  sample_size INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access team content"
  ON content_items FOR ALL
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
      UNION
      SELECT business_id FROM businesses b
      JOIN team_members tm ON b.team_id = tm.team_id
      WHERE tm.user_id = auth.uid() AND tm.status = 'active'
    )
  );
