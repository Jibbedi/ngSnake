import {Component, OnInit} from '@angular/core';
import {Board} from '../model/Board.class';
import {Point} from '../model/Point.class';
import {Location} from '../model/Location.class';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  size = 25;
  board : Board;
  tick = null;
  point = null;

  ngOnInit() {
    this.startGame();
  }

  restart() {
    this.startGame();
  }

  private startGame() {
    this.board = new Board(this.size, new Location(20, 20), 10);

    this.tick = window.setInterval(() => {
      if (this.board.collisionLocation) {
        clearInterval(this.tick);
        return;
      }
      this.board.tick();
    }, 50);

    this.point = window.setInterval(() => {

      if (this.board.collisionLocation) {
        clearInterval(this.point);
        return;
      }

      const location = new Location(Math.round(Math.random() * this.size), Math.round(Math.random() * this.size));
      this.board.addPoint(new Point(100, location));
    }, 5000);
  }
}
