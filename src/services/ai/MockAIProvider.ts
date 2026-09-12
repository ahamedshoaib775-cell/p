import type { AIProvider, AIRegenerateOptions, AIPlanGenerationOptions } from './AIProvider';
import type { BusinessProfile, BrandProfile, PostItem } from '../../types';
import { getRecommendedPostingTime } from '../postingTimeEngine';
import { generateHashtagsForBusiness } from '../aiGenerator';

export class MockAIProvider implements AIProvider {
  id = 'mock' as const;
  name = 'SocialPilot Smart Local Engine (Built-in)';

  async analyzeBrand(business: BusinessProfile): Promise<BrandProfile> {
    const category = business.business_category || 'General Business';
    const name = business.business_name || 'My Business';
    const audience = business.target_audience || 'valued clients and community';
    const goals = business.main_goal || 'Increase brand awareness and customer engagement';

    // Generate industry specific content pillars
    const pillarsMap: Record<string, string[]> = {
      'Restaurant & Cafe': ['Culinary Behind-the-Scenes', 'Menu Highlights & Pairings', 'Community Events', 'Chef Tips & Stories'],
      'Fashion': ['Style Guides & Lookbooks', 'Fabric & Quality Care', 'Trend Forecasts', 'Customer OOTD Feature'],
      'Real Estate': ['Market Insights', 'Home Buyer Checklists', 'Neighborhood Spotlights', 'Virtual Property Tours'],
      'Fitness & Wellness': ['Form Tips & Workouts', 'Nutrition Insights', 'Member Transformation Stories', 'Mindset Motivation'],
      'Beauty & Salon': ['Skincare Routines', 'Product Spotlight & Formulations', 'Before & After Showcases', 'Self-Care Tips'],
      'B2B SaaS & Tech': ['Productivity Hacks', 'Workflow Tutorials', 'Customer Success Case Studies', 'Feature Spotlights'],
      'Education': ['Interactive Quizzes & Tips', 'Study & Growth Hacks', 'Student Success Stories', 'Expert QA Sessions'],
      'Finance': ['Smart Money Tips', 'Market Breakdown', 'Client Milestones', 'Financial Mythbusting'],
      'Professional Services': ['Case Studies & Strategy', 'Client FAQ Answered', 'Team Behind the Work', 'Industry News']
    };

    const contentPillars = pillarsMap[category] || ['Educational Value', 'Product/Service Highlights', 'Behind-the-Scenes', 'Community & Proof'];

    return {
      business_id: business.id,
      businessName: name,
      industry: category,
      targetAudience: audience,
      location: business.location || 'Global / Online',
      tone: business.brand_tone || 'Professional & Approachable',
      personality: business.brand_personality || ['Professional', 'Friendly', 'Trustworthy'],
      contentPillars,
      visualStyle: 'Clean typography, high-contrast brand tones, authentic product/people photography',
      preferredWords: ['authentic', 'quality', 'trusted', 'crafted', 'practical'],
      avoidedWords: ['elevate', 'unlock', 'unleash', 'game-changer', 'revolutionize', 'next-level', 'delve'],
      CTAStyle: 'Direct and conversational with clear value proposition',
      hashtagStyle: 'Mix of 5 industry, 5 niche, 3 location, and 2 brand tags',
      postingFrequency: business.posting_frequency || 'Once daily',
      businessGoals: goals
    };
  }

  async generate7DayPlan(
    business: BusinessProfile,
    _brandProfile: BrandProfile | null,
    options?: AIPlanGenerationOptions
  ): Promise<Omit<PostItem, 'id' | 'created_at'>[]> {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const today = new Date();
    const bName = business.business_name || 'Our Business';
    const bCat = business.business_category || 'Business';
    const bAudience = business.target_audience || 'our clients';
    const bProducts = business.products_services || 'our core services';
    const bDesc = business.business_description || 'helping clients achieve top results';

    // Check brand preferences memory for avoided phrases
    const avoidedPhrases = options?.preferences?.flatMap(p => p.avoided_phrases) || [
      'Elevate your', 'Unlock your', 'Unleash your', 'Step into', 'Discover the power of', 'Delve into'
    ];

    // Filter text helper to remove generic AI buzzwords
    const sanitizeText = (text: string): string => {
      let result = text;
      avoidedPhrases.forEach(phrase => {
        const regex = new RegExp(phrase, 'gi');
        result = result.replace(regex, 'Explore');
      });
      return result;
    };

    // Category specific 7-day templates
    const getCategoryPlan = () => {
      if (bCat.includes('Restaurant') || bCat.includes('Cafe')) {
        return [
          {
            type: 'REEL' as const,
            title: `Behind the Counter: How We Prepare Our Signature Dish`,
            concept: '15-second ASMR compilation of kitchen prep and plating.',
            hook: 'Ever wondered what goes into our most-ordered dish?',
            caption: `Behind every dish at ${bName} is hours of prep, fresh local ingredients, and genuine passion. Here's a quick peek at our kitchen team in action today.`,
            cta: 'Tag a friend who needs to try this with you this week!',
            visualDirection: 'Close-up dynamic video cuts, warm natural kitchen lighting, rhythmic sizzle sound effect.',
            sampleMediaUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
          },
          {
            type: 'CAROUSEL' as const,
            title: `5 Pairing Ideas You Haven't Tried Yet`,
            concept: '3-slide visual guide matching drinks with popular menu items.',
            hook: 'Stop ordering the same thing! Try these 5 flavor combinations.',
            caption: `Upgrade your next visit to ${bName}. We matched our top signature items with the perfect beverages for an unforgettable taste experience.`,
            cta: 'Save this post for your next visit!',
            visualDirection: 'Minimalist split-screen layout with crisp food photos and bold numbered overlays.',
            sampleMediaUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
          },
          {
            type: 'STORY' as const,
            title: `Community Poll: Which Weekly Special Should Return?`,
            concept: 'Interactive story with poll sticker comparing two past crowd favorites.',
            hook: 'We are bringing back ONE past favorite next week. You choose!',
            caption: `Option A or Option B? Tap your vote in our story stickers above! Our chef is prepping whichever dish gets the most votes by midnight.`,
            cta: 'Vote now on our Instagram Story!',
            visualDirection: 'Vertical 9:16 layout with large poll sticker zones and vibrant food photos.',
            sampleMediaUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
          },
          {
            type: 'POST' as const,
            title: `Meet the Team: The Secret to ${bName}`,
            concept: 'Staff spotlight featuring a team member sharing their favorite menu item.',
            hook: 'Meet Sarah, our head barista who has poured over 10,000 cups!',
            caption: `At ${bName}, our people make all the difference. Sarah’s current recommendation? The iced oat milk matcha with home-made vanilla bean syrup.`,
            cta: 'Drop a 👋 in the comments to say hi to Sarah!',
            visualDirection: 'Friendly portrait in natural cafe light holding a fresh beverage.',
            sampleMediaUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80'
          },
          {
            type: 'REEL' as const,
            title: `Weekend Vibe Check at ${bName}`,
            concept: 'Atmospheric slow-motion reel showing cozy seating, ambient music, and happy guests.',
            hook: 'Your weekend table is ready...',
            caption: `Looking for the ultimate spot to unwind this weekend? Grab a cozy corner seat at ${bName}, enjoy fresh coffee, and take a breather.`,
            cta: 'Click the link in our bio to reserve a table or view our full menu!',
            visualDirection: 'Warm aesthetic tones, slow pan shots, cozy ambient lighting.',
            sampleMediaUrl: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80'
          },
          {
            type: 'CAROUSEL' as const,
            title: `Customer Highlight & Honest Review`,
            concept: 'Quote overlay on slide 1 followed by client photos on slide 2 and 3.',
            hook: '"Hands down the best spot in town for genuine hospitality."',
            caption: `A huge thank you to our amazing community of ${bAudience}! Reviews like this keep our team inspired every day. Swipe to see what they ordered.`,
            cta: 'Have you visited us recently? Leave a review or tag us in your photos!',
            visualDirection: 'Elegant dark slate typography background transitioning to high-res customer photo.',
            sampleMediaUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80'
          },
          {
            type: 'STORY' as const,
            title: `Sunday Relax & Weekly Q&A`,
            concept: 'Q&A story box encouraging followers to ask questions about catering or ingredients.',
            hook: 'Sunday Q&A: Ask us anything about our ingredients or catering!',
            caption: `Got a question about our menu, dietary options, or private bookings? Drop it in the question sticker and we'll answer them live!`,
            cta: 'Ask your question in the sticker above!',
            visualDirection: 'Clean pastel aesthetic with prominent question sticker placeholder.',
            sampleMediaUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80'
          }
        ];
      }

      if (bCat.includes('Real Estate')) {
        return [
          {
            type: 'REEL' as const,
            title: `3 Costly Mistakes First-Time Homebuyers Make`,
            concept: 'Fast-paced talking head reel with text popups explaining financing & inspection mistakes.',
            hook: 'Planning to buy your first home this year? Avoid these 3 mistakes!',
            caption: `Buying a home is one of your biggest life investments. Before putting down an offer, ensure you check these key steps: 1) Getting pre-approved before house hunting, 2) Budgeting for closing costs, 3) Never skipping an independent inspection.`,
            cta: 'Comment "BUY" and we will send you our complete 2026 Homebuyer Guide!',
            visualDirection: 'Professional agent in modern property setting, dynamic text captions.',
            sampleMediaUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'
          },
          {
            type: 'CAROUSEL' as const,
            title: `Neighborhood Spotlight: What Makes ${business.location || 'This Area'} Special`,
            concept: '4-slide guide highlighting local schools, parks, dining, and average home values.',
            hook: 'Thinking about moving to ${business.location || "our area"}? Here is your complete guide.',
            caption: `Location is everything! Here is a quick breakdown of top amenities, transit links, and market trends in the neighborhood.`,
            cta: 'Save this post if you are exploring homes in this area!',
            visualDirection: 'Map graphics, neighborhood drone photography, clean statistical infographics.',
            sampleMediaUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
          },
          {
            type: 'POST' as const,
            title: `Just Listed: Modern 3-Bedroom Property Showcase`,
            concept: 'Hero property exterior shot with detailed features breakdown in caption.',
            hook: 'Step inside this stunning modern listing before it hits the open market!',
            caption: `Feature Spotlight: 3 Beds | 2.5 Baths | Open Concept Living | Solar Ready. Located right in the heart of the community with private yard and top-tier finishes.`,
            cta: 'Send us a DM for private showing availability and price details!',
            visualDirection: 'Wide architectural photo with crisp daylight and vibrant greenery.',
            sampleMediaUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
          },
          {
            type: 'STORY' as const,
            title: `This or That: Open Plan vs Traditional Layout`,
            concept: 'Interactive story with poll asking followers their favorite home interior style.',
            hook: 'Which kitchen layout would you pick for your dream home?',
            caption: `Option A (Modern Minimalist Island) or Option B (Warm Classic Woodwork)? Tap your preference above!`,
            cta: 'Vote in the story poll above!',
            visualDirection: 'Split screen 9:16 vertical graphic with clear poll targets.',
            sampleMediaUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
          },
          {
            type: 'REEL' as const,
            title: `Virtual Walkthrough: Top 3 Features Buyers Love`,
            concept: 'Smooth camera walkthrough highlight reel of living room, kitchen island, and master suite.',
            hook: 'The kitchen in this property will make you want to move immediately...',
            caption: `Take a 20-second tour of this beautiful space with team ${bName}. Notice the custom quartz countertops and floor-to-ceiling windows.`,
            cta: 'Tap the link in bio to view full gallery and schedule a walk-through!',
            visualDirection: 'Gimbal smoothed video, subtle ambient music overlay.',
            sampleMediaUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80'
          },
          {
            type: 'POST' as const,
            title: `Client Success Story: From Search to Keys in 28 Days`,
            concept: 'Photo of happy buyers holding keys in front of their new home.',
            hook: 'Congratulations to the Miller family on closing on their dream home!',
            caption: `Navigating competitive markets can be daunting, but with the right strategy and guidance, the Millers secured their top choice under budget in under 30 days.`,
            cta: 'Ready to start your real estate journey? DM us today!',
            visualDirection: 'Heartwarming lifestyle portrait, bright joyful lighting.',
            sampleMediaUrl: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=800&q=80'
          },
          {
            type: 'CAROUSEL' as const,
            title: `Weekly Market Update: Interest Rates & Inventory Trends`,
            concept: '3-slide chart breakdown of local market stats.',
            hook: 'What happened in real estate this week? Here is your 60-second summary.',
            caption: `Keeping you informed! Inventory increased by 4% this week while buyer demand remains high for move-in ready homes.`,
            cta: 'Share this update with anyone considering selling this season!',
            visualDirection: 'Clean corporate chart graphics with high-contrast text typography.',
            sampleMediaUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80'
          }
        ];
      }

      // Default high quality multi-industry strategy
      return [
        {
          type: 'REEL' as const,
          title: `3 Key Things Every ${bAudience.split(',')[0] || 'Customer'} Should Know About ${bCat}`,
          concept: 'Dynamic educational Reel breaking down 3 practical tips for your target audience.',
          hook: `If you are looking for better results in ${bCat.toLowerCase()}, don't make these common mistakes!`,
          caption: `At ${bName}, we work with ${bAudience} every day. Here are 3 proven principles to keep in mind:\n\n1️⃣ Clarity over complexity.\n2️⃣ Quality materials & craftsmanship.\n3️⃣ Consistency in implementation.\n\nWhich of these 3 resonates most with you today?`,
          cta: 'Save this Reel for later & share with someone who needs it!',
          visualDirection: 'Clean cinematic video snippet, bold dynamic captions, high energy.',
          sampleMediaUrl: 'https://images.unsplash.com/photo-1542744094-3a31b272c490?auto=format&fit=crop&w=800&q=80'
        },
        {
          type: 'CAROUSEL' as const,
          title: `Spotlight on ${bProducts.split(',')[0] || 'Our Signature Offering'}`,
          concept: '3-slide feature breakdown showing how your product/service solves a real problem.',
          hook: `Why do ${bAudience} choose ${bName}? It comes down to our core approach.`,
          caption: `Swipe through to see what makes ${bProducts} unique. We designed every aspect of our offerings to ensure ${bDesc}.\n\nSlide 1: Premium Quality\nSlide 2: Tailored Process\nSlide 3: Proven Results`,
          cta: 'Tap the link in our bio to explore full details and get started today!',
          visualDirection: 'Sleek carousel design with crisp product photography and brand accent cards.',
          sampleMediaUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
        },
        {
          type: 'STORY' as const,
          title: `Behind the Scenes: A Day in the Studio with ${bName}`,
          concept: 'Interactive story set featuring team workflow and a Q&A sticker.',
          hook: 'Take a quick peek behind the curtain at our studio today!',
          caption: `Every piece of work we deliver at ${bName} starts right here. Here is what our team is working on this Wednesday afternoon!`,
          cta: 'Drop your questions in our Story sticker!',
          visualDirection: 'Vertical 9:16 aesthetic photo with story text overlays and interactive stickers.',
          sampleMediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
        },
        {
          type: 'REEL' as const,
          title: `How We Solved a Real Challenge for Our Client`,
          concept: 'Case study transformation reel highlighting client problem, solution, and outcome.',
          hook: '"Partnering with ${bName} was the best decision we made for our business."',
          caption: `When our client came to us looking for help with ${bProducts}, they needed a solution that was fast, reliable, and authentic. Here is how we helped them achieve top results.`,
          cta: 'Send us a DM or visit our bio link to schedule your discovery chat!',
          visualDirection: 'Authentic testimonial style video clip with elegant client quote overlay.',
          sampleMediaUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80'
        },
        {
          type: 'POST' as const,
          title: `Frequently Asked Question: "How Do We Get Started With ${bName}?"`,
          concept: 'Clean infographic post answering the #1 inquiry received in DMs.',
          hook: 'We get asked this question in our DMs every single week!',
          caption: `Q: What is the fastest way to get started with ${bName}?\n\nA: It takes less than 3 minutes! Simply visit our website, choose your preferred option, and our team guides you through every step.`,
          cta: 'Have another question? Ask us in the comments below!',
          visualDirection: 'Minimal slate card layout with bold legible question and answer typography.',
          sampleMediaUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80'
        },
        {
          type: 'CAROUSEL' as const,
          title: `What’s Trending in ${bCat} This Month`,
          concept: '3-slide industry analysis highlighting key shifts and practical advice for followers.',
          hook: `The ${bCat} landscape moves fast! Here are 3 key trends you need to know.`,
          caption: `Staying ahead of trends gives your brand a massive competitive edge. Here is what we are seeing across ${bCat} right now and how to leverage it for ${bAudience}.`,
          cta: 'Bookmark this carousel to reference later!',
          visualDirection: 'Modern editorial style layout with clear numbers and high-impact visuals.',
          sampleMediaUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'
        },
        {
          type: 'STORY' as const,
          title: `Sunday Community Check-In & Weekly Goal Setting`,
          concept: 'Warm Sunday story post building connection with community followers.',
          hook: `Happy Sunday! What is your #1 focus for the upcoming week?`,
          caption: `As we wrap up the week, we want to hear from our incredible community of ${bAudience}! Let's inspire each other for the week ahead.`,
          cta: 'Share your goal in our story reply box!',
          visualDirection: 'Warm relaxing lifestyle photo with clean white text overlay.',
          sampleMediaUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80'
        }
      ];
    };

    const templates = getCategoryPlan();

    return templates.map((item, index) => {
      const postDate = new Date(today);
      postDate.setDate(today.getDate() + index + 1);
      const dayName = daysOfWeek[(postDate.getDay() + 6) % 7];
      const dateStr = postDate.toISOString().split('T')[0];

      const timing = getRecommendedPostingTime(bCat, bAudience, dayName);
      const hashtagObj = generateHashtagsForBusiness(business, item.title);

      return {
        business_id: business.id,
        day_number: index + 1,
        scheduled_date: dateStr,
        scheduled_time: timing.bestTime,
        content_type: item.type,
        type: item.type,
        title: item.title,
        headline: item.title,
        concept: item.concept,
        hook: item.hook,
        caption: sanitizeText(item.caption),
        hashtags: hashtagObj.all,
        suggested_posting_time: `${timing.bestTime} (${timing.windowLabel})`,
        recommendedTime: `${timing.bestTime} (${timing.windowLabel})`,
        cta: item.cta,
        visualDirection: item.visualDirection,
        required_media_type: item.concept,
        media_url: item.sampleMediaUrl,
        status: 'DRAFT' as const,
        approval_status: 'draft' as const
      };
    });
  }

  async regenerateSingleItem(options: AIRegenerateOptions): Promise<Partial<PostItem>> {
    const { customInstruction, itemToRegenerate, business } = options;
    const instructionLower = customInstruction.toLowerCase();
    let newCaption = itemToRegenerate.caption;
    let newTitle = itemToRegenerate.title;
    let newCta = itemToRegenerate.cta;

    if (instructionLower.includes('shorter') || instructionLower.includes('brief') || instructionLower.includes('concise')) {
      const sentences = newCaption.split('\n\n');
      newCaption = sentences.slice(0, 2).join('\n\n') + `\n\nShort & sweet for ${business.business_name || 'our community'}!`;
    } else if (instructionLower.includes('funny') || instructionLower.includes('humor') || instructionLower.includes('witty')) {
      newCaption = `😄 Pro tip from ${business.business_name || 'our team'}: ${newCaption}\n\n(Because adulting is hard enough without overcomplicating things!)`;
      newCta = 'Drop a laugh emoji in the comments if you relate! 😂';
    } else if (instructionLower.includes('premium') || instructionLower.includes('luxury') || instructionLower.includes('elegant')) {
      newTitle = `Crafted for Distinction: ${itemToRegenerate.title}`;
      newCaption = `Refined detail. Uncompromising quality.\n\n${itemToRegenerate.caption}\n\nDesigned specifically for discerning ${business.target_audience || 'clients'}.`;
      newCta = 'Discover exceptional quality via the link in our bio.';
    } else if (instructionLower.includes('cta') || instructionLower.includes('call to action') || instructionLower.includes('stronger')) {
      newCta = `🔥 Ready to take action? Tap the link in our bio right now to claim your spot or DM us "START"!`;
    } else {
      newCaption = `${newCaption}\n\n✨ Updated with your request: "${customInstruction}"`;
    }

    return {
      title: newTitle,
      headline: newTitle,
      caption: newCaption,
      cta: newCta
    };
  }
}
