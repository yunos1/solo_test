import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Direction, GameConfig } from '../types/game';
import { GameLoop } from '../game/GameLoop';
import GameBoard from './GameBoard';
import GameControls from './GameControls';
import ScoreBoard from './ScoreBoard';
import GameConfigComponent from './GameConfig';
import GameStats from './GameStats';
import SkinSelector from './SkinSelector';

const defaultConfig: GameConfig = {
  boardWidth: 30,
  boardHeight: 30,
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
    }
  }, [gameLoop]);

  const handleDirectionChange = useCallback((direction: Direction) => {
    if (gameLoop) {
      gameLoop.changePlayerDirection(direction);
    }
  }, [gameLoop]);

  const handleConfigChange = useCallback((newConfig: GameConfig) => {
    setGameConfig(newConfig);
  }, []);

  const handleSkinChange = useCallback((skinId: string) => {
    setPlayerSkinId(skinId);
    if (gameLoop && gameState) {
      gameLoop.updatePlayerSkin(skinId);
    }
  }, [gameLoop, gameState]);

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">游戏加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          多人贪吃蛇大作战
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Controls and Config */}
          <div className="lg:col-span-1 space-y-6">
            <GameControls
              gameState={gameState}
              onStart={handleStart}
              onPause={handlePause}
              onResume={handleResume}
              onReset={handleReset}
            />
            <SkinSelector
              currentSkinId={playerSkinId}
              onSkinSelect={handleSkinChange}
              disabled={gameState.gameStatus === 'playing'}
            />
            <GameConfigComponent
              currentConfig={gameConfig}
              onConfigChange={handleConfigChange}
            />
            <GameStats gameState={gameState} />
          </div>

          {/* Center - Game Board */}
          <div className="lg:col-span-2">
            <div className="flex justify-center">
              <GameBoard 
                gameState={gameState} 
                onDirectionChange={handleDirectionChange}
                isSwipeEnabled={gameState.gameStatus === 'playing'}
              />
            </div>
          </div>

          {/* Right Panel - Score Board */}
          <div className="lg:col-span-1">
            <ScoreBoard gameState={gameState} />
          </div>
        </div>

        {/* Mobile Instructions */}
        <div className="mt-6 lg:hidden">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-2">📱 手机操作</h3>
            <p className="text-sm text-gray-600">
              直接在棋盘上滑动即可控制蛇的移动方向
            </p>
            <div className="mt-3 flex justify-center space-x-4 text-xs text-gray-500">
              <span>👆 向上滑动：向上</span>
              <span>👇 向下滑动：向下</span>
              <span>👈 向左滑动：向左</span>
              <span>👉 向右滑动：向右</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-2">游戏说明</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold mb-1">操作方式：</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>方向键：控制蛇的移动方向</li>
                <li>空格键：暂停/继续游戏</li>
                <li>手机端：直接在棋盘上滑动控制</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-1">游戏规则：</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>🍎 普通食物：+10分</li>
                <li>⭐ 特殊食物：+20分</li>
                <li>撞到墙壁或其他蛇会淘汰</li>
                <li>最后存活的蛇获胜</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;