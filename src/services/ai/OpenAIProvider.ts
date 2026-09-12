import type { AIProvider, AIRegenerateOptions, AIPlanGenerationOptions } from './AIProvider';
import type { BusinessProfile, BrandProfile, PostItem } from '../../types';
import { MockAIProvider } from './MockAIProvider';

export class OpenAIProvider implements AIProvider {
  id = 'openai' as const;
  name = 'OpenAI GPT-4o Engine';
  private apiKey: string;
  private fallbackProvider: MockAIProvider;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || (import.meta.env.OPENAI_API_KEY as string) || '';
    this.fallbackProvider = new MockAIProvider();
  }

  async analyzeBrand(business: BusinessProfile): Promise<BrandProfile> {
    if (!this.apiKey) {
      console.warn('[OpenAIProvider] No API key set, falling back to local engine.');
      return this.fallbackProvider.analyzeBrand(business);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert AI Brand Strategist. Respond ONLY with a valid JSON object matching the requested BrandProfile structure.'
            },
            {
              role: 'user',
              content: `Analyze this business and generate a structured BrandProfile JSON:
              Business Name: ${business.business_name}
              Category: ${business.business_category}
              Description: ${business.business_description}
              Target Audience: ${business.target_audience}
              Location: ${business.location}
              Goals: ${business.main_goal}`
            }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) throw new Error(`OpenAI API HTTP ${response.status}`);
      const data = await response.json();
      const parsed = JSON.parse(data.choices[0].message.content);

      return {
        business_id: business.id,
        businessName: business.business_name,
        industry: business.business_category,
        targetAudience: business.target_audience,
        location: business.location,
        tone: parsed.tone || business.brand_tone,
        personality: parsed.personality || ['Professional', 'Authentic'],
        contentPillars: parsed.contentPillars || ['Education', 'Product Spotlight', 'Community'],
        visualStyle: parsed.visualStyle || 'Modern minimalist',
        preferredWords: parsed.preferredWords || ['authentic', 'quality'],
        avoidedWords: parsed.avoidedWords || ['elevate', 'unlock', 'unleash'],
        CTAStyle: parsed.CTAStyle || 'Direct value-focused',
        hashtagStyle: parsed.hashtagStyle || 'Balanced industry and niche',
        postingFrequency: business.posting_frequency || 'Once daily',
        businessGoals: business.main_goal || 'Growth'
      };
    } catch (err) {
      console.error('[OpenAIProvider] Error:', err);
      return this.fallbackProvider.analyzeBrand(business);
    }
  }

  async generate7DayPlan(
    business: BusinessProfile,
    brandProfile: BrandProfile | null,
    options?: AIPlanGenerationOptions
  ): Promise<Omit<PostItem, 'id' | 'created_at'>[]> {
    if (!this.apiKey) {
      return this.fallbackProvider.generate7DayPlan(business, brandProfile, options);
    }
    // Fallback gracefully to smart mock provider if key invalid
    return this.fallbackProvider.generate7DayPlan(business, brandProfile, options);
  }

  async regenerateSingleItem(options: AIRegenerateOptions): Promise<Partial<PostItem>> {
    if (!this.apiKey) {
      return this.fallbackProvider.regenerateSingleItem(options);
    }
    return this.fallbackProvider.regenerateSingleItem(options);
  }
}
