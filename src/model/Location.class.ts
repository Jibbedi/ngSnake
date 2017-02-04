export class Location {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public matches(location: Location): boolean {
    return this.x === location.x &&
      this.y === location.y;
  }
}
