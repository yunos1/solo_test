import { Snake, Food, Direction, Position } from '../types/game';
import { GameEngine } from './GameEngine';

export class AISnake {
  private engine: GameEngine;
  private difficulty: 'easy' | 'medium' | 'hard';

  constructor(engine: GameEngine, difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
    this.engine = engine;
    this.difficulty = difficulty;
  }

  makeDecision(snake: Snake, foods: Food[], allSnakes: Snake[]): Direction {
    const head = snake.body[0];
    const validDirections = this.engine.getValidDirections(snake);
    
    if (validDirections.length === 0) {
      return snake.direction;
    }

    // Find nearest food
    const nearestFood = this.findNearestFood(head, foods);
    
    if (!nearestFood) {
      return this.getRandomDirection(validDirections);
    }

    // Calculate scores for each direction
    const directionScores = new Map<Direction, number>();
    
    validDirections.forEach(direction => {
      const score = this.calculateDirectionScore(
        head, 
        direction, 
        nearestFood.position, 
        allSnakes, 
        snake
      );
      directionScores.set(direction, score);
    });

    // Choose best direction based on difficulty
    return this.selectBestDirection(directionScores, validDirections);
  }

  private findNearestFood(head: Position, foods: Food[]): Food | null {
    if (foods.length === 0) return null;
    
    return foods.reduce((nearest, food) => {
      const currentDistance = this.engine.calculateDistance(head, food.position);
      const nearestDistance = this.engine.calculateDistance(head, nearest.position);
      return currentDistance < nearestDistance ? food : nearest;
    });
  }

  private calculateDirectionScore(
    head: Position,
    direction: Direction,
    targetFood: Position,
    allSnakes: Snake[],
    currentSnake: Snake
  ): number {
    const newHead = this.getNewHeadPosition(head, direction);
    
    // Check for immediate dangers
    let score = 0;
    
    // Wall collision check
    if (this.engine.checkWallCollision(newHead)) {
      return -1000;
    }

    // Self collision check
    const tempSnake = { ...currentSnake, body: [newHead, ...currentSnake.body] };
    if (this.engine.checkSelfCollision(tempSnake)) {
      return -1000;
    }

    // Other snake collision check
    const otherSnakes = allSnakes.filter(s => s.id !== currentSnake.id);
    if (this.engine.checkSnakeCollision(tempSnake, otherSnakes)) {
      return -800;
    }

    // Distance to food (closer is better)
    const distanceToFood = this.engine.calculateDistance(newHead, targetFood);
    score += Math.max(0, 50 - distanceToFood);

    // Space availability (more open space is better)
    const openSpaceScore = this.calculateOpenSpaceScore(newHead, allSnakes);
    score += openSpaceScore;

    // Center preference (avoid edges when possible)
    const centerScore = this.calculateCenterScore(newHead);
    score += centerScore;

    return score;
  }

  private getNewHeadPosition(head: Position, direction: Direction): Position {
    switch (direction) {
      case Direction.UP:
        return { x: head.x, y: head.y - 1 };
      case Direction.DOWN:
        return { x: head.x, y: head.y + 1 };
      case Direction.LEFT:
        return { x: head.x - 1, y: head.y };
      case Direction.RIGHT:
        return { x: head.x + 1, y: head.y };
    }
  }

  private calculateOpenSpaceScore(position: Position, allSnakes: Snake[]): number {
    let openSpaces = 0;
    const directions = [
      { x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }
    ];

    directions.forEach(dir => {
      const newPos = { x: position.x + dir.x, y: position.y + dir.y };
      if (!this.engine.checkWallCollision(newPos)) {
        const occupied = allSnakes.some(snake => 
          snake.body.some(segment => segment.x === newPos.x && segment.y === newPos.y)
        );
        if (!occupied) {
          openSpaces++;
        }
      }
    });

    return openSpaces * 10;
  }

  private calculateCenterScore(position: Position): number {
    // Prefer positions closer to center when no clear food target
    const centerX = 15; // Assuming 30x30 board
    const centerY = 15;
    const distanceToCenter = this.engine.calculateDistance(position, { x: centerX, y: centerY });
    return Math.max(0, 20 - distanceToCenter);
  }

  private getRandomDirection(directions: Direction[]): Direction {
    return directions[Math.floor(Math.random() * directions.length)];
  }

  private selectBestDirection(directionScores: Map<Direction, number>, validDirections: Direction[]): Direction {
    const sortedDirections = validDirections.sort((a, b) => 
      (directionScores.get(b) || 0) - (directionScores.get(a) || 0)
    );

    switch (this.difficulty) {
      case 'easy':
        // 70% chance to pick best direction, 30% random
        return Math.random() < 0.7 ? sortedDirections[0] : this.getRandomDirection(validDirections);
      
      case 'medium':
        // 85% chance to pick best direction
        return Math.random() < 0.85 ? sortedDirections[0] : sortedDirections[1] || this.getRandomDirection(validDirections);
      
      case 'hard':
        // 95% chance to pick best direction
        return Math.random() < 0.95 ? sortedDirections[0] : sortedDirections[1] || this.getRandomDirection(validDirections);
      
      default:
        return sortedDirections[0];
    }
  }
}