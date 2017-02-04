import {Location} from './Location.class';
import {Direction} from './Direction.enum';

export class SnakePart {
  location: Location = null;
  currentDirection: Direction = null;

  constructor(location: Location, currentDirection: Direction) {
    this.location = location;
    this.currentDirection = currentDirection;
  }
}
