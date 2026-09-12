import type { BusinessProfile, BrandProfile, PostItem, BrandPreference } from '../../types';

export interface AIPlanGenerationOptions {
  customFocus?: string;
  preferences?: BrandPreference[];
}

export interface AIRegenerateOptions {
  customInstruction: string;
  itemToRegenerate: PostItem;
  business: BusinessProfile;
  brandProfile?: BrandProfile | null;
  preferences?: BrandPreference[];
}

export interface AIProvider {
  /** Provider identifier */
  id: 'mock' | 'openai' | 'gemini';
  name: string;

  /** Analyzes business details & Instagram profile to build a persistent Brand Profile */
  analyzeBrand(business: BusinessProfile): Promise<BrandProfile>;

  /** Generates a tailored 7-day Instagram content plan (7 content items) */
  generate7DayPlan(
    business: BusinessProfile,
    brandProfile: BrandProfile | null,
    options?: AIPlanGenerationOptions
  ): Promise<Omit<PostItem, 'id' | 'created_at'>[]>;

  /** Regenerates a single content item with a custom user instruction */
  regenerateSingleItem(options: AIRegenerateOptions): Promise<Partial<PostItem>>;
}
