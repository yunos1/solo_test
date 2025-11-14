import { useState, useEffect, useRef, useCallback } from 'react';
import { Direction } from '../types/game';

interface BoardSwipeControls {
  onDirectionChange: (direction: Direction) => void;
  minSwipeDistance?: number;
  maxSwipeTime?: number;
}

interface TouchPosition {
  x: number;
  y: number;
  timestamp: number;
}

export const useBoardSwipeControls = ({ 
  onDirectionChange, 
  minSwipeDistance = 20, 
  maxSwipeTime = 300,
  isEnabled = true
}: BoardSwipeControls & { isEnabled?: boolean }) => {
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartRef = useRef<TouchPosition | null>(null);
  const lastDirectionRef = useRef<Direction | null>(null);

  const getDirection = useCallback((start: TouchPosition, end: TouchPosition): Direction => {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // 滑动距离太短，不处理
    if (distance < minSwipeDistance) {
      return lastDirectionRef.current || Direction.RIGHT;
    }

    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    
    // 简化的4方向检测（更直观）
    if (angle >= -45 && angle < 45) {
      return Direction.RIGHT;
    } else if (angle >= 45 && angle < 135) {
      return Direction.DOWN;
    } else if (angle >= 135 || angle < -135) {
      return Direction.LEFT;
    } else if (angle >= -135 && angle < -45) {
      return Direction.UP;
    }
    
    return lastDirectionRef.current || Direction.RIGHT;
  }, [minSwipeDistance]);

  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    touchStartRef.current = {
      x: clientX,
      y: clientY,
      timestamp: Date.now()
    };
    setIsSwiping(true);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!touchStartRef.current || !isEnabled) {
      setIsSwiping(false);
      return;
    }

    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
    
    const endPosition = {
      x: clientX,
      y: clientY,
      timestamp: Date.now()
    };

    const startTime = touchStartRef.current.timestamp;
    const endTime = endPosition.timestamp;
    const swipeTime = endTime - startTime;

    // 检查滑动时间是否在有效范围内
    if (swipeTime <= maxSwipeTime) {
      const direction = getDirection(touchStartRef.current, endPosition);
      
      // 只在方向真正改变时触发
      if (lastDirectionRef.current !== direction) {
        lastDirectionRef.current = direction;
        onDirectionChange(direction);
      }
    }

    // 重置触摸状态
    touchStartRef.current = null;
    setIsSwiping(false);
  }, [getDirection, maxSwipeTime, onDirectionChange, isEnabled]);

  return {
    isSwiping,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd
  };
};