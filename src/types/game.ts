export interface Position {
  x: number;
  y: number;
}

export interface Snake {
  id: string;
  body: Position[];
  direction: Direction;
  color: string;
  isAI: boolean;
  score: number;
  isAlive: boolean;
  skinId?: string;
}

export interface Food {
  position: Position;
  type: 'normal' | 'special';
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export interface GameState {
  snakes: Snake[];
  foods: Food[];
  gameStatus: 'waiting' | 'playing' | 'paused' | 'gameOver';
  winner?: string;
  gameConfig: GameConfig;
}

export interface GameConfig {
  boardWidth: number;
  boardHeight: number;
  playerCount: number;
  aiCount: number;
  gameSpeed: number;
  foodCount: number;
}

export interface GameStats {
  totalGames: number;
  longestSnake: number;
  highestScore: number;
  averageGameTime: number;
}