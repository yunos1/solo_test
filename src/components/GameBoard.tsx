import React, { useState, useEffect } from 'react';
import { GameState, Position, Snake, Food } from '../types/game';
import { getSkinById } from '../types/skins';
import { useBoardSwipeControls } from '../hooks/useBoardSwipeControls';
import { Direction } from '../types/game';

interface GameBoardProps {
  gameState: GameState;
  onDirectionChange?: (direction: Direction) => void;
  isSwipeEnabled?: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState, onDirectionChange, isSwipeEnabled = true }) => {
  const { snakes, foods, gameConfig } = gameState;
  const { boardWidth, boardHeight } = gameConfig;
  const [cellSize, setCellSize] = useState(14);

  useEffect(() => {
    const updateSize = () => {
      const maxWidth = Math.min(window.innerWidth - 100, boardWidth * 14);
      const maxHeight = Math.min(window.innerHeight - 300, boardHeight * 14);
      const size = Math.min(maxWidth / boardWidth, maxHeight / boardHeight);
      setCellSize(Math.max(8, Math.min(size, 16)));
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [boardWidth, boardHeight]);

  // 集成棋盘滑动控制
  const { isSwiping, onTouchStart, onTouchEnd } = useBoardSwipeControls({
    onDirectionChange: onDirectionChange || (() => {}),
    isEnabled: isSwipeEnabled && !!onDirectionChange
  });

  const getSnakeAtPosition = (x: number, y: number): Snake | null => {
    for (const snake of snakes) {
      for (const segment of snake.body) {
        if (segment.x === x && segment.y === y) {
          return snake;
        }
      }
    }
    return null;
  };

  const getFoodAtPosition = (x: number, y: number): Food | null => {
    return foods.find(food => food.position.x === x && food.position.y === y) || null;
  };

  const renderCell = (x: number, y: number) => {
    const snake = getSnakeAtPosition(x, y);
    const food = getFoodAtPosition(x, y);

    let cellStyle: React.CSSProperties = {
      width: `${cellSize}px`,
      height: `${cellSize}px`
    };
    let cellContent: React.ReactNode = '';
    let backgroundColor = '#111827'; // gray-900

    if (snake) {
      const isHead = snake.body[0].x === x && snake.body[0].y === y;
      const skin = snake.skinId ? getSkinById(snake.skinId) : null;
      
      if (isHead) {
        if (skin) {
          // Use skin for head
          backgroundColor = '';
          cellContent = (
            <div 
              className="w-full h-full flex items-center justify-center text-xs font-bold drop-shadow-lg rounded-full shadow-md"
              style={{ 
                backgroundColor: skin.head.backgroundColor,
                borderColor: skin.head.borderColor || '#ffffff'
              }}
            >
              {skin.head.emoji}
            </div>
          );
        } else {
          // Fallback to original rendering
          backgroundColor = snake.color;
          cellContent = (
            <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold drop-shadow-lg rounded-full shadow-md">
              {snake.id === 'player' ? '👤' : '🤖'}
            </div>
          );
        }
      } else {
        if (skin) {
          // Use skin for body
          backgroundColor = '';
          cellContent = (
            <div 
              className={`w-full h-full rounded-sm ${
                skin.body.pattern === 'striped' ? 'bg-gradient-to-r' :
                skin.body.pattern === 'dotted' ? 'bg-dotted' : ''
              }`}
              style={{ 
                backgroundColor: skin.body.backgroundColor,
                borderColor: skin.body.borderColor || '#ffffff'
              }}
            />
          );
        } else {
          // Fallback to original rendering
          backgroundColor = snake.color;
          cellContent = '';
        }
      }
    } else if (food) {
      backgroundColor = food.type === 'special' ? '#fbbf24' : '#ef4444';
      cellContent = (
        <div className="w-full h-full flex items-center justify-center text-sm font-bold drop-shadow-md rounded-full shadow-sm">
          {food.type === 'special' ? '⭐' : '🍎'}
        </div>
      );
    }

    return (
      <div
        key={`${x}-${y}`}
        className="flex items-center justify-center"
        style={{...cellStyle, backgroundColor: snake ? 'transparent' : backgroundColor}}
      >
        {cellContent}
      </div>
    );
  };

  return (
    <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-4 shadow-2xl select-none border border-gray-600">
      <div 
        className="grid gap-0 mx-auto cursor-pointer select-none"
        style={{
          gridTemplateColumns: `repeat(${boardWidth}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${boardHeight}, minmax(0, 1fr))`,
          width: `${Math.min(boardWidth * cellSize, window.innerWidth - 100)}px`,
          height: `${Math.min(boardHeight * cellSize, window.innerHeight - 300)}px`
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onTouchStart}
        onMouseUp={onTouchEnd}
      >
        {Array.from({ length: boardHeight }, (_, y) =>
          Array.from({ length: boardWidth }, (_, x) =>
            renderCell(x, y)
          )
        )}
      </div>
      
      {/* 滑动状态指示器 */}
      {isSwipeEnabled && isSwiping && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span>滑动控制中...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;