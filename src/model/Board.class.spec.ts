import {Board} from './Board.class';
import {Location} from './Location.class';
import {Direction} from './Direction.enum';
import {Point} from './Point.class';

describe('Board.class', () => {

  let board;

  function tickTimes(times: number) {
    for (let i = 0; i < times; i++) {
      board.tick();
    }
  }

  beforeEach(() => {
    board = new Board(4);
  });

  it('should create Board', () => {
    expect(board).toEqual(jasmine.any(Board));
  });

  it('should get initial snake part count of four', () => {
    const snakePartCount = board.snakePartCount;
    expect(snakePartCount).toBe(4);
  });

  it('should get initial location of head', () => {
    const headLocation: Location = board.snakeHeadLocation;
    expect(headLocation.x).toBe(100);
    expect(headLocation.y).toBe(100);
  });

  it('should move snake in direction of travel', () => {
    tickTimes(1);

    const headPosition = board.snakeHeadLocation;
    expect(headPosition.x).toBe(99);
    expect(headPosition.y).toBe(100);

    const tailPosition = board.snakeTailLocation;
    expect(tailPosition.x).toBe(102);
    expect(tailPosition.y).toBe(100);
  });

  it('should change direction to bottom', () => {

    board.changeDirectionTo(Direction.Down);
    tickTimes(1);

    const headPosition = board.snakeHeadLocation;
    expect(headPosition.x).toBe(100);
    expect(headPosition.y).toBe(101);

    const tailPosition = board.snakeTailLocation;
    expect(tailPosition.x).toBe(102);
    expect(tailPosition.y).toBe(100);

  });

  it('should move all parts down they hit direction changer', () => {
    board.changeDirectionTo(Direction.Down);

    tickTimes(4);

    const headPosition = board.snakeHeadLocation;
    expect(headPosition.x).toBe(100);
    expect(headPosition.y).toBe(104);

    const tailPosition = board.snakeTailLocation;
    expect(tailPosition.x).toBe(100);
    expect(tailPosition.y).toBe(101);
  });

  it('should move all parts up they hit direction changer', () => {
    board.changeDirectionTo(Direction.Up);

    tickTimes(4);

    const headPosition = board.snakeHeadLocation;
    expect(headPosition.x).toBe(100);
    expect(headPosition.y).toBe(96);

    const tailPosition = board.snakeTailLocation;
    expect(tailPosition.x).toBe(100);
    expect(tailPosition.y).toBe(99);
  });

  it('should not change travel direction if opposite is pressed', () => {

    tickTimes(2);

    board.changeDirectionTo(Direction.Right);

    tickTimes(2);

    board.changeDirectionTo(Direction.Down);

    tickTimes(2);

    board.changeDirectionTo(Direction.Up);

    tickTimes(2);

    const headPosition = board.snakeHeadLocation;
    expect(headPosition.x).toBe(96);
    expect(headPosition.y).toBe(104);

    const tailPosition = board.snakeTailLocation;
    expect(tailPosition.x).toBe(96);
    expect(tailPosition.y).toBe(101);
  });

  it('should move up,right,down,left,left', () => {
    board.changeDirectionTo(Direction.Up);
    tickTimes(1);
    board.changeDirectionTo(Direction.Right);
    tickTimes(1);
    board.changeDirectionTo(Direction.Down);
    tickTimes(1);
    board.changeDirectionTo(Direction.Left);
    tickTimes(2);

    const headPosition = board.snakeHeadLocation;
    expect(headPosition.x).toBe(99);
    expect(headPosition.y).toBe(100);

    const tailPosition = board.snakeTailLocation;
    expect(tailPosition.x).toBe(101);
    expect(tailPosition.y).toBe(99);
  });

  it('remove director changer after last snake part', () => {
    board.changeDirectionTo(Direction.Up);
    tickTimes(5);
    board.changeDirectionTo(Direction.Right);
    tickTimes(5);
    board.changeDirectionTo(Direction.Down);
    tickTimes(5);
    board.changeDirectionTo(Direction.Left);
    tickTimes(10);

    const headPosition = board.snakeHeadLocation;
    expect(headPosition.x).toBe(95);
    expect(headPosition.y).toBe(100);
  });

  it('should ignore direction changer input before next tick', () => {
    board.changeDirectionTo(Direction.Up);
    board.changeDirectionTo(Direction.Left);
    expect(board.directionChangerCount).toBe(1);
    tickTimes(1);
    board.changeDirectionTo(Direction.Left);
    expect(board.directionChangerCount).toBe(2);
  });

  it('should detect collision', () => {
    board = new Board(5);

    board.changeDirectionTo(Direction.Up);
    tickTimes(1);
    board.changeDirectionTo(Direction.Right);
    tickTimes(1);
    board.changeDirectionTo(Direction.Down);
    tickTimes(1);

    const collisionLocation = board.collisionLocation;
    expect(collisionLocation.x).toBe(101);
    expect(collisionLocation.y).toBe(100);

  });

  it('should prevent snake from moving after collision', () => {
    board = new Board(5);

    board.changeDirectionTo(Direction.Up);
    tickTimes(1);
    board.changeDirectionTo(Direction.Right);
    tickTimes(1);
    board.changeDirectionTo(Direction.Down);
    tickTimes(4);

    const collisionLocation = board.collisionLocation;
    const headLocation = board.snakeHeadLocation;
    expect(collisionLocation.x).toBe(101);
    expect(collisionLocation.y).toBe(100);
    expect(headLocation.x).toBe(101);
    expect(headLocation.y).toBe(100);
  });

  it('should start with zero points', () => {
    expect(board.pointCounter).toBe(0);
  });

  it('should update point counter after point collision', () => {
    const pointLocation = new Location(99, 105);
    const pointValue = 100;
    const point = new Point(pointValue, pointLocation);
    board.addPoint(point);
    tickTimes(1);
    board.changeDirectionTo(Direction.Down);
    tickTimes(10);
    expect(board.pointCounter).toBe(pointValue);
  });

  it('should add new part to snake at point collision after tail passed', () => {
    const pointLocation = new Location(99, 100);
    const pointValue = 100;
    const point = new Point(pointValue, pointLocation);
    board.addPoint(point);
    tickTimes(4);

    expect(board.pointCounter).toBe(pointValue);
    let tailPosition = board.snakeTailLocation;
    expect(tailPosition.x).toBe(99);
    expect(tailPosition.y).toBe(100);

    tickTimes(1);
    tailPosition = board.snakeTailLocation;
    expect(tailPosition.x).toBe(99);
    expect(tailPosition.y).toBe(100);

  });

});
