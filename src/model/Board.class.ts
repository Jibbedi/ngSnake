import {SnakePart} from './SnakePart.class';
import {Location} from './Location.class';
import {Direction} from './Direction.enum';
import {DirectionChanger} from './DirectionChanger.class';
export class Board {
  size: number = 256;

  private _snakeParts: SnakePart[] = [];
  private _directionChanger: DirectionChanger[] = [];

  private _changeDirectionInputAcceptable = true;


  get snakePartCount(): number {
    return this._snakeParts.length;
  }

  get snakeHeadLocation(): Location {
    return this.snakeHead.location;
  }

  get snakeTailLocation(): Location {
    return this.snakeTail.location;
  }

  get directionChangerCount(): number {
    return this._directionChanger.length;
  }

  private get snakeHead(): SnakePart {
    return this._snakeParts[0];
  }

  private get snakeTail(): SnakePart {
    return this._snakeParts[this._snakeParts.length - 1];
  }


  constructor() {
    this.createInitialSnakeParts();
  }

  tick() {
    this._snakeParts.forEach(snakePart => {
      this.updateSnakePartLocation(snakePart);
      this.updateSnakePartDirection(snakePart);
    });
    this._changeDirectionInputAcceptable = true;
  }

  changeDirectionTo(direction: Direction) {

    if (!this._changeDirectionInputAcceptable) {
      return;
    }

    if (this.isOppositeDirectionOfHeadDirection(direction)) {
      return;
    }

    const location = new Location(this.snakeHeadLocation.x, this.snakeHeadLocation.y);
    const changer = new DirectionChanger(location, direction);
    this._directionChanger.push(changer);
    this.snakeHead.currentDirection = direction;

    this._changeDirectionInputAcceptable = false;
  }

  private updateSnakePartDirection(snakePart: SnakePart) {

    let removeIndex = -1;

    this._directionChanger.forEach((directionChanger, index) => {

      if (directionChanger.location.matches(snakePart.location)) {
        snakePart.currentDirection = directionChanger.direction;

        if (snakePart === this.snakeTail) {
          removeIndex = index;
        }
      }
    });

    if (removeIndex >= 0) {
      this._directionChanger.splice(removeIndex, 1);
    }
  }

  private updateSnakePartLocation(snakePart: SnakePart) {
    switch (snakePart.currentDirection) {
      case Direction.Left:
        snakePart.location.x--;
        break;
      case Direction.Up:
        snakePart.location.y--;
        break;
      case Direction.Right:
        snakePart.location.x++;
        break;
      case Direction.Down:
        snakePart.location.y++;
        break;
    }
  }

  private createInitialSnakeParts() {
    let initalXPosition = 100;
    const initalYPosition = 100;
    const initalPartCount = 4;

    for (let partIndex = 0; partIndex < initalPartCount; partIndex++, initalXPosition++) {
      const location = new Location(initalXPosition, initalYPosition);
      this.addSnakePart(location, Direction.Left);
    }
  }

  private addSnakePart(location: Location, direction: Direction) {
    const snakePart = new SnakePart(location, direction);
    snakePart.head = this._snakeParts.length === 0;
    snakePart.tail = true;
    this._snakeParts.push(snakePart);
  }

  private isOppositeDirectionOfHeadDirection(direction: Direction) {
    return this.snakeHead.currentDirection === Direction.Left && direction === Direction.Right ||
      this.snakeHead.currentDirection === Direction.Right && direction === Direction.Left ||
      this.snakeHead.currentDirection === Direction.Up && direction === Direction.Down ||
      this.snakeHead.currentDirection === Direction.Down && direction === Direction.Up;
  }
}
