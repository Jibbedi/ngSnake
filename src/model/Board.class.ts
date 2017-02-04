import {SnakePart} from './SnakePart.class';
import {Location} from './Location.class';
import {Direction} from './Direction.enum';
import {DirectionChanger} from './DirectionChanger.class';
import {Point} from './Point.class';
export class Board {
  size: number;

  public collisionLocation: Location = null;
  public pointCounter = 0;

  private _snakeParts: SnakePart[] = [];
  private _directionChanger: DirectionChanger[] = [];
  private _points: Point[] = [];

  private _changeDirectionInputAcceptable = true;

  private _addNewSnakeParts: SnakePart[] = [];

  get snakePartCount(): number {
    return this._snakeParts.length;
  }

  get snakeHeadLocation(): Location {
    return new Location(this.snakeHead.location.x, this.snakeHead.location.y);
  }

  get snakePartLocations(): Location[] {
    return this._snakeParts.map(snakePart => {
      return new Location(snakePart.location.x, snakePart.location.y);
    });
  }

  get pointsLocations(): Location[] {
    return this._points.map(point => {
        return new Location(point.location.x, point.location.y);
      }) || [];
  }

  get snakeTailLocation(): Location {
    return new Location(this.snakeTail.location.x, this.snakeTail.location.y);
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


  constructor(size = 256, initialLocation: Location, initialPartCount = 4) {
    this.size = size;
    this.createInitialSnakeParts(initialLocation, initialPartCount);
  }

  tick() {

    if (this.collisionLocation) {
      return;
    }

    const snakeTailLocationBeforeTick = this.snakeTailLocation;

    this._snakeParts.forEach(snakePart => {
      this.updateSnakePartDirection(snakePart);
      this.updateSnakePartLocation(snakePart);
    });

    this.handleAdditionOfNewSnakeParts(snakeTailLocationBeforeTick);
    this._changeDirectionInputAcceptable = true;
    this.detectCollisionWithSelf();
    this.detectCollisionWithPoints();
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

    this._changeDirectionInputAcceptable = false;
  }

  addPoint(point: Point) {
    this._points.push(point);
  }

  private newSnakePartWillBeCreatedAtLocation(location: Location) {
    for (let newSnakePart of this._addNewSnakeParts) {
      if (location.matches(newSnakePart.location)) {
        return true;
      }
    }
    return false;
  }

  private updateSnakePartDirection(snakePart: SnakePart) {

    let removeIndex = -1;

    this._directionChanger.forEach((directionChanger, index) => {

      if (directionChanger.location.matches(snakePart.location)) {
        snakePart.currentDirection = directionChanger.direction;

        if (snakePart === this.snakeTail &&
          !this.newSnakePartWillBeCreatedAtLocation(this.snakeTailLocation)) {
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
        snakePart.location.x = this.getNewPosition(snakePart.location.x - 1);
        break;
      case Direction.Up:
        snakePart.location.y = this.getNewPosition(snakePart.location.y - 1);
        break;
      case Direction.Right:
        snakePart.location.x = this.getNewPosition(snakePart.location.x + 1);
        break;
      case Direction.Down:
        snakePart.location.y = this.getNewPosition(snakePart.location.y + 1);
        break;
    }
  }

  private handleAdditionOfNewSnakeParts(snakeTailLocation: Location) {
    let removeAtIndex = -1;

    this._addNewSnakeParts.forEach((newSnakePart, index) => {
      if (newSnakePart.location.matches(snakeTailLocation)) {
        this._snakeParts.push(newSnakePart);
        removeAtIndex = index;
        return false;
      }
    });

    if (removeAtIndex >= 0) {
      this._addNewSnakeParts.splice(removeAtIndex, 1);
    }
  }

  private createInitialSnakeParts(initialLocation: Location, initialPartCount: number) {

    for (let partIndex = 0; partIndex < initialPartCount; partIndex++, initialLocation.x++) {
      const location = new Location(initialLocation.x, initialLocation.y);
      this.addSnakePart(location, Direction.Left);
    }
  }

  private detectCollisionWithSelf() {
    this._snakeParts.forEach(snakePart => {
      if (snakePart === this.snakeHead) {
        return true;
      }

      if (this.snakeHeadLocation.matches(snakePart.location)) {
        this.collisionLocation = snakePart.location;
        return false;
      }
    });
  }

  private detectCollisionWithPoints() {
    let removeIndex = -1;

    this._points.forEach((point, index) => {
      if (this.snakeHeadLocation.matches(point.location)) {
        this.pointCounter += point.value;

        const newSnakePart = new SnakePart(this.snakeHeadLocation, this.snakeHead.currentDirection);
        this._addNewSnakeParts.push(newSnakePart);

        removeIndex = index;
        return false;
      }
    });

    if (removeIndex >= 0) {
      this._points.splice(removeIndex, 1);
    }
  }

  private addSnakePart(location: Location, direction: Direction) {
    const newLocation = new Location(location.x, location.y);
    const snakePart = new SnakePart(newLocation, direction);
    this._snakeParts.push(snakePart);
  }

  private isOppositeDirectionOfHeadDirection(direction: Direction) {
    return this.snakeHead.currentDirection === Direction.Left && direction === Direction.Right ||
      this.snakeHead.currentDirection === Direction.Right && direction === Direction.Left ||
      this.snakeHead.currentDirection === Direction.Up && direction === Direction.Down ||
      this.snakeHead.currentDirection === Direction.Down && direction === Direction.Up;
  }

  private getNewPosition(position: number) {
    if (position < 0) return this.size - 1;
    if (position >= this.size) return 0;
    return position;
  }
}
