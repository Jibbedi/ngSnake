import {Component, Input, OnChanges} from '@angular/core';
import {Board} from '../../model/Board.class';
import {Location} from '../../model/Location.class';
import {Direction} from '../../model/Direction.enum';

@Component({
  selector: 'snake-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  host: {
    '(document:keydown)': 'handleKeypress($event)'
  }
})
export class BoardComponent implements OnChanges {


  rows;

  @Input()
  board: Board;

  get tileSize() {
    return 500 / this.board.size + 'px';
  }

  constructor() {
  };

  ngOnChanges(changes) {
    if (changes.board.currentValue) {
      this.rows = Array(this.board.size).fill(Array(this.board.size).fill(0));
    }
  }

  shouldBeSelected(row, column) {
    const location = new Location(column, row);

    for (let snakeLocation of this.board.snakePartLocations) {
      if (snakeLocation.matches(location)) {
        return true;
      }
    }

    return false;
  }

  shouldBePoint(row, column) {
    const location = new Location(column, row);

    for (let pointLocation of this.board.pointsLocations) {
      if (pointLocation.matches(location)) {
        return true;
      }
    }

    return false;
  }

  handleKeypress($event: KeyboardEvent) {
    $event.preventDefault();

    switch ($event.keyCode) {
      case 37:
        this.board.changeDirectionTo(Direction.Left);
        break;
      case 38:
        this.board.changeDirectionTo(Direction.Up);
        break;
      case 39:
        this.board.changeDirectionTo(Direction.Right);
        break;
      case 40:
        this.board.changeDirectionTo(Direction.Down);
        break;
    }

  }
}
