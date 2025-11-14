export interface SnakeSkin {
  id: string;
  name: string;
  head: {
    emoji: string;
    backgroundColor: string;
    borderColor?: string;
  };
  body: {
    backgroundColor: string;
    borderColor?: string;
    pattern?: 'solid' | 'striped' | 'dotted';
  };
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface SkinCollection {
  skins: SnakeSkin[];
  defaultSkinId: string;
}

export const DEFAULT_SKINS: SnakeSkin[] = [
  {
    id: 'classic',
    name: '经典蛇',
    head: {
      emoji: '👤',
      backgroundColor: '#dc2626',
      borderColor: '#ffffff'
    },
    body: {
      backgroundColor: '#dc2626',
      borderColor: '#ffffff',
      pattern: 'solid'
    },
    description: '经典的红色贪吃蛇',
    rarity: 'common'
  },
  {
    id: 'forest',
    name: '森林蛇',
    head: {
      emoji: '🐍',
      backgroundColor: '#059669',
      borderColor: '#ffffff'
    },
    body: {
      backgroundColor: '#10b981',
      borderColor: '#ffffff',
      pattern: 'striped'
    },
    description: '绿色的森林之蛇',
    rarity: 'common'
  },
  {
    id: 'royal',
    name: '皇家蛇',
    head: {
      emoji: '👑',
      backgroundColor: '#7c3aed',
      borderColor: '#fbbf24'
    },
    body: {
      backgroundColor: '#8b5cf6',
      borderColor: '#fbbf24',
      pattern: 'solid'
    },
    description: '紫色的皇家蛇',
    rarity: 'rare'
  },
  {
    id: 'golden',
    name: '黄金蛇',
    head: {
      emoji: '⭐',
      backgroundColor: '#f59e0b',
      borderColor: '#ffffff'
    },
    body: {
      backgroundColor: '#fbbf24',
      borderColor: '#ffffff',
      pattern: 'dotted'
    },
    description: '闪闪发光的黄金蛇',
    rarity: 'epic'
  },
  {
    id: 'dragon',
    name: '神龙',
    head: {
      emoji: '🐉',
      backgroundColor: '#dc2626',
      borderColor: '#fbbf24'
    },
    body: {
      backgroundColor: '#ef4444',
      borderColor: '#fbbf24',
      pattern: 'striped'
    },
    description: '传说中的神龙',
    rarity: 'legendary'
  },
  {
    id: 'ninja',
    name: '忍者蛇',
    head: {
      emoji: '🥷',
      backgroundColor: '#1f2937',
      borderColor: '#ef4444'
    },
    body: {
      backgroundColor: '#374151',
      borderColor: '#ef4444',
      pattern: 'solid'
    },
    description: '神秘的忍者蛇',
    rarity: 'epic'
  },
  {
    id: 'ice',
    name: '冰霜蛇',
    head: {
      emoji: '❄️',
      backgroundColor: '#0ea5e9',
      borderColor: '#ffffff'
    },
    body: {
      backgroundColor: '#38bdf8',
      borderColor: '#ffffff',
      pattern: 'dotted'
    },
    description: '冰冷的冰霜蛇',
    rarity: 'rare'
  },
  {
    id: 'fire',
    name: '火焰蛇',
    head: {
      emoji: '🔥',
      backgroundColor: '#ea580c',
      borderColor: '#fbbf24'
    },
    body: {
      backgroundColor: '#f97316',
      borderColor: '#fbbf24',
      pattern: 'striped'
    },
    description: '燃烧的火焰蛇',
    rarity: 'epic'
  }
];

export const getSkinById = (id: string): SnakeSkin | undefined => {
  return DEFAULT_SKINS.find(skin => skin.id === id);
};

export const getRandomSkin = (): SnakeSkin => {
  const randomIndex = Math.floor(Math.random() * DEFAULT_SKINS.length);
  return DEFAULT_SKINS[randomIndex];
};

export const getSkinsByRarity = (rarity: SnakeSkin['rarity']): SnakeSkin[] => {
  return DEFAULT_SKINS.filter(skin => skin.rarity === rarity);
};