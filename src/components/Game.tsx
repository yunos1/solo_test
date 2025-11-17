import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Direction, GameConfig } from '../types/game';
import { GameLoop } from '../game/GameLoop';
import GameBoard from './GameBoard';
import ScoreBoard from './ScoreBoard';
import SkinSelector from './SkinSelector';
import GameContainer from './GameContainer';

const defaultConfig: GameConfig = {
  boardWidth: 25,
  boardHeight: 25,
  playerCount: 1,
  aiCount: 3,
  gameSpeed: 200,
  foodCount: 5
};

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameLoop, setGameLoop] = useState<GameLoop | null>(null);
  const [gameConfig, setGameConfig] = useState<GameConfig>(defaultConfig);
  const [playerSkinId, setPlayerSkinId] = useState<string>('classic');
  const [showStartScreen, setShowStartScreen] = useState(true);

  // Initialize game
  useEffect(() => {
    const game = new GameLoop(gameConfig, (state: GameState) => {
      setGameState(state);
    });
    setGameLoop(game);
    setGameState(game.getGameState());

    return () => {
      game.stopGame();
    };
  }, [gameConfig]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!gameLoop || !gameState) return;

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          gameLoop.changePlayerDirection(Direction.UP);
          break;
        case 'ArrowDown':
          event.preventDefault();
          gameLoop.changePlayerDirection(Direction.DOWN);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          gameLoop.changePlayerDirection(Direction.LEFT);
          break;
        case 'ArrowRight':
          event.preventDefault();
          gameLoop.changePlayerDirection(Direction.RIGHT);
          break;
        case ' ':
          event.preventDefault();
          if (gameState.gameStatus === 'playing') {
            gameLoop.pauseGame();
          } else if (gameState.gameStatus === 'paused') {
            gameLoop.resumeGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameLoop, gameState]);

  const handleStart = useCallback(() => {
    if (gameLoop) {
      gameLoop.startGame();
      setShowStartScreen(false);
    }
  }, [gameLoop]);

  const handlePause = useCallback(() => {
    if (gameLoop) {
      gameLoop.pauseGame();
    }
  }, [gameLoop]);

  const handleResume = useCallback(() => {
    if (gameLoop) {
      gameLoop.resumeGame();
    }
  }, [gameLoop]);

  const handleReset = useCallback(() => {
    if (gameLoop) {
      gameLoop.resetGame();
      setShowStartScreen(true);
    }
  }, [gameLoop]);

  const handleDirectionChange = useCallback((direction: Direction) => {
    if (gameLoop) {
      gameLoop.changePlayerDirection(direction);
    }
  }, [gameLoop]);

  const handleSkinChange = useCallback((skinId: string) => {
    setPlayerSkinId(skinId);
    if (gameLoop && gameState) {
      gameLoop.updatePlayerSkin(skinId);
    }
  }, [gameLoop, gameState]);

  if (!gameState) {
    return (
      <GameContainer>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-xl">游戏加载中...</div>
        </div>
      </GameContainer>
    );
  }

  if (showStartScreen && gameState.gameStatus === 'waiting') {
    return (
      <GameContainer>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">🐍 多人贪吃蛇大作战</h1>
            <p className="text-gray-300 text-lg">在棋盘上滑动控制你的蛇</p>
          </div>
          
          <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-6 mb-6">
            <SkinSelector
              currentSkinId={playerSkinId}
              onSkinSelect={handleSkinChange}
              disabled={false}
              compact={true}
            />
          </div>

          <button
            onClick={handleStart}
            className="px-12 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xl font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            🎮 开始游戏
          </button>

          <div className="mt-8 text-center text-gray-400 text-sm max-w-md">
            <p className="mb-2">📱 手机操作：在棋盘上滑动控制方向</p>
            <p>🎯 目标：吃掉食物，成为最后的胜者！</p>
          </div>
        </div>
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      {/* 游戏主界面 */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* 左侧信息面板 */}
        <div className="lg:w-64 bg-black bg-opacity-30 backdrop-blur-sm border-r border-gray-700 p-4 space-y-4 overflow-y-auto">
          <ScoreBoard gameState={gameState} />
          
          {/* 游戏状态和控制 */}
          <div className="bg-black bg-opacity-50 rounded-lg p-4">
            <h3 className="text-white font-bold mb-3">游戏控制</h3>
            <div className="space-y-2">
              {gameState.gameStatus === 'playing' && (
                <button
                  onClick={handlePause}
                  className="w-full px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm transition-colors"
                >
                  ⏸ 暂停
                </button>
              )}
              
              {gameState.gameStatus === 'paused' && (
                <button
                  onClick={handleResume}
                  className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                >
                  ▶ 继续
                </button>
              )}
              
              {(gameState.gameStatus === 'gameOver' || gameState.gameStatus === 'paused') && (
                <button
                  onClick={handleReset}
                  className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                >
                  🔄 重新开始
                </button>
              )}
            </div>
          </div>

          {/* 皮肤选择 */}
          <div className="bg-black bg-opacity-50 rounded-lg p-4">
            <h3 className="text-white font-bold mb-3">皮肤</h3>
            <SkinSelector
              currentSkinId={playerSkinId}
              onSkinSelect={handleSkinChange}
              disabled={gameState.gameStatus === 'playing'}
              compact={true}
            />
          </div>

          {/* 操作提示 */}
          <div className="bg-black bg-opacity-50 rounded-lg p-4">
            <h3 className="text-white font-bold mb-2">操作提示</h3>
            <div className="text-xs text-gray-300 space-y-1">
              <p>📱 滑动控制方向</p>
              <p>⌨️ 方向键控制</p>
              <p>空格键暂停/继续</p>
            </div>
          </div>
        </div>

        {/* 中间游戏区域 */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <GameBoard 
            gameState={gameState} 
            onDirectionChange={handleDirectionChange}
            isSwipeEnabled={gameState.gameStatus === 'playing'}
          />
        </div>

        {/* 右侧信息面板 */}
        <div className="lg:w-64 bg-black bg-opacity-30 backdrop-blur-sm border-l border-gray-700 p-4 space-y-4 overflow-y-auto">
          {/* 游戏统计 */}
          <div className="bg-black bg-opacity-50 rounded-lg p-4">
            <h3 className="text-white font-bold mb-3">游戏统计</h3>
            <div className="text-sm text-gray-300 space-y-2">
              <div className="flex justify-between">
                <span>游戏状态:</span>
                <span>{gameState.gameStatus}</span>
              </div>
              <div className="flex justify-between">
                <span>食物总数:</span>
                <span>{gameState.foods.length}</span>
              </div>
              <div className="flex justify-between">
                <span>存活蛇数:</span>
                <span>{gameState.snakes.filter(s => s.isAlive).length}</span>
              </div>
            </div>
          </div>

          {/* 食物图例 */}
          <div className="bg-black bg-opacity-50 rounded-lg p-4">
            <h3 className="text-white font-bold mb-3">食物图例</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-red-500">🍎</span>
                <span className="text-gray-300">普通食物 +10分</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400">⭐</span>
                <span className="text-gray-300">特殊食物 +20分</span>
              </div>
            </div>
          </div>

          {/* 游戏状态 */}
          <div className="bg-black bg-opacity-50 rounded-lg p-4">
            <h3 className="text-white font-bold mb-3">游戏状态</h3>
            <div className={`text-sm font-semibold ${
              gameState.gameStatus === 'playing' ? 'text-green-400' :
              gameState.gameStatus === 'paused' ? 'text-yellow-400' :
              gameState.gameStatus === 'gameOver' ? 'text-red-400' :
              'text-gray-400'
            }`}>
              {gameState.gameStatus === 'waiting' && '⏳ 等待开始'}
              {gameState.gameStatus === 'playing' && '🎮 游戏进行中'}
              {gameState.gameStatus === 'paused' && '⏸ 游戏暂停'}
              {gameState.gameStatus === 'gameOver' && '🏁 游戏结束'}
            </div>
            
            {gameState.gameStatus === 'gameOver' && gameState.winner && (
              <div className="mt-2 text-sm text-green-400">
                {gameState.winner === 'player' ? '🎉 你获胜了！' : '🤖 AI获胜！'}
              </div>
            )}
          </div>
        </div>
      </div>
    </GameContainer>
  );
};

export default Game;