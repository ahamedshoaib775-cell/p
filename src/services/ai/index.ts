import type { AIProvider } from './AIProvider';
import { MockAIProvider } from './MockAIProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { GeminiProvider } from './GeminiProvider';
import type { AIProviderSettings } from '../../types';

export * from './AIProvider';
export * from './MockAIProvider';
export * from './OpenAIProvider';
export * from './GeminiProvider';

export function getAIProvider(settings?: AIProviderSettings): AIProvider {
  const providerType = settings?.provider || (import.meta.env.VITE_AI_PROVIDER as any) || 'mock';

  switch (providerType) {
    case 'openai':
      return new OpenAIProvider(settings?.openaiKey);
    case 'gemini':
      return new GeminiProvider(settings?.geminiKey);
    case 'mock':
    default:
      return new MockAIProvider();
  }
}
