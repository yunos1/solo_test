import React from 'react';
import { Direction } from '../types/game';

interface MobileControlsProps {
  onDirectionChange: (direction: Direction) => void;
}

const MobileControls: React.FC<MobileControlsProps> = ({ onDirectionChange }) => {
  return (
    <div className="lg:hidden bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">移动控制</h3>
      <div className="flex flex-col items-center space-y-2">
        {/* Up Button */}
        <button
          onClick={() => onDirectionChange(Direction.UP)}
          className="w-12 h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center text-xl"
        >
          ↑
        </button>
        
        {/* Left and Right Buttons */}
        <div className="flex space-x-8">
          <button
            onClick={() => onDirectionChange(Direction.LEFT)}
            className="w-12 h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center text-xl"
          >
            ←
          </button>
          <button
            onClick={() => onDirectionChange(Direction.RIGHT)}
            className="w-12 h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center text-xl"
          >
            →
          </button>
        </div>
        
        {/* Down Button */}
        <button
          onClick={() => onDirectionChange(Direction.DOWN)}
          className="w-12 h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center text-xl"
        >
          ↓
        </button>
      </div>
      
      <div className="text-center mt-4 text-xs text-gray-500">
        点击方向按钮控制蛇的移动
      </div>
    </div>
  );
};

export default MobileControls;