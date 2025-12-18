
export type LayoutMode = 'WAVE' | 'RANDOM' | 'CIRCULAR';

export interface MarketingAsset {
  id: string;
  url: string;
  title: string;
  category: 'original' | 'mug' | 'billboard' | 'shirt';
}

export interface ImageItem {
  id: string;
  url: string;
  aspect: number;
}

export interface ProjectWork {
  id: string;
  name: string;
  items: ImageItem[];
}
