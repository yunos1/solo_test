import { useState, useEffect, useRef, useCallback } from 'react';
import { Direction } from '../types/game';

interface SwipeControls {
  onSwipe: (direction: Direction) => void;
  minSwipeDistance?: number;
  maxSwipeTime?: number;
}

interface TouchPosition {
  x: number;
  y: number;
  timestamp: number;
}

export const useSwipeControls = ({ 
  onSwipe, 
  minSwipeDistance = 30, 
  maxSwipeTime = 300 
}: SwipeControls) => {
  const touchStartRef = useRef<TouchPosition | null>(null);
  const touchEndRef = useRef<TouchPosition | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const getDirection = useCallback((start: TouchPosition, end: TouchPosition): Direction => {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // 如果滑动距离太短，不处理
    if (distance < minSwipeDistance) {
      return Direction.RIGHT; // 返回默认方向
    }

    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    
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
    
    return Direction.RIGHT; // 默认方向
  }, [minSwipeDistance]);

  const onTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };
    setIsSwiping(true);
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current || !isSwiping) return;
    
    const touch = e.touches[0];
    touchEndRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };
  }, [isSwiping]);

  const onTouchEnd = useCallback(() => {
    if (!touchStartRef.current || !touchEndRef.current) {
      setIsSwiping(false);
      return;
    }

    const startTime = touchStartRef.current.timestamp;
    const endTime = touchEndRef.current.timestamp;
    const swipeTime = endTime - startTime;

    // 检查滑动时间是否在有效范围内
    if (swipeTime <= maxSwipeTime) {
      const direction = getDirection(touchStartRef.current, touchEndRef.current);
      onSwipe(direction);
    }

    // 重置触摸状态
    touchStartRef.current = null;
    touchEndRef.current = null;
    setIsSwiping(false);
  }, [getDirection, maxSwipeTime, onSwipe]);

  // 添加鼠标事件支持（用于桌面端测试）
  const onMouseDown = useCallback((e: MouseEvent) => {
    touchStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now()
    };
    setIsSwiping(true);
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!touchStartRef.current || !isSwiping) return;
    
    touchEndRef.current = {
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now()
    };
  }, [isSwiping]);

  const onMouseUp = useCallback(() => {
    if (!touchStartRef.current || !touchEndRef.current) {
      setIsSwiping(false);
      return;
    }

    const startTime = touchStartRef.current.timestamp;
    const endTime = touchEndRef.current.timestamp;
    const swipeTime = endTime - startTime;

    if (swipeTime <= maxSwipeTime) {
      const direction = getDirection(touchStartRef.current, touchEndRef.current);
      onSwipe(direction);
    }

    touchStartRef.current = null;
    touchEndRef.current = null;
    setIsSwiping(false);
  }, [getDirection, maxSwipeTime, onSwipe]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => onTouchStart(e);
    const handleTouchMove = (e: TouchEvent) => onTouchMove(e);
    const handleTouchEnd = () => onTouchEnd();
    
    const handleMouseDown = (e: MouseEvent) => onMouseDown(e);
    const handleMouseMove = (e: MouseEvent) => onMouseMove(e);
    const handleMouseUp = () => onMouseUp();

    // 触摸事件
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);

    // 鼠标事件（用于测试）
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onTouchStart, onTouchMove, onTouchEnd, onMouseDown, onMouseMove, onMouseUp]);

  return {
    isSwiping,
    resetSwipe: () => {
      touchStartRef.current = null;
      touchEndRef.current = null;
      setIsSwiping(false);
    }
  };
};