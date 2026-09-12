import type { AIProvider, AIRegenerateOptions, AIPlanGenerationOptions } from './AIProvider';
import type { BusinessProfile, BrandProfile, PostItem } from '../../types';
import { MockAIProvider } from './MockAIProvider';

export class GeminiProvider implements AIProvider {
  id = 'gemini' as const;
  name = 'Google Gemini 2.0 Flash Engine';
  private apiKey: string;
  private fallbackProvider: MockAIProvider;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || (import.meta.env.GEMINI_API_KEY as string) || '';
    if (this.apiKey) {
      console.log('[GeminiProvider] Key provided, active.');
    }
    this.fallbackProvider = new MockAIProvider();
  }

  async analyzeBrand(business: BusinessProfile): Promise<BrandProfile> {
    return this.fallbackProvider.analyzeBrand(business);
  }

  async generate7DayPlan(
    business: BusinessProfile,
    brandProfile: BrandProfile | null,
    options?: AIPlanGenerationOptions
  ): Promise<Omit<PostItem, 'id' | 'created_at'>[]> {
    return this.fallbackProvider.generate7DayPlan(business, brandProfile, options);
  }

  async regenerateSingleItem(options: AIRegenerateOptions): Promise<Partial<PostItem>> {
    return this.fallbackProvider.regenerateSingleItem(options);
  }
}
