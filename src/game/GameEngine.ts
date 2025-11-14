import { Position, Snake, Food, Direction, GameConfig } from '../types/game';

export class GameEngine {
  private config: GameConfig;
  
  constructor(config: GameConfig) {
    this.config = config;
  }

  generateRandomPosition(): Position {
    return {
      x: Math.floor(Math.random() * this.config.boardWidth),
      y: Math.floor(Math.random() * this.config.boardHeight)
    };
  }

  isPositionOccupied(position: Position, snakes: Snake[]): boolean {
    return snakes.some(snake => 
      snake.body.some(segment => segment.x === position.x && segment.y === position.y)
    );
  }

  generateFood(snakes: Snake[]): Food {
    let position: Position;
    do {
      position = this.generateRandomPosition();
    } while (this.isPositionOccupied(position, snakes));

    return {
      position,
      type: Math.random() < 0.8 ? 'normal' : 'special'
    };
  }

  moveSnake(snake: Snake): Snake {
    if (!snake.isAlive) return snake;

    const head = snake.body[0];
    let newHead: Position;

    switch (snake.direction) {
      case Direction.UP:
        newHead = { x: head.x, y: head.y - 1 };
        break;
      case Direction.DOWN:
        newHead = { x: head.x, y: head.y + 1 };
        break;
      case Direction.LEFT:
        newHead = { x: head.x - 1, y: head.y };
        break;
      case Direction.RIGHT:
        newHead = { x: head.x + 1, y: head.y };
        break;
    }

    const newBody = [newHead, ...snake.body];

    // Check if snake ate food (will be handled in game loop)
    return {
      ...snake,
      body: newBody
    };
  }

  checkWallCollision(position: Position): boolean {
    return (
      position.x < 0 ||
      position.x >= this.config.boardWidth ||
      position.y < 0 ||
      position.y >= this.config.boardHeight
    );
  }

  checkSelfCollision(snake: Snake): boolean {
    const head = snake.body[0];
    return snake.body.slice(1).some(segment => 
      segment.x === head.x && segment.y === head.y
    );
  }

  checkSnakeCollision(snake: Snake, otherSnakes: Snake[]): boolean {
    const head = snake.body[0];
    return otherSnakes.some(otherSnake => 
      otherSnake.body.some(segment => 
        segment.x === head.x && segment.y === head.y
      )
    );
  }

  getValidDirections(snake: Snake): Direction[] {
    const currentDirection = snake.direction;
    const allDirections = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
    
    // Remove opposite direction to prevent immediate self-collision
    const oppositeDirections = {
      [Direction.UP]: Direction.DOWN,
      [Direction.DOWN]: Direction.UP,
      [Direction.LEFT]: Direction.RIGHT,
      [Direction.RIGHT]: Direction.LEFT
    };

    return allDirections.filter(direction => direction !== oppositeDirections[currentDirection]);
  }

  calculateDistance(pos1: Position, pos2: Position): number {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  }
}