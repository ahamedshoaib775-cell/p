import type { BrandPreference } from '../types';
import { supabase } from './supabase';

export const analyzeUserEditAndLearn = async (
  businessId: string,
  originalText: string,
  editedText: string,
  category: 'caption' | 'cta' | 'headline' = 'caption'
): Promise<BrandPreference | null> => {
  if (!originalText || !editedText || originalText === editedText) {
    return null;
  }

  // Detect common generic AI buzzword patterns present in original but removed in edited
  const commonBuzzwords = [
    'elevate your', 'elevate', 'unlock your', 'unlock', 'unleash your', 'unleash',
    'step into', 'discover the power', 'game-changer', 'revolutionize', 'delve into',
    'next-level', 'tapestry of', 'beacon of', 'testament to'
  ];

  const origLower = originalText.toLowerCase();
  const editLower = editedText.toLowerCase();

  const avoidedPhrases: string[] = [];
  commonBuzzwords.forEach(bw => {
    if (origLower.includes(bw) && !editLower.includes(bw)) {
      avoidedPhrases.push(bw.charAt(0).toUpperCase() + bw.slice(1));
    }
  });

  const preferredPhrases: string[] = [];
  // Extract concise natural phrases from user edit
  const userWords = editedText.split(' ').slice(0, 4).join(' ');
  if (userWords.length > 5) {
    preferredPhrases.push(userWords);
  }

  const preference: BrandPreference = {
    id: `pref_${Date.now()}`,
    business_id: businessId,
    original_ai_text: originalText,
    user_edited_text: editedText,
    avoided_phrases: avoidedPhrases.length > 0 ? avoidedPhrases : ['Generic AI buzzwords'],
    preferred_phrases: preferredPhrases,
    category,
    notes: `Learned from manual edit on ${new Date().toLocaleDateString()}`,
    created_at: new Date().toISOString()
  };

  // Save into Supabase brand_preferences table if connected
  try {
    if (supabase) {
      await supabase.from('brand_preferences').insert({
        business_id: businessId,
        user_id: 'user_current',
        original_ai_text: originalText,
        user_edited_text: editedText,
        avoided_phrases: preference.avoided_phrases,
        preferred_phrases: preference.preferred_phrases,
        category,
        notes: preference.notes
      });
    }
  } catch (err) {
    console.warn('[BrandPreferences] Supabase offline, persisted in local state.');
  }

  return preference;
};
