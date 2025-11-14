import React from 'react';
import { GameState } from '../types/game';

interface GameStatsProps {
  gameState: GameState;
}

const GameStats: React.FC<GameStatsProps> = ({ gameState }) => {
  const { snakes, gameStatus } = gameState;
  
  const aliveSnakes = snakes.filter(snake => snake.isAlive);
  const totalScore = snakes.reduce((sum, snake) => sum + snake.score, 0);
  const gameTime = Math.floor(Date.now() / 1000); // Simple game time tracking

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4">游戏统计</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">存活蛇数</span>
          <span className="font-bold text-green-600">{aliveSnakes.length}/{snakes.length}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">总分数</span>
          <span className="font-bold text-blue-600">{totalScore}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">游戏状态</span>
          <span className={`font-bold ${
            gameStatus === 'playing' ? 'text-green-600' :
            gameStatus === 'paused' ? 'text-yellow-600' :
            gameStatus === 'gameOver' ? 'text-red-600' :
            'text-gray-600'
          }`}>
            {gameStatus === 'waiting' && '等待开始'}
            {gameStatus === 'playing' && '进行中'}
            {gameStatus === 'paused' && '已暂停'}
            {gameStatus === 'gameOver' && '已结束'}
          </span>
        </div>

        <div className="pt-2 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">操作提示</h4>
          <div className="text-xs text-gray-500 space-y-1">
            <div>↑↓←→ 控制方向</div>
            <div>空格键 暂停/继续</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStats;