class Agent {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.drawPos = createVector(x * scl, y * scl);
    this.cellOccupied = grid[this.pos.x][this.pos.y];
    this.cellOccupied.type = CellType.Start;
    this.prevCell = null;
    this.state = "EXPLORER";
  }

  show() {
    fill(255, 0, 255);
    if (this.state == "EXPLORER") {
      fill(0, 255, 0);
    }
    rect(this.drawPos.x, this.drawPos.y, scl, scl);
  }

  move() {
    let table = this.cellOccupied.QTable;
    if (this.state == "EXPLORER") {
      const action = floor(random(4));
      switch (action) {
        case 0:
          if (this.pos.x < rows-2) {
            this.pos.x++;
          }
          break;
        case 1:
          if (this.pos.x > 1) {
            this.pos.x--;
          }
        break;
        case 2:
          if (this.pos.y < cols-2) {
            this.pos.y++;
          }
          break;
        case 3:
          if (this.pos.y > 1) {
            this.pos.y--;
          }
          break;
      }
    } else {
      let table = this.cellOccupied.QTable;

      const possibleActions = [
        table.Up,
        table.Down,
        table.Left,
        table.Right
      ];

      const action = selectAction(possibleActions)[1];
      switch (action) {
        case 0:
          if (this.pos.x < rows-2) {
            this.pos.x++;
          }
          break;
        case 1:
          if (this.pos.x > 1) {
            this.pos.x--;
          }
        break;
        case 2:
          if (this.pos.y < cols-2) {
            this.pos.y++;
          }
          break;
        case 3:
          if (this.pos.y > 1) {
            this.pos.y--;
          }
          break;
        default:
          const action = floor(random(4));
          switch (action) {
            case 0:
              if (this.pos.x < rows-2) {
                this.pos.x++;
              }
              break;
            case 1:
              if (this.pos.x > 1) {
                this.pos.x--;
              }
            break;
            case 2:
              if (this.pos.y < cols-2) {
                this.pos.y++;
              }
              break;
            case 3:
              if (this.pos.y > 1) {
                this.pos.y--;
              }
              break;
          }
          break;
      }
    }
  }

  update() {
    this.move();

    if (frameCount % 120 === 0) {
      this.state = (this.state == "EXPLORER") ? "EXPLOITER" : "EXPLORER";
      this.pos.set(floor(cols/2), floor(rows/2));
    }

    this.prevCell = this.cellOccupied;

    this.drawPos = createVector(this.pos.x * scl, this.pos.y * scl);
    this.cellOccupied = grid[this.pos.x][this.pos.y];
  }
}
