import React, { useState } from 'react';
import { GameConfig } from '../types/game';

interface GameConfigProps {
  currentConfig: GameConfig;
  onConfigChange: (config: GameConfig) => void;
}

const GameConfigComponent: React.FC<GameConfigProps> = ({ currentConfig, onConfigChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<GameConfig>(currentConfig);

  const handleConfigChange = (key: keyof GameConfig, value: number) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">游戏设置</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
        >
          {isOpen ? '收起' : '展开'}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI数量: {config.aiCount}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={config.aiCount}
              onChange={(e) => handleConfigChange('aiCount', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              游戏速度: {config.gameSpeed}ms
            </label>
            <input
              type="range"
              min="100"
              max="500"
              step="50"
              value={config.gameSpeed}
              onChange={(e) => handleConfigChange('gameSpeed', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              食物数量: {config.foodCount}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={config.foodCount}
              onChange={(e) => handleConfigChange('foodCount', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="text-xs text-gray-500">
            提示：调整设置后需要重新开始游戏才能生效
          </div>
        </div>
      )}
    </div>
  );
};

export default GameConfigComponent;