import type { BusinessProfile, ContentType, PostItem, VisualAsset, PerformancePrediction, CompetitorBenchmark } from '../types';
import { getRecommendedPostingTime } from './postingTimeEngine';
import { competitorServiceInstance } from './competitor/CompetitorAnalysisService';

export interface HashtagSet {
  broad: string[];
  niche: string[];
  location: string[];
  industry: string[];
  all: string[];
}

export const generateHashtagsForBusiness = (
  business: Partial<BusinessProfile>,
  postTopic: string = ''
): HashtagSet => {
  const nameClean = (business.business_name || 'business').toLowerCase().replace(/[^a-z0-9]/g, '');
  const categoryClean = (business.business_category || 'smallbusiness').toLowerCase().replace(/[^a-z0-9]/g, '');
  const locationClean = (business.location || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  const broad = [
    `#${categoryClean}`,
    '#smallbusiness',
    '#businessgrowth',
    '#socialmediamarketing',
    '#supportsmallbusiness'
  ];

  const niche = [
    `#${nameClean}life`,
    `#${categoryClean}tips`,
    `#quality${categoryClean}`,
    '#customerfirst',
    '#authenticbrand'
  ];

  const location = locationClean ? [
    `#${locationClean}`,
    `#${locationClean}business`,
    `#${locationClean}life`,
    `#shoplocal${locationClean}`
  ] : [
    '#localbusiness',
    '#communityfirst',
    '#shoplocal'
  ];

  const topicClean = postTopic.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ')[0] || 'insights';
  const industry = [
    `#${categoryClean}community`,
    `#${topicClean}strategy`,
    `#${categoryClean}trends`,
    '#dailyinspiration'
  ];

  const all = Array.from(new Set([...broad, ...niche, ...location, ...industry]));

  return { broad, niche, location, industry, all };
};

export const generate7DayContentPlan = (
  business: BusinessProfile,
  _customFocus: string = ''
): Omit<PostItem, 'id' | 'created_at'>[] => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const today = new Date();
  
  const bName = business.business_name || 'Our Business';
  const bCat = business.business_category || 'Services';
  const bDesc = business.business_description || 'providing high quality solutions for our clients';
  const bAudience = business.target_audience || 'valued clients and community members';
  const bProducts = business.products_services || 'our core signature offerings';

  const concepts: {
    dayOffset: number;
    contentType: ContentType;
    type: 'POST' | 'REEL' | 'STORY' | 'CAROUSEL';
    headline: string;
    captionTemplate: (name: string, products: string, audience: string, desc: string) => string;
    cta: string;
    mediaType: string;
    sampleMediaUrl: string;
    assetType: 'image' | 'video' | 'carousel';
    prompt: string;
  }[] = [
    {
      dayOffset: 0,
      contentType: 'Educational',
      type: 'REEL',
      headline: `3 Quick Styling & Quality Tips for Every ${bAudience.split(',')[0] || 'Client'}`,
      captionTemplate: (name, _prod, aud) => 
        `Did you know that small changes in how you approach ${bCat.toLowerCase()} can yield massive results for ${aud}? Here are 3 expert tips from the team at ${name}:\n\n1️⃣ Focus on core quality.\n2️⃣ Consistency beats complexity.\n3️⃣ Always tailor solutions to your daily workflow.\n\nWhich tip resonates most with you today?`,
      cta: 'Save this Reel & share with a team member!',
      mediaType: 'Dynamic Reel snippet (30s)',
      sampleMediaUrl: 'https://images.unsplash.com/photo-1542744094-3a31b272c490?auto=format&fit=crop&w=800&q=80',
      assetType: 'video',
      prompt: 'Fast-paced transformation reel. Modern, trendy aesthetic, clean lighting.'
    },
    {
      dayOffset: 1,
      contentType: 'Promotional',
      type: 'CAROUSEL',
      headline: `Spotlight on ${bProducts.split(',')[0] || 'Our Signature Offering'}`,
      captionTemplate: (name, prod, aud, desc) => 
        `Ever wondered why ${aud} choose ${name}? It all comes down to how we deliver ${prod}.\n\n${desc}\n\nWe design every detail to ensure you receive exceptional value. Swipe through the slides to see key features!`,
      cta: 'Tap the link in bio to learn more or place your order today!',
      mediaType: 'Carousel graphics (3 slides)',
      sampleMediaUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      assetType: 'carousel',
      prompt: '3-slide sleek product showcase, clean typography, luxury minimal layout.'
    },
    {
      dayOffset: 2,
      contentType: 'Behind the scenes',
      type: 'REEL',
      headline: `A Day in the Life Behind ${bName}`,
      captionTemplate: (name) => 
        `Take a peek behind the curtain! 🎬 Before any product or service reaches our clients, our team puts hours of passion, care, and meticulous detail into the process.\n\nHere is a look at what our workspace looks like on a busy Wednesday at ${name}.`,
      cta: 'Drop a 💙 if you love seeing behind-the-scenes content!',
      mediaType: 'Short reel / video snippet (15s)',
      sampleMediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      assetType: 'video',
      prompt: 'Behind the scenes studio walkthrough, warm ambient lighting, authentic team vibe.'
    },
    {
      dayOffset: 3,
      contentType: 'Customer story',
      type: 'POST',
      headline: `How We Helped Solve a Real Challenge for Our Client`,
      captionTemplate: (name, prod, aud) => 
        `"Working with ${name} was a total gamechanger for us."\n\nNothing makes our day more than seeing our ${aud} thrive. When clients partner with us for ${prod}, we make sure their goals are met with clarity and dedication.`,
      cta: 'Ready for your own success story? Send us a DM today!',
      mediaType: 'Quote card / Client testimonial banner',
      sampleMediaUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
      assetType: 'image',
      prompt: 'Client testimonial graphic with clean typography, elegant slate dark background.'
    },
    {
      dayOffset: 4,
      contentType: 'FAQ',
      type: 'POST',
      headline: `Frequently Asked Question: "How Do I Get Started With ${bName}?"`,
      captionTemplate: (name, prod) => 
        `We get this question in our DMs every single week! 💬\n\nQ: What is the fastest way to get started with ${name} for ${prod}?\n\nA: It takes less than 2 minutes! Simply visit our website, select your preferred options, and our team handles the rest.`,
      cta: 'Have another question? Ask us in the comments!',
      mediaType: 'Infographic banner',
      sampleMediaUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
      assetType: 'image',
      prompt: 'Clean FAQ breakdown banner, subtle indigo accent gradients.'
    },
    {
      dayOffset: 5,
      contentType: 'Industry insight',
      type: 'CAROUSEL',
      headline: `What’s Trending in ${bCat} This Month`,
      captionTemplate: (_name, prod, aud) => 
        `The ${bCat} landscape moves fast! Here is what we are seeing across the industry right now, and why it matters for ${aud}.\n\nAdapting early gives you a massive advantage when choosing quality offerings like ${prod}.`,
      cta: 'Bookmark this post to stay ahead of the curve!',
      mediaType: 'Single high-impact banner',
      sampleMediaUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      assetType: 'carousel',
      prompt: 'Trend report carousel, modern charts, bold headline fonts.'
    },
    {
      dayOffset: 6,
      contentType: 'Engagement',
      type: 'STORY',
      headline: `Sunday Community Check-In with ${bName}`,
      captionTemplate: (_name, _prod, aud) => 
        `Happy Sunday! 🌿 As we wrap up the week, we want to hear from our incredible community of ${aud}.\n\nWhat is your #1 focus or goal for the upcoming week? Let’s inspire each other in the comments below!`,
      cta: 'Tell us your thoughts in the comments!',
      mediaType: 'Warm lifestyle image',
      sampleMediaUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
      assetType: 'image',
      prompt: 'Warm lifestyle aesthetic, natural Sunday morning sunlight, coffee cup on desk.'
    }
  ];

  return concepts.map((concept, index) => {
    const postDate = new Date(today);
    postDate.setDate(today.getDate() + index + 1);
    
    const dayName = daysOfWeek[(postDate.getDay() + 6) % 7];
    const dateStr = postDate.toISOString().split('T')[0];
    
    const timeRec = getRecommendedPostingTime(bCat, bAudience, dayName);
    const hashtagObj = generateHashtagsForBusiness(business, concept.headline);

    const visualAsset: VisualAsset = {
      id: `asset_gen_${index}_${Date.now()}`,
      asset_type: concept.assetType,
      generation_prompt: concept.prompt,
      style_direction: 'Modern, Minimalist, Premium',
      storage_url: concept.sampleMediaUrl,
      thumbnail_url: concept.sampleMediaUrl,
      carousel_urls: concept.assetType === 'carousel' ? [
        concept.sampleMediaUrl,
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
      ] : undefined,
      duration: concept.assetType === 'video' ? 30 : undefined,
      aspect_ratio: concept.assetType === 'video' ? '9:16' : '1:1',
      generated_at: new Date().toISOString(),
      user_edited: false,
      cost_usd: concept.assetType === 'video' ? 0.12 : (concept.assetType === 'carousel' ? 0.08 : 0.04),
      provider: concept.assetType === 'video' ? 'Runway ML' : 'DALL-E 3'
    };

    const performancePrediction: PerformancePrediction = {
      predicted_likes: 185 + (index * 12),
      predicted_comments: 12 + index,
      predicted_shares: 18 + index,
      predicted_saves: 25 + index,
      predicted_engagement_rate: 3.7 + (index * 0.1),
      confidence_level: 0.84,
      factors: [
        { name: `Content Format (${concept.type})`, impact: 0.7, description: 'Format generates high organic engagement' },
        { name: 'Optimal posting time window', impact: 0.6, description: `Posting at ${timeRec.bestTime} aligns with target audience peak` },
        { name: 'Brand Voice & Tone Match', impact: 0.8, description: 'Matches defined brand personality guidelines' }
      ],
      best_posting_time: `Tuesday ${timeRec.bestTime}`
    };

    const competitorBenchmark: CompetitorBenchmark = competitorServiceInstance.getCompetitorBenchmark(concept.type);

    return {
      business_id: business.id,
      day_number: index + 1,
      scheduled_date: dateStr,
      scheduled_time: timeRec.bestTime,
      content_type: concept.contentType,
      type: concept.type,
      title: concept.headline,
      headline: concept.headline,
      caption: concept.captionTemplate(bName, bProducts, bAudience, bDesc),
      hashtags: hashtagObj.all,
      suggested_posting_time: `${timeRec.bestTime} (${timeRec.windowLabel})`,
      cta: concept.cta,
      required_media_type: concept.mediaType,
      media_url: concept.sampleMediaUrl,
      status: 'Draft' as const,

      // Workflow & Collaboration
      approval_status: 'draft',
      assigned_approver: undefined,
      comments: [],

      // Visual Asset & Analytics
      visualAsset,
      performancePrediction,
      competitorBenchmark
    };
  });
};
