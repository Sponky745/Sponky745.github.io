const CellType = {
  Start: "Start",
  Mine: "Mine",
  Lightning: "Lightning",
  Goal: "Goal",
  None: "None",
};

class Cell {
  constructor(x, y, type, isDrawPos) {
    this.pos = (isDrawPos) ? createVector(x / scl, y / scl) : createVector(x, y);
    this.drawPos = (isDrawPos) ? createVector(x, y) : createVector(x * scl, y * scl);
    this.type = type;

    this.QTable = {
      Up: 0,
      Down: 0,
      Left: 0,
      Right: 0
    };
  }

  show() {
    let col;
    switch (this.type) {
      case CellType.Start:
        col = color(0, 0, 255);
        break;
      case CellType.Mine:
        col = color(127);
        break;
      case CellType.Lightning:
        col = color(255, 255, 0);
        break;
      case CellType.Goal:
        col = color(255, 0, 0);
        break;
      default:
        col = color(51);
    }
    fill(col);
    rect(this.drawPos.x, this.drawPos.y, scl, scl);
  }
}
