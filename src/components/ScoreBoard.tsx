import React from 'react';
import { GameState } from '../types/game';

interface ScoreBoardProps {
  gameState: GameState;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ gameState }) => {
  const { snakes } = gameState;
  
  // Sort snakes by score (descending)
  const sortedSnakes = [...snakes].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4">排行榜</h3>
      <div className="space-y-2">
        {sortedSnakes.map((snake, index) => (
          <div
            key={snake.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              snake.isAlive ? 'bg-gray-50' : 'bg-gray-200 opacity-60'
            } ${
              index === 0 ? 'border-2 border-yellow-400' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="text-lg font-bold text-gray-600">
                #{index + 1}
              </div>
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: snake.color }}
              />
              <div>
                <div className="font-semibold text-gray-800">
                  {snake.id === 'player' ? '玩家' : `AI-${snake.id.split('-')[1]}`}
                  {!snake.isAlive && ' (已淘汰)'}
                </div>
                <div className="text-xs text-gray-500">
                  长度: {snake.body.length}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-800">
                {snake.score}
              </div>
              <div className="text-xs text-gray-500">分数</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreBoard;