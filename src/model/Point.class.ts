import {Location} from './Location.class';
export class Point {
  value: number;
  location: Location;

  constructor(value: number, location: Location) {
    this.value = value;
    this.location = location;
  }
}
