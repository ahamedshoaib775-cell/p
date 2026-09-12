import type { VisualAsset } from '../../types';

export interface VideoGenerationProvider {
  generateVideo(script: string, style: string, duration?: number): Promise<VisualAsset>;
  generateShortForm(concept: string, platform?: string): Promise<VisualAsset>;
  estimateCost(duration: number): Promise<number>;
}

const SAMPLE_VIDEO_THUMBNAILS = [
  'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1000&q=80'
];

// Sample HTML5 video for previewing video reel play
const SAMPLE_REEL_VIDEO_URL = 'https://assets.mixkit.co/videos/preview/mixkit-working-late-in-a-modern-office-4330-large.mp4';

export class RunwayMLProvider implements VideoGenerationProvider {
  async generateVideo(script: string, style: string, duration: number = 30): Promise<VisualAsset> {
    const cost = await this.estimateCost(duration);
    const thumb = SAMPLE_VIDEO_THUMBNAILS[Math.floor(Math.random() * SAMPLE_VIDEO_THUMBNAILS.length)];

    return {
      id: `vid_runway_${Date.now()}`,
      asset_type: 'video',
      generation_prompt: script,
      style_direction: style || 'Dynamic, Fast-Paced',
      storage_url: SAMPLE_REEL_VIDEO_URL,
      thumbnail_url: thumb,
      duration: duration,
      aspect_ratio: '9:16',
      generated_at: new Date().toISOString(),
      user_edited: false,
      cost_usd: cost,
      provider: 'Runway ML',
      model_version: 'Gen-2 HD'
    };
  }

  async generateShortForm(concept: string, platform: string = 'Instagram Reels'): Promise<VisualAsset> {
    return this.generateVideo(`Short form concept for ${platform}: ${concept}`, 'Modern, High-Energy', 15);
  }

  async estimateCost(duration: number): Promise<number> {
    // ~$0.004 per second
    return Math.round(duration * 0.004 * 100) / 100;
  }
}

export class HeyGenProvider implements VideoGenerationProvider {
  async generateVideo(script: string, style: string, duration: number = 30): Promise<VisualAsset> {
    const cost = await this.estimateCost(duration);
    const thumb = SAMPLE_VIDEO_THUMBNAILS[0];
    return {
      id: `vid_heygen_${Date.now()}`,
      asset_type: 'video',
      generation_prompt: script,
      style_direction: style || 'Avatar Presenter, Professional',
      storage_url: SAMPLE_REEL_VIDEO_URL,
      thumbnail_url: thumb,
      duration,
      aspect_ratio: '9:16',
      generated_at: new Date().toISOString(),
      user_edited: false,
      cost_usd: cost,
      provider: 'HeyGen',
      model_version: 'v2-avatar'
    };
  }

  async generateShortForm(concept: string, _platform: string = 'Instagram Reels'): Promise<VisualAsset> {
    return this.generateVideo(concept, 'Energetic Presenter', 30);
  }

  async estimateCost(duration: number): Promise<number> {
    return Math.round(duration * 0.005 * 100) / 100;
  }
}

export function getVideoGenerationProvider(providerType: string = 'runway'): VideoGenerationProvider {
  switch (providerType.toLowerCase()) {
    case 'heygen':
      return new HeyGenProvider();
    case 'runway':
    default:
      return new RunwayMLProvider();
  }
}
