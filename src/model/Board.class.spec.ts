import {Board} from './Board.class';
import {Location} from './Location.class';
import {Direction} from './Direction.enum';

describe('Board.class', () => {

  let board;

  function tickTimes(times: number) {
    for (let i = 0; i < times; i++) {
      board.tick();
    }
  }

  beforeEach(() => {
    board = new Board();
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

});
