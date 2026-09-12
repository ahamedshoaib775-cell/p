import type { VisualAsset } from '../../types';

export interface ImageGenerationProvider {
  generateImage(prompt: string, style: string, aspectRatio?: string): Promise<VisualAsset>;
  generateCarousel(concept: string, style: string, count?: number): Promise<VisualAsset>;
  editImage(imageUrl: string, prompt: string): Promise<VisualAsset>;
  estimateCost(prompt: string): Promise<number>;
}

const SAMPLE_IMAGE_ASSETS = [
  'https://images.unsplash.com/photo-1542744094-3a31b272c490?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=80'
];

export class DALLE3ImageProvider implements ImageGenerationProvider {
  async generateImage(prompt: string, style: string, aspectRatio: '1:1' | '16:9' | '9:16' | '4:5' = '1:1'): Promise<VisualAsset> {
    const cost = await this.estimateCost(prompt);
    const randomUrl = SAMPLE_IMAGE_ASSETS[Math.floor(Math.random() * SAMPLE_IMAGE_ASSETS.length)];
    
    return {
      id: `img_dalle_${Date.now()}`,
      asset_type: 'image',
      generation_prompt: prompt,
      style_direction: style || 'Modern, Minimalist',
      storage_url: randomUrl,
      thumbnail_url: randomUrl,
      aspect_ratio: aspectRatio,
      generated_at: new Date().toISOString(),
      user_edited: false,
      cost_usd: cost,
      provider: 'DALL-E 3',
      model_version: 'dall-e-3-hd'
    };
  }

  async generateCarousel(concept: string, style: string, count: number = 3): Promise<VisualAsset> {
    const cost = (await this.estimateCost(concept)) * count;
    const urls = SAMPLE_IMAGE_ASSETS.slice(0, count);

    return {
      id: `car_dalle_${Date.now()}`,
      asset_type: 'carousel',
      generation_prompt: `3-slide thematic series: ${concept}`,
      style_direction: style || 'Clean & Professional',
      storage_url: urls[0],
      thumbnail_url: urls[0],
      carousel_urls: urls,
      aspect_ratio: '1:1',
      generated_at: new Date().toISOString(),
      user_edited: false,
      cost_usd: cost,
      provider: 'DALL-E 3',
      model_version: 'dall-e-3'
    };
  }

  async editImage(imageUrl: string, prompt: string): Promise<VisualAsset> {
    const cost = 0.03;
    return {
      id: `img_edit_${Date.now()}`,
      asset_type: 'image',
      generation_prompt: prompt,
      style_direction: 'Modified based on prompt',
      storage_url: imageUrl,
      thumbnail_url: imageUrl,
      aspect_ratio: '1:1',
      generated_at: new Date().toISOString(),
      user_edited: true,
      edit_history: [`Edited with: ${prompt}`],
      cost_usd: cost,
      provider: 'DALL-E 3'
    };
  }

  async estimateCost(_prompt: string): Promise<number> {
    return 0.04;
  }
}

export class StabilityImageProvider implements ImageGenerationProvider {
  async generateImage(prompt: string, style: string, aspectRatio: '1:1' | '16:9' | '9:16' | '4:5' = '1:1'): Promise<VisualAsset> {
    const cost = await this.estimateCost(prompt);
    const randomUrl = SAMPLE_IMAGE_ASSETS[Math.floor(Math.random() * SAMPLE_IMAGE_ASSETS.length)];
    return {
      id: `img_stab_${Date.now()}`,
      asset_type: 'image',
      generation_prompt: prompt,
      style_direction: style,
      storage_url: randomUrl,
      thumbnail_url: randomUrl,
      aspect_ratio: aspectRatio,
      generated_at: new Date().toISOString(),
      user_edited: false,
      cost_usd: cost,
      provider: 'Stability AI',
      model_version: 'SDXL-1.0'
    };
  }

  async generateCarousel(concept: string, style: string, count: number = 3): Promise<VisualAsset> {
    const cost = 0.02 * count;
    const urls = SAMPLE_IMAGE_ASSETS.slice(0, count);
    return {
      id: `car_stab_${Date.now()}`,
      asset_type: 'carousel',
      generation_prompt: concept,
      style_direction: style,
      storage_url: urls[0],
      thumbnail_url: urls[0],
      carousel_urls: urls,
      aspect_ratio: '1:1',
      generated_at: new Date().toISOString(),
      user_edited: false,
      cost_usd: cost,
      provider: 'Stability AI'
    };
  }

  async editImage(imageUrl: string, prompt: string): Promise<VisualAsset> {
    return {
      id: `img_edit_${Date.now()}`,
      asset_type: 'image',
      generation_prompt: prompt,
      style_direction: 'SD Inpainting',
      storage_url: imageUrl,
      thumbnail_url: imageUrl,
      aspect_ratio: '1:1',
      generated_at: new Date().toISOString(),
      user_edited: true,
      cost_usd: 0.018,
      provider: 'Stability AI'
    };
  }

  async estimateCost(_prompt: string): Promise<number> {
    return 0.02;
  }
}

export function getImageGenerationProvider(providerType: string = 'dalle3'): ImageGenerationProvider {
  switch (providerType.toLowerCase()) {
    case 'stability':
      return new StabilityImageProvider();
    case 'dalle3':
    default:
      return new DALLE3ImageProvider();
  }
}
