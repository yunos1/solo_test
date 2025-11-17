import { GameState, Snake, Food, Direction, GameConfig } from '../types/game';
import { GameEngine } from './GameEngine';
import { AISnake } from './AISnake';

export class GameLoop {
  private gameState: GameState;
  private gameEngine: GameEngine;
  private aiSnakes: AISnake[];
  private gameInterval: NodeJS.Timeout | null = null;
  private onStateUpdate: (state: GameState) => void;

  constructor(config: GameConfig, onStateUpdate: (state: GameState) => void) {
    this.gameEngine = new GameEngine(config);
    this.onStateUpdate = onStateUpdate;
    this.aiSnakes = [];
    
    // Initialize game state
    this.gameState = {
      snakes: [],
      foods: [],
      gameStatus: 'waiting',
      gameConfig: config
    };

    this.initializeGame();
  }

  private initializeGame() {
    const snakes: Snake[] = [];
    const colors = ['#b91c1c', '#1d4ed8', '#047857', '#b45309', '#6d28d9', '#be185d'];
    
    // Create player snake
    const playerSnake: Snake = {
      id: 'player',
      body: [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }
      ],
      direction: Direction.RIGHT,
      color: colors[0],
      isAI: false,
      score: 0,
      isAlive: true,
      skinId: 'classic'
    };
    snakes.push(playerSnake);

    // Create AI snakes
    for (let i = 0; i < this.gameState.gameConfig.aiCount; i++) {
      const aiSnake: Snake = {
        id: `ai-${i}`,
        body: [
          { x: 25 + i * 2, y: 25 + i * 2 },
          { x: 24 + i * 2, y: 25 + i * 2 },
          { x: 23 + i * 2, y: 25 + i * 2 }
        ],
        direction: Direction.LEFT,
        color: colors[i + 1],
        isAI: true,
        score: 0,
        isAlive: true
      };
      snakes.push(aiSnake);
      
      // Create AI controller with different difficulties
      const difficulty = i === 0 ? 'hard' : i === 1 ? 'medium' : 'easy';
      this.aiSnakes.push(new AISnake(this.gameEngine, difficulty));
    }

    // Generate initial food
    const foods: Food[] = [];
    for (let i = 0; i < this.gameState.gameConfig.foodCount; i++) {
      foods.push(this.gameEngine.generateFood(snakes));
    }

    this.gameState = {
      ...this.gameState,
      snakes,
      foods
    };

    this.notifyStateUpdate();
  }

  startGame() {
    if (this.gameInterval) return;

    this.gameState.gameStatus = 'playing';
    this.notifyStateUpdate();

    this.gameInterval = setInterval(() => {
      this.gameTick();
    }, this.gameState.gameConfig.gameSpeed);
  }

  pauseGame() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }
    this.gameState.gameStatus = 'paused';
    this.notifyStateUpdate();
  }

  resumeGame() {
    if (this.gameState.gameStatus === 'paused') {
      this.startGame();
    }
  }

  stopGame() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }
  }

  private gameTick() {
    let snakes = [...this.gameState.snakes];
    let foods = [...this.gameState.foods];

    // Process AI decisions
    snakes.forEach((snake, index) => {
      if (snake.isAI && snake.isAlive) {
        const aiSnake = this.aiSnakes[index - 1]; // -1 because player is first
        if (aiSnake) {
          const newDirection = aiSnake.makeDecision(snake, foods, snakes);
          snake.direction = newDirection;
        }
      }
    });

    // Move all snakes
    const snakesThatAteFood: boolean[] = [];
    snakes = snakes.map((snake, snakeIndex) => {
      if (!snake.isAlive) return snake;

      const newSnake = this.gameEngine.moveSnake(snake);
      
      // Check if this snake will eat food
      const head = newSnake.body[0];
      const willEatFood = foods.some(food => 
        food.position.x === head.x && food.position.y === head.y
      );
      
      snakesThatAteFood[snakeIndex] = willEatFood;
      
      return newSnake;
    });

    // Process collisions and food consumption
    snakes = this.processCollisionsAndFood(snakes, foods, snakesThatAteFood);
    
    // Update foods (remove eaten ones and add new ones)
    foods = this.updateFoods(foods, snakes);

    // Check game end conditions
    const aliveSnakes = snakes.filter(snake => snake.isAlive);
    
    if (aliveSnakes.length <= 1) {
      this.endGame(aliveSnakes[0]);
      return;
    }

    this.gameState = {
      ...this.gameState,
      snakes,
      foods
    };

    this.notifyStateUpdate();
  }

  private processCollisionsAndFood(snakes: Snake[], foods: Food[], snakesThatAteFood: boolean[]): Snake[] {
    return snakes.map((snake, index) => {
      if (!snake.isAlive) return snake;

      const head = snake.body[0];

      // Check wall collision
      if (this.gameEngine.checkWallCollision(head)) {
        return { ...snake, isAlive: false };
      }

      // Check self collision
      if (this.gameEngine.checkSelfCollision(snake)) {
        return { ...snake, isAlive: false };
      }

      // Check other snake collisions
      const otherSnakes = snakes.filter(s => s.id !== snake.id);
      if (this.gameEngine.checkSnakeCollision(snake, otherSnakes)) {
        return { ...snake, isAlive: false };
      }

      // Handle food consumption
      const ateFood = snakesThatAteFood[index];
      if (ateFood) {
        const eatenFoodIndex = foods.findIndex(food => 
          food.position.x === head.x && food.position.y === head.y
        );
        
        if (eatenFoodIndex !== -1) {
          const eatenFood = foods[eatenFoodIndex];
          const points = eatenFood.type === 'special' ? 20 : 10;
          
          // Remove eaten food
          foods.splice(eatenFoodIndex, 1);
          
          // Snake grows - keep the new length (don't remove tail)
          return {
            ...snake,
            score: snake.score + points
          };
        }
      } else {
        // Normal movement - remove tail segment
        if (snake.body.length > 3) { // Keep minimum length of 3
          const newBody = [...snake.body];
          newBody.pop();
          return {
            ...snake,
            body: newBody
          };
        }
      }

      return snake;
    });
  }

  private updateFoods(foods: Food[], snakes: Snake[]): Food[] {
    let newFoods = [...foods];
    
    // Add new food if needed
    while (newFoods.length < this.gameState.gameConfig.foodCount) {
      newFoods.push(this.gameEngine.generateFood(snakes));
    }
    
    return newFoods;
  }

  private endGame(winner?: Snake) {
    this.stopGame();
    this.gameState.gameStatus = 'gameOver';
    this.gameState.winner = winner?.id;
    this.notifyStateUpdate();
  }

  changePlayerDirection(direction: Direction) {
    const playerSnake = this.gameState.snakes.find(s => s.id === 'player');
    if (playerSnake && playerSnake.isAlive) {
      // Prevent 180-degree turns
      const oppositeDirections = {
        [Direction.UP]: Direction.DOWN,
        [Direction.DOWN]: Direction.UP,
        [Direction.LEFT]: Direction.RIGHT,
        [Direction.RIGHT]: Direction.LEFT
      };

      if (playerSnake.direction !== oppositeDirections[direction]) {
        playerSnake.direction = direction;
        this.notifyStateUpdate();
      }
    }
  }

  resetGame() {
    this.stopGame();
    this.initializeGame();
  }

  private notifyStateUpdate() {
    this.onStateUpdate(this.gameState);
  }

  getGameState(): GameState {
    return { ...this.gameState };
  }

  updatePlayerSkin(skinId: string) {
    const playerSnake = this.gameState.snakes.find(s => s.id === 'player');
    if (playerSnake) {
      playerSnake.skinId = skinId;
      this.notifyStateUpdate();
    }
  }
}