
import { ProjectWork } from './types';

export const INITIAL_WORKS: ProjectWork[] = [
  { 
    id: '1', 
    name: '翠影湖光系列', 
    items: [
      { id: '1-1', url: 'https://picsum.photos/id/10/600/800', aspect: 3/4 },
      { id: '1-2', url: 'https://picsum.photos/id/11/600/800', aspect: 3/4 },
      { id: '1-3', url: 'https://picsum.photos/id/12/600/800', aspect: 3/4 },
    ]
  },
  { 
    id: '2', 
    name: '森之呼吸', 
    items: [
      { id: '2-1', url: 'https://picsum.photos/id/20/600/800', aspect: 3/4 },
      { id: '2-2', url: 'https://picsum.photos/id/21/600/800', aspect: 3/4 },
    ]
  },
  { 
    id: '3', 
    name: '晨曦初露', 
    items: [{ id: '3-1', url: 'https://picsum.photos/id/30/600/800', aspect: 3/4 }]
  },
  { id: '4', name: '秘境幽径', items: [{ id: '4-1', url: 'https://picsum.photos/id/40/600/800', aspect: 3/4 }] },
  { id: '5', name: '古木参天', items: [{ id: '5-1', url: 'https://picsum.photos/id/50/600/800', aspect: 3/4 }] },
  { id: '6', name: '万物生辉', items: [{ id: '6-1', url: 'https://picsum.photos/id/60/600/800', aspect: 3/4 }] },
  { id: '7', name: '林间物语', items: [{ id: '7-1', url: 'https://picsum.photos/id/70/600/800', aspect: 3/4 }] },
  { id: '8', name: '翡翠之梦', items: [{ id: '8-1', url: 'https://picsum.photos/id/80/600/800', aspect: 3/4 }] },
];

export const MARKETING_PROMPTS = {
  mug: "Place this product naturally on a high-quality ceramic coffee mug. The mug is sitting on a clean minimalist wooden table in a brightly lit modern cafe. Maintain product design exactly.",
  billboard: "Place this product on a massive, sleek digital billboard in a futuristic city environment during twilight. The product should be the center focus with high cinematic lighting.",
  shirt: "A professional fashion photograph of a person wearing a plain high-quality t-shirt with this product design printed clearly on the chest. Soft studio lighting."
};
