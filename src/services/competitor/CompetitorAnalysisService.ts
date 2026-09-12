import type { CompetitorAccount, CompetitorBenchmark, CompetitorInsight } from '../../types';

export class CompetitorAnalysisService {
  getMonitoredCompetitors(): CompetitorAccount[] {
    return [
      {
        id: 'comp_1',
        business_id: 'biz_sample_1',
        instagram_handle: 'style_competitor',
        follower_count: 45200,
        bio: 'Boutique fashion & lifestyle curated for modern professionals.',
        website: 'https://stylecompetitor.com',
        last_synced_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        status: 'active'
      },
      {
        id: 'comp_2',
        business_id: 'biz_sample_1',
        instagram_handle: 'fashion_guru',
        follower_count: 12800,
        bio: 'Daily styling tips, capsule wardrobe guides, and sustainable fits.',
        website: 'https://fashionguru.co',
        last_synced_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        status: 'active'
      },
      {
        id: 'comp_3',
        business_id: 'biz_sample_1',
        instagram_handle: 'trend_studio',
        follower_count: 98400,
        bio: 'High-street fashion trends & creative video reels.',
        website: 'https://trendstudio.app',
        last_synced_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
        status: 'active'
      }
    ];
  }

  getCompetitorBenchmark(contentType: string): CompetitorBenchmark {
    const isReel = contentType.toUpperCase().includes('REEL');
    return {
      similarContentType: isReel ? 'REEL' : 'CAROUSEL',
      averageEngagement: isReel ? '3.8%' : '3.2%',
      competitorData: [
        { competitor: '@style_competitor', engagement: isReel ? '4.2%' : '3.6%' },
        { competitor: '@fashion_guru', engagement: isReel ? '5.8%' : '6.1%' },
        { competitor: '@trend_studio', engagement: isReel ? '2.9%' : '2.4%' }
      ],
      positioning: 'Above average for category (+15% vs sector benchmark)'
    };
  }

  getCompetitorInsights(): CompetitorInsight[] {
    return [
      {
        id: 'ins_1',
        competitor_account_id: 'comp_1',
        insight_date: new Date().toISOString().split('T')[0],
        best_performing_content_type: 'Reels (Educational Tips)',
        average_engagement_rate: 3.8,
        posting_frequency: 6,
        optimal_posting_times: ['Monday 10:00 AM', 'Thursday 2:00 PM'],
        top_hashtags: ['#StylingHacks', '#CapsuleWardrobe', '#OutfitInspo', '#MinimalFashion'],
        top_content_themes: ['Educational (45%)', 'Promotional (30%)', 'Behind-the-scenes (15%)'],
        audience_sentiment: 'Positive (88%)',
        growth_rate_estimate: 2.4
      },
      {
        id: 'ins_2',
        competitor_account_id: 'comp_2',
        insight_date: new Date().toISOString().split('T')[0],
        best_performing_content_type: 'Carousels (Step-by-step)',
        average_engagement_rate: 6.1,
        posting_frequency: 12,
        optimal_posting_times: ['Wednesday 6:00 PM', 'Sunday 7:00 PM'],
        top_hashtags: ['#StyleGuide', '#FashionTips', '#WardrobeEssentials'],
        top_content_themes: ['Lifestyle (40%)', 'Product (35%)', 'Testimonials (15%)'],
        audience_sentiment: 'Very High (94%)',
        growth_rate_estimate: 4.8
      }
    ];
  }

  getAICompetitorRecommendations(): string[] {
    return [
      '📊 Opportunity: Educational content is underperforming in your mix compared to @fashion_guru. They average 6.1% engagement on educational carousels vs. your 3.4%.',
      '📊 Strength: Your behind-the-scenes Reels (5.1% engagement) outperform all 3 competitors by 1.3%-1.8%. Double down on authentic studio footage!',
      '📊 Gap: None of your competitors post Stories daily. Posting daily interactive polls can unlock a major differentiation advantage.',
      '📊 Trend: Carousel posts with 5-7 slides perform 23% better than single-slide posts across all monitored competitor accounts.'
    ];
  }
}

export const competitorServiceInstance = new CompetitorAnalysisService();
