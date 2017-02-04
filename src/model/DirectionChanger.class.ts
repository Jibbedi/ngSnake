import {Location} from './Location.class';
import {Direction} from './Direction.enum';
export class DirectionChanger {
  location: Location;
  direction: Direction;

  constructor(location: Location, direction: Direction) {
    this.location = location;
    this.direction = direction;
  }
}
