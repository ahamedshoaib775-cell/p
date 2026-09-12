import type { BusinessProfile, BrandProfile } from '../types';
import { getAIProvider } from './ai';

export const generateBrandProfile = async (business: BusinessProfile): Promise<BrandProfile> => {
  const provider = getAIProvider();
  return await provider.analyzeBrand(business);
};
