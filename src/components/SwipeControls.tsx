import React, { useState, useCallback } from 'react';
import { Direction } from '../types/game';
import { useSwipeControls } from '../hooks/useSwipeControls';

interface SwipeControlsProps {
  onDirectionChange: (direction: Direction) => void;
  isEnabled?: boolean;
}

const SwipeControls: React.FC<SwipeControlsProps> = ({ 
  onDirectionChange, 
  isEnabled = true 
}) => {
  const [showIndicator, setShowIndicator] = useState(false);
  const [lastDirection, setLastDirection] = useState<Direction | null>(null);

  const handleSwipe = useCallback((direction: Direction) => {
    if (!isEnabled) return;
    
    onDirectionChange(direction);
    setLastDirection(direction);
    setShowIndicator(true);
    
    // 显示方向指示器1秒后隐藏
    setTimeout(() => {
      setShowIndicator(false);
    }, 1000);
  }, [onDirectionChange, isEnabled]);

  const { isSwiping } = useSwipeControls({
    onSwipe: handleSwipe,
    minSwipeDistance: 20,
    maxSwipeTime: 500
  });

  const getDirectionText = (direction: Direction): string => {
    switch (direction) {
      case Direction.UP: return '上';
      case Direction.DOWN: return '下';
      case Direction.LEFT: return '左';
      case Direction.RIGHT: return '右';
      default: return '';
    }
  };

  const getDirectionIcon = (direction: Direction): string => {
    switch (direction) {
      case Direction.UP: return '↑';
      case Direction.DOWN: return '↓';
      case Direction.LEFT: return '←';
      case Direction.RIGHT: return '→';
      default: return '';
    }
  };

  return (
    <div className="lg:hidden bg-white p-6 rounded-lg shadow-lg">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">滑动控制</h3>
        <p className="text-sm text-gray-600">
          在屏幕上滑动来控制蛇的移动方向
        </p>
      </div>

      {/* 滑动区域指示器 */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 mb-4 border-2 border-dashed border-blue-300">
        <div className="text-center">
          <div className="text-4xl mb-2">
            👆
          </div>
          <div className="text-sm text-blue-600 font-medium">
            {isSwiping ? '滑动中...' : '在此区域滑动'}
          </div>
        </div>

        {/* 方向指示器 */}
        {showIndicator && lastDirection && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold shadow-lg animate-pulse">
              {getDirectionIcon(lastDirection)}
            </div>
          </div>
        )}
      </div>

      {/* 方向说明 */}
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <span className="text-blue-500">↑</span>
          <span>向上滑动</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-blue-500">↓</span>
          <span>向下滑动</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-blue-500">←</span>
          <span>向左滑动</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-blue-500">→</span>
          <span>向右滑动</span>
        </div>
      </div>

      {/* 最后操作提示 */}
      {lastDirection && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
          <span className="text-sm text-blue-700">
            上次操作: 
            <span className="font-bold">
              {getDirectionIcon(lastDirection)} {getDirectionText(lastDirection)}
            </span>
          </span>
        </div>
      )}

      {/* 状态指示 */}
      <div className="mt-4 text-center">
        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
          isEnabled 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-500'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isEnabled ? 'bg-green-500' : 'bg-gray-400'
          }`}></div>
          <span>{isEnabled ? '滑动控制已启用' : '滑动控制已禁用'}</span>
        </div>
      </div>
    </div>
  );
};

export default SwipeControls;