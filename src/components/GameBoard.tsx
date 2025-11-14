import React from 'react';
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

    let cellClass = 'w-4 h-4';
    let cellContent: React.ReactNode = '';
    let backgroundColor = 'bg-gray-100';

    if (snake) {
      const isHead = snake.body[0].x === x && snake.body[0].y === y;
      const skin = snake.skinId ? getSkinById(snake.skinId) : null;
      
      if (isHead) {
        if (skin) {
          // Use skin for head
          backgroundColor = '';
          cellClass += ' rounded-full shadow-md';
          cellContent = (
            <div 
              className="w-full h-full flex items-center justify-center text-xs font-bold drop-shadow-lg rounded-full"
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
          cellClass += ' rounded-full shadow-md';
          cellContent = (
            <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold drop-shadow-lg">
              {snake.id === 'player' ? '👤' : '🤖'}
            </div>
          );
        }
      } else {
        if (skin) {
          // Use skin for body
          backgroundColor = '';
          cellClass += ' rounded-sm';
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
          cellClass += ' rounded-sm opacity-90';
          cellContent = '';
        }
      }
    } else if (food) {
      backgroundColor = food.type === 'special' ? 'bg-yellow-400' : 'bg-red-500';
      cellClass += ' rounded-full shadow-sm';
      cellContent = (
        <div className="w-full h-full flex items-center justify-center text-sm font-bold drop-shadow-md">
          {food.type === 'special' ? '⭐' : '🍎'}
        </div>
      );
    }

    return (
      <div
        key={`${x}-${y}`}
        className={`${cellClass} ${backgroundColor}`}
      >
        {cellContent}
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg select-none">
      <div 
        className="grid gap-0 mx-auto cursor-pointer select-none"
        style={{
          gridTemplateColumns: `repeat(${boardWidth}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${boardHeight}, minmax(0, 1fr))`,
          width: `${boardWidth * 16}px`,
          height: `${boardHeight * 16}px`
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