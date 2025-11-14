import React, { useState, useRef, useCallback } from 'react';
import { Direction } from '../types/game';

interface VirtualJoystickProps {
  onDirectionChange: (direction: Direction) => void;
  isEnabled?: boolean;
}

const VirtualJoystick: React.FC<VirtualJoystickProps> = ({ 
  onDirectionChange, 
  isEnabled = true 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const currentDirectionRef = useRef<Direction | null>(null);

  const getDirectionFromPosition = useCallback((x: number, y: number): Direction => {
    const angle = Math.atan2(y, x) * 180 / Math.PI;
    
    // 8方向检测
    if (angle >= -22.5 && angle < 22.5) {
      return Direction.RIGHT;
    } else if (angle >= 22.5 && angle < 67.5) {
      return Direction.DOWN; // 右下
    } else if (angle >= 67.5 && angle < 112.5) {
      return Direction.DOWN;
    } else if (angle >= 112.5 && angle < 157.5) {
      return Direction.DOWN; // 左下
    } else if (angle >= 157.5 || angle < -157.5) {
      return Direction.LEFT;
    } else if (angle >= -157.5 && angle < -112.5) {
      return Direction.UP; // 左上
    } else if (angle >= -112.5 && angle < -67.5) {
      return Direction.UP;
    } else if (angle >= -67.5 && angle < -22.5) {
      return Direction.UP; // 右上
    }
    
    return Direction.RIGHT;
  }, []);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (!isEnabled || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const x = clientX - rect.left - centerX;
    const y = clientY - rect.top - centerY;
    
    // 限制摇杆移动范围
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = Math.min(centerX, centerY) - 20;
    
    if (distance <= maxDistance) {
      setJoystickPosition({ x, y });
    } else {
      const ratio = maxDistance / distance;
      setJoystickPosition({ x: x * ratio, y: y * ratio });
    }
    
    const direction = getDirectionFromPosition(x, y);
    if (currentDirectionRef.current !== direction) {
      currentDirectionRef.current = direction;
      onDirectionChange(direction);
    }
    
    setIsDragging(true);
  }, [isEnabled, getDirectionFromPosition, onDirectionChange]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !isEnabled || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const x = clientX - rect.left - centerX;
    const y = clientY - rect.top - centerY;
    
    // 限制摇杆移动范围
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = Math.min(centerX, centerY) - 20;
    
    if (distance <= maxDistance) {
      setJoystickPosition({ x, y });
    } else {
      const ratio = maxDistance / distance;
      setJoystickPosition({ x: x * ratio, y: y * ratio });
    }
    
    const direction = getDirectionFromPosition(x, y);
    if (currentDirectionRef.current !== direction) {
      currentDirectionRef.current = direction;
      onDirectionChange(direction);
    }
  }, [isDragging, isEnabled, getDirectionFromPosition, onDirectionChange]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    setJoystickPosition({ x: 0, y: 0 });
    currentDirectionRef.current = null;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  }, [handleStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  }, [handleMove]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [handleStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  }, [handleMove]);

  const getDirectionText = (direction: Direction): string => {
    switch (direction) {
      case Direction.UP: return '上';
      case Direction.DOWN: return '下';
      case Direction.LEFT: return '左';
      case Direction.RIGHT: return '右';
      default: return '';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">虚拟摇杆</h3>
        <p className="text-sm text-gray-600">
          拖拽摇杆来控制蛇的移动方向
        </p>
      </div>

      {/* 摇杆容器 */}
      <div 
        ref={containerRef}
        className={`relative w-32 h-32 mx-auto bg-gray-100 rounded-full border-4 border-gray-300 ${
          isEnabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleEnd}
      >
        {/* 摇杆背景圆圈 */}
        <div className="absolute inset-2 bg-gray-200 rounded-full opacity-50"></div>
        
        {/* 摇杆 */}
        <div 
          className={`absolute w-8 h-8 bg-blue-500 rounded-full shadow-lg transform -translate-x-4 -translate-y-4 ${
            isDragging ? 'scale-110 shadow-xl' : 'scale-100'
          } transition-transform duration-100`}
          style={{
            left: `calc(50% + ${joystickPosition.x}px)`,
            top: `calc(50% + ${joystickPosition.y}px)`,
          }}
        >
          {/* 摇杆中心指示器 */}
          <div className="absolute inset-1 bg-blue-300 rounded-full opacity-60"></div>
        </div>

        {/* 方向标记 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xs text-gray-400 font-bold">
            {currentDirectionRef.current ? getDirectionText(currentDirectionRef.current) : '•'}
          </div>
        </div>
      </div>

      {/* 状态信息 */}
      <div className="mt-4 text-center">
        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
          isEnabled 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-500'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isEnabled ? 'bg-green-500' : 'bg-gray-400'
          }`}></div>
          <span>{isEnabled ? '摇杆已启用' : '摇杆已禁用'}</span>
        </div>
        
        {currentDirectionRef.current && (
          <div className="mt-2 text-sm text-blue-600 font-medium">
            当前方向: {getDirectionText(currentDirectionRef.current)}
          </div>
        )}
      </div>

      {/* 使用说明 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
        <p className="text-xs text-blue-700">
          💡 提示：拖拽蓝色摇杆到想要的方向，蛇会立即响应
        </p>
      </div>
    </div>
  );
};

export default VirtualJoystick;