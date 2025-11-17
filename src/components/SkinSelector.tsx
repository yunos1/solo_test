import React, { useState } from 'react';
import { SnakeSkin, DEFAULT_SKINS, getSkinById } from '../types/skins';

interface SkinSelectorProps {
  currentSkinId?: string;
  onSkinSelect: (skinId: string) => void;
  disabled?: boolean;
  compact?: boolean;
}

const SkinSelector: React.FC<SkinSelectorProps> = ({ currentSkinId, onSkinSelect, disabled = false, compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentSkin = currentSkinId ? getSkinById(currentSkinId) : DEFAULT_SKINS[0];

  const getRarityColor = (rarity: SnakeSkin['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
    }
  };

  const getRarityTextColor = (rarity: SnakeSkin['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'rare': return 'text-blue-600';
      case 'epic': return 'text-purple-600';
      case 'legendary': return 'text-yellow-600';
    }
  };

  const getRarityName = (rarity: SnakeSkin['rarity']) => {
    switch (rarity) {
      case 'common': return '普通';
      case 'rare': return '稀有';
      case 'epic': return '史诗';
      case 'legendary': return '传说';
    }
  };

  if (compact) {
    return (
      <div className="relative">
        <select
          value={currentSkinId}
          onChange={(e) => onSkinSelect(e.target.value)}
          disabled={disabled}
          className={`w-full px-3 py-2 rounded-lg border-2 bg-black bg-opacity-50 text-white text-sm transition-all duration-200 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black hover:bg-opacity-70 cursor-pointer'
          }`}
        >
          {DEFAULT_SKINS.map((skin) => (
            <option key={skin.id} value={skin.id} className="bg-gray-800 text-white">
              {skin.head.emoji} {skin.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md cursor-pointer'
        } ${getRarityColor(currentSkin.rarity)}`}
      >
        <div 
          className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold shadow-md"
          style={{ 
            backgroundColor: currentSkin.head.backgroundColor,
            borderColor: currentSkin.head.borderColor || '#ffffff'
          }}
        >
          {currentSkin.head.emoji}
        </div>
        <div className="text-left">
          <div className="font-semibold text-gray-800">{currentSkin.name}</div>
          <div className={`text-xs ${getRarityTextColor(currentSkin.rarity)}`}>
            {getRarityName(currentSkin.rarity)}
          </div>
        </div>
        <div className="ml-auto">
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">选择蛇皮肤</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEFAULT_SKINS.map((skin) => (
                <button
                  key={skin.id}
                  onClick={() => {
                    onSkinSelect(skin.id);
                    setIsOpen(false);
                  }}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md text-left ${
                    currentSkinId === skin.id 
                      ? 'ring-2 ring-blue-500 ring-offset-2' 
                      : ''
                  } ${getRarityColor(skin.rarity)}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg font-bold shadow-md"
                      style={{ 
                        backgroundColor: skin.head.backgroundColor,
                        borderColor: skin.head.borderColor || '#ffffff'
                      }}
                    >
                      {skin.head.emoji}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{skin.name}</div>
                      <div className={`text-xs ${getRarityTextColor(skin.rarity)}`}>
                        {getRarityName(skin.rarity)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <div 
                      className="w-4 h-4 rounded-sm border"
                      style={{ 
                        backgroundColor: skin.body.backgroundColor,
                        borderColor: skin.body.borderColor || '#ffffff'
                      }}
                    />
                    <span className="text-xs text-gray-600">身体样式</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{skin.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkinSelector;