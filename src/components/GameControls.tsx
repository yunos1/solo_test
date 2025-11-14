import React from 'react';
import { GameState } from '../types/game';

interface GameControlsProps {
  gameState: GameState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  onStart,
  onPause,
  onResume,
  onReset
}) => {
  const { gameStatus } = gameState;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex flex-col space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">贪吃蛇大作战</h2>
          <div className="text-sm text-gray-600">
            状态: <span className="font-semibold">
              {gameStatus === 'waiting' && '等待开始'}
              {gameStatus === 'playing' && '游戏进行中'}
              {gameStatus === 'paused' && '游戏暂停'}
              {gameStatus === 'gameOver' && '游戏结束'}
            </span>
          </div>
        </div>

        <div className="flex justify-center space-x-2">
          {gameStatus === 'waiting' && (
            <button
              onClick={onStart}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              开始游戏
            </button>
          )}
          
          {gameStatus === 'playing' && (
            <button
              onClick={onPause}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              暂停游戏
            </button>
          )}
          
          {gameStatus === 'paused' && (
            <button
              onClick={onResume}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              继续游戏
            </button>
          )}
          
          {(gameStatus === 'gameOver' || gameStatus === 'paused') && (
            <button
              onClick={onReset}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              重新开始
            </button>
          )}
        </div>

        {gameStatus === 'gameOver' && gameState.winner && (
          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-bold text-gray-800">
              {gameState.winner === 'player' ? '🎉 恭喜获胜！' : '🤖 AI获胜！'}
            </h3>
          </div>
        )}

        <div className="text-xs text-gray-500 text-center">
          使用方向键控制你的蛇（👤）
        </div>
      </div>
    </div>
  );
};

export default GameControls;